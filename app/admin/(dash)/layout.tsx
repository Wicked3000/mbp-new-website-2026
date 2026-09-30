import { redirect } from "next/navigation";
import { requireSession } from "@server/auth";
import AdminShell from "@/admin/AdminLayout";

/**
 * Server-side admin gate.
 *
 * ## This replaces <RequireAuth> in src/App.tsx
 *
 * The old guard ran in the browser:
 *
 *   function RequireAuth({ children }) {
 *     if (!api.isAuthed()) return <Navigate to="/admin/login" replace />;
 *     return children;
 *   }
 *
 * That worked only because the token sat in localStorage, where any script
 * could read it. It also meant every admin page and its data reached the browser
 * before the redirect fired - the check happened after the bundle shipped.
 *
 * The token is an httpOnly cookie now, so JavaScript cannot make this check at
 * all. It happens here instead, on the server, before the page renders:
 *
 *   - no token             -> redirect to the login page
 *   - token but revoked    -> redirect to the login page
 *   - database unreachable -> redirect to the login page. `requireSession` fails
 *     closed with a 503 rather than trusting an unverified JWT.
 *
 * The `auth_version` re-read cannot move to `middleware.ts`, which has no
 * database access and runs on the Edge runtime where `jsonwebtoken` does not
 * work. The cost is one indexed SELECT per admin navigation - the same round
 * trip the Express middleware already made on every request.
 *
 * ## Why a route group
 *
 * This file is `app/admin/(dash)/layout.tsx`, so it guards everything under
 * `app/admin/(dash)/` while contributing nothing to the URL. The login page
 * sits outside it at `app/admin/login/page.tsx`, the only admin route reachable
 * without a session.
 */
export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await requireSession();
  if (!auth.ok) redirect("/admin/login");

  // The username is taken from the verified claims and handed to the shell as a
  // prop. The shell used to call `api.user()`, which read localStorage - that
  // would both break during the server render that Next performs for client
  // components and reintroduce the storage read this migration exists to remove.
  return (
    <AdminShell
      user={{
        id: auth.claims.id,
        username: auth.claims.username,
        email: auth.claims.email,
        role: auth.claims.role,
      }}
    >
      {children}
    </AdminShell>
  );
}
