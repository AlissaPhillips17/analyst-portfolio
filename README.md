# Alissa Phillips | Digital analytics, experimentation & AI-ready data

I turn customer behavior and business questions into reliable measurement, test decisions, and clear technical requirements. My work spans digital analytics, personalization, data quality, and cross-functional delivery at NBCUniversal, Universal Destinations & Experiences, Chipotle, and Subway.

**What I work on:** analytics implementation and QA · SQL and metric definitions · A/B testing · audience and identity design · AI-assisted analytics workflows

[LinkedIn](https://www.linkedin.com/in/alissap17/) · Contact: use LinkedIn

## Selected portfolio work

| Project | Business question | What to inspect | Relevant roles |
| --- | --- | --- | --- |
| [Event quality and metric contract](projects/event-quality/) | Can we trust conversion reporting across web events and orders? | Reconciliation SQL, event contract, QA gates | EY analytics / data transformation; NBC AI data foundations |
| [Experiment decision notebook](projects/experimentation/) | Did a new experience improve conversion without harming revenue per visitor? | Reproducible Python analysis, assumptions, decision memo | EY advisory; NBC product and growth analytics |
| [AI requirements specification](projects/ai-requirements/) | How can an assistant turn requests into reviewable analytics requirements? | Schema, deterministic validator, evaluation examples, human review path | NBC AI; EY AI adoption and governance |

The examples use **synthetic data**. They demonstrate how I approach problems; they are not employer deliverables or claims about a particular company's internal architecture. I distinguish analytics decisions from statistical evidence and include failure cases and review criteria.

## Professional context

- At Universal Destinations & Experiences, I manage experimentation and personalization strategy, QA, and stakeholder requirements across ecommerce experiences.
- At Chipotle, I used SQL and digital analytics to investigate data gaps, validate transactions, and inform optimization.
- At NBCUniversal, I worked across large-scale digital properties on implementation, tagging, stakeholder translation, and analytics process improvement, including AI-assisted workflows.
- At Subway, I led BI analysis and reporting across restaurant and digital performance.

## Run locally

Python 3.10+ is sufficient; no packages, API keys, or account access are required.

```bash
python3 projects/experimentation/analyze.py
python3 projects/ai-requirements/validate.py projects/ai-requirements/example_request.json
python3 -m unittest discover -s tests -v
```

## A note on AI

The requirements example does not call a language model. It defines the structure and quality gate around one: a model can draft a specification, while a deterministic validator checks required fields and a human approves definitions before implementation. This separation helps make AI output reviewable.
