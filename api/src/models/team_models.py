from pydantic import BaseModel
from typing import Optional

class TeamRegisterModel(BaseModel): # Modelo para el registro de equipos
    project_auth_key: str
    team_description: str
    team_name: str
    team_password: Optional[str] = None

class TeamJoinModel(BaseModel): # Modelo para unirse a un equipo
    project_auth_key: str
    team_id: int
    team_password: Optional[str] = None
    
class TeamDataSearch(BaseModel): # Modelo para la búsqueda de equipos
    project_auth_key: str
    team_id: int

class TeamAddLeader(BaseModel):
    user_email: str