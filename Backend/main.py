from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import model
import time
start_time = time.time()

app = FastAPI()

# CORS configuration - allows frontend to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173","http://localhost","http://127.0.0.1"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

MODEL_VERSION = '1.0.0'

@app.get("/")
def root():
    return {
        "message":"This is the end Point where model Testing API is hosted"
    }

#for aws recommended (Machine readable)
@app.get("/health")
def health_check():
    uptime = time.time() - start_time
    return {
        "status":"OK",
        "version":MODEL_VERSION,
        "model_loaded": model is not None,
        "service":"Insurence Prediction Model API ",
        "uptime_seconds":round(uptime,2)

    }

app.include_router(model.router)
