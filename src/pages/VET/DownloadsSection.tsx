import { Link } from "react-router-dom";
import { useEntity } from "@/hooks/useDynamic";

export function DownloadsSection() {
  const DOWNLOADS_FALLBACK = [
    { name: "VET Prospectus 2026", type: "PDF", size_text: "4.5 MB", category: "Guide" },
    { name: "Course Information Sheets (All Trades)", type: "PDF", size_text: "8.2 MB", category: "Curriculum" },
    { name: "Enrolment Application Form", type: "PDF", size_text: "650 KB", category: "Forms" },
    { name: "Apprenticeship Guidelines for Employers", type: "PDF", size_text: "2.1 MB", category: "Guidelines" },
    { name: "RPL Application & Evidence Guide", type: "PDF", size_text: "1.8 MB", category: "Assessment" },
    { name: "Centre Facility Standards", type: "PDF", size_text: "3.4 MB", category: "Standards" },
    { name: "Trainer Qualification Requirements", type: "PDF", size_text: "920 KB", category: "HR" },
    { name: "Graduate Tracer Study 2024", type: "PDF", size_text: "2.7 MB", category: "Reports" },
  ];
  const { data: downloads } = useEntity("downloads", []);
  const scoped = downloads.filter((d: any) => d.program === "vet");
  const docs = scoped.length ? scoped : DOWNLOADS_FALLBACK;
  const { data: headings } = useEntity("vet_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "downloads") || {
      eyebrow: "Resources",
      heading: "Documents & Downloads",
    };

  return (
    <section className="py-16 px-4 bg-[#F8F6F1]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
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
            className="text-teal-600 hover:text-teal-800 font-semibold text-sm flex items-center gap-1"
          >
            Request Documents →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {docs.map((doc: any) => (
            <Link
              key={doc.name}
              to="/downloads"
              className="bg-white rounded-xl p-5 border border-gray-100 hover:border-teal-300 hover:shadow-lg transition-all flex items-start gap-4"
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                  doc.type === "PDF" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                }`}
              >
                <span className="text-xl">{doc.type === "PDF" ? "📄" : "📝"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-600">
                  {doc.category}
                </span>
                <h3 className="text-[#0B2545] font-semibold text-sm mt-1 truncate">{doc.name}</h3>
                <div className="text-gray-500 text-xs mt-1">{doc.size_text}</div>
              </div>
              <span className="text-teal-500 shrink-0">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
