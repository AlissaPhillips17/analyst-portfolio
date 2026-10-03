"""Illustrative fixed-horizon A/B analysis on synthetic aggregate data."""
import csv
import math
from pathlib import Path


def summarize(path):
    with open(path, newline="", encoding="utf-8") as source:
        rows = {r["variant"]: r for r in csv.DictReader(source)}
    if set(rows) != {"control", "variant"}:
        raise ValueError("Expected exactly control and variant")
    values = {}
    for name, row in rows.items():
        n, x, revenue = int(row["visitors"]), int(row["converted_visitors"]), float(row["revenue_usd"])
        if n <= 0 or not 0 <= x <= n or revenue < 0:
            raise ValueError(f"Invalid aggregate for {name}")
        values[name] = {"n": n, "x": x, "rate": x / n, "rpv": revenue / n}
    c, v = values["control"], values["variant"]
    delta = v["rate"] - c["rate"]
    se = math.sqrt(v["rate"] * (1 - v["rate"]) / v["n"] + c["rate"] * (1 - c["rate"]) / c["n"])
    return values, delta, (delta - 1.96 * se, delta + 1.96 * se)


if __name__ == "__main__":
    values, delta, interval = summarize(Path(__file__).with_name("data.csv"))
    c, v = values["control"], values["variant"]
    print("SYNTHETIC EXPERIMENT DECISION MEMO")
    print(f"Sample: control {c['n']:,}; variant {v['n']:,} visitors")
    print(f"Conversion: {c['rate']:.2%} vs {v['rate']:.2%}")
    print(f"Absolute lift: {delta:+.2%}; approximate 95% CI [{interval[0]:+.2%}, {interval[1]:+.2%}]")
    print(f"Revenue per visitor: ${c['rpv']:.2f} vs ${v['rpv']:.2f} (point estimates)")
    print("Next decision: validate assignment balance, event/order reconciliation, refund lag, and guardrail uncertainty before rollout.")
