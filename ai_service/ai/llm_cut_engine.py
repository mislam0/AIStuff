import os
import json
from typing import List, Dict, Optional

# ---------- optional import (graceful degradation) ----------
try:
    from openai import OpenAI
    _HAS_OPENAI = True
except ImportError:
    _HAS_OPENAI = False

# ---------- defaults ----------
DEFAULT_WEIGHTS = {
    "motion": 0.30,
    "brightness": 0.25,
    "sharpness": 0.25,
    "contrast": 0.20,
}

FEATURE_NAMES = ["motion", "brightness", "sharpness", "contrast"]

# ---------- helper: weighted fallback ----------
def _fallback_score(features: List[float], weights: Dict[str, float] = None) -> float:
    """Pure math fallback — no LLM needed."""
    w = weights or DEFAULT_WEIGHTS
    return sum(f * w[k] for f, k in zip(features, FEATURE_NAMES))

def _build_system_prompt() -> str:
    return (
        "You are a video highlight scoring assistant. "
        "Given a user's creative brief and a list of video segment features "
        "(motion, brightness, sharpness, contrast — each 0-1), "
        "return a JSON object with:\n"
        '  "weights": {"motion": float, "brightness": float, "sharpness": float, "contrast": float}\n'
        '  "min_thresholds": {"motion": float, "brightness": float, "sharpness": float, "contrast": float}\n'
        "\n"
        "The weights should sum to 1.0 and reflect what the user cares about.\n"
        "min_thresholds (0-1) let you hard-filter segments that don't meet a minimum bar.\n"
        "Respond ONLY with valid JSON, no explanation."
    )

def _build_user_message(prompt: str, sample_features: List[List[float]]) -> str:
    rows = "\n".join(
        f"  Segment {i}: motion={f[0]:.2f}, brightness={f[1]:.2f}, "
        f"sharpness={f[2]:.2f}, contrast={f[3]:.2f}"
        for i, f in enumerate(sample_features[:10])
    )
    return (
        f'User brief: "{prompt}"\n\n'
        f"Sample segments (up to 10):\n{rows}\n\n"
        "Return the JSON weights and min_thresholds."
    )


def get_llm_weights(
    prompt: str,
    sample_features: List[List[float]],
) -> Dict:
    """
    If a prompt is provided and OpenAI is available, ask the LLM for
    scoring weights. Otherwise return balanced defaults.
    """

    # No prompt → skip the API call entirely, use defaults
    if not prompt or not prompt.strip():
        print("[llm_engine] No prompt provided — using default weights")
        return {
            "weights": DEFAULT_WEIGHTS,
            "min_thresholds": {k: 0.0 for k in FEATURE_NAMES},
            "source": "default",
        }

    api_key = os.getenv("OPENAI_API_KEY", "")

    if not _HAS_OPENAI or not api_key:
        print("[llm_engine] OpenAI unavailable — using default weights")
        return {
            "weights": DEFAULT_WEIGHTS,
            "min_thresholds": {k: 0.0 for k in FEATURE_NAMES},
            "source": "default",
        }

    client = OpenAI(api_key=api_key)

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            temperature=0.2,
            max_tokens=300,
            messages=[
                {"role": "system", "content": _build_system_prompt()},
                {"role": "user", "content": _build_user_message(prompt, sample_features)},
            ],
        )
        raw = response.choices[0].message.content.strip()

        # Strip markdown fences if the model wraps them
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[1].rsplit("```", 1)[0]

        data = json.loads(raw)

        weights = data.get("weights", DEFAULT_WEIGHTS)
        thresholds = data.get("min_thresholds", {k: 0.0 for k in FEATURE_NAMES})

        # Normalize weights to sum to 1
        total = sum(weights.values()) or 1.0
        weights = {k: v / total for k, v in weights.items()}

        print(f"[llm_engine] LLM weights: {weights}")
        print(f"[llm_engine] LLM thresholds: {thresholds}")

        return {"weights": weights, "min_thresholds": thresholds, "source": "llm"}

    except Exception as e:
        print(f"[llm_engine] LLM call failed ({e}) — using default weights")
        return {
            "weights": DEFAULT_WEIGHTS,
            "min_thresholds": {k: 0.0 for k in FEATURE_NAMES},
            "source": "default",
        }


def score_segment(
    features: List[float],
    weights: Dict[str, float],
    thresholds: Dict[str, float],
) -> float:
    """
    Score a segment purely from LLM-derived (or default) weights.
    Segments below min_thresholds are rejected (score = 0).
    """
    # Hard-filter check
    for i, key in enumerate(FEATURE_NAMES):
        if features[i] < thresholds.get(key, 0.0):
            return 0.0

    return sum(
        features[i] * weights.get(k, 0.25)
        for i, k in enumerate(FEATURE_NAMES)
    )