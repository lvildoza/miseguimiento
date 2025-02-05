from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.route_seguimiento import seguimiento
from routes.route_status import status_router


app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost:5173",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(status_router)
app.include_router(seguimiento)
