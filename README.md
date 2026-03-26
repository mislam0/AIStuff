# AIvideoGenerator

## Description
This project is an AI-powered Highlight Video Generator designed to help nonprofits and community organizations quickly create short-form promotional videos. The MVP allows users to upload photos and videos, provide a short text prompt describing the desired style, and receive a polished 30–60 second highlight video.

The system works similarly to CapCut’s auto-cut feature. It is not a chatbot. Users simply upload media and provide a description, and the system generates a silent highlight video that can be downloaded in common formats such as MP4.

The primary MVP workflow is:

Upload → Analysis → Simple Cut → Export

---

## Links
(To be added later)
---
## Features (MVP)

- Upload up to 10 media files (images and videos)
- AI-based segment scoring and highlight selection
- Automatic 30–60 second video generation
- Image-to-video clip conversion
- Video normalization and concatenation
- Downloadable MP4 output
- Object storage using MinIO
- Processing progress tracking
- Video gallery (view, download, delete)
- Simple and clean web interface

---

## Tech Stack

### Frontend
- Next.js (React)
- TypeScript
- Tailwind CSS

### Backend
- FastAPI (Python)

### Video Processing
- FFmpeg

### AI / Processing
- Custom ML model (segment scoring)
- Feature extraction pipeline

### Storage
- MinIO (S3-compatible object storage)

---

## Architecture Overview (MVP)

```text
[Next.js Frontend]
        |
        | Upload media + prompt
        v
[FastAPI Backend]
        |
        | Store files
        v
[MinIO Storage]
        |
        | Process request
        v
[AI Processing Pipeline]
        |
        | - Feature extraction
        | - Segment scoring
        | - Clip selection
        v
[FFmpeg Processing]
        |
        | Assemble final video
        v
[MinIO Storage]
        |
        | Return video URL
        v
[Frontend Display + Download]
```

---

## Current Status

### Completed
- Upload interface
- FastAPI backend service
- Highlight generation pipeline
- FFmpeg processing integration
- MinIO storage integration
- Video preview and download UI
- Video gallery (list and delete)

### In Progress
- Scene detection improvements
- Highlight ranking accuracy
- Progress UI improvements

### Planned
- Background job queue for processing
- Improved AI scoring model
- Optional user authentication
- Metadata storage

---

## Non-Goals (MVP)

- Audio processing or music syncing
- Subtitles or overlays
- Advanced AI scene understanding
- Full user customization

---

## Installation (Development)

### Clone the repository

git clone <repo-url>
cd AIvideoGenerator
---
Start the WebAPP
* cd AIvideoGenerator
* npm start dev (Should start both backend and frontend)
---

## Local URLs

- Frontend: http://localhost:3000  
- Backend API: http://127.0.0.1:8000  
- API Docs: http://127.0.0.1:8000/docs  
- MinIO Console: http://127.0.0.1:9001  

---
# Team Name 

Hydro 

Spring 2026 

AI Highlight Video Generator


# Team roles 

Dino Maksumic, 20% Programmer, 20% Documentation Lead, 60% Testing Lead 

Mohammed Islam, 20% Programmer, 50% Lead Programmer, 30% Client Liaison 

David Jones, 40% Programmer, 60% UI designer 

Rahsun Mclaurin, 20% Programmer, 60% Data Modeler, 20% Project Manager

