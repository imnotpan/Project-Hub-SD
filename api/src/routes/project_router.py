from datetime import datetime, timedelta, timezone
from http.client import HTTPException
import src.services.log_services as log_services

from src.services import message_services
from fastapi import APIRouter, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm
import src.models.project_models as project_models
import src.models.auth_models as auth_models
import src.services.auth_services as auth_services
import src.services.project_services as project_services

project_router = APIRouter()

@project_router.post( # Ruta para la autenticación de proyectos
    "/auth", tags=["project"], dependencies=[Depends(auth_services.get_user_current)]
)
async def auth_project(project_data: project_models.ProjectSearchModel = Depends(),
                       user_data=Depends(auth_services.get_user_current)):
    data_project = await project_services.project_auth(project_data.project_id, project_data.project_password)
    token = await auth_services.create_access_token(project_data.project_id)
    isOwner = await project_services.project_owner_verify(project_data.project_id, user_data['app_user_id'])
    data = {"status_code": 201, "access_token": token, "token_type": "bearer", "owner": isOwner, 'project_name': data_project['project_name']}
    return data

@project_router.post("/create", tags=["project"]) # Ruta para el registro de proyectos
async def create_project(
    project_data: project_models.ProjectRegisterModel = Depends(),
    user_data=Depends(auth_services.get_user_current),
):
    await log_services.add_log(f"Start created project", 1, 11, user_data['app_user_id'] )
    
    project_id = await project_services.create_project(project_data, user_data)
    response = await project_services.set_profile_in_project(
        project_id["project_id"], user_data["app_user_id"], 2
    )
    await log_services.add_log(f"Project created {project_id['project_id']}", 2, 11, user_data['app_user_id'] )
    return response
    
@project_router.get("/get/messages/", tags=["project"]) # Ruta para la obtención de mensajes de un equipo
async def get_team_messages(
    project_key : project_models.ProjectKeyModel = Depends(),
    user=Depends(auth_services.get_user_current),
):
    project = await project_services.get_project_current(project_key.project_auth_key)
    messages = await message_services.get_project_messages(project["project_id"])
    return messages



@project_router.post("/add/owner", tags=["project"])
async def add_owner(
    add_owner: project_models.ProjectOwnerModel = Depends(),
    user_data=Depends(auth_services.get_user_current),
):
    await log_services.add_log(f"Start add owner", 1, 7, user_data['app_user_id'] )
    project = await project_services.get_project_current(add_owner.project_auth_key)
    isOwner = await project_services.project_owner_verify(project['project_id'],user_data['app_user_id'])
    if not isOwner:
        await log_services.add_log(f"Error add owner, user isn't owner", 3, 7, user_data['app_user_id'] )
        return {401, f"You aren't leader or owner"}
    
    user_data = await auth_services.get_user_by_email(add_owner.user_email)
    if user_data:
        response = await project_services.add_co_owners(project["project_id"], user_data['app_user_id'])
        await log_services.add_log(f"owner added", 2, 7, user_data['app_user_id'] )
        return response
    else:
        await log_services.add_log(f"Error add owner, Email not exists", 3, 7, user_data['app_user_id'] )
        return {401, f"Email not exists"}


@project_router.delete("/delete/owner", tags=["project"])
async def delete_owner(
    add_owner: project_models.ProjectOwnerModel = Depends(),
    user_data=Depends(auth_services.get_user_current),
):
    project = await project_services.get_project_current(add_owner.project_auth_key)
    await project_services.project_owner_verify(project['project_id'],user_data['app_user_id'])
    to_delete_user = await auth_services.get_user_by_email(add_owner.user_email)
    isOwner = await project_services.project_main_owner_verify(user_data['app_user_id'], to_delete_user['app_user_id'])
    if not isOwner:
        return {401, f"You aren't leader or owner"}
    return await project_services.delete_co_owner(project["project_id"], to_delete_user['app_user_id'])

@project_router.get( # Ruta para la obtención de equipos de un proyecto
    "/{project_auth_key}/teams",
    tags=["project"],
    dependencies=[Depends(auth_services.get_user_current)],
)
async def get_teams_from_project(project_auth_key: str):
    project = await project_services.get_project_current(project_auth_key)
    teams = await project_services.get_teams_from_project(project["project_id"])
    return teams
    
