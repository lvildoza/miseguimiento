from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from bson import ObjectId
from uuid import uuid4 as uuid
from schema.schema_user import list_user
from config.database import usercollection_name
from models.model_users import Users

# Requirements login
from fastapi import Depends
from passlib.context import CryptContext
from routes.route_login import oauth2_scheme

user_router = APIRouter(prefix="/api/v1",
                        tags=["Users"],
                        responses={status.HTTP_404_NOT_FOUND: {"message": "No encontrado"}})

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def convert_objectid(obj):
    """Función auxiliar para convertir ObjectId a cadena."""
    if isinstance(obj, ObjectId):
        return str(obj)
    raise TypeError(f"Type {type(obj)} not serializable")

###################################
# Request Method Endpoint "Users"#
###################################

# CREATE: endpoint para agregar un nuevo usuario
@user_router.post("/users", status_code=status.HTTP_201_CREATED)
async def post_users(user: Users):
    try:
        user.user_id = str(uuid())
        # Encriptar la contraseña antes de guardar
        user.user_password = pwd_context.hash(user.user_password)
        user_dict = jsonable_encoder(user)
        print(f"User data before insert: {user_dict}")  # Registro de depuración
        usercollection_name.insert_one(user_dict)
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"message": "Usuario registrado exitosamente"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al registrar el usuario: {str(e)}"
        )


# READ: endpoint para listar todos los usuarios
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
    
# READ: endpoint para listar usuarios por id
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

# UPDATE: endpoint para actualizar usuario por {id} 
@user_router.put("/user/{id}")
async def update_user(id: str, user: Users, token: str = Depends(oauth2_scheme)):
    try:
        result = usercollection_name.update_one({"user_id": id}, {"$set": jsonable_encoder(user)})
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el usuario con id {id}"
            )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Usuario modificado exitosamente"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar el usuario: {str(e)}"
        )

# DELETE: endpoint para eliminar usuario por {id}
@user_router.delete("/users/{id}", status_code=status.HTTP_200_OK)
async def delete_user(id: str, token: str = Depends(oauth2_scheme)):
    try:
        result = usercollection_name.delete_one({"user_id": id})
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el usuario con id {id}"
            )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Usuario eliminado exitosamente"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar el usuario: {str(e)}"
        )