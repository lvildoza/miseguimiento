# Schema Users
def individual_user(user) -> dict:
    return {
        "user_id": str(user["user_id"]),
        "user_first_name": user["user_first_name"],
        "user_last_name": user["user_last_name"],
        "user_mail": user["user_mail"],
        "user_password": user["user_password"],
        "product_delivery_type": user["product_delivery"],
        "user_contact": user["user_contact"]
        }


# Schema List Seguimiento --- CHEQUEADO OK!
def list_user(users) -> list:
    return[individual_user(user) for user in users]