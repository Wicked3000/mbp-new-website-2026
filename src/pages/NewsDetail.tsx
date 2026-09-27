import { Link, useParams } from "react-router-dom";
import { useEntity } from "@/hooks/useDynamic";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const FALLBACK = [
  {
    id: 1,
    tag: "Announcement",
    tag_color: "bg-[#0D9488]",
    news_date: "September 18, 2026",
    title: "Grade 8 and Grade 10 Examination Timetable Released",
    excerpt:
      "The Division of Education has officially released the 2026 examination timetable for all Grade 8 and Grade 10 students across Milne Bay Province.",
    img: "/assets/education_programs/basic/banner.jpg",
  },
  {
    id: 2,
    tag: "Programs",
    tag_color: "bg-[#C9A84C] text-[#0B2545]",
    news_date: "September 10, 2026",
    title: "New VET Training Centres to Open in Alotau and Samarai",
    excerpt:
      "Two new Vocational Education and Training centres are set to open in Term 4, expanding skills-based learning opportunities for youth across the province.",
    img: "/assets/education_programs/vet/banner.jpg",
  },
  {
    id: 3,
    tag: "Notice",
    tag_color: "bg-[#0B2545]",
    news_date: "August 29, 2026",
    title: "School Subsidy Payment Schedule for Term 4 Now Available",
    excerpt:
      "Head teachers and school boards are advised to collect the Term 4 subsidy payment schedules from the Division office by 5 October 2026.",
    img: "/assets/slider/mbp-img1.jpg",
  },
];

export default function NewsDetail() {
  const { id } = useParams();
  const { data } = useEntity("news", FALLBACK as any);
  const list = (data as any[]).filter((n: any) => n.is_published !== 0);
  const item = list.find((n: any) => String(n.id) === String(id));
  const related = item ? list.filter((n: any) => String(n.id) !== String(item.id)).slice(0, 3) : [];

  if (!item)
    return (
      <div
        className="min-h-screen bg-[#F8F6F1] grid place-items-center px-4"
        style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}
      >
        <div className="text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12">
          <div
            className="text-5xl font-bold text-[#C9A84C]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            404
          </div>
          <div
            className="text-2xl font-bold text-[#0B2545] mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            News not found
          </div>
          <p className="text-gray-500 mt-2 mb-5">The article you are looking for is unavailable.</p>
          <Link
            to="/news"
            className="bg-[#0B2545] text-white font-bold px-6 py-3 rounded-full text-sm"
          >
            ← Back to News
          </Link>
        </div>
      </div>
    );

  return (
    <div
      className="min-h-screen bg-[#F8F6F1]"
      style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}
    >
      <SiteHeader />
      <div className="relative h-[360px] sm:h-[420px] overflow-hidden bg-[#0B2545]">
        <img decoding="async"
          src={item.img}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07192E] via-[#0B2545]/60 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-8">
          <div className="max-w-4xl mx-auto">
            <span
              className={`${item.tag_color || "bg-[#0D9488]"} text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full`}
            >
              {item.tag}
            </span>
            <h1
              className="text-3xl sm:text-4xl font-bold text-white mt-3 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {item.title}
            </h1>
            <div className="text-blue-100 text-sm mt-2">
              {item.news_date} • Division of Education, Milne Bay
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <p className="text-gray-600 leading-relaxed text-lg">{item.excerpt}</p>
          <div className="mt-6 prose prose-sm max-w-none text-gray-700 leading-relaxed">
            <p>
              The Milne Bay Province Division of Education is committed to keeping parents,
              students, and teachers informed. This announcement was published via the official
              Division channels and is managed through the admin dashboard (News tab). For full
              documents, forms, or timetables referenced above, please visit the Division office in
              Alotau or contact the helpdesk.
            </p>
            <p className="mt-4">
              For enquiries, contact{" "}
              <a href="tel:+6756411234" className="text-[#0D9488] font-bold">
                +675 641 1234
              </a>{" "}
              or{" "}
              <a href="mailto:info@mbpeducation.gov.pg" className="text-[#0D9488] font-bold">
                info@mbpeducation.gov.pg
              </a>
              . External education news (NDoE, TSC, UNICEF) is curated on the{" "}
              <Link to="/news" className="text-[#0D9488] font-bold">
                News - External tab
              </Link>
              .
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/news"
              className="bg-[#0B2545] text-white font-bold px-6 py-3 rounded-full text-sm"
            >
              ← View All News
            </Link>
            <Link
              to="/contact"
              className="bg-white border border-gray-200 text-[#0B2545] font-bold px-6 py-3 rounded-full text-sm"
            >
              Contact Division
            </Link>
            <button
              onClick={() =>
                navigator.share
                  ? navigator.share({
                      title: item.title,
                      url: window.location.href,
                    })
                  : navigator.clipboard.writeText(window.location.href)
              }
              className="bg-[#0D9488] text-white font-bold px-6 py-3 rounded-full text-sm"
            >
              Share
            </button>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-10">
            <h2
              className="text-xl font-bold text-[#0B2545] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              More News
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((n: any) => (
                <Link
                  key={n.id}
                  to={`/news/${n.id}`}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group"
                >
                  <img loading="lazy" decoding="async"
                    src={n.img}
                    alt={n.title}
                    className="h-36 w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="p-4">
                    <div className="text-xs text-gray-400">{n.news_date}</div>
                    <div className="font-bold text-[#0B2545] text-sm mt-1 line-clamp-2 group-hover:text-[#0D9488]">
                      {n.title}
                    </div>
                    <span className="text-xs font-bold text-[#C9A84C] mt-2 inline-block">
                      Read More →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}
