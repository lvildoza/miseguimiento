from fastapi import APIRouter, HTTPException, status
from uuid import uuid4 as uuid
from models.seguimiento import Seguimiento
from models.seguimiento import SeguimientoDeadLine
from schema.schemas import list_seguimiento
from config.database import collection_name

seguimiento = APIRouter(prefix="/api/v1",
                   tags=["Seguimiento"],
                   responses={status.HTTP_404_NOT_FOUND: {"message": "No encontrado"}})


#########################################
# Request Method Endpoint "Seguimiento" #
#########################################

# GET
@seguimiento.get("/seguimiento")
async def get_seguimientos():
    seguimientos = list_seguimiento(collection_name.find())
    return seguimientos

# GET By Id
@seguimiento.get("/seguimiento/{id}")
async def get_seguimientoById(id):
    _seguimientoID = list_seguimiento(collection_name.find({"id": str(id)}))
    return _seguimientoID

# POST
@seguimiento.post("/seguimiento", status_code=status.HTTP_201_CREATED)
async def post_seguimiento(seguimiento: Seguimiento):
    seguimiento.id = str(uuid())
    collection_name.insert_one(dict(seguimiento))
    return {"message": "Seguimiento registrado exitosamente"}


# PUT
@seguimiento.put("/seguimiento/{id}")
async def put_seguimiento(id: str, seguimiento: Seguimiento):
    collection_name.find_one_and_update({"id": str(id)}, {"$set": dict(seguimiento)})
    return {"message": "Seguimiento modificado exitosamente"}

# PUT DeadLine
@seguimiento.put("/seguimiento/{id}/deadline")
async def put_seguimiento_deadline(id: str, seguimiento: SeguimientoDeadLine):
    collection_name.find_one_and_update({"id": str(id)}, {"$set": dict(seguimiento)})
    return {"message": "Fecha de entrega modificada exitosamente"}

# DELETE
@seguimiento.delete("/seguimiento/{id}")
async def delete_seguimiento(id: str):
    collection_name.find_one_and_delete({"id": str(id)})
    return {"message": "Seguimiento eliminado exitosamente"}
