from pydantic import BaseModel
from datetime import datetime

class Seguimiento(BaseModel):
    id: str = None
    initial_date: datetime = datetime.now()
    product_deadline: str
    user_name: str
    product_description: str
    product_delivery: str
    product_status: str = "PENDIENTE"

class SeguimientoDeadLine(BaseModel):
    product_deadline: str