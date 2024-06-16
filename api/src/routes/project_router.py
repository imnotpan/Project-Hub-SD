from datetime import datetime, timedelta, timezone
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
async def auth_project(project_data: project_models.ProjectSearchModel = Depends()):
    await project_services.project_auth(project_data.project_id, project_data.project_password)
    token = await auth_services.create_access_token(project_data.project_id)
    data = {"status_code": 201, "access_token": token, "token_type": "bearer"}
    return data

@project_router.post("/create", tags=["project"]) # Ruta para el registro de proyectos
async def create_project(
    project_data: project_models.ProjectRegisterModel = Depends(),
    user_data=Depends(auth_services.get_user_current),
):
    project_id = await project_services.create_project(project_data, user_data)
    return await project_services.set_profile_in_project(
        project_id["project_id"], user_data["app_user_id"], "admin"
    )
    
@project_router.post("/add/owner", tags=["project"])
async def create_project(
    project_data: project_models.ProjectRegisterModel = Depends(),
    user_data=Depends(auth_services.get_user_current),
):
    project_id = await project_services.create_project(project_data, user_data)
    return await project_services.set_profile_in_project(
        project_id["project_id"], user_data["app_user_id"], "admin"
    )

@project_router.get( # Ruta para la obtención de equipos de un proyecto
    "/{project_auth_key}/teams",
    tags=["project"],
    dependencies=[Depends(auth_services.get_user_current)],
)
async def get_teams_from_project(project_auth_key: str):
    project = await project_services.get_project_current(project_auth_key)
    teams = await project_services.get_teams_from_project(project["project_id"])
    return teams
    
