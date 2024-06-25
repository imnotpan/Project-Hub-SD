import os
from datetime import datetime
import src.services.auth_services as auth_services
import src.controllers.db_controller as db
import random
import string
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

oauth2_scheme_project = OAuth2PasswordBearer(tokenUrl="/project/auth")
SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = "HS256"


async def create_project(project_data, user_data): # Registra un proyecto en la base de datos
    cursor = db.conn.cursor()
    random_id = await random_key(10)
    time_now = datetime.now()
    project_add_query = f"""
        INSERT INTO project (project_id, project_creation_date, project_description, project_name, project_password, project_owner_id)
        VALUES (%s, %s, %s, %s, %s, %s);
    """
    project_add_query_parameters = (
        random_id,
        time_now,
        project_data.project_description,
        project_data.project_name,
        await auth_services.get_password_hash(project_data.project_password),
        user_data["app_user_id"],
    )

    cursor.execute(project_add_query, project_add_query_parameters)
    db.conn.commit()
    return {
        "project_id": random_id,
        "project_description": project_data.project_description,
        "project_name": project_data.project_name,
        "creation_date": time_now,
    }


    
async def project_auth(project_id, project_password): # Valida las credenciales de un proyecto en la base de datos
    find_project = await get_project_by_id(project_id)
    if not find_project:
        raise HTTPException(
            status_code=401,
            detail="Project not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not await auth_services.verify_password(project_password, find_project["project_password"]):
        raise HTTPException(
            status_code=401,
            detail="Password error",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return find_project


async def random_key(tamaño): # Genera una clave aleatoria usando letras y números
    caracteres = string.ascii_letters + string.digits
    return "".join(random.choice(caracteres) for _ in range(tamaño))


async def get_project_by_id(project_id): # Obtiene un proyecto por su id en la base de datos
    cursor = db.conn.cursor()
    project_search_query = f"SELECT * FROM project WHERE project_id = '{ project_id }';"
    cursor.execute(project_search_query)
    find_project = cursor.fetchone()
    if find_project:
        columns = [desc[0] for desc in cursor.description]
        user_info = dict(zip(columns, find_project))
        return user_info
    cursor.close()
    return find_project

 
async def get_teams_from_project(project_id): # Obtiene los equipos de un proyecto
    cursor = db.conn.cursor()
    teams_search_query = f"""
                    SELECT team_id, team_description, team_name, team_private
                    FROM team WHERE project_id = '{ project_id }'
                    """
    cursor.execute(teams_search_query)
    find_teams = cursor.fetchall()
    column_names = [desc[0] for desc in cursor.description]

    teams_as_dict = []
    for team in find_teams:
        team_dict = dict(zip(column_names, team))
        teams_as_dict.append(team_dict)

    return teams_as_dict


async def get_project_current(project_token: str): # Obtiene el proyecto actual a partir de un token
    try:
        token_decode = jwt.decode(project_token, SECRET_KEY, ALGORITHM)
        project_id = token_decode.get("sub")
        if project_id == None:
            raise HTTPException(
                status_code=401,
                detail="Project id not decoded",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Project id not decoded",
            headers={"WWW-Authenticate": "Bearer"},
        )

    project = await get_project_by_id(project_id)
    if not project:
        raise HTTPException(
            status_code=401,
            detail="Project not exists",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return project


async def set_profile_in_project(project_id, user_id, profile_type): # Establece el perfil de un usuario en un proyecto
    cursor = db.conn.cursor()
    profile_add_query = f"""
        INSERT INTO app_user_profile_project (app_user_profile_type, app_user_id, project_id)
        VALUES (%s, %s, %s);
    """
    profile_add_query_parameters = (profile_type, user_id, project_id)

    cursor.execute(profile_add_query, profile_add_query_parameters)
    db.conn.commit()
    return {"project_id": project_id}


async def get_all_projects_from_user(user_id): # Obtiene todos los proyectos de un usuario dueño
    cursor = db.conn.cursor()
    projects_search_query = f"""
                    SELECT project_id, project_creation_date, project_description, project_name, project_password
                    FROM project
                    WHERE project_owner_id = %s
                    """
    cursor.execute(projects_search_query, (user_id,))
    find_projects = cursor.fetchall()
    column_names = [desc[0] for desc in cursor.description]

    project_as_dict = []
    for projects in find_projects:
        project_dict = dict(zip(column_names, projects))
        project_as_dict.append(project_dict)
    return project_as_dict


async def add_co_owners(project_id, user_id):
    cursor = db.conn.cursor()
    add_co_owner = f"""
        INSERT INTO app_user_profile_project (app_user_profile_type, app_user_id, project_id)
        VALUES (2, %s, %s);
    """
    add_co_owner_parameters = (user_id, project_id )
    cursor.execute(add_co_owner, add_co_owner_parameters)
    db.conn.commit()
    return {"project_id": project_id}

async def project_owner_verify(project_id, user_id):
    cursor = db.conn.cursor()
    verify_owner = f"""
        SELECT p.project_owner_id, p.project_id, aupp.project_id, aupp.app_user_id, aupp.app_user_profile_type
        FROM 
            project p
        FULL JOIN
            app_user_profile_project aupp
        ON 
            p.project_id = aupp.project_id
        WHERE
            (aupp.app_user_id = {user_id} OR p.project_owner_id = {user_id}) and p.project_id = '{project_id}' and aupp.app_user_profile_type = 2;
    """
    cursor.execute(verify_owner, )
    user_project_owner = cursor.fetchone()
    db.conn.commit()
    if user_project_owner is None:
        return False
    else:
        return True

async def project_main_owner_verify(project_id, user_id):
    cursor = db.conn.cursor()
    verify_owner = f"""
        SELECT p.project_owner_id, p.project_id, aupp.project_id, aupp.app_user_id
        FROM 
            project p
        FULL JOIN
            app_user_profile_project aupp
        ON 
            p.project_id = aupp.project_id
        WHERE
            p.project_owner_id = {user_id} and p.project_id = '{project_id}' 
    """
    cursor.execute(verify_owner, )
    user_project_owner = cursor.fetchone()
    if user_project_owner is not None:
        raise HTTPException(
            status_code=401,
            detail="You are delete the project main owner ",
        )
    db.conn.commit()
    return {"project_id": project_id}

async def delete_co_owner(project_id, user_id):
    cursor = db.conn.cursor()
    delete_owner = f"""
        DELETE FROM app_user_profile_project
        WHERE project_id = '{project_id}' AND app_user_id = {user_id}
    """
    
    print(delete_owner)
    cursor.execute(delete_owner, )
    db.conn.commit()
