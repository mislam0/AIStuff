\# Requirements Report (1–2 pages) — AI-Powered Highlight Video Generator (MVP)



\## 1. Project Overview

This project will develop an AI-powered Highlight Video Generator for nonprofits and community organizations. The MVP allows a user to upload media (photos and/or videos), provide a short description of how they want the final edit to look, and receive a polished highlight video between 30 and 60 seconds. The workflow is similar to “auto cut” tools (such as CapCut’s autocut feature), but the product is not a chatbot—there is no conversational interaction. The system takes user inputs (media + prompt) and produces a downloadable video.



\## 2. Goals and Scope (MVP)



\### Primary MVP goal

Create a working prototype for the “AI Cut Engine” pipeline:



Upload → Analysis → Simple Cut → Export (30–60 seconds)



\### In-scope for MVP

\- Upload up to \*\*10 media files\*\* (photos and/or videos)

\- Enforce a \*\*maximum file size per upload\*\* to avoid overwhelming storage

\- User provides a text prompt (minimal or detailed) describing desired edit style

\- Server-side processing selects and arranges clips into a 30–60 second highlight video

\- Export output in common formats (at minimum MP4; MOV optional)

\- Allow user to \*\*download/export\*\* the generated video

\- Store uploaded media and generated output in client-provided Amazon S3

\- Provide basic processing status (processing / completed / failed)

\- Lightweight, simple, and visually clean web UI for ease of use



\### Out-of-scope for MVP

\- Audio support (video will be silent for MVP)

\- Queue system for multiple concurrent requests

\- Moderation system

\- Advanced timeline editing UI

\- Direct social media publishing



These features may be considered in later phases.



\## 3. Users and Use Cases



\### Target users

Staff or volunteers at nonprofits and community organizations who need fast, simple highlight videos for promotion, fundraising, or event recaps.



\### Primary use case

1\. User uploads up to 10 media files

2\. User enters a short prompt describing the desired style

3\. System processes the media and generates a 30–60 second highlight video

4\. User downloads the final output



\## 4. Assumptions and Constraints

\- Client provides access to an Amazon S3 bucket for storage

\- Frontend will be built using Angular (TypeScript, HTML, CSS)

\- Backend services will use Node.js

\- FFmpeg will be used for video cutting and exporting

\- n8n will be used for workflow orchestration

\- Supabase may be used for authentication and metadata storage if user accounts are required

\- Audio is not required for MVP

\- No queue system or moderation is required for MVP

\- Upload limits will be enforced (maximum 10 media files and capped file size)



\## 5. Platform and Framework Selection

The team will use the following technologies:

\- Angular for frontend UI

\- Node.js with TypeScript for backend APIs

\- FFmpeg for video processing

\- Amazon S3 for storage (client-provided)

\- n8n for workflow automation

\- Supabase DB for authentication and metadata



This stack supports rapid MVP development while allowing team members to gain experience with modern web frameworks, cloud storage, asynchronous processing, and media pipelines.



\## 6. Functional Requirements Summary

\- Upload photos and videos (up to 10 files)

\- Accept user text prompt

\- Generate a 30–60 second silent highlight video

\- Export/download output video

\- Store inputs and outputs in S3

\- Display processing status



\## 7. Non-Functional Requirements Summary

\- Secure storage and access control for uploaded media

\- Reasonable processing time for MVP usage

\- Clear error handling and feedback

\- Lightweight, simple, and visually appealing web interface

\- Maintainable modular architecture



\## 8. Domain Requirements Summary

\- Output video length must be between 30 and 60 seconds

\- System operates as a one-shot generator (not conversational)

\- Inputs may include mixed media (photos and videos)

\- Output is a standard downloadable video file



\## 9. Risks and Open Questions

\- Exact file size limits still need to be finalized

\- Template design and styling expectations need confirmation



These items will be clarified with the client as development progresses.

