"""Deterministic checks around a proposed AI-generated analytics contract."""
import json
import re
import sys
from pathlib import Path


def validate(spec):
    errors = []
    for field in ("source_request", "event_name", "trigger", "identity_key", "owner"):
        if not isinstance(spec.get(field), str) or not spec[field].strip():
            errors.append(f"{field}: required nonempty text")
    name = spec.get("event_name", "")
    if isinstance(name, str) and not re.fullmatch(r"[a-z][a-z0-9]*(?:_[a-z0-9]+)*", name):
        errors.append("event_name: use lower_snake_case")
    metric = spec.get("primary_metric")
    for field in ("name", "numerator", "denominator", "grain"):
        if not isinstance(metric, dict) or not isinstance(metric.get(field), str) or not metric[field].strip():
            errors.append(f"primary_metric.{field}: required nonempty text")
    required = spec.get("required_properties")
    if not isinstance(required, list) or not required or any(not isinstance(x, str) or not x for x in required):
        errors.append("required_properties: expected nonempty list of property names")
        required = []
    if len(required) != len(set(required)):
        errors.append("required_properties: duplicate property")
    payload = spec.get("example_payload")
    if not isinstance(payload, dict):
        errors.append("example_payload: required object")
    else:
        for key in required:
            if key not in payload or payload[key] in (None, ""):
                errors.append(f"example_payload: missing {key}")
    questions = spec.get("open_questions")
    if not isinstance(questions, list):
        errors.append("open_questions: required list (may be empty)")
    return errors


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python3 validate.py path/to/spec.json")
    data = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    issues = validate(data)
    print("PASS: specification meets structural checks" if not issues else "FAIL:\n" + "\n".join(issues))
    raise SystemExit(bool(issues))
