from pydantic import BaseModel

class MessageContent(BaseModel): # Modelo para el envío de mensajes
    project_auth_key: str
    team_id: int
    message_content: str
    
class GeneralMessageContent(BaseModel):
    project_auth_key: str
    message_content: str