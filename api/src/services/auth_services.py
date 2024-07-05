from passlib.context import CryptContext
import os
from dotenv import load_dotenv
from datetime import datetime
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, OAuth2PasswordBearer
from jose import jwt as jose_jwt, JWTError
import src.controllers.db_controller as db

load_dotenv('.env.api') # Cargar variables de entorno

# Configuración de seguridad
security = HTTPBearer()
SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 60
# Configuración de encriptación
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme_user = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def register_user(user_data): # Registra un usuario en la base de datos
    find_user = await get_user_by_email(user_data.user_email)
    cursor = db.conn.cursor()
    if not find_user:
        user_query = f"""
            INSERT INTO app_user (app_user_name, app_user_email, app_user_password, app_user_create_date)
            VALUES (%s, %s, %s, %s)
            RETURNING app_user_id;
        """
        user_query_parameters = (user_data.user_name,
                            user_data.user_email,
                            await get_password_hash(user_data.user_password),
                            datetime.now().date())
        cursor.execute(user_query,user_query_parameters)
        db.conn.commit()
        new_user_id = cursor.fetchone()[0]  # Obtener el ID del usuario insertado
        cursor.close()
        return new_user_id
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User email exists"
        )

async def login_user(user_data): # Valida las credenciales de un usuario en la base de datos
    find_user = await get_user_by_email(user_data.username)
    if not find_user:
        raise HTTPException(status_code = 401, detail="Could not validate credentials", 
                            headers={"WWW-Authenticate":"Bearer"})        
    if not await verify_password(user_data.password, find_user['app_user_password']):
        raise HTTPException(status_code = 401, detail="", 
                    headers={"WWW-Authenticate":"Bearer"})  
    return find_user
        
async def get_user_by_email(user_email): # Obtiene un usuario por su email
    cursor = db.conn.cursor()
    email_query = f"SELECT * FROM app_user WHERE app_user_email = '{ user_email }';"
    cursor.execute(email_query)
    find_user = cursor.fetchone()
    if find_user:
        columns = [desc[0] for desc in cursor.description]
        user_info = dict(zip(columns, find_user))
        return user_info
    cursor.close()
    return find_user

async def verify_password(plain_password, hashed_password): # Verifica la contraseña de un usuario 
    return pwd_context.verify(plain_password.encode('utf-8'), hashed_password)

async def get_password_hash(password): # Obtiene el hash de una contraseña
    return pwd_context.hash(password.encode('utf-8'))

async def create_access_token(user_id): # Crea un token de acceso JWT para un usuario
    payload = {
        'sub': user_id
    }
    return jose_jwt.encode(payload, SECRET_KEY, ALGORITHM)
    
async def get_user_current(user_token: str = Depends(oauth2_scheme_user)): # Obtiene el usuario actual a partir de un token
    try:
        token_decode = jose_jwt.decode(user_token, SECRET_KEY, ALGORITHM)
        user_email = token_decode.get("sub")
        if user_email == None:
            raise HTTPException(status_code = 401, detail="User email not decoded", 
            headers={"WWW-Authenticate":"Bearer"})  
    except JWTError:
        raise HTTPException(status_code = 401, detail="User email not decoded", 
        headers={"WWW-Authenticate":"Bearer"})  
    
    user = await get_user_by_email(user_email)
    if not user:
        raise HTTPException(status_code = 401, detail="User not exists", 
        headers={"WWW-Authenticate":"Bearer"})  
    return user