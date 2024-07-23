from pydantic import BaseModel
from datetime import datetime
from typing import List

class ProductStatus(BaseModel):
    product_status_datetime: datetime
    product_status_type: str
    product_description_status: str

class Seguimiento(BaseModel):
    product_id: str = None
    product_initial_date: datetime = datetime.now()
    product_client_name: str
    product_deadline: str
    product_description: str
    product_delivery_type: str
    product_status: List[ProductStatus]

class SeguimientoDeadLine(BaseModel):
    product_deadline: str