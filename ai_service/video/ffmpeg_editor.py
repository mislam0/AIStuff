import ffmpeg
import os
from typing import List, Dict


class FFmpegEditor:
    """Handles all FFmpeg-based video editing operations."""

    @staticmethod
    def get_video_metadata(filepath: str) -> Dict:
        try:
            probe = ffmpeg.probe(filepath)

            video_stream = next(
                (s for s in probe["streams"] if s["codec_type"] == "video"), None
            )

            audio_stream = next(
                (s for s in probe["streams"] if s["codec_type"] == "audio"), None
            )

            return {
                "duration": float(probe["format"].get("duration", 0)),
                "width": int(video_stream["width"]) if video_stream else 0,
                "height": int(video_stream["height"]) if video_stream else 0,
                "fps": (
                    lambda parts: int(parts[0]) / int(parts[1])
                    if len(parts) == 2 and int(parts[1]) != 0
                    else 24
                )(video_stream.get("r_frame_rate", "24/1").split("/"))
                if video_stream
                else 24,
                "has_audio": audio_stream is not None,
                "codec": video_stream.get("codec_name", "") if video_stream else "",
                "bitrate": int(probe["format"].get("bit_rate", 0)),
            }

        except Exception as e:
            print(f"Error probing {filepath}: {e}")
            return {}

    @staticmethod
    def extract_frames(filepath: str, output_dir: str, fps: int = 1) -> List[str]:

        os.makedirs(output_dir, exist_ok=True)

        pattern = os.path.join(output_dir, "frame_%04d.jpg")

        (
            ffmpeg
            .input(filepath)
            .filter("fps", fps=fps)
            .output(pattern, qscale=2)
            .overwrite_output()
            .run(quiet=True)
        )

        frames = sorted(
            [
                os.path.join(output_dir, f)
                for f in os.listdir(output_dir)
                if f.endswith(".jpg")
            ]
        )

        return frames

    @staticmethod
    def trim_clip(input_path: str, output_path: str, start: float, end: float):

        print(f"Trimming clip {input_path} ({start}s -> {end}s)")

        (
            ffmpeg
            .input(input_path, ss=start, to=end)
            .output(
                output_path,
                vcodec="libx264",
                acodec="aac",
                preset="fast"
            )
            .overwrite_output()
            .run(quiet=True)
        )

    @staticmethod
    def concatenate_clips(clip_paths: List[str], output_path: str):

        print("Concatenating clips...")

        list_file = output_path + ".txt"

        with open(list_file, "w") as f:
            for clip in clip_paths:
                f.write(f"file '{os.path.abspath(clip)}'\n")

        (
            ffmpeg
            .input(list_file, format="concat", safe=0)
            .output(
                output_path,
                vcodec="libx264",
                acodec="aac",
                preset="fast"
            )
            .overwrite_output()
            .run(quiet=True)
        )

        os.remove(list_file)

        print(f"Concatenated video created: {output_path}")

    @staticmethod
    def apply_filter(input_path: str, output_path: str, filter_name: str, **kwargs):

        stream = ffmpeg.input(input_path)

        filter_map = {
            "brightness": lambda s: s.filter("eq", brightness=kwargs.get("value", 0.1)),
            "contrast": lambda s: s.filter("eq", contrast=kwargs.get("value", 1.2)),
            "saturation": lambda s: s.filter("eq", saturation=kwargs.get("value", 1.3)),
            "blur": lambda s: s.filter("boxblur", luma_radius=kwargs.get("value", 2)),
            "sharpen": lambda s: s.filter("unsharp"),
            "speed": lambda s: s.filter("setpts", f"{1/kwargs.get('value', 1.5)}*PTS"),
            "fade_in": lambda s: s.filter("fade", type="in", duration=kwargs.get("value", 1)),
            "fade_out": lambda s: s.filter("fade", type="out", duration=kwargs.get("value", 1)),
            "grayscale": lambda s: s.filter("hue", s=0),
            "sepia": lambda s: s.filter(
                "colorchannelmixer",
                rr=0.393, rg=0.769, rb=0.189,
                gr=0.349, gg=0.686, gb=0.168,
                br=0.272, bg=0.534, bb=0.131
            ),
        }

        if filter_name in filter_map:
            stream = filter_map[filter_name](stream)

        stream.output(
            output_path,
            vcodec="libx264",
            preset="fast"
        ).overwrite_output().run(quiet=True)

    @staticmethod
    def create_image_clip(image_path: str, output_path: str, duration: float = 3, fps: int = 24):

        print(f"Creating clip from image: {image_path}")

        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found: {image_path}")

        (
            ffmpeg
            .input(image_path, loop=1, t=duration)

            # Ensure dimensions are even for H264
            .filter("scale", "trunc(iw/2)*2", "trunc(ih/2)*2")

            .output(
                output_path,
                vcodec="libx264",
                pix_fmt="yuv420p",
                r=fps
            )
            .overwrite_output()
            .run(quiet=True)
        )

        print(f"Created clip: {output_path}")

    @staticmethod
    def normalize_clip(
        input_path: str,
        output_path: str,
        width: int = 1920,
        height: int = 1080,
        fps: int = 24
    ):

        print(f"Normalizing clip: {input_path}")

        (
            ffmpeg
            .input(input_path)
            .filter("scale", width, height, force_original_aspect_ratio="decrease")
            .filter("pad", width, height, "(ow-iw)/2", "(oh-ih)/2")
            .filter("fps", fps=fps)
            .output(
                output_path,
                vcodec="libx264",
                pix_fmt="yuv420p",
                preset="fast"
            )
            .overwrite_output()
            .run(quiet=True)
        )

        print(f"Normalized clip saved: {output_path}")