from fastapi import FastAPI
from routers import model
import time
start_time = time.time()

app = FastAPI()

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
