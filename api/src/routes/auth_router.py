from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, Response
import src.models.user_models as user_models
import src.services.auth_services as auth_services
import src.services.log_services as log_services
from fastapi.security import OAuth2PasswordRequestForm


auth_router = APIRouter()

# Ruta de registro de usuario
@auth_router.post("/register", tags=["auth"])
async def register_user(user_data: user_models.UserRegisterModel = Depends()):
    await log_services.add_log("User start register", 1, 1)
    user_id = await auth_services.register_user(user_data)
    await log_services.add_log("User register succesfully", 2, 1, user_id)
    return {"status": 201, "response": "Cuenta creada exitosamente"}

# Ruta de inicio de sesión
@auth_router.post("/login", tags=["auth"])
async def access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    await log_services.add_log("User start login", 1, 2)
    
    user = await auth_services.login_user(form_data)
    token = await auth_services.create_access_token(form_data.username)
    await log_services.add_log("User Login succesfully", 2, 2, user['app_user_id'])
    
    return {
        "user_name": user['app_user_name'],
        "user_email": user['app_user_email'],
        "access_token": token,
        "token_type": "bearer"
    }
