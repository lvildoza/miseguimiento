

# Schema Seguimiento
def individual_seguimiento(seguimiento) -> dict:
    return {
        "product_id": str(seguimiento["product_id"]),
        "product_initial_date": seguimiento["product_initial_date"],
        "product_client_name": seguimiento["product_client_name"],
        "product_deadline": seguimiento["product_deadline"],
        "product_description": seguimiento["product_description"],
        "product_delivery_type": seguimiento["product_delivery"],
        "product_status": seguimiento["product_status"]
        }

def product_status(productstatus) -> dict:
    return {
        "product_status_datetime": productstatus["product_status_datetime"],
        "product_status_type": productstatus["product_status_type"],
        "product_description_status": productstatus["product_description_status"]
        }

# Schema List Seguimiento
def list_seguimiento(seguimientos) -> list:
    return[individual_seguimiento(seguimiento) for seguimiento in seguimientos]

# Schema Status
def individual_status(status) -> dict:
    return {
        "product_id": str(status["product_id"]),
        "product_status": status["ProductStatus"]
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