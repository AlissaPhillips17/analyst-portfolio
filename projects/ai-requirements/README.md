# AI-assisted analytics requirements: specification and quality gate

**Scenario (synthetic):** a product owner asks for measurement of a new checkout CTA. An assistant drafts a structured event requirement; the analyst and engineering owner review it before implementation. This is a representative design, not a copy of an employer tool.

## Flow

Request → draft structured JSON → validate required fields → analyst checks KPI and identity definitions → engineer checks feasibility → QA validates emitted payload → approve and version the contract.

[`example_request.json`](example_request.json) is a sample accepted draft. [`validate.py`](validate.py) rejects missing or inconsistent specifications. Run with `python3 validate.py example_request.json`; it prints errors and exits nonzero for an invalid spec.

| Risk | Control |
| --- | --- |
| Invented KPI or ambiguous denominator | Explicit metric numerator, denominator, grain, and owner; human sign-off |
| Missing event properties | Required property list plus example payload |
| Invalid event naming | Deterministic snake_case rule |
| Personal data in payload | Review prohibited fields and consent before launch; no customer data in this repo |
| Plausible but wrong AI draft | Keep source request, validation errors, review notes, and approval record |

**Next iteration:** evaluate a model on a labeled set of requests with missing context, conflicting KPI definitions, and adversarial prompts. Report field-level precision/recall, unsupported assumptions, reviewer correction rate, and time to approved spec. Do not claim performance until measured.
