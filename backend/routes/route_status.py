from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from models.status import Status
from schema.schemas import list_status, list_status_byDateTime
from config.database import collection_name
from bson import ObjectId

status_router = APIRouter(prefix="/api/v1",
                          tags=["Status"],
                          responses={status.HTTP_404_NOT_FOUND: {"message": "No encontrado"}})

def convert_objectid(obj):
    """Función auxiliar para convertir ObjectId a cadena."""
    if isinstance(obj, ObjectId):
        return str(obj)
    raise TypeError(f"Type {type(obj)} not serializable")

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

# GET By Date Time
@status_router.get("/status/datetime")
async def get_status_byDateTime():
    try:
        status_byDateTime = list_status_byDateTime(collection_name.find())
        if not status_byDateTime:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No se encontraron estados por fecha y hora"
            )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=jsonable_encoder(status_byDateTime, custom_encoder={ObjectId: convert_objectid})
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener los estados por fecha y hora: {str(e)}"
        )

# GET By Id
@status_router.get("/status/{id}")
async def get_statusById(id: str):
    try:
        get_status_byid = collection_name.find_one({"id": id})
        if not get_status_byid:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el estado con id {id}"
            )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=jsonable_encoder(get_status_byid, custom_encoder={ObjectId: convert_objectid})
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener el estado: {str(e)}"
        )

# PUT
@status_router.put("/status/{id}")
async def put_status(id: str, status_data: Status):
    try:
        result = collection_name.find_one_and_update({"id": id}, {"$set": jsonable_encoder(status_data)})
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