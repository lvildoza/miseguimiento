from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from models.model_users import Users
from config.database import usercollection_name


test = APIRouter(prefix="/api/v1",
                 tags=["Test"],
                 responses={status.HTTP_404_NOT_FOUND: {"message": "No encontrado"}})

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_user(username: str):
    user = usercollection_name.find_one({"user_name": username})
    if user:
        return Users(**user)
    return None

def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user or not verify_password(password, user.user_password):
        return False
    return user

@test.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"access_token": user.user_name, "token_type": "bearer"}

@test.get("/test")
def get_test(token: str = Depends(oauth2_scheme)):
    return {"message": "Login correcto"}


@test.get("/")
def read_root():
    return {"message": "Bienvenido a la API"}
