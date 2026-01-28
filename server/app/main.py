"""
Doggy Meetup Backend API
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1 import auth, dogs

app = FastAPI(
    title="Doggy Meetup API",
    description="狗狗拼团 - 连接狗狗主人的社交平台",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(dogs.router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": "Doggy Meetup API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
