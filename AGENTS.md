<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Application rules
- Keep brand, localization, sample catalog, and validation in shared browser-safe modules so dashboard surfaces use consistent values.
- `/` is the public marketing landing page; `/dashboard`, `/orders`, and `/products` share the responsive dashboard shell, and `/auth` + `/reset-password` handle Supabase Auth.
- Store-scoped tables enforce role-based RLS (`owner`, `manager`, `agent`, `stock_keeper`) via `private.*` security-definer helpers so every store member can read store data, owners/managers manage all store tables, agents update only order confirmation/status/notes and log `order_events`, and stock keepers manage `products` and `stock_movements`.
- Keep a single filtered `onAuthStateChange` listener in `src/routes/__root.tsx` and use the 4-step sign-out teardown (`cancelQueries`, `clear`, `signOut`, `navigate(..., { replace: true })`).
