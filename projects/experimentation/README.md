# Experiment decision analysis

**Scenario (synthetic):** a checkout experience is randomized by visitor. Decide whether the variant improved completed-order conversion, while monitoring revenue per visitor.

The script reads aggregate synthetic cohorts from `data.csv`, computes conversion rates, a two-sided normal-approximation interval for the absolute lift, and revenue per visitor. It prints a decision memo. The confidence interval is descriptive for this example; a launch decision also requires sample-ratio checks, instrumentation QA, guardrails, and a predetermined stopping rule. Aggregate revenue supports a point estimate only, not a revenue uncertainty interval.

```bash
python3 analyze.py
```

**Measurement design:** assignment unit = visitor; primary metric = visitors with at least one completed order / assigned visitors; guardrail = revenue per visitor; intended analysis = one read after the planned sample size. Avoid interpreting multiple interim looks as if they were a single fixed-horizon test. Investigate identity merging, cross-device behavior, and refund lag before production use.
