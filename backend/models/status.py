from pydantic import BaseModel
from datetime import datetime

class Status(BaseModel):
    id: str = None
    product_status: str
    status_datetime: datetime = datetime.now()
    