from fastapi import Depends, APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from bson import ObjectId
from uuid import uuid4 as uuid
from models.model_seguimiento import SeguimientoDeadLine, Seguimiento, SeguimientoPost
from models.model_seguimiento import SeguimientoDeadLine, Seguimiento, SeguimientoPost
from schema.schema_seguimiento import list_seguimiento
from config.database import collection_name

# Requirements login
from fastapi import Depends
from passlib.context import CryptContext
from routes.route_login import oauth2_scheme

seguimiento_router = APIRouter(prefix="/api/v1",
                        tags=["Seguimiento"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def convert_objectid(obj):
    """Función auxiliar para convertir ObjectId a cadena."""
    if isinstance(obj, ObjectId):
        return str(obj)
    raise TypeError(f"Type {type(obj)} not serializable")

#########################################
# Request Method Endpoint "Seguimiento" #
#########################################

# CREATE: endpoint para crear seguimientos
@seguimiento_router.post("/seguimiento", status_code=status.HTTP_201_CREATED)
async def post_seguimiento(seguimiento: SeguimientoPost, token: str = Depends(oauth2_scheme)):
    try:
        seguimiento.product_id = str(uuid())
        collection_name.insert_one(jsonable_encoder(seguimiento))
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"message": "Seguimiento registrado exitosamente", "product_id": seguimiento.product_id}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al registrar el seguimiento: {str(e)}"
        )

# READ: endpoint para listar todos los seguimientos
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

# READ: endpoint para listar seguimientos por {id}
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

# UPDATE: endpoint para actualizar seguimiento por {id}
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

# UPDATE: endpoint para actualizar DeadLine por {id}
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

# DELETE: endpoint para eliminación de seguimiento por {id}
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