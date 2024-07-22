

# Schema Seguimiento
def individual_seguimiento(seguimiento) -> dict:
    return {
        "id": str(seguimiento["id"]),
        "initial_date": seguimiento["initial_date"],
        "product_deadline": seguimiento["product_deadline"],
        "user_name": seguimiento["user_name"],
        "product_description": seguimiento["product_description"],
        "product_delivery": seguimiento["product_delivery"],
        "product_status": seguimiento["product_status"]
    }

# Schema List Seguimiento
def list_seguimiento(seguimientos) -> list:
    return[individual_seguimiento(seguimiento) for seguimiento in seguimientos]

# Schema Status
def individual_status(status) -> dict:
    return {
        "id": str(status["id"]),
        "product_status": status["product_status"],
    }

def list_status(statuses) -> list:
    return[individual_status(status) for status in statuses]

# Schema Status By Date Time
def status_byDateTime(status) -> dict:
    return {
        "id": str(status["id"]),
        "product_status": status["product_status"],
        "status_datetime": status["status_datetime"]
    }

def list_status_byDateTime(statuses) -> list:
    return[status_byDateTime(status) for status in statuses]