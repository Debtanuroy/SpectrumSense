"""
diagnose.py — run this on your audio files to see raw feature values
Usage: python diagnose.py samples/asd/file1.wav samples/non_asd/file1.wav
"""
import sys
import librosa
import numpy as np

def diagnose(filepath, label):
    print(f"\n{'='*50}")
    print(f"File: {filepath} [{label}]")
    print(f"{'='*50}")
    
    audio, sr = librosa.load(filepath, sr=16000, mono=True)
    
    # Pitch
    pitches, magnitudes = librosa.piptrack(y=audio, sr=sr, fmin=75, fmax=400)
    pitch_vals = []
    for t in range(pitches.shape[1]):
        idx = magnitudes[:, t].argmax()
        p   = pitches[idx, t]
        if p > 0:
            pitch_vals.append(p)
    pa = np.array(pitch_vals) if pitch_vals else np.array([0.0])
    
    # Energy
    rms    = librosa.feature.rms(y=audio)[0]
    rms_db = librosa.amplitude_to_db(rms, ref=np.max)
    
    # Pauses
    is_silence  = rms_db < -40
    hop_length  = 512
    frame_dur   = hop_length / sr
    pauses = []
    in_pause = False
    start = 0
    for i, s in enumerate(is_silence):
        if s and not in_pause:
            in_pause = True; start = i
        elif not s and in_pause:
            in_pause = False
            d = (i - start) * frame_dur
            if d > 0.2: pauses.append(d)
    
    total_dur  = len(audio) / sr
    pause_rate = len(pauses) / (total_dur / 60)
    zcr        = librosa.feature.zero_crossing_rate(audio)[0]
    speech_rate = float(np.mean(zcr)) * sr / hop_length

    print(f"Duration:     {total_dur:.1f}s")
    print(f"Pitch mean:   {np.mean(pa):.1f} Hz  (TD ref: 185 Hz)")
    print(f"Pitch std:    {np.std(pa):.1f} Hz   (TD ref: 35 Hz, SD=15)")
    print(f"Pitch range:  {np.ptp(pa):.1f} Hz   (TD ref: 120 Hz, SD=50)")
    print(f"Energy mean:  {np.mean(rms):.5f}     (TD ref: 0.055, SD=0.02)")
    print(f"Energy std:   {np.std(rms):.5f}      (TD ref: 0.055, SD=0.02)")
    print(f"Pause rate:   {pause_rate:.1f}/min   (TD ref: 8.0, SD=4.0)")
    print(f"Speech rate:  {speech_rate:.2f}       (TD ref: 4.5, SD=1.5)")
    
    # Z-scores
    print(f"\nZ-scores vs TD reference:")
    print(f"  pitch_std z:   {(np.std(pa) - 35) / 15:.2f}")
    print(f"  pitch_range z: {(np.ptp(pa) - 120) / 50:.2f}")
    print(f"  energy_std z:  {(np.std(rms) - 0.055) / 0.02:.2f}")
    print(f"  pause_rate z:  {(pause_rate - 8.0) / 4.0:.2f}")
    print(f"  speech_rate z: {(speech_rate - 4.5) / 1.5:.2f}")

if len(sys.argv) < 2:
    print("Usage: python diagnose.py <file1.wav> [file2.wav ...]")
    print("Label files with asd/non_asd in their path")
else:
    for f in sys.argv[1:]:
        label = "ASD" if "asd" in f.lower() and "non" not in f.lower() else "non-ASD"
        diagnose(f, label)