"""
Doggy Meetup Backend API
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

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


@app.get("/")
async def root():
    return {"message": "Doggy Meetup API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
