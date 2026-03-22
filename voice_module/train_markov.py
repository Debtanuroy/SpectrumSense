"""
train_markov.py
===============
Trains the Markov chain model on available audio samples.
Handles small datasets gracefully — uses all available data,
reports confidence based on sample size.

Usage:
  python train_markov.py
  python train_markov.py --asd samples/asd --non_asd samples/non_asd
"""

import os
import sys
import json
import argparse
import librosa
import numpy as np
from hybrid_scorer import MarkovModel, extract_state_sequence

ASD_DIR     = "samples/asd"
NON_ASD_DIR = "samples/non_asd"
MODEL_PATH  = "markov_model.joblib"

SUPPORTED = (".wav", ".mp3", ".m4a", ".ogg", ".flac")

def load_sequences(folder, label):
    sequences = []
    if not os.path.exists(folder):
        print(f"[train] Folder not found: {folder}")
        return sequences

    files = [f for f in os.listdir(folder) if f.lower().endswith(SUPPORTED)]
    print(f"[train] Loading {len(files)} {label} files from {folder}...")

    for fname in files:
        fpath = os.path.join(folder, fname)
        try:
            audio, sr = librosa.load(fpath, sr=16000, mono=True)
            seq       = extract_state_sequence(audio, sr)
            sequences.append(seq)
            print(f"  ✓ {fname} — {len(seq)} frames")
        except Exception as e:
            print(f"  ✗ {fname} — Error: {e}")

    return sequences

def assess_confidence(n_asd, n_non_asd):
    total = n_asd + n_non_asd
    if total == 0:   return "none",   "No samples — using rule-based scoring only"
    if total < 4:    return "very_low","Very few samples. Markov weight reduced to 5%."
    if total < 10:   return "low",    "Small dataset. Markov adds weak signal."
    if total < 20:   return "medium", "Moderate dataset. Markov adds meaningful signal."
    return "high",   "Good dataset size. Markov model reliable."

def train(asd_dir=ASD_DIR, non_asd_dir=NON_ASD_DIR):
    print("=" * 55)
    print("Markov Chain Model Training")
    print("Research basis: Ma et al. 2024, Fusaroli et al. 2022")
    print("=" * 55)

    asd_seqs     = load_sequences(asd_dir,     "ASD")
    non_asd_seqs = load_sequences(non_asd_dir, "non-ASD")

    conf_level, conf_msg = assess_confidence(len(asd_seqs), len(non_asd_seqs))
    print(f"\n[train] Confidence: {conf_level.upper()} — {conf_msg}")

    if len(asd_seqs) == 0 or len(non_asd_seqs) == 0:
        print("[train] Need at least 1 file per class to train Markov model.")
        print("[train] Saving untrained model — hybrid scorer will use rule-based only.")
        model = MarkovModel()
        model.save(MODEL_PATH)
        return

    model = MarkovModel()
    model.train(asd_seqs, non_asd_seqs)
    model.save(MODEL_PATH)

    print(f"\n[train] Markov model trained:")
    print(f"  ASD sequences:     {len(asd_seqs)}")
    print(f"  Non-ASD sequences: {len(non_asd_seqs)}")
    print(f"  States in ASD matrix:     {len(model.asd_matrix)}")
    print(f"  States in non-ASD matrix: {len(model.non_asd_matrix)}")
    print(f"  Saved: {MODEL_PATH}")

    # Quick self-test
    print(f"\n[train] Self-test:")
    correct = 0
    total   = 0
    for seq in asd_seqs:
        score = model.score(seq)
        pred  = "ASD" if score > 50 else "non-ASD"
        correct += (pred == "ASD")
        total   += 1
        print(f"  ASD sample: score={score:.1f}% → {pred}")
    for seq in non_asd_seqs:
        score = model.score(seq)
        pred  = "ASD" if score > 50 else "non-ASD"
        correct += (pred == "non-ASD")
        total   += 1
        print(f"  non-ASD sample: score={score:.1f}% → {pred}")

    if total > 0:
        print(f"\n  Training accuracy: {correct}/{total} ({100*correct//total}%)")
        print(f"  Note: Training accuracy on small datasets is optimistic.")
        print(f"  Collect more samples for reliable validation.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--asd",     default=ASD_DIR,     help="Path to ASD audio folder")
    parser.add_argument("--non_asd", default=NON_ASD_DIR, help="Path to non-ASD audio folder")
    args = parser.parse_args()
    train(args.asd, args.non_asd)