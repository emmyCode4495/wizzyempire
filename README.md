# Wizzy Empire — Admin dashboard files

Copy this folder into your project root (merge with existing paths).

## Env (.env.local)

```
ADMIN_EMAILS=you@example.com
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

- `ADMIN_EMAILS` — comma-separated emails allowed into `/admin`
- `SUPABASE_SERVICE_ROLE_KEY` — from Supabase → Settings → API (server only). Needed so product/category/order writes bypass RLS.

## Routes

- `/admin` — overview
- `/admin/products` — list / create / edit / delete
- `/admin/categories` — create / delete
- `/admin/orders` — list + status updates

## Note on proxy.ts

If you already have `proxy.ts`, only merge the protected path:

```ts
const protectedPaths = ["/account", "/checkout", "/admin"];
```

Do not overwrite your whole proxy if you customized it.
