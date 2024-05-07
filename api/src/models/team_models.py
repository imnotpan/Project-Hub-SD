from pydantic import BaseModel

class TeamRegisterModel(BaseModel):
    project_id: str
    team_description: str
    team_name: str
