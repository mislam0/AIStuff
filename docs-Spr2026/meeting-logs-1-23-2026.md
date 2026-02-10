# Client Meeting Log — AI Highlight Video Generator (MVP)

## Meeting details
- Date: 1/23/2026
- Time: 5 - 6 pm
- Location: Online, via Microsoft Teams
- Attendees
  - Client: Britney Hull
  - Team: Mohammed Islam, David Jones, Rahsun McLaurin, Dino Maksumic

## Meeting purpose
Clarify MVP scope and requirements for an AI powered highlight video generator that produces a 30–60 second video from user-uploaded media and a text prompt describing desired style.

## Key notes from client
- Product concept is similar to CapCut “auto cut” style workflow:
  - User uploads media (photos and or videos)
  - User provides a short description prompt (minimal or detailed)
  - System generates a polished highlight video (MVP output 30–60 seconds)
- This is not an AI chatbot:
  - No back-and-forth conversation
  - Input is media + text prompt; output is a generated video
- Output formats should support common video formats such as MP4 and MOV
- Proposed expected technologies:
  - Frontend Angular
  - Workflow automation using n8n
  - Storage Amazon S3 (client-provided)
  - Backend processing Node.js + FFmpeg
  - DB Supabase
  - Lightweight Web UI

## Decisions  agreements
- MVP goal upload -> analyze -> simple cut -> export 30–60s highlight video
- Prompt length flexibility minimal prompt works; more detail may improve results
