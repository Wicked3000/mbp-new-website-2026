import NewsDetail from "@/views/NewsDetail";

/**
 * /news/:id - dynamic segment.
 *
 * App Router hands the segment to the page as an async `params` prop; there is
 * no `useParams` hook. The id is forwarded to the component as a plain prop
 * rather than read from a router context, which is what lets the component stay
 * a client component without knowing anything about routing.
 *
 * The page itself is a Server Component - no "use client" - while the component
 * it renders is a Client Component. That boundary is the point: the route
 * resolves on the server and only the interactive part ships to the browser.
 */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <NewsDetail id={id} />;
}
