import numpy as np
import librosa
import torch
import json
import sys
from transformers import Wav2Vec2Processor, Wav2Vec2Model

TARGET_SR  = 16000
SILENCE_DB = -40

print("[voice] Loading Wav2Vec2...")
processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
model     = Wav2Vec2Model.from_pretrained("facebook/wav2vec2-large-xlsr-53")
model.eval()
print("[voice] Model ready.")

def load_audio(filepath):
    audio, sr = librosa.load(filepath, sr=TARGET_SR, mono=True)
    return audio, sr

def extract_features(audio, sr):
    pitches, magnitudes = librosa.piptrack(y=audio, sr=sr, fmin=75, fmax=400)
    pitch_vals = []
    for t in range(pitches.shape[1]):
        idx = magnitudes[:, t].argmax()
        p = pitches[idx, t]
        if p > 0:
            pitch_vals.append(p)
    pa = np.array(pitch_vals) if pitch_vals else np.array([0.0])
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
    pauses = []
    in_pause = False
    pause_start = 0
    for i, silent in enumerate(is_silence):
        if silent and not in_pause:
            in_pause = True
            pause_start = i
        elif not silent and in_pause:
            in_pause = False
            dur = (i - pause_start) * frame_dur
            if dur > 0.2:
                pauses.append(dur)
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
        "pitch_mean": round(pitch_mean,3), "pitch_std": round(pitch_std,3),
        "pitch_range": round(pitch_range,3), "energy_mean": round(energy_mean,6),
        "energy_std": round(energy_std,6), "pause_count": pause_count,
        "pause_rate_per_min": round(pause_rate,3), "pause_mean_duration": round(pause_mean,3),
        "speech_rate_proxy": round(speech_rate,3), "spectral_centroid": round(spec_centroid,3),
        "spectral_rolloff": round(spec_rolloff,3), "mfcc_means": mfcc_means,
        "mfcc_stds": mfcc_stds, "duration_seconds": round(total_dur,2),
    }

def extract_embeddings(audio):
    inputs = processor(audio, sampling_rate=TARGET_SR, return_tensors="pt", padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).squeeze().numpy()

def compute_score(features):
    ps   = features["pitch_std"]
    mono = 90 if ps < 10 else 70 if ps < 20 else 45 if ps < 35 else 15
    es   = features["energy_std"]
    flat = 85 if es < 0.02 else 55 if es < 0.05 else 20
    pr   = features["pause_rate_per_min"]
    pause = 80 if pr > 20 else 55 if pr > 12 else 30 if pr > 6 else 15
    sr   = features["speech_rate_proxy"]
    rate = 75 if (sr < 1.5 or sr > 8.0) else 45 if (sr < 2.5 or sr > 6.5) else 15
    overall = round(mono*0.35 + pause*0.30 + flat*0.20 + rate*0.15, 1)
    risk    = "high" if overall >= 70 else "moderate" if overall >= 45 else "low"
    return {"monotone_score": mono, "flat_affect_score": flat,
            "pause_score": pause, "rate_score": rate,
            "overall_score": overall, "risk_level": risk}

def analyse_file(filepath):
    audio, sr  = load_audio(filepath)
    features   = extract_features(audio, sr)
    embeddings = extract_embeddings(audio)
    scores     = compute_score(features)
    return {
        "status": "success", "file": filepath,
        "duration": features["duration_seconds"],
        "features": features, "scores": scores,
        "overall_score": scores["overall_score"],
        "risk_level": scores["risk_level"],
        "interpretation": {
            "monotone_speech":  features["pitch_std"] < 25,
            "flat_affect":      features["energy_std"] < 0.04,
            "excessive_pauses": features["pause_rate_per_min"] > 15,
        },
        "embedding_shape": list(embeddings.shape),
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python feature_extractor.py <audio.wav>")
        sys.exit(1)
    result = analyse_file(sys.argv[1])
    print(json.dumps(result, indent=2))
