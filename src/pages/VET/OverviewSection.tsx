import vetImg from "../../../assets/vet/vet-img.png";

export function OverviewSection() {
  return (
    <section id="overview" className="bg-[#F8F6F1] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
              Program Overview
            </span>
            <h2
              className="text-4xl font-bold text-[#0B2545] mt-2 mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Skills for Employment & Entrepreneurship
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-lg">
              The VET program provides competency-based skills training aligned with national
              qualifications. The Division coordinates 6 registered VET centres across the province,
              offering certificate and diploma programs in priority trade areas.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Training is open to Grade 10 and Grade 12 school leavers, out-of-school youth, and
              existing workers seeking formal recognition. Programs range from 6-month certificates
              to 2-year diplomas, with pathways to higher education and apprenticeships.
            </p>
            <div className="space-y-4">
              {[
                {
                  icon: "🔧",
                  title: "Competency-Based Training",
                  desc: "Industry-aligned qualifications (NC1–NC3) assessed against national competency standards",
                },
                {
                  icon: "🏭",
                  title: "Workplace Learning",
                  desc: "Structured workplace training & industry attachments mandatory for all programs",
                },
                {
                  icon: "📜",
                  title: "National Certification",
                  desc: "TVET Authority accredited; qualifications recognized nationally and regionally",
                },
                {
                  icon: "🚀",
                  title: "Pathways to Higher Study",
                  desc: "Credit articulation into technical colleges, universities, and apprenticeship schemes",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all"
                >
                  <div className="text-2xl shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="text-[#0B2545] font-bold mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
              <img src={vetImg} alt="Workshop training" className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3
                  className="text-xl font-bold text-[#0B2545] mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {[
                    "Free tuition for eligible students under Government subsidy",
                    "8 trade programs across 6 training centres",
                    "Industry partnerships with PNG LNG, Ok Tedi, local businesses",
                    "Recognition of Prior Learning (RPL) for experienced workers",
                    "Entrepreneurship & business skills embedded in all courses",
                    "Job placement support through provincial industry links",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <span className="text-amber-300 shrink-0">✓</span>
                      <span className="text-gray-700">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  value: "6",
                  label: "Training Centres",
                  color: "bg-[#0D9488]",
                },
                { value: "8", label: "Trade Programs", color: "bg-[#14B8A6]" },
                {
                  value: "1,200+",
                  label: "Annual Trainees",
                  color: "bg-teal-600",
                },
                {
                  value: "85%",
                  label: "Employment Rate",
                  color: "bg-teal-700",
                },
              ].map((s) => (
                <div key={s.label} className={`${s.color} rounded-xl p-5 text-white text-center`}>
                  <div
                    className="text-3xl font-bold"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-amber-100 text-sm uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
