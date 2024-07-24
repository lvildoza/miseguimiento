# Schema Seguimiento
def individual_seguimiento(seguimiento) -> dict:
    return {
        "product_id": str(seguimiento["product_id"]),
        "product_initial_date": seguimiento["product_initial_date"],
        "product_client_name": seguimiento["product_client_name"],
        "product_deadline": seguimiento["product_deadline"],
        "product_description": seguimiento["product_description"],
        "product_delivery_type": seguimiento["product_delivery_type"]
        }


# Schema List Seguimiento
def list_seguimiento(seguimientos) -> list:
    return[individual_seguimiento(seguimiento) for seguimiento in seguimientos]