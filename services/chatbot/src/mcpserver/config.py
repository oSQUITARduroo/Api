import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    WEB_SERVICE = os.getenv("WEB_SERVICE", "crapi-web")
    IDENTITY_SERVICE = os.getenv("IDENTITY_SERVICE", "crapi-identity:8080")
    CHROMA_PERSIST_DIRECTORY = os.getenv("CHROMA_PERSIST_DIRECTORY", "/app/vectorstore")
    TLS_ENABLED = os.getenv("TLS_ENABLED", "false").lower() in ("true", "1", "yes")
    API_AUTH_TYPE = os.getenv("API_AUTH_TYPE", "jwt") # Toggle between "apikey" and "jwt" based on your auth type