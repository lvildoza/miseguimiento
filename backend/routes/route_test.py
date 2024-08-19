from fastapi import APIRouter, HTTPException, status

# Requirements login
from fastapi import Depends
from passlib.context import CryptContext
from routes.route_login import oauth2_scheme


test_router = APIRouter(prefix="/api/v1",
                 tags=["Test"],
                 responses={status.HTTP_404_NOT_FOUND: {"message": "No encontrado"}})

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@test_router.get("/test")
def get_test(token: str = Depends(oauth2_scheme)):
    return {"message": "Login correcto"}


@test_router.get("/")
def read_root():
    return {"message": "Bienvenido a la API"}
