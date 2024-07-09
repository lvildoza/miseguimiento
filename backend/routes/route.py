from fastapi import APIRouter
from models.seguimiento import Seguimiento
from models.seguimiento import SeguimientoDeadLine
from models.status import Status
from schema.schemas import list_seguimiento
from schema.schemas import list_status
from schema.schemas import list_status_byDateTime
from config.database import collection_name
from bson import ObjectId

router = APIRouter()
router.prefix = "/api/v1"

#########################################
# Request Method Endpoint "Seguimiento" #
#########################################

# GET
@router.get("/seguimiento", tags=["Seguimiento"])
async def get_seguimientos():
    seguimientos = list_seguimiento(collection_name.find())
    return seguimientos

# GET By Id
@router.get("/seguimiento/{id}", tags=["Seguimiento"])
async def get_seguimientoById(id):
    get_seguimiento_byid = list_seguimiento(collection_name.find({"_id": ObjectId(id)}))
    return get_seguimiento_byid

# POST
@router.post("/seguimiento", tags=["Seguimiento"])
async def post_seguimiento(seguimiento: Seguimiento):
    collection_name.insert_one(dict(seguimiento))

# PUT
@router.put("/seguimiento/{id}", tags=["Seguimiento"])
async def put_seguimiento(id: str, seguimiento: Seguimiento):
    collection_name.find_one_and_update({"_id": ObjectId(id)}, {"$set": dict(seguimiento)})

# PUT DeadLine
@router.put("/seguimiento/{id}/deadline", tags=["Seguimiento"])
async def put_seguimiento_deadline(id: str, seguimiento: SeguimientoDeadLine):
    collection_name.find_one_and_update({"_id": ObjectId(id)}, {"$set": dict(seguimiento)})

# DELETE
@router.delete("/seguimiento/{id}", tags=["Seguimiento"])
async def delete_seguimiento(id: str):
    collection_name.find_one_and_delete({"_id": ObjectId(id)})


###################################
# Request Method Endpoint "Status"#
###################################

# GET
@router.get("/status", tags=["Status"])
async def get_status():
    statuses = list_status(collection_name.find())
    return statuses

# GET By Date Time
@router.get("/status/datetime", tags=["Status"])
async def get_status_byDateTime():
    status_byDateTime = list_status_byDateTime(collection_name.find())
    return status_byDateTime

# GET By Id
@router.get("/status/{id}", tags=["Status"])
async def get_statusById(id):
    get_status_byid = list_status_byDateTime(collection_name.find({"_id": ObjectId(id)}))
    return get_status_byid

# PUT
@router.put("/status/{id}", tags=["Status"])
async def put_status(id: str, status: Status):
    collection_name.find_one_and_update({"_id": ObjectId(id)}, {"$set": dict(status)})