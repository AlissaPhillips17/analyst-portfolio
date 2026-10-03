-- Synthetic example. Expected source tables: events, orders.
-- events(event_id, anonymous_id, session_id, event_name, event_ts_utc, order_id)
-- orders(order_id, order_status, order_ts_utc, revenue_usd)
WITH event_counts AS (
  SELECT event_id, COUNT(*) AS copies
  FROM events
  GROUP BY event_id
),
valid_events AS (
  SELECT e.*
  FROM events e
  JOIN event_counts c ON e.event_id = c.event_id
  WHERE c.copies = 1
    AND e.anonymous_id IS NOT NULL
    AND e.session_id IS NOT NULL
),
eligible_sessions AS (
  SELECT DISTINCT anonymous_id, session_id
  FROM valid_events
  WHERE event_name = 'page_view'
),
purchase_links AS (
  SELECT DISTINCT anonymous_id, session_id, order_id
  FROM valid_events
  WHERE event_name = 'purchase' AND order_id IS NOT NULL
),
completed_orders AS (
  SELECT order_id, revenue_usd
  FROM orders
  WHERE order_status = 'completed'
),
matched AS (
  SELECT p.anonymous_id, p.session_id, p.order_id, o.revenue_usd
  FROM purchase_links p
  JOIN completed_orders o ON p.order_id = o.order_id
  JOIN eligible_sessions s
    ON p.anonymous_id = s.anonymous_id AND p.session_id = s.session_id
),
converted_sessions AS (
  SELECT DISTINCT anonymous_id, session_id FROM matched
)
SELECT
  (SELECT COUNT(*) FROM eligible_sessions) AS eligible_sessions,
  (SELECT COUNT(*) FROM converted_sessions) AS converted_sessions,
  (SELECT COUNT(*) FROM completed_orders) AS completed_orders,
  (SELECT COUNT(*) FROM purchase_links) AS tracked_purchase_links,
  (SELECT COUNT(*) FROM purchase_links p LEFT JOIN completed_orders o
     ON p.order_id = o.order_id WHERE o.order_id IS NULL) AS unmatched_purchase_links,
  1.0 * (SELECT COUNT(*) FROM converted_sessions)
    / NULLIF((SELECT COUNT(*) FROM eligible_sessions), 0) AS session_conversion_rate;
-- Follow-up: report duplicate event IDs and unmatched orders separately.
-- This example excludes duplicated IDs entirely; production deduplication needs a stable arrival-order field.
