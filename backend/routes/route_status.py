from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from bson import ObjectId
from models.model_status import Status, ProductStatus
from models.model_users import Users
from schema.schema_status import list_status
from config.database import collection_name
from config.database import usercollection_name


status_router = APIRouter(prefix="/api/v1",
                          tags=["Status"],
                          responses={status.HTTP_404_NOT_FOUND: {"message": "No encontrado"}})

def convert_objectid(obj):
    """Función auxiliar para convertir ObjectId a cadena."""
    if isinstance(obj, ObjectId):
        return str(obj)
    raise TypeError(f"Type {type(obj)} not serializable")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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

@status_router.post("/token")
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
# Request Method Endpoint "Status"#
###################################

# GET
@status_router.get("/status")
async def get_status():
    try:
        statuses = list_status(collection_name.find())
        if not statuses:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No se encontraron estados"
            )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=jsonable_encoder(statuses, custom_encoder={ObjectId: convert_objectid})
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener los estados: {str(e)}"
        )
    
# GET: para listar estados por product_id
@status_router.get("/status/{product_id}")
async def get_status_by_product_id(product_id: str):
    try:
        product = collection_name.find_one({"product_id": product_id}, {"_id": 0, "product_id": 1, "product_status": 1})
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el producto con id {product_id}"
            )
        
        # Ordenar el array product_status por product_status_datetime en orden descendente
        product["product_status"] = sorted(product["product_status"], key=lambda x: x["product_status_datetime"], reverse=True)

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=jsonable_encoder(product, custom_encoder={ObjectId: convert_objectid})
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener los estados: {str(e)}"
        )

# PUT
@status_router.put("/status/{id}")
async def put_status(id: str, status_data: Status):
    try:
        result = collection_name.find_one_and_update({"product_id": id}, {"$set": jsonable_encoder(status_data)})
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el estado con id {id}"
            )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Estado modificado exitosamente"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al modificar el estado: {str(e)}"
        )
    

# POST: endpoint para agregar un nuevo estado
@status_router.post("/add_status/{product_id}")
async def add_status(product_id: str, status: ProductStatus, token: str = Depends(oauth2_scheme)):
    result = collection_name.update_one(
        {"product_id": product_id},
        {"$push": {"product_status": status.dict()}}
    )
    if result.modified_count == 1:
        return {"message": "Estado agregado exitosamente"}
    else:
        raise HTTPException(status_code=404, detail="Producto no encontrado")