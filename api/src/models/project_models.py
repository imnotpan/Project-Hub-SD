from pydantic import BaseModel

class ProjectRegisterModel(BaseModel): # Modelo para el registro de proyectos (POST /project)
    project_name: str
    project_password: str
    project_description: str

class ProjectSearchModel(BaseModel): # Modelo para la búsqueda de proyectos (GET /project)
    project_id: str
    project_password: str
    
class ProjectTeamsModel(BaseModel): # Modelo para la obtención de equipos de un proyecto (GET /project/teams)
    project_auth_key: str
    
class ProjectOwnerModel(BaseModel):
    project_auth_key: str
    user_email: str
    
