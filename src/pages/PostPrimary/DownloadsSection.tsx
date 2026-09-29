import { Link } from "react-router-dom";
import { useEntity } from "@/hooks/useDynamic";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

export function DownloadsSection() {
  const DOWNLOADS_FALLBACK = [
    { name: "2026 Grade 9 Selection List", type: "PDF", size_text: "2.4 MB", category: "Selection Lists" },
    { name: "2026 Grade 11 Selection List", type: "PDF", size_text: "3.1 MB", category: "Selection Lists" },
    { name: "Post Primary Handbook 2026", type: "PDF", size_text: "3.1 MB", category: "Policy" },
    { name: "Grade 10 & 12 Exam Specifications", type: "PDF", size_text: "4.2 MB", category: "Assessment" },
    { name: "Stream Selection Guidelines", type: "PDF", size_text: "1.8 MB", category: "Guidance" },
    { name: "Secondary Curriculum: Grades 9–12", type: "PDF", size_text: "22.4 MB", category: "Curriculum" },
    { name: "School Learning Improvement Plan Template", type: "DOCX", size_text: "920 KB", category: "Planning" },
    { name: "Career Guidance Resource Kit", type: "PDF", size_text: "5.6 MB", category: "Guidance" },
    { name: "Boarding School Standards", type: "PDF", size_text: "2.7 MB", category: "Infrastructure" },
    { name: "Teacher Subject Panel Minutes 2025", type: "PDF", size_text: "1.4 MB", category: "Professional Dev" },
  ];
  const { data: downloads } = useEntity("downloads", []);
  // The downloads table is shared with /downloads and /basic; this section shows
  // only the documents scoped to Post Primary.
  const scoped = downloads.filter((d: any) => d.program === "post");
  const docs = scoped.length ? scoped : DOWNLOADS_FALLBACK;
  const { data: headings } = useEntity("post_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "downloads") || {
      eyebrow: "Resources",
      heading: "Documents & Downloads",
    };

  return (
    <section className="py-16 px-4 bg-[#F8F6F1]">
      <Reveal className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
              {heading.eyebrow}
            </span>
            <h2
              className="text-4xl font-bold text-[#0B2545] mt-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {heading.heading}
            </h2>
          </div>
          <Link
            to="/contact"
            className="text-amber-600 hover:text-amber-800 font-semibold text-sm flex items-center gap-1"
          >
            Request Documents →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {docs.map((doc: any) => (
            <Link
              key={doc.name}
              to="/downloads"
              className="bg-white rounded-xl p-5 border border-gray-100 hover:border-amber-300 hover:shadow-lg transition-all flex items-start gap-4"
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                  doc.type === "PDF" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                }`}
              >
                <Icon name={doc.type === "PDF" ? "file-text" : "pencil-line"} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                  {doc.category}
                </span>
                <h3 className="text-[#0B2545] font-semibold text-sm mt-1 truncate">{doc.name}</h3>
                <div className="text-gray-500 text-xs mt-1">{doc.size_text}</div>
              </div>
              <span className="text-amber-500 shrink-0">→</span>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
