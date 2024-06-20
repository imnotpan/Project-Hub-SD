from pydantic import BaseModel
from datetime import date

class TasksModel(BaseModel): # Modelo de una tarea
    project_auth_key: str
    team_id: int
    task_description: str
    task_end_date: date
    task_deadline_date: date
    task_difficult: int
    task_state: str
    
class TaskUpdateModel(BaseModel): # Modelo para la actualización de tareas (PUT /task)
    project_auth_key: str
    team_id: int
    task_id: int
    task_description: str
    task_end_date: date
    task_deadline_date: date
    task_difficult: int
    task_state: str
    
class TaskDestroyModel(BaseModel): # Modelo para la eliminación de tareas (DELETE /task)    
    project_auth_key: str
    team_id: int
    task_id: int