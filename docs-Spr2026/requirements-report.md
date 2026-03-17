# Requirements Report (1–2 pages) — AI-Powered Highlight Video Generator (MVP)

## 1. Project Overview

This project develops an AI-powered Highlight Video Generator for nonprofits and community organizations. The system allows users to upload event media (photos and/or videos), optionally provide a short description of the desired editing style, and receive a polished highlight video between **30 and 60 seconds** in length.

The system functions similarly to automated editing tools such as CapCut’s AutoCut feature, but it is **not a conversational AI system**. Users provide media and an optional prompt, and the system processes the content to produce a downloadable highlight video.

The application focuses on providing a **simple and automated editing workflow** so organizations with little technical experience can quickly generate promotional videos from event media.

---

## 2. Goals and Scope (MVP)

### Primary MVP Goal

Develop a working prototype of the **automated highlight generation pipeline**:

Upload → Scene Detection → Highlight Selection → Video Assembly → Export

### In-Scope for MVP

* Upload up to **10 media files** (photos and/or videos)
* Enforce **maximum file size limits** per upload
* Accept an optional **text prompt** describing the desired style
* Automatically detect scenes within uploaded videos
* Select highlight segments using a simple AI/ML model
* Generate a **30–60 second highlight video**
* Export output as **MP4 format**
* Allow users to **download the generated video**
* Store uploaded media and generated output in **MinIO object storage**
* Display **processing status** (processing / completed / failed)
* Provide a **clean and lightweight web interface**

### Out-of-Scope for MVP

The following features are excluded from the initial prototype:

* Audio processing or music synchronization
* Queue systems for large numbers of simultaneous jobs
* Content moderation systems
* Advanced timeline editing controls
* Direct social media publishing
* Caption or subtitle generation

These features may be explored in future iterations.

---

## 3. Users and Use Cases

### Target Users

The primary users are **staff and volunteers at nonprofits and community organizations** who need a fast and simple way to produce highlight videos for promotion, fundraising, or event recaps.

### Primary Use Case

1. User uploads up to 10 photos and/or videos
2. User optionally enters a short prompt describing the desired style
3. System analyzes the media and selects highlight scenes
4. System generates a 30–60 second highlight video
5. User downloads the final video output

---

## 4. Assumptions and Constraints

* Media files will be stored in **MinIO S3-compatible object storage**
* Frontend will be built using **Next.js / React**
* Backend services will be implemented using **FastAPI (Python)**
* **FFmpeg and MoviePy** will be used for video cutting and assembly
* **PySceneDetect** will detect scene boundaries in uploaded videos
* A **Python machine learning model** will assist with highlight selection
* Output video will be **silent for the MVP**
* Upload limits will be enforced (maximum 10 media files)
* File size limits will be enforced to control resource usage

---

## 5. Platform and Framework Selection

The system will use the following technology stack:

Frontend:

* Next.js (React)
* TypeScript
* HTML / CSS

Backend:

* FastAPI (Python)

Video Processing:

* FFmpeg
* MoviePy

AI / Scene Analysis:

* PySceneDetect
* Python highlight selection model

Storage:

* MinIO (S3-compatible object storage)

This architecture supports rapid MVP development while enabling the team to gain experience with modern web frameworks, AI processing pipelines, and media processing systems.

---

## 6. Functional Requirements Summary

* Upload photos and videos (up to 10 files)
* Accept optional user prompt
* Detect scenes in uploaded videos
* Select highlight segments automatically
* Generate a **30–60 second silent highlight video**
* Export/download output video
* Store input and output media
* Display processing status to the user

---

## 7. Non-Functional Requirements Summary

* Secure storage and handling of uploaded media
* Reliable processing pipeline with clear error reporting
* Processing times should remain reasonable for MVP use (target under ~2 minutes)
* Lightweight and visually simple web interface
* Maintainable and modular architecture

---

## 8. Domain Requirements Summary

* Output video length must be **30–60 seconds**
* The system is a **one-shot generation tool**, not conversational AI
* Inputs may include **mixed media** (photos and videos)
* Output is a **standard downloadable video file (MP4)**

---

## 9. Risks and Open Questions

* Optimal scene detection thresholds may require tuning
* Highlight ranking model may require additional training data
* File size limits may need adjustment based on performance testing
* Future versions may introduce audio processing or caption generation

These issues will be evaluated and refined as development continues.


