from pydantic import BaseModel
from datetime import date
from typing import Optional

class TasksModel(BaseModel): # Modelo de una tarea
    project_auth_key: str
    team_id: int
    task_name: str
    task_description:  Optional[str] = ""
    task_end_date: date
    task_deadline_date: date
    task_difficult: int
    task_state: str
    
class TaskUpdateModel(BaseModel): # Modelo para la actualización de tareas (PUT /task)
    project_auth_key: str
    team_id: int
    task_id: int
    task_name: Optional[str] = None
    task_description: Optional[str] = None
    task_end_date: Optional[date] = None
    task_deadline_date: Optional[date] = None
    task_difficult: Optional[int] = None
    task_state: Optional[str] = None
    
class TaskDestroyModel(BaseModel): # Modelo para la eliminación de tareas (DELETE /task)    
    project_auth_key: str
    team_id: int
    task_id: int