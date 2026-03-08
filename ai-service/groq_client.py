"""
Groq AI Client - Uses Groq's fast LLM inference for video editing decisions
Analyzes video data and user prompts to generate intelligent editing instructions
"""

import os
import json
import httpx
from typing import List, Optional
from dataclasses import asdict

# Import our video processor types
from ai_video_processor import VideoAnalysis, VideoSegment


class GroqVideoEditor:
    """
    Uses Groq's LLM to make intelligent video editing decisions
    based on video analysis and user prompts.
    """
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GROQ_API_KEY")
        if not self.api_key:
            raise ValueError("GROQ_API_KEY environment variable is required")
        
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.model = "llama-3.3-70b-versatile"
    
    def _call_groq(self, messages: List[dict], temperature: float = 0.7) -> str:
        """Make a request to Groq's API"""
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": 4096
        }
        
        with httpx.Client(timeout=60.0) as client:
            response = client.post(self.base_url, headers=headers, json=payload)
            response.raise_for_status()
            
            data = response.json()
            return data["choices"][0]["message"]["content"]
    
    def analyze_for_highlights(
        self,
        analyses: List[VideoAnalysis],
        user_prompt: str,
        target_duration: float = 60.0
    ) -> dict:
        """
        Use AI to analyze video data and determine the best highlight segments
        based on the user's prompt and video analysis.
        
        Returns a dict with:
        - selected_segments: List of {video_index, start, end, reason}
        - editing_style: Recommended editing style
        - transitions: Recommended transition types
        """
        
        # Build video summary for the AI
        video_summaries = []
        for i, analysis in enumerate(analyses):
            # Get top segments by score
            top_segments = sorted(
                analysis.segments, 
                key=lambda s: s.combined_score, 
                reverse=True
            )[:10]
            
            segment_info = [
                {
                    "start": round(s.start_time, 2),
                    "end": round(s.end_time, 2),
                    "score": round(s.combined_score, 2),
                    "scene_activity": round(s.scene_score, 2),
                    "audio_activity": round(s.audio_score, 2)
                }
                for s in top_segments
            ]
            
            video_summaries.append({
                "video_index": i,
                "duration": round(analysis.duration, 2),
                "has_audio": analysis.has_audio,
                "scene_changes_count": len(analysis.scene_changes),
                "audio_peaks_count": len(analysis.audio_peaks),
                "top_segments": segment_info
            })
        
        system_prompt = """You are an expert video editor AI assistant. Your job is to analyze video data and select the best segments for creating highlight reels.

You will receive:
1. Analysis data for one or more videos (scene changes, audio peaks, segment scores)
2. A user's description of what kind of highlight video they want
3. A target duration for the final video

Your task is to select segments that:
- Match the user's creative intent
- Have high engagement scores (scene activity + audio activity)
- Flow well together when edited
- Fit within the target duration

Respond ONLY with valid JSON in this exact format:
{
    "selected_segments": [
        {
            "video_index": 0,
            "start": 0.0,
            "end": 5.0,
            "reason": "High action scene with peak audio"
        }
    ],
    "editing_style": "fast-paced/cinematic/documentary/etc",
    "transition_recommendation": "cut/crossfade/etc",
    "summary": "Brief description of the highlight reel"
}"""

        user_message = f"""User's request: "{user_prompt}"

Target duration: {target_duration} seconds

Video analysis data:
{json.dumps(video_summaries, indent=2)}

Select the best segments to create a highlight video that matches the user's request. Make sure total duration is close to {target_duration} seconds."""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
        
        response = self._call_groq(messages, temperature=0.5)
        
        # Parse the JSON response
        try:
            # Find JSON in the response (in case there's extra text)
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            if json_start != -1 and json_end > json_start:
                json_str = response[json_start:json_end]
                result = json.loads(json_str)
                return result
        except json.JSONDecodeError:
            pass
        
        # Fallback: return auto-selected segments
        return {
            "selected_segments": [],
            "editing_style": "auto",
            "transition_recommendation": "cut",
            "summary": "Auto-generated highlight reel",
            "ai_error": "Failed to parse AI response, using auto-selection"
        }
    
    def generate_editing_instructions(
        self,
        user_prompt: str,
        video_count: int,
        total_duration: float
    ) -> dict:
        """
        Generate high-level editing instructions based on user prompt.
        Used when detailed video analysis isn't available yet.
        """
        
        system_prompt = """You are an expert video editor. Generate editing instructions based on the user's request.

Respond ONLY with valid JSON:
{
    "style": "fast-paced/cinematic/documentary/vlog/etc",
    "pacing": "quick cuts/moderate/slow",
    "segment_duration_range": {"min": 2, "max": 5},
    "prioritize": "action/dialogue/music/visuals",
    "transition_type": "cut/crossfade/fade",
    "music_sync": true/false,
    "instructions": "Detailed editing instructions..."
}"""

        user_message = f"""User request: "{user_prompt}"
        
Number of input videos: {video_count}
Total source duration: {total_duration} seconds

Generate editing instructions for creating a highlight video."""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
        
        response = self._call_groq(messages, temperature=0.7)
        
        try:
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            if json_start != -1 and json_end > json_start:
                return json.loads(response[json_start:json_end])
        except json.JSONDecodeError:
            pass
        
        # Fallback defaults
        return {
            "style": "auto",
            "pacing": "moderate",
            "segment_duration_range": {"min": 2, "max": 5},
            "prioritize": "action",
            "transition_type": "cut",
            "music_sync": False,
            "instructions": "Create a highlight reel with the best moments"
        }
    
    def refine_segment_selection(
        self,
        current_segments: List[dict],
        user_feedback: str,
        video_analyses: List[VideoAnalysis]
    ) -> List[dict]:
        """
        Refine segment selection based on user feedback.
        Allows iterative editing where user can say things like
        "add more action scenes" or "remove the slow parts".
        """
        
        system_prompt = """You are a video editor assistant. The user wants to refine their highlight video.

Given:
1. Currently selected segments
2. User's feedback on what to change
3. Available video data

Modify the segment selection based on the feedback.

Respond ONLY with valid JSON:
{
    "selected_segments": [
        {"video_index": 0, "start": 0.0, "end": 5.0, "reason": "..."}
    ],
    "changes_made": "Description of what was changed"
}"""

        # Build available segments from analyses
        available_segments = []
        for i, analysis in enumerate(video_analyses):
            for seg in analysis.segments:
                available_segments.append({
                    "video_index": i,
                    "start": round(seg.start_time, 2),
                    "end": round(seg.end_time, 2),
                    "score": round(seg.combined_score, 2)
                })
        
        user_message = f"""Current segments: {json.dumps(current_segments)}

User feedback: "{user_feedback}"

Available segments: {json.dumps(available_segments[:50])}

Modify the selection based on the feedback."""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
        
        response = self._call_groq(messages, temperature=0.5)
        
        try:
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            if json_start != -1 and json_end > json_start:
                result = json.loads(response[json_start:json_end])
                return result.get("selected_segments", current_segments)
        except json.JSONDecodeError:
            pass
        
        return current_segments
