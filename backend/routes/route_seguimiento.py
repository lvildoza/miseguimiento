from fastapi import Depends, APIRouter, HTTPException, Response, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from uuid import uuid4 as uuid
from models.model_seguimiento import SeguimientoDeadLine, Seguimiento, SeguimientoPost
from schema.schema_seguimiento import list_seguimiento
from config.database import collection_name

# Requirements login
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from config.database import usercollection_name
from models.model_users import Users


from bson import ObjectId

seguimiento_router = APIRouter(prefix="/api/v1",
                        tags=["Seguimiento"])


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

@seguimiento_router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"access_token": user.user_name, "token_type": "bearer"}


#########################################
# Request Method Endpoint "Seguimiento" #
#########################################

# GET
@seguimiento_router.get("/seguimiento")
async def get_seguimiento(token: str = Depends(oauth2_scheme)):
    try:
        get_seguimientos = list_seguimiento(collection_name.find())
        if not get_seguimientos:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No se encontraron seguimientos"
            )
        
        # Ordenar los seguimientos por product_initial_date en orden descendente
        get_seguimientos = sorted(get_seguimientos, key=lambda x: x["product_initial_date"], reverse=True)

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=jsonable_encoder(get_seguimientos)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener los seguimientos: {str(e)}"
        )
    


# GET by ID
@seguimiento_router.get("/seguimiento/{id}")
async def get_seguimiento_by_id(id: str):
    try:
        get_seguimiento_by_id = collection_name.find_one({"product_id": id})
        if not get_seguimiento_by_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el seguimiento con id {id}"
            )

        # Convertir ObjectId a cadena
        get_seguimiento_by_id = jsonable_encoder(get_seguimiento_by_id, custom_encoder={ObjectId: convert_objectid})
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=get_seguimiento_by_id
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener el seguimiento: {str(e)}"
        )

# POST
@seguimiento_router.post("/seguimiento", status_code=status.HTTP_201_CREATED)
async def post_seguimiento(seguimiento: SeguimientoPost, token: str = Depends(oauth2_scheme)):
    try:
        seguimiento.product_id = str(uuid())
        collection_name.insert_one(jsonable_encoder(seguimiento))
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"message": "Seguimiento registrado exitosamente"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al registrar el seguimiento: {str(e)}"
        )

# PUT
@seguimiento_router.put("/seguimiento/{id}", status_code=status.HTTP_200_OK)
async def update_seguimiento(id: str, seguimiento: Seguimiento, token: str = Depends(oauth2_scheme)):
    try:
        result = collection_name.update_one({"product_id": id}, {"$set": jsonable_encoder(seguimiento)})
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el seguimiento con id {id}"
            )

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Seguimiento actualizado exitosamente"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar el seguimiento: {str(e)}"
        )


# PUT DeadLine
@seguimiento_router.put("/seguimiento/{id}/deadline")
async def put_seguimiento_deadline(id: str, seguimiento: SeguimientoDeadLine, token: str = Depends(oauth2_scheme)):
    try:
        result = collection_name.update_one({"product_id": id}, {"$set": jsonable_encoder(seguimiento)})
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el seguimiento con id {id}"
            )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Fecha de entrega modificada exitosamente"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar fecha de entrega: {str(e)}"
        )


# DELETE
@seguimiento_router.delete("/seguimiento/{id}", status_code=status.HTTP_200_OK)
async def delete_seguimiento(id: str, token: str = Depends(oauth2_scheme)):
    try:
        result = collection_name.delete_one({"product_id": id})
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el seguimiento con id {id}"
            )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Seguimiento eliminado exitosamente"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar el seguimiento: {str(e)}"
        )