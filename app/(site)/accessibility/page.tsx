import Accessibility from "@/views/Accessibility";

/**
 * /accessibility
 *
 * A Server Component rendering the existing client component from src/. The
 * components stay in src/ rather than moving under app/ so that the ~45 files
 * they share (SiteHeader, Reveal, Icon, the page sections) are not rewritten as
 * a side effect of the routing change.
 */
export default function Page() {
  return <Accessibility />;
}
