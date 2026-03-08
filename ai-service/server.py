"""
AI Highlight Video Generator - FastAPI Server
Uses FFmpeg + Groq AI for intelligent video editing and highlight extraction
"""

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, UploadFile, Form, File, HTTPException, BackgroundTasks
from typing import List, Optional
import shutil
import os
import uuid
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import our AI modules
from ai_video_processor import AIVideoProcessor, VideoAnalysis
from groq_client import GroqVideoEditor

app = FastAPI(title="AI Highlight Video Generator")

# GLOBAL PROGRESS AND STATE
progress_status = {
    "progress": 0,
    "stage": "idle",
    "message": ""
}

# Store analyses for session
video_analyses_cache = {}

# Initialize processors
video_processor = AIVideoProcessor(output_folder="outputs")

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


def update_progress(progress: int, stage: str, message: str = ""):
    """Update global progress status"""
    progress_status["progress"] = progress
    progress_status["stage"] = stage
    progress_status["message"] = message


@app.post("/create-highlight")
async def create_highlight(
    files: List[UploadFile] = File(...),
    prompt: str = Form(""),
    target_duration: float = Form(60.0)
):
    """
    Main endpoint for creating AI-powered highlight videos.
    
    1. Uploads and saves media files
    2. Analyzes videos using FFmpeg (scene detection, audio peaks)
    3. Uses Groq AI to select best segments based on user prompt
    4. Creates highlight video with selected segments
    """
    
    print(f"FILES RECEIVED: {len(files)}")
    print(f"PROMPT: {prompt}")
    print(f"TARGET DURATION: {target_duration}s")
    
    update_progress(0, "uploading", "Receiving files...")
    
    session_id = str(uuid.uuid4())
    uploaded_files = []
    
    try:
        # Step 1: Save uploaded files
        for i, file in enumerate(files):
            unique_name = f"{session_id}_{i}_{file.filename}"
            input_path = os.path.join(UPLOAD_FOLDER, unique_name)
            
            with open(input_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            uploaded_files.append({
                "path": input_path,
                "filename": file.filename,
                "is_image": file.filename.lower().endswith((".png", ".jpg", ".jpeg", ".webp", ".gif"))
            })
            
            progress = int(((i + 1) / len(files)) * 20)
            update_progress(progress, "uploading", f"Uploaded {i + 1}/{len(files)} files")
        
        # Step 2: Analyze videos
        update_progress(20, "analyzing", "Analyzing videos with FFmpeg...")
        
        analyses = []
        video_files = [f for f in uploaded_files if not f["is_image"]]
        
        for i, file_info in enumerate(video_files):
            try:
                analysis = video_processor.analyze_video(file_info["path"])
                analyses.append(analysis)
                
                progress = 20 + int(((i + 1) / len(video_files)) * 30)
                update_progress(progress, "analyzing", f"Analyzed {i + 1}/{len(video_files)} videos")
                
            except Exception as e:
                print(f"Error analyzing {file_info['filename']}: {e}")
                continue
        
        if not analyses:
            raise HTTPException(status_code=400, detail="No valid videos to process")
        
        # Cache analyses for potential refinement
        video_analyses_cache[session_id] = analyses
        
        # Step 3: Use AI to select segments
        update_progress(50, "ai_processing", "AI is selecting best moments...")
        
        groq_api_key = os.getenv("GROQ_API_KEY")
        
        if groq_api_key:
            try:
                groq_editor = GroqVideoEditor(api_key=groq_api_key)
                
                ai_result = groq_editor.analyze_for_highlights(
                    analyses=analyses,
                    user_prompt=prompt or "Create an engaging highlight reel with the best moments",
                    target_duration=target_duration
                )
                
                selected_segments = ai_result.get("selected_segments", [])
                editing_style = ai_result.get("editing_style", "auto")
                summary = ai_result.get("summary", "AI-generated highlights")
                
                print(f"AI selected {len(selected_segments)} segments")
                print(f"Style: {editing_style}")
                print(f"Summary: {summary}")
                
            except Exception as e:
                print(f"Groq AI error: {e}, falling back to auto-selection")
                selected_segments = video_processor.auto_select_highlights(
                    analyses, 
                    target_duration=target_duration
                )
                summary = "Auto-selected highlights (AI unavailable)"
        else:
            # No API key - use automatic selection
            print("No GROQ_API_KEY found, using auto-selection")
            selected_segments = video_processor.auto_select_highlights(
                analyses, 
                target_duration=target_duration
            )
            summary = "Auto-selected highlights based on scene and audio analysis"
        
        if not selected_segments:
            # Fallback to selecting top segments from each video
            selected_segments = video_processor.auto_select_highlights(
                analyses, 
                target_duration=target_duration
            )
        
        update_progress(70, "editing", "Creating highlight video...")
        
        # Step 4: Create the highlight video
        output_path = video_processor.create_highlight_from_segments(
            analyses=analyses,
            selected_segments=selected_segments,
            target_duration=target_duration
        )
        
        update_progress(100, "complete", "Highlight video created!")
        
        output_filename = os.path.basename(output_path)
        
        return {
            "success": True,
            "message": "Highlight created successfully",
            "prompt": prompt,
            "output": f"outputs/{output_filename}",
            "summary": summary,
            "segments_used": len(selected_segments),
            "session_id": session_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        update_progress(0, "error", str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze-videos")
async def analyze_videos(
    files: List[UploadFile] = File(...)
):
    """
    Analyze videos without creating a highlight.
    Returns detailed analysis data for preview/adjustment.
    """
    
    session_id = str(uuid.uuid4())
    uploaded_files = []
    
    # Save files
    for i, file in enumerate(files):
        unique_name = f"{session_id}_{i}_{file.filename}"
        input_path = os.path.join(UPLOAD_FOLDER, unique_name)
        
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        if not file.filename.lower().endswith((".png", ".jpg", ".jpeg", ".webp", ".gif")):
            uploaded_files.append(input_path)
    
    # Analyze
    analyses = []
    for filepath in uploaded_files:
        try:
            analysis = video_processor.analyze_video(filepath)
            analyses.append({
                "filepath": filepath,
                "duration": analysis.duration,
                "has_audio": analysis.has_audio,
                "scene_changes": len(analysis.scene_changes),
                "audio_peaks": len(analysis.audio_peaks),
                "segments": [
                    {
                        "start": s.start_time,
                        "end": s.end_time,
                        "score": s.combined_score
                    }
                    for s in analysis.segments
                ]
            })
        except Exception as e:
            print(f"Error analyzing: {e}")
    
    # Cache for later use
    video_analyses_cache[session_id] = analyses
    
    return {
        "session_id": session_id,
        "analyses": analyses
    }


@app.post("/refine-highlight")
async def refine_highlight(
    session_id: str = Form(...),
    feedback: str = Form(...),
    current_segments: str = Form("[]")
):
    """
    Refine an existing highlight based on user feedback.
    Uses AI to adjust segment selection.
    """
    
    if session_id not in video_analyses_cache:
        raise HTTPException(status_code=404, detail="Session not found. Please re-upload videos.")
    
    analyses = video_analyses_cache[session_id]
    
    import json
    try:
        segments = json.loads(current_segments)
    except:
        segments = []
    
    groq_api_key = os.getenv("GROQ_API_KEY")
    
    if groq_api_key:
        groq_editor = GroqVideoEditor(api_key=groq_api_key)
        refined_segments = groq_editor.refine_segment_selection(
            current_segments=segments,
            user_feedback=feedback,
            video_analyses=analyses
        )
    else:
        # Without AI, just return current segments
        refined_segments = segments
    
    return {
        "refined_segments": refined_segments,
        "message": f"Refined based on: {feedback}"
    }


@app.get("/progress")
def get_progress():
    """Get current processing progress"""
    return progress_status


@app.get("/health")
def health_check():
    """Health check endpoint"""
    groq_configured = bool(os.getenv("GROQ_API_KEY"))
    
    return {
        "status": "healthy",
        "groq_configured": groq_configured,
        "ffmpeg_available": shutil.which("ffmpeg") is not None
    }
