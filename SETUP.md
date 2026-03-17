============================================================
                AI VIDEO GENERATOR – SETUP GUIDE
============================================================

This project generates AI-powered highlight videos from
uploaded media using the following technologies:

   • Next.js        (Frontend)
   • FastAPI        (Backend)
   • FFmpeg         (Video Processing)
   • MinIO          (Object Storage)

Follow the steps below to run the project locally.

============================================================
PREREQUISITES
============================================================

Before starting, make sure the following are installed:

   • Node.js (v18 or newer recommended)
   • Python (3.10 or newer)
   • FFmpeg (installed and available in PATH)
   • Git

You can verify installations with:

   node -v
   python --version
   ffmpeg -version


============================================================
STEP 1 — CLONE THE REPOSITORY
============================================================

Open a terminal and run:

   git clone https://github.com/GGC-SD/AIvideoGenerator.git
   cd AIvideoGenerator


============================================================
STEP 2 — INSTALL NODE DEPENDENCIES
============================================================

From the project root folder run:

   npm install

Then install frontend dependencies:

   cd frontend
   npm install
   cd ..


============================================================
STEP 3 — INSTALL PYTHON DEPENDENCIES
============================================================

Navigate to the AI service folder:

   cd ai_service

Create a virtual environment (recommended):

   python -m venv venv


Activate the virtual environment

Windows:

   venv\Scripts\activate

Mac / Linux:

   source venv/bin/activate


Install Python requirements:

   pip install -r requirements.txt


Return to the root project folder:

   cd ..


============================================================
STEP 4 — INSTALL MINIO
============================================================

MinIO is used to store generated highlight videos.

Download MinIO here:

    https://dl.min.io/server/minio/release/windows-amd64/minio.exe


After downloading **minio.exe**, place it in this folder:

   AIvideoGenerator/storage/


Your project structure should look like this:

   AIvideoGenerator
   ├── frontend
   ├── ai_service
   │    ├── ai
   │    ├── storage
   │    ├── video
   │    └── server.py
   ├── storage
   │    ├── minio.exe
   │    └── minio-data
   ├── package.json
   └── SETUP.txt


============================================================
STEP 5 — START THE PROJECT
============================================================

From the project root run:

   npm run dev


This command automatically starts:

   ✔ MinIO Storage Server
   ✔ FastAPI Backend
   ✔ Next.js Frontend


============================================================
STEP 6 — ACCESS THE APPLICATION
============================================================

Frontend:

   http://localhost:3000


Backend API:

   http://localhost:8000


MinIO Dashboard:

   http://localhost:9001


Login credentials:

   Username:  minioadmin
   Password:  minioadmin


============================================================
HOW THE SYSTEM WORKS
============================================================

1. User uploads images or videos in the frontend
2. Files are sent to the FastAPI backend
3. FFmpeg processes the media
4. The AI model selects highlight segments
5. A final 60-second highlight video is generated
6. The video is uploaded to MinIO storage
7. The frontend displays the generated video preview


============================================================
RUNNING THE SYSTEM
============================================================

Whenever you want to start the project run:

   npm run dev

Then open:

   http://localhost:3000


============================================================
COMMON ISSUES
============================================================

MINIO NOT STARTING

Make sure this file exists:

   storage/minio.exe


------------------------------------------------------------

PYTHON DEPENDENCIES FAILING

Make sure the virtual environment is activated:

   venv\Scripts\activate

Then reinstall dependencies:

   pip install -r ai_service/requirements.txt


------------------------------------------------------------

FFMPEG ERRORS

Ensure FFmpeg is installed and available in PATH.

Test with:

   ffmpeg -version


============================================================
NOTES
============================================================

Large binaries such as `minio.exe` are not stored in the
Git repository because GitHub limits files to 100MB.

Each developer must download MinIO manually.
============================================================