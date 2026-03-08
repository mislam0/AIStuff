"""
AI Video Processor - FFmpeg-based video analysis and highlight extraction
Analyzes videos for scene changes, audio peaks, and motion to create auto-highlights
"""

import subprocess
import json
import os
import uuid
from dataclasses import dataclass
from typing import List, Optional
import re


@dataclass
class VideoSegment:
    """Represents a segment of video with its analysis scores"""
    start_time: float
    end_time: float
    scene_score: float = 0.0
    audio_score: float = 0.0
    motion_score: float = 0.0
    combined_score: float = 0.0
    
    @property
    def duration(self) -> float:
        return self.end_time - self.start_time


@dataclass
class VideoAnalysis:
    """Complete analysis of a video file"""
    filepath: str
    duration: float
    width: int
    height: int
    fps: float
    has_audio: bool
    segments: List[VideoSegment]
    scene_changes: List[float]
    audio_peaks: List[float]


class AIVideoProcessor:
    """
    Processes videos using FFmpeg and AI to extract highlights.
    Detects scene changes, audio peaks, and high-motion segments.
    """
    
    def __init__(self, output_folder: str = "outputs"):
        self.output_folder = output_folder
        os.makedirs(output_folder, exist_ok=True)
    
    def get_video_info(self, filepath: str) -> dict:
        """Get video metadata using ffprobe"""
        cmd = [
            "ffprobe",
            "-v", "quiet",
            "-print_format", "json",
            "-show_format",
            "-show_streams",
            filepath
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise Exception(f"ffprobe failed: {result.stderr}")
        
        return json.loads(result.stdout)
    
    def detect_scene_changes(self, filepath: str, threshold: float = 0.3) -> List[float]:
        """Detect scene changes using FFmpeg's scene detection filter"""
        cmd = [
            "ffmpeg",
            "-i", filepath,
            "-vf", f"select='gt(scene,{threshold})',showinfo",
            "-f", "null",
            "-"
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        # Parse scene change timestamps from stderr
        scene_times = []
        for line in result.stderr.split('\n'):
            if 'pts_time' in line:
                match = re.search(r'pts_time:(\d+\.?\d*)', line)
                if match:
                    scene_times.append(float(match.group(1)))
        
        return scene_times
    
    def detect_audio_peaks(self, filepath: str, threshold: float = -20) -> List[float]:
        """Detect audio peaks/loud moments using FFmpeg's volumedetect"""
        cmd = [
            "ffmpeg",
            "-i", filepath,
            "-af", f"silencedetect=noise={threshold}dB:d=0.5",
            "-f", "null",
            "-"
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        # Parse silence end times (which indicate audio peaks/speech)
        peak_times = []
        for line in result.stderr.split('\n'):
            if 'silence_end' in line:
                match = re.search(r'silence_end: (\d+\.?\d*)', line)
                if match:
                    peak_times.append(float(match.group(1)))
        
        return peak_times
    
    def analyze_video(self, filepath: str, segment_duration: float = 3.0) -> VideoAnalysis:
        """Perform complete analysis of a video file"""
        
        # Get video info
        info = self.get_video_info(filepath)
        
        # Extract metadata
        video_stream = next(
            (s for s in info.get('streams', []) if s['codec_type'] == 'video'),
            None
        )
        audio_stream = next(
            (s for s in info.get('streams', []) if s['codec_type'] == 'audio'),
            None
        )
        
        if not video_stream:
            raise Exception("No video stream found")
        
        duration = float(info['format']['duration'])
        width = int(video_stream['width'])
        height = int(video_stream['height'])
        
        # Parse FPS (handle fractional formats like "30000/1001")
        fps_str = video_stream.get('r_frame_rate', '30/1')
        if '/' in fps_str:
            num, den = map(int, fps_str.split('/'))
            fps = num / den if den != 0 else 30.0
        else:
            fps = float(fps_str)
        
        has_audio = audio_stream is not None
        
        # Detect scene changes and audio peaks
        scene_changes = self.detect_scene_changes(filepath)
        audio_peaks = self.detect_audio_peaks(filepath) if has_audio else []
        
        # Create segments and score them
        segments = []
        current_time = 0.0
        
        while current_time < duration:
            end_time = min(current_time + segment_duration, duration)
            
            # Calculate scores for this segment
            scene_score = self._calculate_scene_score(current_time, end_time, scene_changes)
            audio_score = self._calculate_audio_score(current_time, end_time, audio_peaks)
            
            # Combined score (weighted average)
            combined_score = (scene_score * 0.4) + (audio_score * 0.6)
            
            segment = VideoSegment(
                start_time=current_time,
                end_time=end_time,
                scene_score=scene_score,
                audio_score=audio_score,
                combined_score=combined_score
            )
            segments.append(segment)
            
            current_time = end_time
        
        return VideoAnalysis(
            filepath=filepath,
            duration=duration,
            width=width,
            height=height,
            fps=fps,
            has_audio=has_audio,
            segments=segments,
            scene_changes=scene_changes,
            audio_peaks=audio_peaks
        )
    
    def _calculate_scene_score(self, start: float, end: float, scene_changes: List[float]) -> float:
        """Calculate scene activity score for a time range"""
        count = sum(1 for t in scene_changes if start <= t < end)
        # Normalize: more scene changes = more interesting (up to a point)
        return min(count / 3.0, 1.0)
    
    def _calculate_audio_score(self, start: float, end: float, audio_peaks: List[float]) -> float:
        """Calculate audio activity score for a time range"""
        count = sum(1 for t in audio_peaks if start <= t < end)
        # Normalize: more audio activity = more interesting
        return min(count / 2.0, 1.0)
    
    def extract_segment(self, filepath: str, start: float, end: float, output_path: str) -> str:
        """Extract a segment from a video using FFmpeg"""
        cmd = [
            "ffmpeg",
            "-y",  # Overwrite output
            "-ss", str(start),
            "-i", filepath,
            "-t", str(end - start),
            "-c:v", "libx264",
            "-c:a", "aac",
            "-preset", "fast",
            "-crf", "23",
            output_path
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise Exception(f"FFmpeg extract failed: {result.stderr}")
        
        return output_path
    
    def concatenate_segments(self, segment_paths: List[str], output_path: str, 
                            crossfade_duration: float = 0.5) -> str:
        """Concatenate multiple video segments with optional crossfade"""
        
        if len(segment_paths) == 0:
            raise Exception("No segments to concatenate")
        
        if len(segment_paths) == 1:
            # Just copy the single segment
            subprocess.run(["cp", segment_paths[0], output_path], check=True)
            return output_path
        
        # Create a concat file
        concat_file = os.path.join(self.output_folder, f"concat_{uuid.uuid4()}.txt")
        with open(concat_file, 'w') as f:
            for path in segment_paths:
                f.write(f"file '{os.path.abspath(path)}'\n")
        
        # Concatenate using FFmpeg
        cmd = [
            "ffmpeg",
            "-y",
            "-f", "concat",
            "-safe", "0",
            "-i", concat_file,
            "-c:v", "libx264",
            "-c:a", "aac",
            "-preset", "fast",
            "-crf", "23",
            output_path
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        # Cleanup concat file
        os.remove(concat_file)
        
        if result.returncode != 0:
            raise Exception(f"FFmpeg concat failed: {result.stderr}")
        
        return output_path
    
    def create_highlight_from_segments(
        self,
        analyses: List[VideoAnalysis],
        selected_segments: List[dict],
        target_duration: float = 60.0
    ) -> str:
        """
        Create a highlight video from selected segments.
        
        Args:
            analyses: List of VideoAnalysis objects
            selected_segments: List of dicts with {video_index, start, end}
            target_duration: Target output duration in seconds
        
        Returns:
            Path to the output highlight video
        """
        
        # Extract each segment
        temp_segments = []
        
        for i, seg in enumerate(selected_segments):
            video_index = seg.get('video_index', 0)
            start = seg['start']
            end = seg['end']
            
            if video_index < len(analyses):
                analysis = analyses[video_index]
                temp_path = os.path.join(
                    self.output_folder, 
                    f"temp_seg_{uuid.uuid4()}.mp4"
                )
                
                self.extract_segment(analysis.filepath, start, end, temp_path)
                temp_segments.append(temp_path)
        
        if not temp_segments:
            raise Exception("No segments extracted")
        
        # Concatenate all segments
        output_name = f"highlight_{uuid.uuid4()}.mp4"
        output_path = os.path.join(self.output_folder, output_name)
        
        self.concatenate_segments(temp_segments, output_path)
        
        # Cleanup temp files
        for temp_path in temp_segments:
            if os.path.exists(temp_path):
                os.remove(temp_path)
        
        # Trim to target duration if needed
        final_info = self.get_video_info(output_path)
        final_duration = float(final_info['format']['duration'])
        
        if final_duration > target_duration:
            trimmed_path = os.path.join(self.output_folder, f"highlight_{uuid.uuid4()}.mp4")
            self.extract_segment(output_path, 0, target_duration, trimmed_path)
            os.remove(output_path)
            return trimmed_path
        
        return output_path
    
    def auto_select_highlights(
        self, 
        analyses: List[VideoAnalysis], 
        target_duration: float = 60.0,
        min_segment_duration: float = 2.0
    ) -> List[dict]:
        """
        Automatically select the best segments for a highlight reel.
        
        Returns list of {video_index, start, end, score} dicts
        """
        
        # Collect all segments with their video index
        all_segments = []
        for video_idx, analysis in enumerate(analyses):
            for segment in analysis.segments:
                if segment.duration >= min_segment_duration:
                    all_segments.append({
                        'video_index': video_idx,
                        'start': segment.start_time,
                        'end': segment.end_time,
                        'score': segment.combined_score,
                        'duration': segment.duration
                    })
        
        # Sort by score (highest first)
        all_segments.sort(key=lambda x: x['score'], reverse=True)
        
        # Select segments until we reach target duration
        selected = []
        total_duration = 0.0
        
        for seg in all_segments:
            if total_duration >= target_duration:
                break
            
            remaining = target_duration - total_duration
            
            if seg['duration'] <= remaining:
                selected.append(seg)
                total_duration += seg['duration']
            elif remaining >= min_segment_duration:
                # Truncate segment to fit
                seg['end'] = seg['start'] + remaining
                seg['duration'] = remaining
                selected.append(seg)
                total_duration += remaining
        
        # Sort selected by video index and start time for natural flow
        selected.sort(key=lambda x: (x['video_index'], x['start']))
        
        return selected
