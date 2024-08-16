from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from bson import ObjectId
from uuid import uuid4 as uuid
from schema.schema_user import list_user

# Requirements login
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from config.database import usercollection_name
from models.model_users import Users

user_router = APIRouter(prefix="/api/v1",
                          tags=["Users"],
                          responses={status.HTTP_404_NOT_FOUND: {"message": "No encontrado"}})

def convert_objectid(obj):
    """Función auxiliar para convertir ObjectId a cadena."""
    if isinstance(obj, ObjectId):
        return str(obj)
    raise TypeError(f"Type {type(obj)} not serializable")

###################################
############## Login ##############
###################################

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_user(username: str):
    user = usercollection_name.find_one({"user_name": username})
    if user:
        return Users(**user)
    return None

def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user or not verify_password(password, user.user_password):
        return False
    return user

@user_router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"access_token": user.user_name, "token_type": "bearer"}

###################################
# Request Method Endpoint "Users"#
###################################
    

# GET
@user_router.get("/users")
async def get_users(token: str = Depends(oauth2_scheme)):
    try:
        user = list_user(usercollection_name.find())
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No se encontraron usuarios"
            )
        
        # Ordenar los seguimientos por user_id en orden descendente
        user = sorted(user, key=lambda x: x["user_id"], reverse=True)

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=jsonable_encoder(user)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener los usuarios: {str(e)}"
        )
    
# GET: para listar usuarios por id
@user_router.get("/users/{user_id}")
async def get_users_by_user_id(user_id: str, token: str = Depends(oauth2_scheme)):
    try:
        user = usercollection_name.find_one({"user_id": user_id})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el usuario con id {user_id}"
            )
        
        # Convertir ObjectId a cadena
        user = jsonable_encoder(user, custom_encoder={ObjectId: convert_objectid})
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=user
        )
      
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener el usuario: {str(e)}"
        )
    
# POST: endpoint para agregar un nuevo user
@user_router.post("/users", status_code=status.HTTP_201_CREATED)
async def post_users(user: Users, token: str = Depends(oauth2_scheme)):
    try:
        user.user_id = str(uuid())
        usercollection_name.insert_one(jsonable_encoder(user))
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"message": "Usuario registrado exitosamente"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al registrar el usuario: {str(e)}"
        )
