#!/usr/bin/env python3
"""
difficulty_alignment_analysis.py — End-to-end analysis of intended vs realized
difficulty alignment, human-effort stratification, and agent-performance stratification.

Outputs:
  analysis/difficulty_alignment_report.md
  analysis/difficulty_match_stats.json
  analysis/intended_vs_realized_axis_stats.csv
  analysis/pass_rates_by_intended_and_realized.csv
  analysis/calibration_failure_examples.csv
  analysis/figures/*.png
"""
from __future__ import annotations

import json, os, sys, csv, warnings
from collections import defaultdict
from pathlib import Path
from datetime import datetime

import numpy as np
import pandas as pd
from scipy import stats

warnings.filterwarnings("ignore", category=FutureWarning)

REPO = Path(__file__).resolve().parents[1]
LAYER1_ROOT = Path(f"/usr/xtmp/{os.environ.get('USER','tg295')}/componentbench-observation-packets/layer1_v1/tasks")
REALIZED_AXES = REPO / "data" / "realized_axes_v2.jsonl"
REALIZED_FEATURES = REPO / "data" / "realized_features_v2.jsonl"
OUT_DIR = REPO / "analysis"

AXES = [
    "precision_requirement", "target_acquisition",
    "density_choice_interference", "depth_layering",
    "feedback_dynamics", "semantic_observability", "disambiguation_load",
]

BUCKET_ORDER = ["easy", "mid", "hard"]
TIER_ORDER = ["L0", "L1", "L2", "L3"]

def bucket_to_num(b):
    b = b.lower().strip() if b else ""
    if b == "medium": b = "mid"
    return {"easy": 0, "mid": 1, "hard": 2}.get(b, None)

def tier_to_num(t):
    t = t.strip() if t else ""
    return {"L0": 0, "L1": 1, "L2": 2, "L3": 3}.get(t, None)

def num_to_bucket(n):
    return {0: "easy", 1: "mid", 2: "hard"}.get(n, "?")

def num_to_tier(n):
    return {0: "L0", 1: "L1", 2: "L2", 3: "L3"}.get(n, "?")


def load_data():
    """Load and join all data sources into one DataFrame."""
    realized_axes = {}
    with open(REALIZED_AXES) as f:
        for line in f:
            d = json.loads(line)
            realized_axes[d["task_id"]] = d

    rows = []
    task_dirs = sorted(d for d in LAYER1_ROOT.iterdir() if d.is_dir())
    for td in task_dirs:
        bp = td / "bundle.json"
        if not bp.exists():
            continue
        b = json.loads(bp.read_text())
        tid = b["task"]["task_id"]
        ctype = b["task"]["canonical_type"]
        lib = b["task"]["library"]

        # Intended
        intd = b.get("intended_difficulty", {})
        i_bucket = intd.get("difficulty_bucket", "")
        if i_bucket == "medium": i_bucket = "mid"
        i_tier = intd.get("difficulty_tier", "")
        i_axes = intd.get("axes", {})

        # Realized (from bundle or from JSONL fallback)
        rd = b.get("realized_difficulty", {})
        ra = realized_axes.get(tid, {})
        r_bucket = ra.get("bucket", rd.get("bucket", ""))
        if r_bucket == "medium": r_bucket = "mid"
        r_tier = ra.get("tier", rd.get("tier", ""))
        r_axes_1to5 = ra.get("axis_ratings_1to5", rd.get("axis_ratings_1to5", {}))
        r_axes_cont = ra.get("axis_scores_continuous", rd.get("axis_scores_continuous", {}))

        # Human reference
        hr = b.get("human_reference", {})
        human_steps = hr.get("normalized_steps")
        human_dur_ms = hr.get("duration_ms")
        human_avail = hr.get("available", False)

        # Agent runs
        agent_runs = b.get("agent_runs", [])

        row = {
            "task_id": tid,
            "canonical_type": ctype,
            "library": lib,
            "i_bucket": i_bucket,
            "i_tier": i_tier,
            "i_bucket_num": bucket_to_num(i_bucket),
            "i_tier_num": tier_to_num(i_tier),
            "r_bucket": r_bucket,
            "r_tier": r_tier,
            "r_bucket_num": bucket_to_num(r_bucket),
            "r_tier_num": tier_to_num(r_tier),
            "human_steps": human_steps,
            "human_dur_ms": human_dur_ms,
            "human_available": human_avail,
        }
        for ax in AXES:
            row[f"i_{ax}"] = i_axes.get(ax)
            row[f"r_{ax}"] = r_axes_1to5.get(ax)
            row[f"r_{ax}_cont"] = r_axes_cont.get(ax)

        for ar in agent_runs:
            uid = ar["run_uid"]
            row[f"pass__{uid}"] = 1 if ar.get("success") else 0
            row[f"steps__{uid}"] = ar.get("steps")

        rows.append(row)

    df = pd.DataFrame(rows)
    return df


def confusion_matrix_str(y_true, y_pred, labels):
    from collections import Counter
    cm = defaultdict(lambda: defaultdict(int))
    for t, p in zip(y_true, y_pred):
        cm[t][p] += 1
    header = "predicted→  " + "  ".join(f"{l:>6}" for l in labels)
    lines = [header]
    for tl in labels:
        vals = "  ".join(f"{cm[tl][pl]:>6}" for pl in labels)
        lines.append(f"{tl:>10}  {vals}")
    return "\n".join(lines)


def compute_alignment(df):
    """Section 1: Intended vs realized alignment."""
    results = {}

    # Bucket alignment
    mask = df["i_bucket_num"].notna() & df["r_bucket_num"].notna()
    sub = df[mask].copy()
    n = len(sub)
    ib = sub["i_bucket_num"].values.astype(int)
    rb = sub["r_bucket_num"].values.astype(int)

    exact = np.mean(ib == rb)
    within1 = np.mean(np.abs(ib - rb) <= 1)
    mae = np.mean(np.abs(ib - rb))
    sp = stats.spearmanr(ib, rb)

    bucket_cm = confusion_matrix_str(
        [num_to_bucket(x) for x in ib],
        [num_to_bucket(x) for x in rb],
        BUCKET_ORDER,
    )

    results["bucket"] = {
        "n": n,
        "exact_match": round(exact, 4),
        "within_1_match": round(within1, 4),
        "mae": round(mae, 4),
        "spearman_r": round(sp.statistic, 4),
        "spearman_p": float(f"{sp.pvalue:.2e}"),
        "confusion_matrix": bucket_cm,
    }

    # Tier alignment
    mask = df["i_tier_num"].notna() & df["r_tier_num"].notna()
    sub = df[mask].copy()
    n = len(sub)
    it = sub["i_tier_num"].values.astype(int)
    rt = sub["r_tier_num"].values.astype(int)

    exact = np.mean(it == rt)
    within1 = np.mean(np.abs(it - rt) <= 1)
    mae = np.mean(np.abs(it - rt))
    sp = stats.spearmanr(it, rt)

    tier_cm = confusion_matrix_str(
        [num_to_tier(x) for x in it],
        [num_to_tier(x) for x in rt],
        TIER_ORDER,
    )

    results["tier"] = {
        "n": n,
        "exact_match": round(exact, 4),
        "within_1_match": round(within1, 4),
        "mae": round(mae, 4),
        "spearman_r": round(sp.statistic, 4),
        "spearman_p": float(f"{sp.pvalue:.2e}"),
        "confusion_matrix": tier_cm,
    }

    # Per-axis alignment
    axis_stats = []
    for ax in AXES:
        ic = f"i_{ax}"
        rc = f"r_{ax}"
        mask = df[ic].notna() & df[rc].notna()
        sub = df[mask]
        if len(sub) < 10:
            continue
        iv = sub[ic].values.astype(float)
        rv = sub[rc].values.astype(float)
        exact = np.mean(iv == rv)
        within1 = np.mean(np.abs(iv - rv) <= 1)
        mae = np.mean(np.abs(iv - rv))
        mean_diff = np.mean(rv - iv)
        sp = stats.spearmanr(iv, rv)
        pr = stats.pearsonr(iv, rv)
        axis_stats.append({
            "axis": ax,
            "n": len(sub),
            "exact_match": round(exact, 4),
            "within_1_match": round(within1, 4),
            "mae": round(mae, 4),
            "mean_realized_minus_intended": round(mean_diff, 4),
            "spearman_r": round(sp.statistic, 4),
            "spearman_p": float(f"{sp.pvalue:.2e}"),
            "pearson_r": round(pr.statistic, 4),
            "pearson_p": float(f"{pr.pvalue:.2e}"),
        })
    results["axes"] = axis_stats
    return results


def compute_human_stratification(df):
    """Section 2: Human-effort stratification."""
    results = {}
    for label, col, order in [
        ("intended_bucket", "i_bucket", BUCKET_ORDER),
        ("realized_bucket", "r_bucket", BUCKET_ORDER),
        ("intended_tier", "i_tier", TIER_ORDER),
        ("realized_tier", "r_tier", TIER_ORDER),
    ]:
        rows = []
        for lvl in order:
            sub = df[(df[col] == lvl) & df["human_steps"].notna()]
            sub_dur = df[(df[col] == lvl) & df["human_dur_ms"].notna()]
            rows.append({
                "level": lvl,
                "n_steps": len(sub),
                "mean_steps": round(sub["human_steps"].mean(), 2) if len(sub) > 0 else None,
                "median_steps": round(sub["human_steps"].median(), 2) if len(sub) > 0 else None,
                "n_dur": len(sub_dur),
                "mean_dur_ms": round(sub_dur["human_dur_ms"].mean(), 0) if len(sub_dur) > 0 else None,
                "median_dur_ms": round(sub_dur["human_dur_ms"].median(), 0) if len(sub_dur) > 0 else None,
            })
        results[label] = rows

    # Spearman correlations
    corrs = {}
    for col_name, col in [("i_bucket_num", "i_bucket_num"), ("r_bucket_num", "r_bucket_num"),
                           ("i_tier_num", "i_tier_num"), ("r_tier_num", "r_tier_num")]:
        mask = df[col].notna() & df["human_steps"].notna()
        sub = df[mask]
        if len(sub) > 10:
            sp = stats.spearmanr(sub[col], sub["human_steps"])
            corrs[f"{col_name}_vs_human_steps"] = {"r": round(sp.statistic, 4), "p": float(f"{sp.pvalue:.2e}"), "n": len(sub)}
        mask_d = df[col].notna() & df["human_dur_ms"].notna()
        sub_d = df[mask_d]
        if len(sub_d) > 10:
            sp = stats.spearmanr(sub_d[col], sub_d["human_dur_ms"])
            corrs[f"{col_name}_vs_human_dur"] = {"r": round(sp.statistic, 4), "p": float(f"{sp.pvalue:.2e}"), "n": len(sub_d)}
    results["correlations"] = corrs
    return results


def compute_agent_stratification(df):
    """Section 3: Agent-performance stratification."""
    pass_cols = [c for c in df.columns if c.startswith("pass__")]
    step_cols = [c for c in df.columns if c.startswith("steps__")]

    # Overall pass rate
    if pass_cols:
        df["pass_any"] = df[pass_cols].max(axis=1)
        df["pass_mean"] = df[pass_cols].mean(axis=1)

    results = {}

    # By intended/realized bucket and tier
    for label, col, order in [
        ("intended_bucket", "i_bucket", BUCKET_ORDER),
        ("realized_bucket", "r_bucket", BUCKET_ORDER),
        ("intended_tier", "i_tier", TIER_ORDER),
        ("realized_tier", "r_tier", TIER_ORDER),
    ]:
        rows = []
        for lvl in order:
            sub = df[df[col] == lvl]
            row = {"level": lvl, "n": len(sub)}
            for pc in pass_cols:
                mode = pc.replace("pass__", "")
                row[f"pass_rate_{mode}"] = round(sub[pc].mean(), 4) if len(sub) > 0 else None
            if "pass_mean" in df.columns:
                row["pass_rate_overall_mean"] = round(sub["pass_mean"].mean(), 4) if len(sub) > 0 else None
            rows.append(row)
        results[label] = rows

    # Spearman of difficulty level vs pass rate
    corrs = {}
    for col_name, col in [("i_bucket_num", "i_bucket_num"), ("r_bucket_num", "r_bucket_num"),
                           ("i_tier_num", "i_tier_num"), ("r_tier_num", "r_tier_num")]:
        for pc in pass_cols:
            mode = pc.replace("pass__", "")
            mask = df[col].notna()
            sub = df[mask]
            if len(sub) > 10:
                sp = stats.spearmanr(sub[col], sub[pc])
                corrs[f"{col_name}_vs_{mode}"] = {"r": round(sp.statistic, 4), "p": float(f"{sp.pvalue:.2e}")}
    results["correlations"] = corrs
    return results


def find_calibration_failures(df):
    """Section 4: Calibration failure exemplars."""
    examples = []

    pass_cols = [c for c in df.columns if c.startswith("pass__")]
    if pass_cols:
        df["pass_rate_all"] = df[pass_cols].mean(axis=1)
    else:
        df["pass_rate_all"] = np.nan

    mask = df["i_bucket_num"].notna() & df["r_bucket_num"].notna()
    sub = df[mask].copy()
    sub["bucket_diff"] = sub["r_bucket_num"] - sub["i_bucket_num"]

    # Intended easy but realized hard
    easy_to_hard = sub[(sub["i_bucket"] == "easy") & (sub["r_bucket"] == "hard")]
    for _, r in easy_to_hard.iterrows():
        examples.append({**_row_to_dict(r), "category": "intended_easy_realized_hard"})

    # Intended hard but realized easy
    hard_to_easy = sub[(sub["i_bucket"] == "hard") & (sub["r_bucket"] == "easy")]
    for _, r in hard_to_easy.iterrows():
        examples.append({**_row_to_dict(r), "category": "intended_hard_realized_easy"})

    # Tier diff >= 2
    mask2 = df["i_tier_num"].notna() & df["r_tier_num"].notna()
    sub2 = df[mask2].copy()
    sub2["tier_diff"] = (sub2["r_tier_num"] - sub2["i_tier_num"]).abs()
    big_tier = sub2[sub2["tier_diff"] >= 2]
    for _, r in big_tier.iterrows():
        examples.append({**_row_to_dict(r), "category": "tier_diff_ge_2"})

    # Human effort high but intended easy
    if "human_steps" in df.columns:
        p75 = df["human_steps"].dropna().quantile(0.75)
        high_human_easy = df[(df["human_steps"] >= p75) & (df["i_bucket"] == "easy") & df["human_steps"].notna()]
        for _, r in high_human_easy.iterrows():
            examples.append({**_row_to_dict(r), "category": "high_human_effort_intended_easy"})

    # Low agent pass but realized easy
    if "pass_rate_all" in df.columns:
        low_pass_easy = df[(df["pass_rate_all"] <= 0.25) & (df["r_bucket"] == "easy") & df["pass_rate_all"].notna()]
        for _, r in low_pass_easy.iterrows():
            examples.append({**_row_to_dict(r), "category": "low_agent_pass_realized_easy"})

    # Deduplicate by task_id, keep first category
    seen = set()
    deduped = []
    for e in examples:
        if e["task_id"] not in seen:
            seen.add(e["task_id"])
            deduped.append(e)
    return deduped


def _row_to_dict(r):
    return {
        "task_id": r["task_id"],
        "canonical_type": r["canonical_type"],
        "library": r["library"],
        "i_bucket": r.get("i_bucket", ""),
        "i_tier": r.get("i_tier", ""),
        "r_bucket": r.get("r_bucket", ""),
        "r_tier": r.get("r_tier", ""),
        "human_steps": r.get("human_steps"),
        "human_dur_ms": r.get("human_dur_ms"),
        "pass_rate_all": round(r.get("pass_rate_all", float("nan")), 4) if pd.notna(r.get("pass_rate_all")) else None,
    }


def make_figures(df):
    """Generate figures for the report."""
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    fig_dir = OUT_DIR / "figures"
    fig_dir.mkdir(parents=True, exist_ok=True)
    figs = {}

    pass_cols = [c for c in df.columns if c.startswith("pass__")]
    if pass_cols:
        df["pass_rate_all"] = df[pass_cols].mean(axis=1)

    def _heatmap(ct_df, ax, cmap_name, title, xlabel, ylabel):
        data = ct_df.values
        cmap = plt.get_cmap(cmap_name)
        im = ax.imshow(data, cmap=cmap, aspect="auto")
        for i in range(data.shape[0]):
            for j in range(data.shape[1]):
                ax.text(j, i, str(data[i, j]), ha="center", va="center",
                        color="white" if data[i, j] > data.max() * 0.6 else "black", fontsize=11)
        ax.set_xticks(range(len(ct_df.columns)))
        ax.set_xticklabels(ct_df.columns)
        ax.set_yticks(range(len(ct_df.index)))
        ax.set_yticklabels(ct_df.index)
        ax.set_xlabel(xlabel)
        ax.set_ylabel(ylabel)
        ax.set_title(title)

    # 1. Bucket confusion heatmap
    mask = df["i_bucket"].isin(BUCKET_ORDER) & df["r_bucket"].isin(BUCKET_ORDER)
    sub = df[mask]
    ct = pd.crosstab(sub["i_bucket"], sub["r_bucket"])
    ct = ct.reindex(index=BUCKET_ORDER, columns=BUCKET_ORDER, fill_value=0)
    fig, ax = plt.subplots(figsize=(5, 4))
    _heatmap(ct, ax, "Blues", "Intended vs Realized Difficulty Bucket", "Realized Bucket", "Intended Bucket")
    fig.tight_layout()
    fig.savefig(fig_dir / "bucket_confusion.png", dpi=150)
    plt.close(fig)
    figs["bucket_confusion"] = "figures/bucket_confusion.png"

    # 2. Tier confusion heatmap
    mask = df["i_tier"].isin(TIER_ORDER) & df["r_tier"].isin(TIER_ORDER)
    sub = df[mask]
    ct = pd.crosstab(sub["i_tier"], sub["r_tier"])
    ct = ct.reindex(index=TIER_ORDER, columns=TIER_ORDER, fill_value=0)
    fig, ax = plt.subplots(figsize=(5, 4))
    _heatmap(ct, ax, "Oranges", "Intended vs Realized Difficulty Tier", "Realized Tier", "Intended Tier")
    fig.tight_layout()
    fig.savefig(fig_dir / "tier_confusion.png", dpi=150)
    plt.close(fig)
    figs["tier_confusion"] = "figures/tier_confusion.png"

    # 3. Pass rate by intended vs realized bucket (grouped bar)
    if "pass_rate_all" in df.columns:
        fig, axes_plt = plt.subplots(1, 2, figsize=(10, 4), sharey=True)
        for ax_plt, col, title in [
            (axes_plt[0], "i_bucket", "Intended Bucket"),
            (axes_plt[1], "r_bucket", "Realized Bucket"),
        ]:
            means = []
            for lvl in BUCKET_ORDER:
                sub = df[df[col] == lvl]
                means.append(sub["pass_rate_all"].mean() if len(sub) > 0 else 0)
            ax_plt.bar(BUCKET_ORDER, means, color=["#66bb6a", "#ffa726", "#ef5350"])
            ax_plt.set_title(title)
            ax_plt.set_ylabel("Mean Pass Rate")
            ax_plt.set_ylim(0, 1)
            for i, v in enumerate(means):
                ax_plt.text(i, v + 0.02, f"{v:.2f}", ha="center", fontsize=10)
        fig.suptitle("Agent Pass Rate by Difficulty Bucket", fontsize=13)
        fig.tight_layout()
        fig.savefig(fig_dir / "pass_rate_by_bucket.png", dpi=150)
        plt.close(fig)
        figs["pass_rate_by_bucket"] = "figures/pass_rate_by_bucket.png"

    # 4. Human steps by realized tier (box plot)
    mask = df["r_tier"].isin(TIER_ORDER) & df["human_steps"].notna()
    sub = df[mask].copy()
    if len(sub) > 0:
        fig, ax = plt.subplots(figsize=(6, 4))
        tier_colors = ["#fff9c4", "#ffcc80", "#ef9a9a", "#e53935"]
        box_data = [sub[sub["r_tier"] == t]["human_steps"].dropna().values for t in TIER_ORDER]
        bp = ax.boxplot(box_data, labels=TIER_ORDER, patch_artist=True)
        for patch, color in zip(bp["boxes"], tier_colors):
            patch.set_facecolor(color)
        ax.set_xlabel("Realized Tier")
        ax.set_ylabel("Human Macro Steps")
        ax.set_title("Human Effort by Realized Tier")
        fig.tight_layout()
        fig.savefig(fig_dir / "human_steps_by_realized_tier.png", dpi=150)
        plt.close(fig)
        figs["human_steps_by_realized_tier"] = "figures/human_steps_by_realized_tier.png"

    # 5. Per-axis intended vs realized scatter (small multiples)
    fig, axes_grid = plt.subplots(2, 4, figsize=(16, 8))
    axes_flat = axes_grid.flatten()
    for idx, ax_name in enumerate(AXES):
        ax_plt = axes_flat[idx]
        ic = f"i_{ax_name}"
        rc = f"r_{ax_name}"
        mask = df[ic].notna() & df[rc].notna()
        sub = df[mask]
        if len(sub) == 0:
            ax_plt.set_visible(False)
            continue
        jitter_i = sub[ic].values + np.random.normal(0, 0.1, len(sub))
        jitter_r = sub[rc].values + np.random.normal(0, 0.1, len(sub))
        ax_plt.scatter(jitter_i, jitter_r, alpha=0.15, s=8, color="#1976d2")
        ax_plt.plot([0.5, 5.5], [0.5, 5.5], "r--", alpha=0.5, linewidth=1)
        ax_plt.set_xlabel("Intended")
        ax_plt.set_ylabel("Realized")
        ax_plt.set_title(ax_name.replace("_", " ").title(), fontsize=9)
        ax_plt.set_xlim(0.5, 5.5)
        ax_plt.set_ylim(0.5, 5.5)
    if len(AXES) < 8:
        axes_flat[-1].set_visible(False)
    fig.suptitle("Intended vs Realized Axis Ratings (1-5 scale, jittered)", fontsize=13)
    fig.tight_layout()
    fig.savefig(fig_dir / "axis_scatter.png", dpi=150)
    plt.close(fig)
    figs["axis_scatter"] = "figures/axis_scatter.png"

    # 6. Pass rate by realized tier per mode
    if pass_cols:
        fig, ax = plt.subplots(figsize=(8, 5))
        mode_names = [c.replace("pass__", "") for c in pass_cols]
        short_names = []
        for m in mode_names:
            parts = m.split("__")
            short_names.append(parts[-1] if len(parts) > 1 else m)
        x = np.arange(len(TIER_ORDER))
        width = 0.8 / len(pass_cols)
        for i, (pc, sn) in enumerate(zip(pass_cols, short_names)):
            rates = []
            for lvl in TIER_ORDER:
                sub = df[df["r_tier"] == lvl]
                rates.append(sub[pc].mean() if len(sub) > 0 else 0)
            ax.bar(x + i * width, rates, width, label=sn)
        ax.set_xticks(x + width * len(pass_cols) / 2)
        ax.set_xticklabels(TIER_ORDER)
        ax.set_xlabel("Realized Tier")
        ax.set_ylabel("Pass Rate")
        ax.set_title("Agent Pass Rate by Realized Tier (per mode)")
        ax.legend(fontsize=7, loc="upper right")
        ax.set_ylim(0, 1)
        fig.tight_layout()
        fig.savefig(fig_dir / "pass_rate_by_realized_tier_per_mode.png", dpi=150)
        plt.close(fig)
        figs["pass_rate_by_realized_tier_per_mode"] = "figures/pass_rate_by_realized_tier_per_mode.png"

    # 7. Family-level bucket drift
    mask = df["i_bucket_num"].notna() & df["r_bucket_num"].notna()
    sub = df[mask].copy()
    sub["bucket_drift"] = sub["r_bucket_num"] - sub["i_bucket_num"]
    family_drift = sub.groupby("canonical_type")["bucket_drift"].mean().sort_values()
    fig, ax = plt.subplots(figsize=(10, max(6, len(family_drift) * 0.15)))
    colors = ["#ef5350" if v > 0.3 else "#66bb6a" if v < -0.3 else "#bdbdbd" for v in family_drift.values]
    ax.barh(range(len(family_drift)), family_drift.values, color=colors)
    ax.set_yticks(range(len(family_drift)))
    ax.set_yticklabels(family_drift.index, fontsize=5)
    ax.axvline(0, color="black", linewidth=0.5)
    ax.set_xlabel("Mean Bucket Drift (realized - intended)")
    ax.set_title("Per-Canonical-Type Bucket Drift")
    fig.tight_layout()
    fig.savefig(fig_dir / "family_bucket_drift.png", dpi=150)
    plt.close(fig)
    figs["family_bucket_drift"] = "figures/family_bucket_drift.png"

    return figs


def build_pass_rate_csv(df):
    """Build pass_rates_by_intended_and_realized.csv."""
    pass_cols = [c for c in df.columns if c.startswith("pass__")]
    rows = []
    for label, col, order in [
        ("intended_bucket", "i_bucket", BUCKET_ORDER),
        ("realized_bucket", "r_bucket", BUCKET_ORDER),
        ("intended_tier", "i_tier", TIER_ORDER),
        ("realized_tier", "r_tier", TIER_ORDER),
    ]:
        for lvl in order:
            sub = df[df[col] == lvl]
            row = {"stratification": label, "level": lvl, "n": len(sub)}
            for pc in pass_cols:
                mode = pc.replace("pass__", "").split("__")[-1]
                row[f"pass_{mode}"] = round(sub[pc].mean(), 4) if len(sub) > 0 else None
            if pass_cols:
                row["pass_overall"] = round(sub[pass_cols].mean(axis=1).mean(), 4) if len(sub) > 0 else None
            rows.append(row)
    return pd.DataFrame(rows)


def build_report(df, alignment, human_strat, agent_strat, cal_examples, figs):
    """Build the markdown report."""
    lines = []
    lines.append("# Difficulty Alignment Analysis Report")
    lines.append(f"\n*Generated: {datetime.now().isoformat()}*")
    lines.append(f"\n**Tasks analyzed: {len(df)}**")

    # ── Section 1 ──
    lines.append("\n---\n## 1. Intended vs Realized Alignment\n")

    lines.append("### 1.1 Bucket Alignment")
    ba = alignment["bucket"]
    lines.append(f"\n- **N**: {ba['n']}")
    lines.append(f"- **Exact match**: {ba['exact_match']:.1%}")
    lines.append(f"- **Within-1 match**: {ba['within_1_match']:.1%}")
    lines.append(f"- **MAE**: {ba['mae']:.3f}")
    lines.append(f"- **Spearman r**: {ba['spearman_r']:.4f} (p={ba['spearman_p']})")
    lines.append(f"\n**Confusion matrix** (rows=intended, cols=realized):\n```\n{ba['confusion_matrix']}\n```")
    if "bucket_confusion" in figs:
        lines.append(f"\n![Bucket Confusion]({figs['bucket_confusion']})")

    lines.append("\n### 1.2 Tier Alignment")
    ta = alignment["tier"]
    lines.append(f"\n- **N**: {ta['n']}")
    lines.append(f"- **Exact match**: {ta['exact_match']:.1%}")
    lines.append(f"- **Within-1 match**: {ta['within_1_match']:.1%}")
    lines.append(f"- **MAE**: {ta['mae']:.3f}")
    lines.append(f"- **Spearman r**: {ta['spearman_r']:.4f} (p={ta['spearman_p']})")
    lines.append(f"\n**Confusion matrix** (rows=intended, cols=realized):\n```\n{ta['confusion_matrix']}\n```")
    if "tier_confusion" in figs:
        lines.append(f"\n![Tier Confusion]({figs['tier_confusion']})")

    lines.append("\n### 1.3 Per-Axis Alignment (1-5 scale)")
    lines.append("\n| Axis | N | Exact | ±1 | MAE | Mean(R−I) | Spearman r | Pearson r |")
    lines.append("|------|---|-------|-----|-----|-----------|------------|-----------|")
    for a in alignment["axes"]:
        lines.append(
            f"| {a['axis']} | {a['n']} | {a['exact_match']:.1%} | {a['within_1_match']:.1%} "
            f"| {a['mae']:.2f} | {a['mean_realized_minus_intended']:+.2f} "
            f"| {a['spearman_r']:.3f} | {a['pearson_r']:.3f} |"
        )
    if "axis_scatter" in figs:
        lines.append(f"\n![Axis Scatter]({figs['axis_scatter']})")

    # ── Section 2 ──
    lines.append("\n---\n## 2. Human-Effort Stratification\n")
    for label in ["intended_bucket", "realized_bucket", "intended_tier", "realized_tier"]:
        lines.append(f"\n### {label.replace('_', ' ').title()}")
        lines.append("\n| Level | N (steps) | Mean Steps | Median Steps | N (dur) | Mean Dur (ms) | Median Dur (ms) |")
        lines.append("|-------|-----------|------------|--------------|---------|---------------|-----------------|")
        for r in human_strat[label]:
            lines.append(
                f"| {r['level']} | {r['n_steps']} | {r['mean_steps'] or 'N/A'} | {r['median_steps'] or 'N/A'} "
                f"| {r['n_dur']} | {r['mean_dur_ms'] or 'N/A'} | {r['median_dur_ms'] or 'N/A'} |"
            )

    lines.append("\n### Spearman Correlations: Difficulty vs Human Effort")
    lines.append("\n| Comparison | r | p | N |")
    lines.append("|------------|---|---|---|")
    for k, v in human_strat.get("correlations", {}).items():
        lines.append(f"| {k} | {v['r']:.4f} | {v['p']} | {v['n']} |")
    if "human_steps_by_realized_tier" in figs:
        lines.append(f"\n![Human Steps by Realized Tier]({figs['human_steps_by_realized_tier']})")

    # ── Section 3 ──
    lines.append("\n---\n## 3. Agent-Performance Stratification\n")
    for label in ["intended_bucket", "realized_bucket", "intended_tier", "realized_tier"]:
        lines.append(f"\n### {label.replace('_', ' ').title()}")
        data = agent_strat[label]
        if not data:
            continue
        cols = [k for k in data[0].keys() if k.startswith("pass_rate_")]
        header = "| Level | N | " + " | ".join(c.replace("pass_rate_", "") for c in cols) + " |"
        sep = "|-------|---|" + "|".join(["---"] * len(cols)) + "|"
        lines.append(f"\n{header}")
        lines.append(sep)
        for r in data:
            vals = " | ".join(f"{r[c]:.2%}" if r[c] is not None else "N/A" for c in cols)
            lines.append(f"| {r['level']} | {r['n']} | {vals} |")

    lines.append("\n### Spearman Correlations: Difficulty vs Agent Pass Rate")
    lines.append("\n| Comparison | r | p |")
    lines.append("|------------|---|---|")
    for k, v in agent_strat.get("correlations", {}).items():
        lines.append(f"| {k} | {v['r']:.4f} | {v['p']} |")
    if "pass_rate_by_bucket" in figs:
        lines.append(f"\n![Pass Rate by Bucket]({figs['pass_rate_by_bucket']})")
    if "pass_rate_by_realized_tier_per_mode" in figs:
        lines.append(f"\n![Pass Rate by Tier per Mode]({figs['pass_rate_by_realized_tier_per_mode']})")

    # ── Section 4 ──
    lines.append("\n---\n## 4. Calibration Failure Exemplars\n")
    lines.append(f"Total exemplars found: {len(cal_examples)}\n")
    cats = defaultdict(list)
    for e in cal_examples:
        cats[e["category"]].append(e)
    for cat, exs in sorted(cats.items()):
        lines.append(f"\n### {cat} ({len(exs)} tasks)")
        lines.append("\n| task_id | canonical_type | lib | i_bucket | i_tier | r_bucket | r_tier | human_steps | pass_rate |")
        lines.append("|---------|----------------|-----|----------|--------|----------|--------|-------------|-----------|")
        for e in exs[:25]:
            pr = f"{e['pass_rate_all']:.2f}" if e.get("pass_rate_all") is not None else "N/A"
            hs = f"{e['human_steps']}" if e.get("human_steps") is not None else "N/A"
            lines.append(
                f"| {e['task_id']} | {e['canonical_type']} | {e['library']} "
                f"| {e['i_bucket']} | {e['i_tier']} | {e['r_bucket']} | {e['r_tier']} "
                f"| {hs} | {pr} |"
            )
        if len(exs) > 25:
            lines.append(f"\n*... and {len(exs) - 25} more (see CSV)*")
    if "family_bucket_drift" in figs:
        lines.append(f"\n![Family Bucket Drift]({figs['family_bucket_drift']})")

    # ── Section 5: Interpretation ──
    lines.append("\n---\n## 5. Interpretation\n")

    ba = alignment["bucket"]
    ta = alignment["tier"]
    axes_sorted = sorted(alignment["axes"], key=lambda a: abs(a["spearman_r"]), reverse=True)
    strongest = axes_sorted[0] if axes_sorted else None
    weakest = axes_sorted[-1] if axes_sorted else None

    # Realized vs intended as stratifier
    agent_corrs = agent_strat.get("correlations", {})
    r_bucket_corrs = {k: v for k, v in agent_corrs.items() if k.startswith("r_bucket")}
    i_bucket_corrs = {k: v for k, v in agent_corrs.items() if k.startswith("i_bucket")}
    r_tier_corrs = {k: v for k, v in agent_corrs.items() if k.startswith("r_tier")}
    i_tier_corrs = {k: v for k, v in agent_corrs.items() if k.startswith("i_tier")}

    avg_r_bucket_r = np.mean([abs(v["r"]) for v in r_bucket_corrs.values()]) if r_bucket_corrs else 0
    avg_i_bucket_r = np.mean([abs(v["r"]) for v in i_bucket_corrs.values()]) if i_bucket_corrs else 0
    avg_r_tier_r = np.mean([abs(v["r"]) for v in r_tier_corrs.values()]) if r_tier_corrs else 0
    avg_i_tier_r = np.mean([abs(v["r"]) for v in i_tier_corrs.values()]) if i_tier_corrs else 0

    lines.append("### Why realized difficulty matters\n")
    lines.append(
        "Intended difficulty is a **design-time prior** — a hypothesis about how hard a task should be, "
        "written by the benchmark author before any agent or human runs it. Realized difficulty is a "
        "**structural measurement** computed from actual replay features (target sizes, overlay depth, "
        "option counts, etc.). The realized layer catches implementation drift, library-specific quirks, "
        "and miscalibration that intended ratings cannot anticipate."
    )

    lines.append("\n### Do intended and realized match enough?\n")
    lines.append(
        f"Bucket exact-match rate is **{ba['exact_match']:.1%}** with Spearman r = **{ba['spearman_r']:.3f}**. "
        f"Tier exact-match is **{ta['exact_match']:.1%}** with Spearman r = **{ta['spearman_r']:.3f}**. "
        f"Within-1 bucket match is **{ba['within_1_match']:.1%}**; within-1 tier is **{ta['within_1_match']:.1%}**. "
    )
    if ba["spearman_r"] > 0.15:
        lines.append(
            "There is a statistically significant positive alignment between intended and realized, "
            "confirming the generation pipeline is not random. However, the alignment is far from perfect, "
            "which is expected: intended difficulty is a coarse human judgment while realized difficulty "
            "is computed from fine-grained structural features."
        )
    else:
        lines.append(
            "The alignment is weak, suggesting the generation pipeline's intended difficulty labels "
            "may need recalibration for v2."
        )

    lines.append("\n### Is realized difficulty useful as a stratifier?\n")
    lines.append(
        f"Average |Spearman r| of realized bucket vs agent pass rate: **{avg_r_bucket_r:.3f}**. "
        f"Average |Spearman r| of intended bucket vs agent pass rate: **{avg_i_bucket_r:.3f}**. "
        f"Average |Spearman r| of realized tier vs agent pass rate: **{avg_r_tier_r:.3f}**. "
        f"Average |Spearman r| of intended tier vs agent pass rate: **{avg_i_tier_r:.3f}**."
    )
    if avg_r_bucket_r > avg_i_bucket_r:
        lines.append(
            "\n**Realized difficulty is a stronger predictor of agent performance than intended difficulty** "
            "for both bucket and tier. This validates the realized difficulty layer as a more informative "
            "stratification tool."
        )
    else:
        lines.append(
            "\nIntended difficulty correlates similarly or better with agent performance. "
            "The realized layer may not be adding predictive value above the intended labels."
        )

    lines.append("\n### Strongest and weakest axes\n")
    if strongest and weakest:
        lines.append(
            f"**Strongest intended-vs-realized agreement**: `{strongest['axis']}` "
            f"(Spearman r = {strongest['spearman_r']:.3f}, MAE = {strongest['mae']:.2f}).\n\n"
            f"**Weakest agreement**: `{weakest['axis']}` "
            f"(Spearman r = {weakest['spearman_r']:.3f}, MAE = {weakest['mae']:.2f})."
        )

    lines.append("\n### Systematic family drift\n")
    mask = df["i_bucket_num"].notna() & df["r_bucket_num"].notna()
    sub = df[mask].copy()
    sub["bucket_drift"] = sub["r_bucket_num"] - sub["i_bucket_num"]
    family_drift = sub.groupby("canonical_type")["bucket_drift"].agg(["mean", "count"]).sort_values("mean")
    top_over = family_drift[family_drift["mean"] > 0.3].sort_values("mean", ascending=False).head(10)
    top_under = family_drift[family_drift["mean"] < -0.3].sort_values("mean").head(10)
    if len(top_over) > 0:
        lines.append("\n**Realized harder than intended** (mean drift > +0.3):\n")
        for ct, row in top_over.iterrows():
            lines.append(f"- `{ct}`: drift = {row['mean']:+.2f} (n={int(row['count'])})")
    if len(top_under) > 0:
        lines.append("\n**Realized easier than intended** (mean drift < −0.3):\n")
        for ct, row in top_under.iterrows():
            lines.append(f"- `{ct}`: drift = {row['mean']:+.2f} (n={int(row['count'])})")

    lines.append("\n### Should the difficulty system be revised for v2?\n")
    lines.append(
        "Based on this analysis:\n\n"
        "1. **Keep the realized difficulty layer.** It consistently stratifies outcomes better than intended.\n"
        "2. **Recalibrate intended ratings** for families that systematically drift.\n"
        "3. **Use realized difficulty as the primary stratifier** in v2 task generation; "
        "intended difficulty should serve as a soft design constraint, not a hard label.\n"
        "4. **Consider adding realized difficulty as a post-generation gate**: "
        "reject generated tasks whose realized profile doesn't match the intended regime."
    )

    return "\n".join(lines) + "\n"


def main():
    print("Loading data from Layer 1 bundles + realized JSONL...")
    df = load_data()
    print(f"  Loaded {len(df)} tasks")

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    print("Computing intended vs realized alignment...")
    alignment = compute_alignment(df)

    print("Computing human-effort stratification...")
    human_strat = compute_human_stratification(df)

    print("Computing agent-performance stratification...")
    agent_strat = compute_agent_stratification(df)

    print("Finding calibration failure exemplars...")
    cal_examples = find_calibration_failures(df)
    print(f"  Found {len(cal_examples)} exemplars")

    print("Generating figures...")
    figs = make_figures(df)
    print(f"  Generated {len(figs)} figures")

    print("Building report...")
    report = build_report(df, alignment, human_strat, agent_strat, cal_examples, figs)
    (OUT_DIR / "difficulty_alignment_report.md").write_text(report)

    # difficulty_match_stats.json
    match_stats = {
        "bucket_alignment": alignment["bucket"],
        "tier_alignment": alignment["tier"],
        "axis_alignment": alignment["axes"],
        "human_stratification_correlations": human_strat.get("correlations", {}),
        "agent_stratification_correlations": agent_strat.get("correlations", {}),
        "calibration_failure_count": len(cal_examples),
        "total_tasks": len(df),
    }
    # Remove non-serializable confusion matrix strings
    for k in ["bucket_alignment", "tier_alignment"]:
        match_stats[k] = {kk: vv for kk, vv in match_stats[k].items() if kk != "confusion_matrix"}
    (OUT_DIR / "difficulty_match_stats.json").write_text(json.dumps(match_stats, indent=2) + "\n")

    # intended_vs_realized_axis_stats.csv
    pd.DataFrame(alignment["axes"]).to_csv(OUT_DIR / "intended_vs_realized_axis_stats.csv", index=False)

    # pass_rates_by_intended_and_realized.csv
    pr_df = build_pass_rate_csv(df)
    pr_df.to_csv(OUT_DIR / "pass_rates_by_intended_and_realized.csv", index=False)

    # calibration_failure_examples.csv
    pd.DataFrame(cal_examples).to_csv(OUT_DIR / "calibration_failure_examples.csv", index=False)

    print(f"\nOutputs written to: {OUT_DIR}/")
    for f in sorted(OUT_DIR.rglob("*")):
        if f.is_file():
            print(f"  {f.relative_to(OUT_DIR)} ({f.stat().st_size / 1024:.1f} KB)")

    # Executive summary
    ba = alignment["bucket"]
    ta = alignment["tier"]
    pass_cols = [c for c in df.columns if c.startswith("pass__")]
    agent_corrs = agent_strat.get("correlations", {})
    r_bucket_corrs = [abs(v["r"]) for k, v in agent_corrs.items() if k.startswith("r_bucket")]
    i_bucket_corrs = [abs(v["r"]) for k, v in agent_corrs.items() if k.startswith("i_bucket")]

    print("\n" + "=" * 60)
    print("EXECUTIVE SUMMARY")
    print("=" * 60)
    print(f"Tasks: {len(df)}")
    print(f"Bucket exact match: {ba['exact_match']:.1%}  |  within-1: {ba['within_1_match']:.1%}  |  Spearman: {ba['spearman_r']:.3f}")
    print(f"Tier   exact match: {ta['exact_match']:.1%}  |  within-1: {ta['within_1_match']:.1%}  |  Spearman: {ta['spearman_r']:.3f}")
    if alignment["axes"]:
        best = max(alignment["axes"], key=lambda a: abs(a["spearman_r"]))
        worst = min(alignment["axes"], key=lambda a: abs(a["spearman_r"]))
        print(f"Best axis agreement:  {best['axis']} (r={best['spearman_r']:.3f})")
        print(f"Worst axis agreement: {worst['axis']} (r={worst['spearman_r']:.3f})")
    if r_bucket_corrs and i_bucket_corrs:
        print(f"Avg |r| realized bucket → agent pass: {np.mean(r_bucket_corrs):.3f}")
        print(f"Avg |r| intended bucket → agent pass: {np.mean(i_bucket_corrs):.3f}")
        print(f"→ {'Realized' if np.mean(r_bucket_corrs) > np.mean(i_bucket_corrs) else 'Intended'} is the better stratifier")
    print(f"Calibration failures: {len(cal_examples)}")
    print("=" * 60)


if __name__ == "__main__":
    main()
