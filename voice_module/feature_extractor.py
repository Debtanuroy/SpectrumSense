"""
feature_extractor.py (with graph generation)
"""
import numpy as np
import librosa
import torch
import json
import sys
import os
from transformers import Wav2Vec2Processor, Wav2Vec2Model
from hybrid_scorer import hybrid_score, MarkovModel
from graph_generator import generate_comparison_chart

TARGET_SR  = 16000
SILENCE_DB = -40
MODEL_PATH = "markov_model.joblib"

print("[voice] Loading Wav2Vec2...")
processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
model     = Wav2Vec2Model.from_pretrained("facebook/wav2vec2-large-xlsr-53")
model.eval()
print("[voice] Wav2Vec2 ready.")

markov_model = MarkovModel.load(MODEL_PATH)
if markov_model and markov_model.trained:
    print(f"[voice] Markov model loaded ({markov_model.n_asd} ASD, {markov_model.n_non_asd} non-ASD)")
else:
    print("[voice] No Markov model — using research-calibrated rules.")

def load_audio(filepath):
    audio, sr = librosa.load(filepath, sr=TARGET_SR, mono=True)
    return audio, sr

def extract_features(audio, sr):
    pitches, magnitudes = librosa.piptrack(y=audio, sr=sr, fmin=75, fmax=400)
    pitch_vals = []
    for t in range(pitches.shape[1]):
        idx = magnitudes[:, t].argmax()
        p   = pitches[idx, t]
        if p > 0:
            pitch_vals.append(p)
    pa          = np.array(pitch_vals) if pitch_vals else np.array([0.0])
    pitch_mean  = float(np.mean(pa))
    pitch_std   = float(np.std(pa))
    pitch_range = float(np.ptp(pa))

    rms         = librosa.feature.rms(y=audio)[0]
    energy_mean = float(np.mean(rms))
    energy_std  = float(np.std(rms))

    rms_db      = librosa.amplitude_to_db(rms, ref=np.max)
    is_silence  = rms_db < SILENCE_DB
    hop_length  = 512
    frame_dur   = hop_length / sr
    pauses      = []
    in_pause    = False
    pause_start = 0
    for i, silent in enumerate(is_silence):
        if silent and not in_pause:
            in_pause = True; pause_start = i
        elif not silent and in_pause:
            in_pause = False
            dur = (i - pause_start) * frame_dur
            if dur > 0.2: pauses.append(dur)

    total_dur   = len(audio) / sr
    pause_count = len(pauses)
    pause_rate  = pause_count / (total_dur / 60)
    pause_mean  = float(np.mean(pauses)) if pauses else 0.0

    zcr         = librosa.feature.zero_crossing_rate(audio)[0]
    speech_rate = float(np.mean(zcr)) * sr / hop_length

    spec_centroid = float(np.mean(librosa.feature.spectral_centroid(y=audio, sr=sr)))
    spec_rolloff  = float(np.mean(librosa.feature.spectral_rolloff(y=audio,  sr=sr)))

    mfccs      = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
    mfcc_means = [round(float(np.mean(mfccs[i])), 3) for i in range(13)]
    mfcc_stds  = [round(float(np.std(mfccs[i])),  3) for i in range(13)]

    return {
        "pitch_mean":          round(pitch_mean, 3),
        "pitch_std":           round(pitch_std, 3),
        "pitch_range":         round(pitch_range, 3),
        "energy_mean":         round(energy_mean, 6),
        "energy_std":          round(energy_std, 6),
        "pause_count":         pause_count,
        "pause_rate_per_min":  round(pause_rate, 3),
        "pause_mean_duration": round(pause_mean, 3),
        "speech_rate_proxy":   round(speech_rate, 3),
        "spectral_centroid":   round(spec_centroid, 3),
        "spectral_rolloff":    round(spec_rolloff, 3),
        "mfcc_means":          mfcc_means,
        "mfcc_stds":           mfcc_stds,
        "duration_seconds":    round(total_dur, 2),
    }

def extract_embeddings(audio):
    inputs = processor(audio, sampling_rate=TARGET_SR, return_tensors="pt", padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).squeeze().numpy()

def analyse_file(filepath):
    print(f"[voice] Analysing: {filepath}")
    audio, sr = load_audio(filepath)
    print(f"[voice] Duration: {len(audio)/sr:.1f}s")

    features   = extract_features(audio, sr)
    embeddings = extract_embeddings(audio)
    scoring    = hybrid_score(
        features=features, audio=audio, sr=sr,
        markov_model=markov_model,
    )

    # Generate comparison chart
    print("[voice] Generating comparison chart...")
    try:
        chart_b64 = generate_comparison_chart(features)
        print("[voice] Chart generated.")
    except Exception as e:
        print(f"[voice] Chart generation failed: {e}")
        chart_b64 = None

    risk_map = {"very_high":"high","high":"high","moderate":"moderate","low":"low"}

    return {
        "status":        "success",
        "file":          filepath,
        "duration":      features["duration_seconds"],
        "features":      features,
        "scores":        scoring["subscores"],
        "overall_score": scoring["overall_score"],
        "risk_level":    risk_map.get(scoring["risk_level"], "moderate"),
        "method":        scoring["method"],
        "z_scores":      scoring.get("z_scores", {}),
        "research_notes":scoring.get("research_notes", {}),
        "markov_trained":scoring["markov_trained"],
        "interpretation":scoring.get("interpretation", {}),
        "embedding_shape":list(embeddings.shape),
        "comparison_chart": chart_b64,   # base64 PNG
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python feature_extractor.py <audio.wav>")
        sys.exit(1)
    result = analyse_file(sys.argv[1])
    result_display = {k: v for k, v in result.items()
                      if k not in ("embedding_shape", "comparison_chart")}
    print(json.dumps(result_display, indent=2))
    if result.get("comparison_chart"):
        print(f"\n[chart] base64 length: {len(result['comparison_chart'])} chars")