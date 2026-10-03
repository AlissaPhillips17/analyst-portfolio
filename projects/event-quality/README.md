# Event quality and metric contract

**Scenario (synthetic):** ecommerce stakeholders see a difference between analytics purchase events and completed orders. Before reporting conversion, establish the grain, metric definition, and a reconciliation rule.

## Contract

| Field | Grain / definition | Quality rule |
| --- | --- | --- |
| `event_id` | Unique client event | Non-null, unique after deduplication |
| `anonymous_id` | Browser/device identifier | Non-null for events used in session metrics |
| `session_id` | One visit, scoped to the anonymous identifier | Non-null for funnel events |
| `event_name` | `page_view`, `add_to_cart`, or `purchase` | From allowed set |
| `event_ts_utc` | Event time in UTC | Within 24 hours of ingestion; investigate late arrivals separately |
| `order_id` | Order reference on purchase event | Required only on purchase |
| `order_status` | Server-side source of truth | Count `completed` orders only |

**Conversion rate:** distinct sessions with at least one completed order divided by distinct eligible sessions. Count a completed order once, even if a purchase event fires twice. Join on order ID and investigate purchase events with no matching completed order. Server orders and client events answer different questions, so the reconciliation report includes both counts and unmatched records.

## Workflow

1. Confirm whether session ID is stable across devices and whether orders can span sessions.
2. Check event uniqueness, missing keys, timestamp lag, and event-order consistency.
3. Reconcile client purchase events to the completed-order table using [`reconciliation.sql`](reconciliation.sql).
4. Segment discrepancies by date, platform, deployment, and consent state before calling a trend real.
5. Publish the metric only after owners agree on exclusions, late-arrival window, and remediation thresholds.

**Tradeoff:** orders without a tracked session remain in revenue reporting but do not enter the session conversion numerator. This avoids quietly assigning an order to the wrong session. A production model would require a documented attribution policy and consent review.

SQL uses broadly portable syntax; adapt timestamp and casting expressions to Snowflake, Databricks, or the warehouse in use.
