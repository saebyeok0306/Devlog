import logging
import socket
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from py_eureka_client import eureka_client

from app.api import api_routers


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
load_dotenv(verbose=True, override=True)

origins = [
    "http://localhost:3000",  # Example frontend URL
    "https://devlog.run",
    # Add more origins as needed
]


def get_ip_address():
    hostname = socket.gethostname()
    ip_address = socket.gethostbyname(hostname)
    return ip_address


@asynccontextmanager
async def lifespan(app_: FastAPI):
    # Startup
    logger.info(f"get_ip_address(): {get_ip_address()}")
    eureka_server = "http://discovery-service:8761/eureka"
    logger.info(f"Initializing Eureka client with server: {eureka_server}, port: 8100")
    await eureka_client.init_async(
        eureka_server=eureka_server,  # "http://localhost:8761/eureka",
        app_name="llm-service",
        instance_id=f"llm-instance:{get_ip_address()}:8100",
        # instance_host="127.0.0.1",
        instance_port=8100,
    )

    yield

    # Shutdown
    logger.info("Stopping Eureka client")
    await eureka_client.stop_async()

app = FastAPI(lifespan=lifespan)
for router in api_routers:
    app.include_router(router)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,  # Allows all origins if set to ["*"]
#     allow_credentials=True,
#     allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
#     allow_headers=["*"],  # Allows all headers
# )


@app.get("/health")
async def health_check():
    logger.info("Handling health check request")
    return {"status": "UP"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8100)