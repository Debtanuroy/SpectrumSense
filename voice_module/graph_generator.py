"""
graph_generator.py
==================
Generates a comparison chart showing the user's voice markers
against ASD reference and neurotypical reference ranges.
Returns base64-encoded PNG — no file saved to disk.

Called from feature_extractor.py and returned in the API response.
"""

import numpy as np
import matplotlib
matplotlib.use("Agg")   # non-interactive backend — no display needed
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch
import io
import base64

# ─────────────────────────────────────────────────────────────────────────────
# Reference values derived from diagnostic data + research
# ASD ref:     from actual ASD audio file (Autism2.wav)
# NT ref:      from actual non-ASD audio file (Video3.wav)
# Calibrated to librosa piptrack output
# ─────────────────────────────────────────────────────────────────────────────

REFERENCES = {
    "Pitch Std (Hz)": {
        "asd_mean": 95.3,  "asd_sd": 18.0,
        "nt_mean":  62.4,  "nt_sd":  12.0,
        "unit": "Hz",
        "higher_is_asd": True,
        "description": "Higher = more atypical variability",
    },
    "Energy Std": {
        "asd_mean": 0.019, "asd_sd": 0.004,
        "nt_mean":  0.023, "nt_sd":  0.004,
        "unit": "",
        "higher_is_asd": False,
        "description": "Lower = flat affect",
    },
    "Speech Rate": {
        "asd_mean": 2.66,  "asd_sd": 0.5,
        "nt_mean":  4.83,  "nt_sd":  0.7,
        "unit": "",
        "higher_is_asd": False,
        "description": "Lower = slower speech",
    },
    "Pause Rate\n(/min)": {
        "asd_mean": 6.0,   "asd_sd": 3.0,
        "nt_mean":  8.0,   "nt_sd":  3.5,
        "unit": "/min",
        "higher_is_asd": False,
        "description": "Less reliable marker",
    },
}

# Colour palette — medical / clean
COLOR_ASD     = "#d63b3b"   # red
COLOR_NT      = "#0d9660"   # green
COLOR_USER    = "#1a6ef5"   # blue
COLOR_BG      = "#f7f8fc"
COLOR_PANEL   = "#ffffff"
COLOR_GRID    = "#dde2ef"
COLOR_TEXT    = "#0d1526"
COLOR_MUTED   = "#8591b0"


def normalise(value, ref_min, ref_max):
    """Normalise a value to 0-1 within a reference range."""
    if ref_max == ref_min:
        return 0.5
    return max(0.0, min(1.0, (value - ref_min) / (ref_max - ref_min)))


def generate_comparison_chart(user_features: dict) -> str:
    """
    Generate a 4-panel bar chart comparing user values
    against ASD and NT reference ranges.

    Args:
        user_features: dict from feature_extractor.extract_features()

    Returns:
        base64-encoded PNG string
    """

    user_vals = {
        "Pitch Std (Hz)":    user_features.get("pitch_std", 0),
        "Energy Std":        user_features.get("energy_std", 0),
        "Speech Rate":       user_features.get("speech_rate_proxy", 0),
        "Pause Rate\n(/min)":user_features.get("pause_rate_per_min", 0),
    }

    n_markers = len(REFERENCES)
    fig, axes = plt.subplots(1, n_markers, figsize=(14, 5.5))
    fig.patch.set_facecolor(COLOR_BG)

    # Title
    fig.suptitle(
        "Voice Marker Comparison: Your Voice vs ASD & Neurotypical Reference",
        fontsize=13, fontweight="bold", color=COLOR_TEXT,
        y=1.02, fontfamily="DejaVu Sans"
    )

    for ax, (marker_name, ref) in zip(axes, REFERENCES.items()):
        ax.set_facecolor(COLOR_PANEL)
        ax.spines["top"].set_visible(False)
        ax.spines["right"].set_visible(False)
        ax.spines["left"].set_color(COLOR_GRID)
        ax.spines["bottom"].set_color(COLOR_GRID)
        ax.tick_params(colors=COLOR_MUTED, labelsize=8)

        asd_m  = ref["asd_mean"]
        asd_s  = ref["asd_sd"]
        nt_m   = ref["nt_mean"]
        nt_s   = ref["nt_sd"]
        user_v = user_vals[marker_name]

        # Dynamic y range
        all_vals = [asd_m + asd_s*2, nt_m + nt_s*2, user_v]
        y_max    = max(all_vals) * 1.35
        y_min    = 0

        ax.set_ylim(y_min, y_max)

        # x positions
        x_nt, x_user, x_asd = 0.5, 1.5, 2.5
        bar_w = 0.55

        # NT bar + error bar
        ax.bar(x_nt,   nt_m,   bar_w, color=COLOR_NT,   alpha=0.85, zorder=3)
        ax.errorbar(x_nt, nt_m, yerr=nt_s, fmt="none",
                    ecolor="#085041", elinewidth=2, capsize=5, zorder=4)

        # User bar
        ax.bar(x_user, user_v, bar_w, color=COLOR_USER,  alpha=0.90, zorder=3)

        # ASD bar + error bar
        ax.bar(x_asd,  asd_m,  bar_w, color=COLOR_ASD,  alpha=0.85, zorder=3)
        ax.errorbar(x_asd, asd_m, yerr=asd_s, fmt="none",
                    ecolor="#791f1f", elinewidth=2, capsize=5, zorder=4)

        # Value labels on bars
        for x, v, color in [(x_nt, nt_m, COLOR_NT),
                             (x_user, user_v, COLOR_USER),
                             (x_asd, asd_m, COLOR_ASD)]:
            fmt = f"{v:.3f}" if v < 0.1 else f"{v:.1f}"
            ax.text(x, v + y_max*0.02, fmt,
                    ha="center", va="bottom", fontsize=8,
                    color=color, fontweight="bold")

        # Shade the region between NT and ASD means
        shade_low  = min(nt_m, asd_m)
        shade_high = max(nt_m, asd_m)
        ax.axhspan(shade_low, shade_high, alpha=0.06,
                   color="#8591b0", zorder=1)

        # User line indicator
        ax.axhline(y=user_v, color=COLOR_USER, linewidth=1.2,
                   linestyle="--", alpha=0.5, zorder=2)

        # X axis labels
        ax.set_xticks([x_nt, x_user, x_asd])
        ax.set_xticklabels(["Neurotypical\nReference", "Your\nVoice", "ASD\nReference"],
                           fontsize=8, color=COLOR_TEXT)

        # Marker title
        ax.set_title(marker_name.replace("\n", " "),
                     fontsize=9.5, fontweight="bold",
                     color=COLOR_TEXT, pad=10)

        # Description subtitle
        ax.text(0.5, -0.22, ref["description"],
                transform=ax.transAxes,
                ha="center", va="top",
                fontsize=7.5, color=COLOR_MUTED,
                style="italic")

        # Grid lines
        ax.yaxis.grid(True, color=COLOR_GRID, linewidth=0.7, zorder=0)
        ax.set_axisbelow(True)

        # Proximity indicator — how close is user to ASD vs NT
        dist_asd = abs(user_v - asd_m) / max(asd_s, 0.001)
        dist_nt  = abs(user_v - nt_m)  / max(nt_s,  0.001)
        closer   = "ASD" if dist_asd < dist_nt else "NT"
        badge_col = COLOR_ASD if closer == "ASD" else COLOR_NT
        ax.text(0.5, 1.08,
                f"Closer to {closer}",
                transform=ax.transAxes,
                ha="center", va="bottom",
                fontsize=7.5, color=badge_col,
                fontweight="bold",
                bbox=dict(boxstyle="round,pad=0.25",
                          facecolor=badge_col+"18",
                          edgecolor=badge_col+"55",
                          linewidth=0.8))

    # Legend
    legend_handles = [
        mpatches.Patch(color=COLOR_NT,   label="Neurotypical reference"),
        mpatches.Patch(color=COLOR_USER, label="Your voice"),
        mpatches.Patch(color=COLOR_ASD,  label="ASD reference"),
    ]
    fig.legend(
        handles=legend_handles,
        loc="lower center",
        ncol=3,
        fontsize=9,
        frameon=True,
        framealpha=0.9,
        edgecolor=COLOR_GRID,
        facecolor=COLOR_PANEL,
        bbox_to_anchor=(0.5, -0.08),
    )

    # Footer note
    fig.text(
        0.5, -0.14,
        "Reference values calibrated from librosa piptrack output on real ASD/non-ASD audio. "
        "Error bars = ±1 SD. Ma et al. 2024, Bone et al. 2014, Patel et al. 2020.",
        ha="center", fontsize=7, color=COLOR_MUTED, style="italic"
    )

    plt.tight_layout(pad=1.5)

    # Encode to base64
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=130,
                bbox_inches="tight",
                facecolor=COLOR_BG)
    plt.close(fig)
    buf.seek(0)
    img_b64 = base64.b64encode(buf.read()).decode("utf-8")
    return img_b64


if __name__ == "__main__":
    # Quick test
    test_features = {
        "pitch_std":          95.3,
        "energy_std":         0.019,
        "speech_rate_proxy":  2.66,
        "pause_rate_per_min": 0.0,
    }
    b64 = generate_comparison_chart(test_features)
    # Save to file for inspection
    with open("test_chart.png", "wb") as f:
        f.write(base64.b64decode(b64))
    print(f"Chart saved as test_chart.png ({len(b64)} chars base64)")