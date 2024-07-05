import src.services.log_services as log_services

from fastapi import APIRouter, Depends
import src.models.tasks_models as tasks_models
import src.services.auth_services as auth_services
import src.services.project_services as project_services
import src.services.tasks_services as tasks_services
import src.services.message_services as message_services

tasks_router = APIRouter()

@tasks_router.post("/add", tags = ["tasks"]) # Ruta para el registro de tareas
async def add_task( task_data: tasks_models.TasksModel = Depends(), user = Depends(auth_services.get_user_current)):
    await log_services.add_log(f"Start add task", 1, 12, user['app_user_id'] )
    
    project = await project_services.get_project_current(task_data.project_auth_key)
    task_data = await tasks_services.add_task(task_data)
    await tasks_services.send_task_to_queue(task_data, project['project_id'], 'add')
    await log_services.add_log(f"End add task", 2, 12, user['app_user_id'] )
    return task_data
    
@tasks_router.patch("/update", tags=["tasks"] ) # Ruta para la actualización de tareas
async def update_task( task_data: tasks_models.TaskUpdateModel = Depends(), user = Depends(auth_services.get_user_current)):
    await log_services.add_log(f"Start update task", 1, 12, user['app_user_id'] )
    
    project = await project_services.get_project_current(task_data.project_auth_key)
    task_data = await tasks_services.update_task(task_data)
    await tasks_services.send_task_to_queue(task_data, project['project_id'], 'update')
    await log_services.add_log(f"End update task {task_data.task_id}", 2, 12, user['app_user_id'] )
    return task_data

@tasks_router.delete("/delete", tags=["tasks"] ) # Ruta para la eliminación de tareas
async def delete_task( task_data: tasks_models.TaskDestroyModel = Depends(), user = Depends(auth_services.get_user_current)):
    await log_services.add_log(f"Start delete task", 1, 14, user['app_user_id'] )
    
    project = await project_services.get_project_current(task_data.project_auth_key)
    await tasks_services.delete_task(task_data.task_id)
    await tasks_services.send_delete_task(task_data.team_id, project['project_id'], task_data.task_id)
    await log_services.add_log(f"End delete task {task_data.task_id}", 1, 14, user['app_user_id'] )
    
    return {"task_id", task_data.task_id}
