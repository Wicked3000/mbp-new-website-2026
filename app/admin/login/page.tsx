import Login from "@/admin/pages/Login";

/**
 * /admin/login
 *
 * The only admin route outside the (dash) group, and so the only one reachable
 * without a session. It is not wrapped by the auth gate in
 * app/admin/(dash)/layout.tsx, which is the entire reason it lives there -
 * src/admin/__tests__/adminRoutes.test.ts asserts the login page is not inside
 * that group, because a login page behind its own guard builds cleanly and is
 * only discoverable by trying to sign in.
 */
export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return <Login />;
}
