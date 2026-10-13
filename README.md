# Alissa Phillips
### Digital analytics · Experimentation · MarTech

I work across analytics, product, and marketing technology. My work includes figuring out why a report doesn't match the underlying data, making sure an experiment is ready to launch, and turning a stakeholder request into something a team can build and measure.

My background spans Universal Destinations & Experiences, Chipotle, NBCUniversal, and Subway. I've worked on ecommerce experiences, streaming and entertainment platforms, customer journeys, and restaurant performance.

[Explore my portfolio](https://alissaphillips17.github.io/analyst-portfolio/arcade/lab.html) · [Play Ali’s Analytics Rush](https://alissaphillips17.github.io/analyst-portfolio/arcade/) · [LinkedIn](https://www.linkedin.com/in/alissap17/)

## What I bring to the work

- **Experimentation and personalization:** test strategy, audience targeting, requirements, acceptance criteria, pre-launch QA, and coordination across ecommerce, development, analytics, and agency teams.
- **Measurement and troubleshooting:** SQL validation, event instrumentation, tagging, attribution, and investigating discrepancies between digital analytics and transactional data.
- **Reporting and business intelligence:** dashboards, performance analysis, and explaining findings in a way that helps people decide what to do next.
- **AI-assisted workflows:** structured prompts, documentation, and review processes for analytics and requirements work.

## Experience

**Universal Destinations & Experiences — Senior MarTech Personalization Strategist (contract)**  
Experimentation and personalization across Universal Orlando Resort and Universal Studios Hollywood ecommerce properties. My work includes Adobe Target setup, test strategy, backlog prioritization, and QA of CTAs, redirects, and cart behavior.

**Chipotle — Senior Digital Analyst**  
Validated transactional data with SQL in Snowflake and Databricks, investigated tagging and attribution issues, and used Adobe Analytics, Customer Journey Analytics, and Adobe Journey Optimizer to support reporting and personalization.

**NBCUniversal — Senior Digital Strategic Analyst**  
Analytics implementation and measurement across Peacock, Fandango, Fandango at Home, and Rotten Tomatoes. I worked with Adobe Launch, mParticle, Adobe Target, and engineering teams, managed one direct report, and documented troubleshooting workflows.

**Subway — Lead Business Intelligence Analyst**  
SQL analysis, Adobe Analytics and Tableau dashboards, digital measurement, marketing performance, and restaurant sales analysis.

## Explore the projects

These are public demonstrations built with synthetic data. They show how I approach a problem; they are separate from my employer work.

| Project | What it explores |
| --- | --- |
| [Event quality & metric contracts](projects/event-quality/) | Reconciling events and orders, defining what a metric counts, and investigating duplicate tracking. |
| [Experiment decision analysis](projects/experimentation/) | Conversion lift, uncertainty, business guardrails, and rollout decisions. |
| [AI-assisted requirements](projects/ai-requirements/) | Structured drafts, required fields, validation, and human review before implementation. |
| [Ali’s Analytics Rush](arcade/) | A playable take on the stakeholder queue: repair dashboards, fix pages, and ship features. |

The [portfolio website](https://alissaphillips17.github.io/analyst-portfolio/arcade/lab.html) includes hands-on versions of the measurement, experiment, and requirements exercises.

## Tools I work with

SQL · Adobe Analytics · Adobe Target · Adobe Launch · CJA · AJO · mParticle · Tableau · Power BI · Alteryx · Snowflake · Databricks · AWS / Redshift · Jira · WorkFront · HTML / CSS / JavaScript

## Run the examples

Python 3.10+; no extra packages or API keys are required.

```bash
python3 projects/experimentation/analyze.py
python3 projects/ai-requirements/validate.py projects/ai-requirements/example_request.json
python3 -m unittest discover -s tests -v
```

The AI requirements demo uses deterministic validation and a simulated draft. It does not call a live language model.
