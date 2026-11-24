# CODDZ — first phase
- [x] Arabic-first design system and language switching
- [x] Public landing page
- [x] Dashboard layout and overview
- [x] Orders filters, details, creation and status changes with sample data
- [x] Products listing and create/edit forms with sample data
- [x] Authentication, merchant profiles and tenant persistence — profiles confirmed
- [x] Browser verification and rule tests

# Schema synchronization
- [x] Confirm store wilaya and delivery-company owner-only access
- [x] Save signup store name and wilaya in the merchant trigger
- [x] Add and backfill order integration columns with external-order uniqueness
- [x] Regenerate types and verify the schema rules

# Full merchant dashboard schema
- [x] Extend `products` and `orders` with real columns, backfill, and auto-generated per-store order numbers
- [x] Add `order_items`, `order_events`, `stock_movements` (with shipped/returned stock triggers), `shipments`, `ad_spend`, `expenses`, `blacklist`, and `team_invites`
- [x] Apply role-based store RLS (`owner`, `manager`, `agent`, `stock_keeper`) via `private.*` helpers and fix security linter warnings
- [x] Enable Realtime (`REPLICA IDENTITY FULL`) on `orders`, `order_events`, `products`, `shipments`, and `stock_movements`
- [x] Add `get_dashboard_stats` function and regenerate Supabase TypeScript types
