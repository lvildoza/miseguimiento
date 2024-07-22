from pydantic import BaseModel, Field
from datetime import datetime

class Seguimiento(BaseModel):
    id: str = None
    initial_date: datetime = Field(default_factory=datetime.now)
    product_deadline: str = Field(..., example="2023-08-01")
    user_name: str = Field(..., example="Juan Perez")
    product_description: str = Field(..., example="Descripción del producto")
    product_delivery: str = Field(..., example="2023-08-05")
    product_status: str = Field(..., example="PENDIENTE")

    class Config:
        schema_extra = {
            "example": {
                "id": "12345",
                "initial_date": "2023-07-21T18:19:29",
                "product_deadline": "2023-08-01",
                "user_name": "Juan Perez",
                "product_description": "Descripción del producto",
                "product_delivery": "2023-08-05",
                "product_status": "PENDIENTE"
            }
        }

class SeguimientoDeadLine(BaseModel):
    product_deadline: str