import json
from datetime import datetime
import src.controllers.db_controller as db
from src.controllers.rabbit_controller import rabbit_controller 

async def get_tasks_from_team(team_id): # Obtiene las tareas de un equipo segundo su id
    cursor = db.conn.cursor()
    get_tasks_messages_query = f"""
        SELECT *
        FROM task
		WHERE team_id = %s
    """
    
    cursor.execute(get_tasks_messages_query, (team_id, ))
    team_tasks = cursor.fetchall()
    column_names = [desc[0] for desc in cursor.description]
   
    team_messages_dict = []
    for tasks in team_tasks:
        tasks_dict = dict(zip(column_names, tasks))
        team_messages_dict.append(tasks_dict)
    
    return team_messages_dict

async def add_task(task_data): # Añade una tarea a la base de datos segun los datos recibidos
    cursor = db.conn.cursor()

    add_task_query = f"""
            INSERT INTO task (task_name, task_description, task_creation_date, task_end_date, task_deadline_date, task_difficult, task_state, team_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s) 
            RETURNING task_name, task_id, task_description, task_creation_date, task_end_date, task_deadline_date, task_difficult, task_state, team_id;
        """
        
    add_task_query_parameters = ( 
                            task_data.task_name,
                            task_data.task_description,
                            datetime.now(),
                            task_data.task_end_date,
                            task_data.task_deadline_date,
                            task_data.task_difficult,
                            task_data.task_state,
                            task_data.team_id
                            )
    cursor.execute(add_task_query,add_task_query_parameters)
    task_info = cursor.fetchone()
    column_names = [desc[0] for desc in cursor.description]
    task_info_dict = dict(zip(column_names, task_info))
    db.conn.commit()
    return task_info_dict

async def update_task(task_data): 
    cursor = db.conn.cursor()
    
    update_columns = []
    update_values = []
    
    if task_data.task_name is not None:
        update_columns.append("task_name = %s")
        update_values.append(task_data.task_name)

    if task_data.task_description is not None:
        update_columns.append("task_description = %s")
        update_values.append(task_data.task_description)

    if task_data.task_end_date is not None:
        update_columns.append("task_end_date = %s")
        update_values.append(task_data.task_end_date)

    if task_data.task_deadline_date is not None:
        update_columns.append("task_deadline_date = %s")
        update_values.append(task_data.task_deadline_date)

    if task_data.task_difficult is not None:
        update_columns.append("task_difficult = %s")
        update_values.append(task_data.task_difficult)

    if task_data.task_state is not None:
        update_columns.append("task_state = %s")
        update_values.append(task_data.task_state)

    if not update_columns:
        raise ValueError("No data provided to update")

    update_task_query = f"""
        UPDATE task
        SET {', '.join(update_columns)}
        WHERE task_id = %s
        RETURNING task_id, task_description, task_creation_date, task_end_date, task_deadline_date, task_difficult, task_state, team_id;
        """
    
    update_values.append(task_data.task_id)

    cursor.execute(update_task_query, update_values)
    task_info = cursor.fetchone()
    column_names = [desc[0] for desc in cursor.description]
    task_info_dict = dict(zip(column_names, task_info))
    db.conn.commit()
    return task_info_dict
    
async def delete_task(task_id): # Elimina una tarea de la base de datos segun su id
    cursor = db.conn.cursor()
    task_destroy_query = f"""
        DELETE FROM task WHERE task_id = %s;
        """
    cursor.execute(task_destroy_query,(task_id,))
    
    db.conn.commit()

async def send_task_to_queue(task_data, project_id, tag): # Añade una tarea a la cola, usando rabbitmq
    task_end_date = None
    task_deadline_date = None
    
    if task_data.get('task_end_date') is not None:
        task_end_date = task_data['task_end_date'].isoformat()

    if task_data.get('task_deadline_date') is not None:
        task_deadline_date = task_data['task_deadline_date'].isoformat()

    content_message_broker = {
        "task_id": task_data['task_id'],
        "task_description": task_data['task_description'],
        "task_end_date": task_end_date,
        "task_deadline_date": task_deadline_date,
        "task_difficult": task_data['task_difficult'],
        "task_state": task_data['task_state'],
        "team_id": task_data['team_id'],
        "task_data": tag
    }
    
    body = json.dumps(content_message_broker)
    rabbit_controller.send_message(body.encode(), f"task_{project_id}_{task_data['team_id']}")
    
    return content_message_broker

async def send_delete_task(team_id, project_id, task_id): # Añade una tarea a la cola, usando rabbitmq
    content_message_broker = {
                                "task_id": task_id,
                                "task_data": 'delete'
                              }
    body = json.dumps(content_message_broker)
    rabbit_controller.send_message(body.encode(), f"task_{project_id}_{team_id}")
    return content_message_broker
