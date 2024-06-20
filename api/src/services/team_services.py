import json
from datetime import datetime
import src.services.auth_services as auth_services
import src.controllers.rabbit_controller as rabbit_controller
import src.controllers.db_controller as db
from fastapi import HTTPException
import psycopg2
from psycopg2.extras import RealDictCursor


async def create_team(team_data, project_id): # Registra un equipo en la base de datos
    cursor = db.conn.cursor()
    team_add_query = None
    team_add_query_parameters = None
    if team_data.team_password == "" or team_data.team_password == None: # Si no se especifica contraseña se crea un equipo publico
        team_add_query = f"""
            INSERT INTO team (team_creation_date, team_description, team_name, project_id, team_private)
            VALUES (%s, %s, %s, %s, %s) 
            RETURNING team_id;
        """
        team_add_query_parameters = (
            datetime.now(),
            team_data.team_description,
            team_data.team_name,
            project_id,
            False,
        )
    else: # Si se especifica contraseña se crea un equipo privado
        team_add_query = f""" 
            INSERT INTO team (team_creation_date, team_description, team_name, project_id, team_password, team_private)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING team_id;
        """
        team_add_query_parameters = (
            datetime.now(),
            team_data.team_description,
            team_data.team_name,
            project_id,
            await auth_services.get_password_hash(team_data.team_password),
            True,
        )
    cursor.execute(team_add_query, team_add_query_parameters)
    team_id = cursor.fetchone()[0]
    db.conn.commit()
    return team_id


async def get_all_users_team(team_id): # Obtiene todos los usuarios de un equipo segun su id
    cursor = db.conn.cursor()
    get_user_query = f"""
        SELECT au.app_user_id, au.app_user_name, au.app_user_email, au.app_user_last_session, aut.user_status, aut.user_type
        FROM app_user_team aut
        JOIN app_user au ON aut.app_user_id = au.app_user_id
        WHERE aut.team_id = %s AND aut.user_status = %s;
    """
    get_user_query_parameters = (team_id, "active")

    cursor.execute(get_user_query, get_user_query_parameters)
    find_users = cursor.fetchall()
    column_names = [desc[0] for desc in cursor.description]

    users_as_dict = []
    for users in find_users:
        user_dict = dict(zip(column_names, users))
        users_as_dict.append(user_dict)

    return users_as_dict


async def verify_team_in_project(team_id, project_id): # Valida que un equipo pertenezca a un proyecto, comparando el id del equipo y el id del proyecto
    cursor = db.conn.cursor(cursor_factory=RealDictCursor)
    check_team_query = """
        SELECT * FROM team WHERE team_id = %s AND project_id = %s;
    """
    cursor.execute(check_team_query, (team_id, project_id))
    team = cursor.fetchone()
    
    if team is None:
        raise HTTPException(
            status_code=401,
            detail="Team not in project",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return dict(team)


async def verify_team_password(team_id, team_password, team_password_hash): # Valida la contraseña de un equipo
    if not await auth_services.verify_password(team_password, team_password_hash):
        raise HTTPException(
            status_code=401,
            detail="invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def join_team(user_id, team_id): # Une un usuario a un equipo 
    cursor = db.conn.cursor()
    check_user_query = """
        SELECT COUNT(*) FROM app_user_team WHERE app_user_id = %s AND team_id = %s;
    """
    cursor.execute(check_user_query, (user_id,team_id))
    user_exists = cursor.fetchone()[0] > 0

    if user_exists:
        update_user_query = f"""
            UPDATE app_user_team
            SET user_status = 'inactive'
            WHERE app_user_id = {user_id};
            
            UPDATE app_user_team
            SET user_status = 'active'
            WHERE app_user_id = {user_id} AND team_id = {team_id} 
            RETURNING user_status, user_type;
            
        """
        update_user_query_parameters = ( team_id, user_id, team_id )
        cursor.execute(update_user_query)
        task_info = cursor.fetchone()
        column_names = [desc[0] for desc in cursor.description]
        task_info_dict = dict(zip(column_names, task_info))
    else:
        insert_user_query = f"""
            UPDATE app_user_team
            SET user_status = 'inactive'
            WHERE app_user_id = {user_id};
            
            INSERT INTO app_user_team (team_id, app_user_id, user_status, user_type)
            VALUES (%s, %s, %s, %s)
            RETURNING user_status, user_type;
        """
        insert_user_query_parameters = (team_id, user_id, "active", 0)
        cursor.execute(insert_user_query, insert_user_query_parameters)
        task_info = cursor.fetchone()
        column_names = [desc[0] for desc in cursor.description]
        task_info_dict = dict(zip(column_names, task_info))
    
    db.conn.commit()
    return task_info_dict


async def disconnect_team(user_id, team_id): # Desconecta un usuario de un equipo 
    cursor = db.conn.cursor()
    check_user_query = """
        SELECT COUNT(*) FROM app_user_team WHERE app_user_id = %s;
    """
    cursor.execute(check_user_query, (user_id,))
    user_exists = cursor.fetchone()[0] > 0

    if user_exists: # Si el usuario existe en la base de datos se actualiza su estado a inactivo
        update_user_query = """
            UPDATE app_user_team
            SET user_status = %s
            WHERE app_user_id = %s AND team_id = %s
            RETURNING user_status, user_type;
        """
        update_user_query_parameters = ("inactive", user_id, team_id)
        cursor.execute(update_user_query, update_user_query_parameters)
        task_info = cursor.fetchone()
        column_names = [desc[0] for desc in cursor.description]
        task_info_dict = dict(zip(column_names, task_info))
    db.conn.commit()

    return task_info_dict

async def send_user_status(user, team_id, project_id, status, user_type): # Envía el estado de un usuario a un equipo
    content_message_broker = {"app_user_id": user['app_user_id'],
                              "app_user_email": user['app_user_email'],
                              "app_user_name": user['app_user_name'], 
                              "user_status": status,
                              "user_type": user_type}
    body = json.dumps(content_message_broker)
    rabbit_controller.rabbit_controller.send_message(body.encode(), f"users_team_{team_id}")
    return content_message_broker

async def change_user_type(user_id, team_id, user_type):
    cursor = db.conn.cursor()
    check_user_query = """
        SELECT * FROM app_user_team WHERE app_user_id = %s AND team_id = %s;
    """
    check_user_query_parameters = (user_id, team_id)       
    cursor.execute(check_user_query, check_user_query_parameters)
    user_team_id = cursor.fetchone()

    if user_team_id is not None:    
        update_user_type = f"""
            UPDATE app_user_team
                SET user_type = {user_type}
                WHERE app_user_id = {user_id} AND team_id = {team_id}; 
        """ 
        cursor.execute(update_user_type, )
        db.conn.commit()
    else:
        insert_user_type = f"""
            INSERT INTO app_user_team(team_id, app_user_id, user_status, user_type)
            VALUES (%s, %s, %s, %s);
        """
        insert_user_type_parameters = (
            team_id,
            user_id,
            'inactive',
            user_type
        )
        cursor.execute(insert_user_type, insert_user_type_parameters)
        db.conn.commit()
    

async def verify_team_leader(user_id, team_id):
    cursor = db.conn.cursor()
    check_user_query = """
        SELECT * FROM app_user_team WHERE app_user_id = %s AND team_id = %s AND (user_type = 1 OR user_type = 2);
    """
    check_user_query_parameters = (user_id, team_id)       
    cursor.execute(check_user_query, check_user_query_parameters)
    user_team_id = cursor.fetchone()
    if user_team_id is None:
        return False
    else:
        return True