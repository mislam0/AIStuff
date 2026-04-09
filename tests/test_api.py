from fastapi.testclient import TestClient
from ai_service.server import app
from unittest.mock import patch
from io import BytesIO

client = TestClient(app)


# ==================================================
# BASIC ENDPOINT TESTS
# ==================================================

def test_root():
    response = client.get("/")
    assert response.status_code in [200, 404]


def test_progress_endpoint():
    response = client.get("/progress")
    assert response.status_code == 200
    assert "progress" in response.json()


# ==================================================
# VIDEO STORAGE (MOCKED MINIO)
# ==================================================

def test_videos_returns_list():
    with patch("ai_service.server.list_videos") as mock_list:
        mock_list.return_value = []

        response = client.get("/videos")

        assert response.status_code == 200
        assert isinstance(response.json(), list)


def test_delete_video_success():
    with patch("ai_service.server.delete_video") as mock_delete:
        mock_delete.return_value = {"message": "Video deleted"}

        response = client.delete("/video", params={"object_name": "test.mp4"})

        assert response.status_code == 200
        assert response.json()["message"] == "Video deleted"


def test_delete_video_failure():
    with patch("ai_service.server.delete_video") as mock_delete:
        mock_delete.return_value = {"error": "Delete failed"}

        response = client.delete("/video", params={"object_name": "bad.mp4"})

        assert response.status_code == 200
        assert "error" in response.json()


# ==================================================
# METADATA ENDPOINT
# ==================================================

def test_metadata_invalid_path():
    response = client.get("/metadata", params={"filepath": "/etc/passwd"})
    assert response.status_code == 400
    assert "filepath must be within" in response.json()["detail"]


def test_metadata_valid_path():
    with patch("ai_service.server.FFmpegEditor.get_video_metadata") as mock_meta:
        mock_meta.return_value = {"duration": 10, "width": 1920}

        response = client.get("/metadata", params={"filepath": "outputs/test.mp4"})

        assert response.status_code == 200
        assert response.json()["duration"] == 10


# ==================================================
# EDIT ENDPOINT
# ==================================================

def test_edit_video_no_filter():
    fake_file = BytesIO(b"fake video")

    with patch("ai_service.server.FFmpegEditor.apply_filter") as mock_filter:
        response = client.post(
            "/edit",
            files={"file": ("test.mp4", fake_file, "video/mp4")},
            data={"prompt": "random"}
        )

        assert response.status_code == 200
        assert "output" in response.json()
        mock_filter.assert_not_called()


def test_edit_video_with_filter():
    fake_file = BytesIO(b"fake video")

    with patch("ai_service.server.FFmpegEditor.apply_filter") as mock_filter:
        response = client.post(
            "/edit",
            files={"file": ("test.mp4", fake_file, "video/mp4")},
            data={"prompt": "brightness"}
        )

        assert response.status_code == 200
        assert response.json()["filter"] == "brightness"
        mock_filter.assert_called_once()


# ==================================================
# FEATURE EXTRACTION
# ==================================================

def test_feature_extraction_output_shape():
    from ai_service.ai.feature_extraction import extract_features_from_clip

    result = extract_features_from_clip("fake.mp4", 0, 3)

    assert isinstance(result, list)
    assert len(result) == 4
    for value in result:
        assert isinstance(value, (int, float))


# ==================================================
# CREATE HIGHLIGHT — CORE PIPELINE
# ==================================================

def mock_pipeline():
    return patch("ai_service.server.FFmpegEditor.get_video_metadata"), \
           patch("ai_service.server.extract_features_from_clip"), \
           patch("ai_service.server.FFmpegEditor.trim_clip"), \
           patch("ai_service.server.FFmpegEditor.concatenate_clips"), \
           patch("ai_service.server.FFmpegEditor.normalize_clip"), \
           patch("ai_service.server.upload_file")


def test_create_highlight_no_files():
    response = client.post("/create-highlight", data={"prompt": "test"})
    assert response.status_code in [400, 422]


def test_create_highlight_calls_ffmpeg():
    fake_file = BytesIO(b"video")

    with patch("ai_service.server.FFmpegEditor.get_video_metadata") as meta, \
         patch("ai_service.server.extract_features_from_clip") as features, \
         patch("ai_service.server.FFmpegEditor.trim_clip") as trim, \
         patch("ai_service.server.FFmpegEditor.concatenate_clips") as concat, \
         patch("ai_service.server.FFmpegEditor.normalize_clip") as norm, \
         patch("ai_service.server.upload_file") as upload:

        meta.return_value = {"duration": 6}
        features.return_value = [0.5]*4
        upload.return_value = "http://fake-url"

        response = client.post(
            "/create-highlight",
            files={"files": ("a.mp4", fake_file, "video/mp4")},
            data={"prompt": "test"}
        )

        assert response.status_code == 200
        assert trim.called and concat.called and norm.called


def test_segments_are_limited():
    fake_file = BytesIO(b"video")

    with patch("ai_service.server.FFmpegEditor.get_video_metadata") as meta, \
         patch("ai_service.server.extract_features_from_clip") as features, \
         patch("ai_service.server.FFmpegEditor.trim_clip") as trim, \
         patch("ai_service.server.FFmpegEditor.concatenate_clips"), \
         patch("ai_service.server.FFmpegEditor.normalize_clip"), \
         patch("ai_service.server.upload_file") as upload:

        meta.return_value = {"duration": 120}
        features.return_value = [0.5]*4
        upload.return_value = "http://fake-url"

        client.post("/create-highlight",
            files={"files": ("a.mp4", fake_file, "video/mp4")},
            data={"prompt": "test"}
        )

        assert trim.call_count <= 20


# ==================================================
# CREATE HIGHLIGHT — EDGE CASES
# ==================================================

def test_no_valid_media():
    fake_file = BytesIO(b"video")

    with patch("ai_service.server.FFmpegEditor.get_video_metadata") as meta, \
         patch("ai_service.server.extract_features_from_clip") as features:

        meta.return_value = {"duration": 0}
        features.return_value = []

        response = client.post(
            "/create-highlight",
            files={"files": ("a.mp4", fake_file, "video/mp4")},
            data={"prompt": "test"}
        )

        assert "error" in response.json()


def test_create_highlight_image_input():
    fake_file = BytesIO(b"image")

    with patch("ai_service.server.FFmpegEditor.create_image_clip") as img, \
         patch("ai_service.server.FFmpegEditor.normalize_clip"), \
         patch("ai_service.server.FFmpegEditor.concatenate_clips"), \
         patch("ai_service.server.FFmpegEditor.trim_clip"), \
         patch("ai_service.server.upload_file"):

        response = client.post(
            "/create-highlight",
            files={"files": ("a.jpg", fake_file, "image/jpeg")},
            data={"prompt": "test"}
        )

        assert response.status_code == 200
        assert img.called


def test_create_highlight_multiple_files():
    f1, f2 = BytesIO(b"a"), BytesIO(b"b")

    with patch("ai_service.server.FFmpegEditor.get_video_metadata") as meta, \
         patch("ai_service.server.extract_features_from_clip") as features, \
         patch("ai_service.server.FFmpegEditor.trim_clip"), \
         patch("ai_service.server.FFmpegEditor.concatenate_clips"), \
         patch("ai_service.server.FFmpegEditor.normalize_clip"), \
         patch("ai_service.server.upload_file"):

        meta.return_value = {"duration": 6}
        features.return_value = [0.5]*4

        response = client.post(
            "/create-highlight",
            files=[
                ("files", ("a.mp4", f1, "video/mp4")),
                ("files", ("b.mp4", f2, "video/mp4"))
            ],
            data={"prompt": "test"}
        )

        assert response.status_code == 200