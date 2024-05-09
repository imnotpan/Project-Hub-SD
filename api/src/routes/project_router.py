from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm
import src.models.project_models as project_models
import src.models.auth_models as auth_models
import src.services.auth_services as auth_services
import src.services.project_services as project_services

project_router = APIRouter()

@project_router.post("/auth", tags = ["project"] , dependencies=[Depends(auth_services.get_user_current)])
async def auth_project( project_data: project_models.ProjectSearchModel = Depends()):
    token = await auth_services.create_access_token(project_data.project_id)
    data = {
        "access_token": token,
        "token_type": "bearer"
    }
    return data

@project_router.post("/create", tags = ["project"])
async def create_project( project_data: project_models.ProjectRegisterModel = Depends(), user_data = Depends(auth_services.get_user_current) ):
    project_id = await project_services.create_project(project_data, user_data)
    await project_services.set_profile_in_project(project_id, user_data['app_user_id'], 'admin')

@project_router.get("/{project_auth_key}/teams", tags = ["project"], dependencies=[Depends(auth_services.get_user_current)])
async def get_teams_from_project( project_auth_key: str):
    project = await project_services.get_project_current(project_auth_key)
    teams = await project_services.get_teams_from_project(project['project_id'])
    return teams

@project_router.get("/{user_id}/projects", tags = ["project"], )
async def get_projects_from_user( user_data = Depends(auth_services.get_user_current) ):
    return await project_services.get_all_projects_from_user(user_data['app_user_id'])
