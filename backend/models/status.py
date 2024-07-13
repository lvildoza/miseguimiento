from pydantic import BaseModel
from datetime import datetime

class Status(BaseModel):
    id: str
    product_status: str
    status_datetime: datetime = datetime.now()
    