\# Requirements List — AI Highlight Video Generator (MVP)



Priority scale:

\- P0 = Must have for MVP

\- P1 = Should have if time permits

\- P2 = Nice to have / post-MVP



---



\## A) Functional Requirements



\### FR-1 Upload media (photos and videos)

\- Priority: P0  

\- Justification: Media upload is required to generate any highlight video.



\### FR-2 Limit uploads to a maximum of 10 files

\- Priority: P0  

\- Justification: Client specified a 10-media maximum to control processing and storage usage.



\### FR-3 Enforce maximum file size per upload

\- Priority: P0  

\- Justification: Prevents overwhelming storage and backend resources.



\### FR-4 Accept user text prompt

\- Priority: P0  

\- Justification: Prompt guides the AI editing process and improves output relevance.



\### FR-5 Generate highlight video (30–60 seconds)

\- Priority: P0  

\- Justification: Core MVP feature defined by the client.



\### FR-6 Export/download generated video

\- Priority: P0  

\- Justification: Users must be able to retrieve the final output.



\### FR-7 Output format support (MP4 required; MOV optional)

\- Priority: P0 (MP4), P1 (MOV)  

\- Justification: MP4 is widely supported; MOV may be added if feasible.



\### FR-8 Automatic scene detection

\- Priority: P0  

\- Justification: Scenes must be identified to create highlights



\### FR-9 Highlight selection using ML model

\- Priority: P0  

\- Justification: AI-based ranking determines which scenes become highlights



\### FR-10 Video assemply pipeline

\- Priority: P0  

\- Justification: Clips must be processed and combined into a final highlight video.



\### FR-11 Store input and output media

\- Priority: P0 

\- Justification: Uploaded files and generated videos must be persisted for retrieval.



---



\## B) Non-Functional Requirements



\### NFR-1 Security of uploaded media

\- Priority: P0  

\- Justification: Uploaded content may be sensitive and must be protected.



\### NFR-2 Reliability and error reporting

\- Priority: P0  

\- Justification: Failures must be communicated clearly to users.



\### NFR-3 Performance within reasonable MVP limits

\- Priority: P1  

\- Justification: Long processing times negatively impact usability. 2 minute maximum is what the goal is for processing.



\### NFR-4 Maintainable modular architecture

\- Priority: P0  

\- Justification: Supports team development and future expansion.



\### NFR-5 Lightweight, simple, and visually appealing web UI

\- Priority: P0  

\- Justification: Client experience depends on ease of use; UI must be clean and intuitive.



\### NFR-6 Responsive web UI

\- Priority: P1  

\- Justification: Improves usability across desktop and mobile devices.



---



\## C) Domain Requirements



\### DR-1 Output video length must be 30–60 seconds

\- Priority: P0  

\- Justification: Explicit client requirement.



\### DR-2 System is not conversational AI

\- Priority: P0  

\- Justification: Client specified no chatbot functionality.



\### DR-3 Mixed media input supported

\- Priority: P0  

\- Justification: Users can upload both photos and videos.



\### DR-4 Output is silent video (no audio for MVP)

\- Priority: P0  

\- Justification: Audio is not required and may be added later.



---



\## D) Explicitly Excluded from MVP



\### EX-1 Queue system

\- Priority: P2  

\- Justification: Client stated queueing is not required at this time.



\### EX-2 Moderation system

\- Priority: P2  

\- Justification: Client stated moderation is not needed for MVP.



---



\## E) Implementation Constraints



\### IC-1 React frontend

\- Priority: P0  

\- Justification: Client/team technology choice.



\### IC-2 FastAPI Python backend

\- Priority: P0  

\- Justification: Provides API endpoints for upload and processing.



\### IC-3 FFmpeg for video processing

\- Priority: P0  

\- Justification: Industry-standard for media handling.



\### IC-4 MoviePy video manipulation

\- Priority: P0  

\- Justification: Simplifies clip extraction and composition.



\### IC-5 MinIO object storage

\- Priority: P0  

\- Justification: Provides S3-compatible media storage.



\### IC-6 Python ML model for highlight selection

\- Priority: P0  

\- Justification: Determines which scenes are most relevant.



\### IC-6 Supabase for auth/metadata

\- Priority: P1

\- Justification: Simplifies MVP user management if required.




