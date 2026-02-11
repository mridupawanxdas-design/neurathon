from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.database import init_db
from app.api.routes import router
from app.api.udhaar import udhaar_router
from app.api.inventory import inventory_router

app = FastAPI(title="Bharat Biz-Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(router)
app.include_router(udhaar_router)
app.include_router(inventory_router)

init_db()
