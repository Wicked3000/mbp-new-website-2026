import { Link } from "react-router-dom";
import { useEntity } from "@/hooks/useDynamic";
import { NEWS, NOTICES } from "./fallbackData";
import Reveal from "@/components/Reveal";

export function NewsSection() {
  const { data: newsData } = useEntity("news", NEWS as any);
  const { data: noticeData } = useEntity("notices", NOTICES as any);
  const newsList = (newsData as any[]).filter((n: any) => n.is_published !== 0);
  const normNewsAll = newsList.map((n: any, idx: number) => ({
    id: n.id ?? idx + 1,
    tag: n.tag,
    date: n.news_date ?? n.date,
    title: n.title,
    excerpt: n.excerpt,
    img: n.img,
    color: n.tag_color ?? n.color,
    is_previous: (n as any).is_previous ?? 0,
  }));
  const normNews = normNewsAll.filter((n: any) => !n.is_previous);
  const noticeList = (noticeData as any[]).filter((n: any) => n.is_published !== 0);
  const normNotices = noticeList.map((n: any) => ({
    date: n.notice_date ?? n.date,
    title: n.title,
  }));
  return (
    <section className="bg-[#F8F6F1] py-14 sm:py-16 px-4" id="news">
      <Reveal className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="flex items-end justify-between mb-8 gap-4">
              <div>
                <span className="inline-flex items-center gap-2 text-[#0D9488] text-[11px] font-bold uppercase tracking-[0.14em]">
                  <span className="w-6 h-[2px] bg-[#0D9488] inline-block" /> Latest Updates
                </span>
                <h2
                  className="text-[30px] sm:text-3xl font-bold text-[#0B2545] mt-2 tracking-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  News & Announcements
                </h2>
              </div>
              <Link
                to="/news"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-[#0B2545] hover:text-[#0D9488] transition-colors border border-gray-200 hover:border-[#0D9488]/30 bg-white px-4 py-2 rounded-full"
              >
                View All <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {normNews[0] && (
                <Link
                  to={`/news/${normNews[0].id}`}
                  className="sm:col-span-2 bg-white rounded-[18px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col sm:flex-row"
                >
                  <div className="relative sm:w-[52%] h-56 sm:h-auto bg-[#0B2545] overflow-hidden shrink-0">
                    <img
                      src={normNews[0].img}
                      alt={normNews[0].title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                    />
                    <span
                      className={`${normNews[0].color} absolute top-3 left-3 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm`}
                    >
                      {normNews[0].tag}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-gray-400 text-xs font-medium">
                      {normNews[0].date} • 2 min read
                    </span>
                    <h3
                      className="text-xl font-bold text-[#0B2545] mt-2 mb-2 leading-snug group-hover:text-[#0D9488] transition-colors"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {normNews[0].title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {normNews[0].excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-[#C9A84C] group-hover:text-[#0B2545] transition-colors">
                      Read More{" "}
                      <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </span>
                  </div>
                </Link>
              )}

              {normNews.slice(1).map((n: any) => (
                <Link
                  key={n.title + n.id}
                  to={`/news/${n.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="relative h-40 bg-[#0B2545] overflow-hidden">
                    <img
                      src={n.img}
                      alt={n.title}
                      className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
                    />
                    <span
                      className={`absolute top-2.5 left-2.5 ${
                        n.color.includes("text") ? n.color : n.color + " text-white"
                      } text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm`}
                    >
                      {n.tag}
                    </span>
                  </div>
                  <div className="p-4">
                    <span className="text-gray-400 text-xs">{n.date}</span>
                    <h3
                      className="text-[15px] font-bold text-[#0B2545] mt-1 mb-1.5 leading-snug group-hover:text-[#0D9488] transition-colors line-clamp-2"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {n.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                      {n.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-[0.14em]">
                  Updates
                </span>
                <h2
                  className="text-[30px] font-bold text-[#0B2545] tracking-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Notice Board
                </h2>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {normNotices.map((n: any, i: number) => (
                <Link
                  key={n.title + i}
                  to="/notices"
                  className={`flex gap-4 px-5 py-4 hover:bg-[#F8F6F1] transition-colors group ${
                    i < normNotices.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="shrink-0">
                    <div className="bg-[#0B2545] group-hover:bg-[#0D9488] text-white text-[11px] font-bold px-2.5 py-2 rounded-lg w-[58px] text-center leading-tight transition-colors">
                      {n.date}
                    </div>
                  </div>
                  <p className="text-[13.5px] text-gray-700 leading-snug group-hover:text-[#0B2545] transition-colors font-medium line-clamp-2">
                    {n.title}
                  </p>
                </Link>
              ))}
              <div className="px-5 py-3.5 bg-[#F8F6F1] border-t border-gray-100 flex items-center justify-between">
                <Link
                  to="/notices"
                  className="text-sm font-bold text-[#0D9488] hover:text-[#0B2545] transition-colors"
                >
                  View All Notices →
                </Link>
                <span className="text-xs text-gray-400">{normNotices.length} notices</span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
