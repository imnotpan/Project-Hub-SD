import json
from datetime import datetime
import src.controllers.db_controller as db
from src.controllers.rabbit_controller import rabbit_controller 

async def send_message_to_queue(message, user, project): # Añade un mensaje a la cola 
    content_message_broker = {
        "message_text": message.message_content,
        "user_name": user['app_user_name'],
        "user_email": user['app_user_email'],
        "message_date": datetime.now().strftime('%Y-%m-%d %H:%M:%S') 
    }
    body = json.dumps(content_message_broker)
    rabbit_controller.send_message(body.encode(), f"messages_team_{message.team_id}")
    return content_message_broker


async def send_message_general_to_queue(message, user, project): # Añade un mensaje a la cola 
    content_message_broker = {
        "message_text": message.message_content,
        "user_name": user['app_user_name'],
        "user_email": user['app_user_email'],
        "message_date": datetime.now().strftime('%Y-%m-%d %H:%M:%S') 
    }
    body = json.dumps(content_message_broker)
    rabbit_controller.send_message(body.encode(), f"messages_project_{project['project_id']}")
    return content_message_broker

async def save_in_db_team_message(message, user):
    cursor = db.conn.cursor()
    check_user_query = """
        SELECT * FROM app_user_team WHERE app_user_id = %s AND team_id = %s;
    """
    check_user_query_parameters = (user['app_user_id'], message.team_id)       
    cursor.execute(check_user_query, check_user_query_parameters)
    user_team_id = cursor.fetchone()[0]


    if user_team_id is not None:    
        message_in_db = """
            INSERT INTO chat_message (message_date, message_content, sent_by, message_state_id, message_type_id, app_user_team_id)
            VALUES (%s, %s, %s, %s, %s, %s);
        """ 
        message_in_db_query_parameters = (
            datetime.now(),
            message.message_content,
            user['app_user_id'],
            2,
            3,
            user_team_id
        )

        cursor.execute(message_in_db, message_in_db_query_parameters)
        db.conn.commit()

async def save_in_db_team_message_general(message, user, project_id):
    cursor = db.conn.cursor()
    message_in_db = f"""
        INSERT INTO chat_message (message_date, message_content, sent_by, message_state_id, message_type_id, app_user_project_id)
        VALUES (%s, %s, %s, %s, %s, %s);
    """
    message_in_db_query_parameters = ( 
                            datetime.now(),
                            message.message_content,
                            user['app_user_id'],
                            2,
                            1,
                            project_id
                            )
    cursor.execute(message_in_db,message_in_db_query_parameters)
    db.conn.commit()
        
    
async def get_team_messages(team_id): # Obtiene los mensajes de un equipo
    cursor = db.conn.cursor()
    get_team_messages_query = f"""
        SELECT aut.app_user_team_id, aut.app_user_id, cm.message_id, cm.message_date, message_content, au.app_user_id, au.app_user_name, au.app_user_email 
        FROM chat_message cm
        JOIN app_user_team aut ON cm.app_user_team_id = aut.app_user_team_id
        JOIN app_user au ON au.app_user_id = aut.app_user_id  
        WHERE aut.team_id = {team_id} AND message_type_id = 3
        ORDER BY cm.message_id desc 
        LIMIT 10;
    """
    
    cursor.execute(get_team_messages_query, (team_id, ))
    team_messages = cursor.fetchall()
    column_names = [desc[0] for desc in cursor.description]
   
    team_messages_dict = []
    for messages in team_messages:
        message_dict = dict(zip(column_names, messages))
        team_messages_dict.append(message_dict)
    
    return team_messages_dict

async def get_project_messages(project_id):
    cursor = db.conn.cursor()
    get_project_messages_query = f"""
        SELECT cm.message_id, cm.message_date, cm.message_content, au.app_user_id, au.app_user_name, au.app_user_email 
        FROM chat_message cm
        JOIN app_user au ON au.app_user_id = cm.sent_by
        WHERE cm.message_type_id = 1 AND app_user_project_id = '{project_id}'
        ORDER BY cm.message_id DESC 
        LIMIT 10;
    """
    
    cursor.execute(get_project_messages_query, )
    project_messages = cursor.fetchall()
    column_names = [desc[0] for desc in cursor.description]
   
    project_messages_dict = []
    for messages in project_messages:
        message_dict = dict(zip(column_names, messages))
        project_messages_dict.append(message_dict)
    
    return project_messages_dict