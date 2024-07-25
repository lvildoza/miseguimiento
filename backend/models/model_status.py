from pydantic import BaseModel
from datetime import datetime
from typing import List

class ProductStatus(BaseModel):
    product_status_datetime: datetime = datetime.now()
    product_status_type: str = None
    product_description_status: str = None

class Status(BaseModel):
    product_id: str = None
    product_status: List[ProductStatus]