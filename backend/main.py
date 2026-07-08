import os
import time
import random
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="HIFA Backend API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure output directory exists
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "outputs")
os.makedirs(OUTPUT_DIR, exist_ok=True)

class TrainRequest(BaseModel):
    image_count: int

class TrainResponse(BaseModel):
    status: str
    epochs_completed: int

class PredictRequest(BaseModel):
    model: str
    temperature: float
    steps: int
    guidance_scale: float
    seed: str

class PredictResponse(BaseModel):
    status: str
    generated_image_path: str
    inference_time_seconds: float

# Global count for simulated training epochs
training_epoch_counter = 0

@app.get("/api/health")
def health_check():
    return {"status": "ok", "timestamp": time.time()}

@app.post("/api/train", response_model=TrainResponse)
def train_model(payload: TrainRequest):
    global training_epoch_counter
    training_epoch_counter = (training_epoch_counter % 5) + 1
    
    # Simulate a brief server-side processing delay
    time.sleep(0.05)
    
    return TrainResponse(
        status="TRAINING_IN_PROGRESS" if training_epoch_counter < 5 else "COMPLETED",
        epochs_completed=training_epoch_counter
    )

@app.post("/api/predict", response_model=PredictResponse)
def predict_model(payload: PredictRequest):
    start_time = time.time()
    
    # Simulate machine learning inference delay based on steps
    sleep_dur = max(0.1, min(1.5, payload.steps * 0.005))
    time.sleep(sleep_dur)
    
    filename = f"gen_seed_{payload.seed}.png"
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    # Try to generate a dummy image using Pillow
    try:
        from PIL import Image, ImageDraw
        # Create a gradient image based on the seed
        # Hash seed string to get numeric seed for random
        numeric_seed = hash(payload.seed) % (2**32)
        random.seed(numeric_seed)
        r1, g1, b1 = random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)
        r2, g2, b2 = random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)
        
        img = Image.new("RGB", (512, 512))
        draw = ImageDraw.Draw(img)
        
        # Simple vertical gradient
        for y in range(512):
            ratio = y / 512.0
            r = int(r1 * (1 - ratio) + r2 * ratio)
            g = int(g1 * (1 - ratio) + g2 * ratio)
            b = int(b1 * (1 - ratio) + b2 * ratio)
            draw.line([(0, y), (512, y)], fill=(r, g, b))
            
        # Draw seed info on the image
        draw.text((20, 20), "HIFA Gen Output", fill=(255, 255, 255))
        draw.text((20, 40), f"Model: {payload.model}", fill=(255, 255, 255))
        draw.text((20, 60), f"Seed: {payload.seed}", fill=(255, 255, 255))
        draw.text((20, 80), f"Steps: {payload.steps}", fill=(255, 255, 255))
        draw.text((20, 100), f"Temp: {payload.temperature}", fill=(255, 255, 255))
        
        img.save(filepath)
    except Exception as e:
        # Fallback if Pillow is not installed: create a simple text file
        filepath = os.path.join(OUTPUT_DIR, f"gen_seed_{payload.seed}.txt")
        with open(filepath, "w") as f:
            f.write(f"Generated Image Placeholder\nSeed: {payload.seed}\nModel: {payload.model}\nError: {e}")
            
    inference_time = time.time() - start_time
    return PredictResponse(
        status="success",
        generated_image_path=os.path.abspath(filepath),
        inference_time_seconds=inference_time
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
