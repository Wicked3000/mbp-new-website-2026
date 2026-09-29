import Reveal from "@/components/Reveal";
export function ProcessSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <Reveal className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest">
            Selection Process
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            How Selections Work
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Exam Results",
              desc: "Grade 8 & 10 results released by Measurement Services Division (MSD). Students receive certificates with scores.",
            },
            {
              step: "02",
              title: "Online Selection",
              desc: "National Online Selection System (NOSS) opens. Students log in with credentials and rank school preferences (max 5).",
            },
            {
              step: "03",
              title: "Automated Matching",
              desc: "Algorithm matches students to schools based on: exam score (primary), preferences (ordered), school capacity, district quotas.",
            },
            {
              step: "04",
              title: "Lists Published",
              desc: "Provincial Education Advisor approves lists. Published on Dept website, at schools, and district offices. SMS notifications sent.",
            },
          ].map((s) => (
            <div key={s.step} className="bg-[#F8F6F1] rounded-xl p-6 border border-gray-100">
              <div
                className="w-14 h-14 rounded-full bg-[#C9A84C]/10 flex items-center justify-center mb-4 text-2xl font-bold text-[#C9A84C]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {s.step}
              </div>
              <h3
                className="text-lg font-bold text-[#0B2545] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {s.title}
              </h3>
              <p className="text-gray-600 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <h3
            className="text-xl font-bold text-[#0B2545] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Important Dates 2026
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            {[
              { label: "Grade 8/10 Results Released", date: "Dec 2025" },
              { label: "NOSS Opens for Choices", date: "Early Jan 2026" },
              { label: "Selection Processing", date: "Mid Jan 2026" },
              { label: "Lists Published", date: "Late Jan 2026" },
            ].map((d) => (
              <div key={d.label} className="bg-white rounded-lg p-4 border border-blue-100">
                <div className="text-sm text-blue-600 font-medium">{d.date}</div>
                <div className="text-gray-700">{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
