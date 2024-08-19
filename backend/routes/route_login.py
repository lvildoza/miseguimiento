from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from datetime import timedelta, datetime
from jose import jwt
from config.database import usercollection_name
from models.model_users import Users

login_router = APIRouter(prefix="/api/v1",
                         tags=["Login"],
                         responses={status.HTTP_404_NOT_FOUND: {"message": "No encontrado"}})

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/token")

SECRET_KEY = 'ezOoh4tJHWth8MzOX8XCf6mpr5fax4+8UMbwq35Ztms='
ALGORITHM = "HS256"

# TOKEN EXPIRE: función que define el tiempo de expiración del token
def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# PASSWORD VALIDATE: validación del password
def verify_password(plain_password, hashed_password):
    print(f"Verifying password: {plain_password} against hash: {hashed_password}")
    result = pwd_context.verify(plain_password, hashed_password)
    print(f"Password verification result: {result}")
    return result

# USER VALIDATE: validación del usuario
def get_user(username: str):
    user = usercollection_name.find_one({"user_name": username})
    if user:
        print(f"User found: {user}")
        return Users(**user)
    print("User not found")
    return None

# AUTHENTICATE USER: función de login
def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        print("Authentication failed: user not found")
        return False
    if not verify_password(password, user.user_password):
        print("Authentication failed: incorrect password")
        return False
    print("Authentication successful")
    return user

#########################################
# Request Method Endpoint "Login" #
#########################################

# TOKEN: Endpoint por donde viaja la información de login
@login_router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    print(f"Login attempt with username: {form_data.username} and password: {form_data.password}")
    user = authenticate_user(form_data.username, form_data.password)
    if user:
        access_token = create_access_token(
            data={"sub": user.user_name}, expires_delta=timedelta(minutes=1)
        )
        print("Login successful")
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        print("Login failed: incorrect username or password")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password", headers={"WWW-Authenticate": "Bearer"})
