from fastapi import APIRouter, HTTPException, status
from models.status import Status
from schema.schemas import list_status
from schema.schemas import list_status_byDateTime
from config.database import collection_name

status = APIRouter(prefix="/api/v1",
                   tags=["Status"],
                   responses={status.HTTP_404_NOT_FOUND: {"message": "No encontrado"}})


###################################
# Request Method Endpoint "Status"#
###################################

# GET
@status.get("/status")
async def get_status():
    statuses = list_status(collection_name.find())
    return statuses

# GET By Date Time
@status.get("/status/datetime")
async def get_status_byDateTime():
    status_byDateTime = list_status_byDateTime(collection_name.find())
    return status_byDateTime

# GET By Id
@status.get("/status/{id}")
async def get_statusById(id):
    get_status_byid = list_status(collection_name.find({"id": str(id)}))
    return get_status_byid


# PUT
@status.put("/status/{id}")
async def put_status(id: str, status: Status):
    collection_name.find_one_and_update({"id": str(id)}, {"$set": dict(status)})
    return {"message": "Estado modificado exitosamente"}