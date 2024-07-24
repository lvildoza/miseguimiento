from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from uuid import uuid4 as uuid
from models.model_seguimiento import SeguimientoDeadLine, Seguimiento
from schema.schema_seguimiento import list_seguimiento
from config.database import collection_name
from bson import ObjectId

seguimiento = APIRouter(prefix="/api/v1",
                        tags=["Seguimiento"])

def convert_objectid(obj):
    """Función auxiliar para convertir ObjectId a cadena."""
    if isinstance(obj, ObjectId):
        return str(obj)
    raise TypeError(f"Type {type(obj)} not serializable")

#########################################
# Request Method Endpoint "Seguimiento" #
#########################################

# GET
@seguimiento.get("/seguimiento")
async def get_seguimiento():
    try:
        seguimientos = list_seguimiento(collection_name.find())
        if not seguimientos:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No se encontraron seguimientos"
            )
        
        # Ordenar los seguimientos por product_initial_date en orden descendente
        seguimientos = sorted(seguimientos, key=lambda x: x["product_initial_date"], reverse=True)

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=jsonable_encoder(seguimientos)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener los seguimientos: {str(e)}"
        )

# GET by ID
@seguimiento.get("/seguimiento/{id}")
async def get_seguimiento_by_id(id: str):
    try:
        seguimiento = collection_name.find_one({"product_id": id})
        if not seguimiento:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el seguimiento con id {id}"
            )

        # Convertir ObjectId a cadena
        seguimiento = jsonable_encoder(seguimiento, custom_encoder={ObjectId: convert_objectid})
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=seguimiento
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener el seguimiento: {str(e)}"
        )

# POST
@seguimiento.post("/seguimiento", status_code=status.HTTP_201_CREATED)
async def post_seguimiento(seguimiento: Seguimiento):
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
@seguimiento.put("/seguimiento/{id}", status_code=status.HTTP_200_OK)
async def update_seguimiento(id: str, seguimiento: Seguimiento):
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
@seguimiento.put("/seguimiento/{id}/deadline")
async def put_seguimiento_deadline(id: str, seguimiento: SeguimientoDeadLine):
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
@seguimiento.delete("/seguimiento/{id}", status_code=status.HTTP_200_OK)
async def delete_seguimiento(id: str):
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