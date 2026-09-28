import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function NotFoundPage() {
  return (
    <div
      className="min-h-screen bg-[#F8F6F1]"
      style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}
    >
      <SiteHeader />
      <main id="main-content" className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div
          className="text-7xl font-bold text-[#C9A84C]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          404
        </div>
        <h1
          className="text-3xl font-bold text-[#0B2545] mt-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Page not found
        </h1>
        <p className="text-gray-500 mt-3 mb-7">
          The page you requested is unavailable or has moved.
        </p>
        <Link
          to="/"
          className="inline-flex bg-[#0B2545] text-white font-bold px-6 py-3 rounded-full"
        >
          Return Home
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
