from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, UploadFile, Form, File
from moviepy import VideoFileClip, ImageClip, concatenate_videoclips
from typing import List
import shutil
import os
import joblib
import numpy as np
import uuid

app = FastAPI()

# GLOBAL PROGRESS
progress_status = {"progress": 0}

# Serve output videos
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

# CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

model = joblib.load("highlight_model.pkl")


def extract_features():
    return [[np.random.rand(), np.random.rand(), np.random.rand()]]


@app.post("/create-highlight")
async def create_highlight(
    files: List[UploadFile] = File(...),
    prompt: str = Form("")
):

    print("FILES RECEIVED:", len(files))
    print("PROMPT:", prompt)

    progress_status["progress"] = 0

    clips = []

    for file in files:

        unique_name = str(uuid.uuid4()) + "_" + file.filename
        input_path = os.path.join(UPLOAD_FOLDER, unique_name)

        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        filename = file.filename.lower()

        # IMAGE
        if filename.endswith((".png", ".jpg", ".jpeg", ".webp")):

            img_clip = ImageClip(input_path).with_duration(3).with_fps(24)
            clips.append(img_clip)

        # VIDEO
        else:

            video = VideoFileClip(input_path)

            duration = int(video.duration)
            segment_length = 3

            for t in range(0, duration, segment_length):

                start = t
                end = min(t + segment_length, duration)

                sub = video.subclipped(start, end)

                score = model.predict_proba(extract_features())[0][1]

                clips.append((score, sub))

    scored_segments = [c for c in clips if isinstance(c, tuple)]
    image_segments = [c for c in clips if not isinstance(c, tuple)]

    scored_segments.sort(reverse=True, key=lambda x: x[0])

    selected = [seg for _, seg in scored_segments]
    selected.extend(image_segments)

    if not selected:
        return {"error": "No valid media"}

    final = concatenate_videoclips(selected, method="compose")

    if final.duration < 60:
        loops = int(60 // final.duration) + 1
        final = concatenate_videoclips([final] * loops)

    final = final.subclipped(0, 60)

    output_name = f"highlight_{uuid.uuid4()}.mp4"
    output_path = os.path.join(OUTPUT_FOLDER, output_name)

    def progress_callback(current_frame, total_frames):
        percent = int((current_frame / total_frames) * 100)
        progress_status["progress"] = percent

    final.write_videofile(
    output_path,
    codec="libx264",
    audio=False,
    fps=20,
    threads=4,
    preset="ultrafast"
    )

    progress_status["progress"] = 100

    return {
        "message": "Highlight created",
        "prompt": prompt,
        "output": f"outputs/{output_name}"
    }


@app.get("/progress")
def get_progress():
    return progress_status