import os
from datetime import datetime
import src.services.auth_services as auth_services
import src.controllers.db_controller as db
import random
import string
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError


async def get_project_general_metrics(project_id):
    cursor = db.conn.cursor()
    get_teams_metrics = f"""
        SELECT
            t.team_id,
            t.team_name,
            COUNT(DISTINCT aut.app_user_id) AS number_of_people,
            COUNT(DISTINCT ta.task_id) AS total_tasks,
            COUNT(CASE WHEN ta.task_state = 'Completed' THEN 1 END) AS completed_tasks,
            COUNT(CASE WHEN ta.task_state = 'Unassigned' THEN 1 END) AS unassigned_tasks,
            COUNT(CASE WHEN ta.task_state = 'Not started' THEN 1 END) AS no_started_tasks,
            COUNT(CASE WHEN ta.task_state = 'In process' THEN 1 END) AS in_process_tasks
        FROM
            project p
            JOIN team t ON p.project_id = t.project_id
            LEFT JOIN app_user_team aut ON t.team_id = aut.team_id
            LEFT JOIN task ta ON t.team_id = ta.team_id
        WHERE
            p.project_id = '{project_id}'
        GROUP BY
            t.team_id,
            t.team_name;
    """
    
    cursor.execute(get_teams_metrics, )
    get_teams_metrics = cursor.fetchall()
    column_names = [desc[0] for desc in cursor.description]
   
    teams_metrics_dict = []
    for messages in get_teams_metrics:
        message_dict = dict(zip(column_names, messages))
        teams_metrics_dict.append(message_dict)
    return teams_metrics_dict