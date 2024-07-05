from fastapi import APIRouter, Depends
import src.models.message_models as message_models
import src.services.auth_services as auth_services
import src.services.project_services as project_services
import src.services.message_services as message_services

messages_router = APIRouter()

@messages_router.post("/send/team", tags = ["message"]) # Ruta para el envío de mensajes a un equipo
async def send_message( message: message_models.MessageContent = Depends(), user = Depends(auth_services.get_user_current)):
    project = await project_services.get_project_current(message.project_auth_key)
    await message_services.save_in_db_team_message(message, user)
    return await message_services.send_message_to_queue(message, user, project) 

@messages_router.post("/send/general", tags = ["message"]) # Ruta para el envío de mensajes a un equipo
async def send_message( message: message_models.GeneralMessageContent = Depends(), user = Depends(auth_services.get_user_current)):
    project = await project_services.get_project_current(message.project_auth_key)
    print(project)
    await message_services.save_in_db_team_message_general(message, user, project['project_id'])
    return await message_services.send_message_general_to_queue(message, user, project)