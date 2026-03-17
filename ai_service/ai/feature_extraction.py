import cv2
import numpy as np


def extract_features_from_clip(video_path, start, end):
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    start_frame = int(start * fps)
    end_frame = int(end * fps)
    total_frames = end_frame - start_frame

    # Sample at most 3 frames per segment instead of every frame
    sample_count = min(3, max(2, total_frames))
    sample_indices = np.linspace(start_frame, end_frame - 1, sample_count, dtype=int)

    frames = []
    brightnesses = []

    for idx in sample_indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ret, frame = cap.read()
        if not ret:
            continue
        # Resize to small resolution for faster processing
        small = cv2.resize(frame, (160, 90))
        frames.append(small)
        brightnesses.append(np.mean(cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)))

    cap.release()

    if len(frames) < 2:
        return [0.0, 0.0, 0.0, 0.0]

    diffs = []
    for i in range(1, len(frames)):
        diff = cv2.absdiff(frames[i], frames[i - 1])
        diffs.append(np.mean(diff))
    motion = np.mean(diffs) / 255.0
    brightness = np.mean(brightnesses) / 255.0
    sharpness = np.mean([cv2.Laplacian(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY), cv2.CV_64F).var() for f in frames])
    sharpness = min(sharpness / 500.0, 1.0)
    contrast = np.mean([np.std(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY)) for f in frames])
    contrast = min(contrast / 128.0, 1.0)
    return [motion, brightness, sharpness, contrast]