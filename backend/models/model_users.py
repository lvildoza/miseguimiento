from pydantic import BaseModel, Field, validator
from typing import List, Optional
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserContact(BaseModel):
    user_address: str
    user_city: str
    user_state: str
    user_zip: str
    user_country: str
    user_phone: str

class Users(BaseModel):
    user_id: Optional[str] = None
    user_first_name: str
    user_last_name: str
    user_mail: str
    user_name: str
    user_password: str
    user_contact: List[UserContact] = Field(default_factory=list)

@validator('user_password', pre=True, always=True)
def hash_password(user_password):
    return pwd_context.hash(user_password)
