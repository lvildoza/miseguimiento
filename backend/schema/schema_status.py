# Schema Status
def individual_status(status) -> dict:
    return {
        "product_id": str(status["product_id"]),
        "product_status": status["product_status"]
    }

def list_status(statuses) -> list:
    return[individual_status(status) for status in statuses]