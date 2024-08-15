from pydantic import BaseModel
from typing import List

class UserContact(BaseModel):
    user_address: str
    user_city: str
    user_state: str
    user_zip: str
    user_country: str
    user_phone: str

class users(BaseModel):
    user_id: str = None
    user_first_name: str
    user_last_name: str
    user_mail: str
    user_password: str
    user_contact: List[UserContact]

class UserLogin(BaseModel):
    user_password: str
    user_alias: str