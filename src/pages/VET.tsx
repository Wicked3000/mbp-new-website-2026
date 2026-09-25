import { Link, useLocation } from "react-router-dom";
import { useState, type Dispatch, type SetStateAction } from "react";
import vetImg from "../../assets/vet/vet-img.png";
import vetBanner from "../../assets/vet/vet-banner.png";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Basic Education", href: "/basic" },
  { label: "Post Primary", href: "/post" },
  { label: "VET", href: "/vet" },
  { label: "FODE", href: "/fode" },
  { label: "Contact", href: "/contact" },
];

function Header({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const location = useLocation();

  return (
    <>
      <div className="bg-[#0B2545] text-white text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex gap-6 items-center">
            <span className="flex items-center gap-1.5 opacity-80">
              <span>📞</span> +675 641 1234
            </span>
            <span className="flex items-center gap-1.5 opacity-80">
              <span>✉️</span> info@mbpeducation.gov.pg
            </span>
          </div>
          <div className="flex gap-4 items-center opacity-80">
            <span>Mon – Fri: 8:00am – 4:30pm</span>
            <span className="hidden sm:block">|</span>
            <Link to="/about" className="hover:text-[#C9A84C] transition-colors">
              NDoE Portal
            </Link>
            <Link to="/contact" className="hover:text-[#C9A84C] transition-colors">
              TSC Online
            </Link>
          </div>
        </div>
      </div>

      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo/mbp-logo-bg-removed.png"
              alt="Milne Bay Province Division of Education"
              className="w-12 h-12 shrink-0 object-contain"
            />
            <div className="leading-tight">
              <div
                className="text-[#0B2545] font-bold text-base"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Milne Bay Province
              </div>
              <div className="text-[#0D9488] text-xs font-semibold uppercase tracking-widest">
                Division of Education
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                  location.pathname === link.href
                    ? "text-[#0D9488] bg-gray-50"
                    : "text-gray-700 hover:text-[#0D9488] hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/#contact"
              className="hidden sm:inline-flex items-center gap-2 bg-[#0D9488] text-white text-sm font-semibold px-4 py-2 rounded hover:bg-[#0B9080] transition-colors"
            >
              Get Help
            </Link>
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-[#0B2545]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="block py-2 text-sm font-medium text-gray-700 border-b border-gray-50 hover:text-[#0D9488]"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

function PageHero() {
  return (
    <section className="relative h-[400px] sm:h-[480px] overflow-hidden bg-[#0D9488]">
      <img
        src={vetBanner}
        alt="VET training workshop"
        className="absolute inset-0 w-full h-full object-cover object-[50%_40%] opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545]/90 via-[#163663]/70 to-[#0D9488]/30" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-amber-300/20 border border-amber-300/40 text-amber-200 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 inline-block" />
            Program 03 - Vocational Education & Training
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Vocational Education
            <span className="block text-amber-300"> & Training (VET)</span>
          </h1>
          <p className="text-teal-100 text-lg leading-relaxed max-w-2xl">
            Skills and trades training for out-of-school youth and adults, delivered through
            registered VET providers across Milne Bay Province - building a skilled workforce for
            PNG's future.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="#overview"
              className="inline-flex items-center gap-2 bg-amber-300 hover:bg-amber-400 text-[#0B2545] font-semibold px-6 py-3 rounded transition-colors"
            >
              Overview
            </Link>
            <Link
              to="#centres"
              className="inline-flex items-center gap-2 border border-amber-300 text-amber-200 hover:bg-amber-300/10 hover:text-white font-semibold px-6 py-3 rounded transition-colors"
            >
              Find Centres
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function OverviewSection() {
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
              <img
                src={vetImg}
                alt="Workshop training"
                className="w-full h-64 object-cover"
              />
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

function ProgramsSection() {
  const PROGRAMS = [
    {
      code: "CPC10120",
      name: "Certificate I in Construction",
      duration: "6 months",
      level: "NC1",
      trades: "Carpentry, Masonry, Concreting",
      icon: "� - ️",
      color: "bg-amber-500",
    },
    {
      code: "MEM10119",
      name: "Certificate I in Engineering",
      duration: "6 months",
      level: "NC1",
      trades: "Welding, Fitting, Machining",
      icon: "⚙️",
      color: "bg-blue-500",
    },
    {
      code: "AUR10120",
      name: "Certificate I in Automotive",
      duration: "6 months",
      level: "NC1",
      trades: "Light Vehicle, Diesel, Electrical",
      icon: "� - ",
      color: "bg-red-500",
    },
    {
      code: "UEE10120",
      name: "Certificate I in Electrotechnology",
      duration: "6 months",
      level: "NC1",
      trades: "Electrical, Renewable Energy",
      icon: "⚡",
      color: "bg-yellow-500",
    },
    {
      code: "SIT10122",
      name: "Certificate I in Hospitality",
      duration: "6 months",
      level: "NC1",
      trades: "Cookery, Front Office, Housekeeping",
      icon: "🍳",
      color: "bg-pink-500",
    },
    {
      code: "AHC10116",
      name: "Certificate I in Agriculture",
      duration: "6 months",
      level: "NC1",
      trades: "Crop Production, Livestock, Machinery",
      icon: "🌱",
      color: "bg-green-500",
    },
    {
      code: "ICT10119",
      name: "Certificate I in ICT",
      duration: "6 months",
      level: "NC1",
      trades: "Computer Hardware, Networking, Support",
      icon: "💻",
      color: "bg-purple-500",
    },
    {
      code: "MST10119",
      name: "Certificate I in Maritime",
      duration: "8 months",
      level: "NC1",
      trades: "Deck Rating, Engine Rating, Safety",
      icon: "⚓",
      color: "bg-cyan-500",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
            Trade Programs
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Certificate Courses Offered
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-base leading-relaxed">
            All programs are TVET Authority accredited. Graduates receive National Certificates
            (NC1) with pathways to NC2/NC3 and diploma programs.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROGRAMS.map((p) => (
            <div
              key={p.code}
              className="bg-[#F8F6F1] rounded-xl p-6 border border-gray-100 hover:border-teal-300 hover:shadow-lg transition-all"
            >
              <div className={`${p.color} text-white rounded-lg p-2 inline-block mb-3`}>
                <span className="text-xl">{p.icon}</span>
              </div>
              <div
                className="text-[#0B2545] font-bold text-sm mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {p.name}
              </div>
              <div className="text-teal-600 text-xs font-semibold uppercase tracking-wider mb-2">
                {p.code} • {p.level}
              </div>
              <p className="text-gray-600 text-xs leading-relaxed mb-3">{p.trades}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Duration: {p.duration}</span>
                <Link to="/contact" className="text-teal-600 hover:text-teal-800 font-medium">
                  Enquire →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const VET_CENTRES = [
  "Kwato TVET",
  "Rabaraba TVET",
  "Sideia TVET",
  "Ubuya TVET",
  "Kaubwaga TVET",
  "Nabusa TVET",
  "Watuluma TVET",
  "Bolubolu TVET",
  "Ailuluai TVET",
];

const VET_SELECTION_DATA: Record<
  string,
  {
    no: number;
    primary: string;
    name: string;
    gender: string;
  }[]
> = {
  "Kwato TVET": [
    { no: 1, primary: "GOILANAI", name: "BRIAN BRIAN", gender: "M" },
    { no: 2, primary: "ALOTAU", name: "EZEKIEL AINAH", gender: "F" },
    { no: 3, primary: "ALOTAU", name: "MORRIS JOEL", gender: "M" },
    { no: 4, primary: "ALOTAU", name: "NELSON NELSON", gender: "M" },
    { no: 5, primary: "KWATO", name: "PAUL THOMAS", gender: "M" },
    { no: 6, primary: "KWATO", name: "MARY GRACE", gender: "F" },
  ],
  "Rabaraba TVET": [
    { no: 1, primary: "RABARABA", name: "DAVID PETER", gender: "M" },
    { no: 2, primary: "RABARABA", name: "ESTHER JOY", gender: "F" },
    { no: 3, primary: "RABARABA", name: "JAMES JOHN", gender: "M" },
    { no: 4, primary: "RABARABA", name: "RUTH NAOMI", gender: "F" },
  ],
  "Sideia TVET": [
    { no: 1, primary: "SIDEIA", name: "PETER ANDREW", gender: "M" },
    { no: 2, primary: "SIDEIA", name: "MARTHA LEAH", gender: "F" },
    { no: 3, primary: "SIDEIA", name: "THOMAS JAMES", gender: "M" },
  ],
  "Ubuya TVET": [
    { no: 1, primary: "UBUYA", name: "SAMUEL DAVID", gender: "M" },
    { no: 2, primary: "UBUYA", name: "RACHEL HANNAH", gender: "F" },
  ],
  "Kaubwaga TVET": [
    { no: 1, primary: "KAUBWAGA", name: "JOSEPH BENJAMIN", gender: "M" },
    { no: 2, primary: "KAUBWAGA", name: "DEBORAH RUTH", gender: "F" },
    { no: 3, primary: "KAUBWAGA", name: "DANIEL MICHAEL", gender: "M" },
  ],
  "Nabusa TVET": [
    { no: 1, primary: "NABUSA", name: "STEPHEN PAUL", gender: "M" },
    { no: 2, primary: "NABUSA", name: "MIRIAM SARAH", gender: "F" },
  ],
  "Watuluma TVET": [
    { no: 1, primary: "WATULUMA", name: "TIMOTHY JOHN", gender: "M" },
    { no: 2, primary: "WATULUMA", name: "ANNA MARIE", gender: "F" },
    { no: 3, primary: "WATULUMA", name: "PHILIP MARK", gender: "M" },
  ],
  "Bolubolu TVET": [
    { no: 1, primary: "BOLUBOLU", name: "ANDREW SIMON", gender: "M" },
    { no: 2, primary: "BOLUBOLU", name: "ELIZABETH JANE", gender: "F" },
  ],
  "Ailuluai TVET": [
    { no: 1, primary: "AILULUAI", name: "MATTHEW LUKE", gender: "M" },
    { no: 2, primary: "AILULUAI", name: "MARGARET ANN", gender: "F" },
    { no: 3, primary: "AILULUAI", name: "BARTHOLOMEW", gender: "M" },
  ],
};

function CentresSection() {
  const CENTRES = [
    {
      name: "Alotau VET Centre",
      district: "Alotau",
      status: "Operational",
      programs: "Construction, Engineering, Automotive, Hospitality",
      capacity: "300",
      facilities: "Workshops, Computer Lab, Dormitory",
      icon: "🏢",
    },
    {
      name: "Samarai VET Centre",
      district: "Samarai-Murua",
      status: "Opening 2026",
      programs: "Maritime, Construction, Agriculture",
      capacity: "150",
      facilities: "Workshops, Jetty Access, Staff Housing",
      icon: "⚓",
    },
    {
      name: "Kiriwina Skills Centre",
      district: "Kiriwina-Goodenough",
      status: "Operational",
      programs: "Hospitality, Construction, ICT",
      capacity: "120",
      facilities: "Kitchen, Workshop, Solar Power",
      icon: "🏝️",
    },
    {
      name: "Esa'ala Training Centre",
      district: "Esa'ala",
      status: "Operational",
      programs: "Maritime, Agriculture, Hospitality",
      capacity: "100",
      facilities: "Workshop, Boat Access, Garden",
      icon: "🌊",
    },
    {
      name: "Rabaruana Technical School",
      district: "Rabaruana",
      status: "Operational",
      programs: "Engineering, Automotive, Construction",
      capacity: "200",
      facilities: "Modern Workshops, Library, Boarding",
      icon: "🔧",
    },
    {
      name: "Misima Skills Centre",
      district: "Samarai-Murua",
      status: "Planned",
      programs: "Maritime, Agriculture, ICT",
      capacity: "80",
      facilities: "Workshop, Satellite Internet",
      icon: "📡",
    },
  ];

  const [status, setStatus] = useState("");

  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredCentres = CENTRES.filter(
    (c) =>
      (status === "" || c.status === status) &&
      `${c.name} ${c.district} ${c.programs}`.toLowerCase().includes(normalizedQuery),
  );

  return (
    <section id="centres" className="bg-[#F8F6F1] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
              Training Network
            </span>
            <h2
              className="text-4xl font-bold text-[#0B2545] mt-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              6 VET Centres Province-Wide
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              aria-label="Filter centres by status"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-teal-500"
            >
              <option value="">All Status</option>
              <option>Operational</option>
              <option>Opening 2026</option>
              <option>Planned</option>
            </select>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search centres..."
              aria-label="Search centres"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-teal-500 min-w-[200px]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCentres.map((c) => (
            <div
              key={c.name}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:border-teal-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-3xl shrink-0">{c.icon}</div>
                <div className="flex-1">
                  <h3
                    className="text-lg font-bold text-[#0B2545] mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {c.name}
                  </h3>
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      c.status === "Operational"
                        ? "bg-green-50 text-green-700"
                        : c.status === "Opening 2026"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>District:</strong> {c.district}
                </p>
                <p>
                  <strong>Programs:</strong> {c.programs}
                </p>
                <p>
                  <strong>Capacity:</strong> {c.capacity} trainees/year
                </p>
                <p>
                  <strong>Facilities:</strong> {c.facilities}
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-block mt-4 text-teal-600 hover:text-teal-800 font-medium text-sm"
              >
                Contact Centre →
              </Link>
            </div>
          ))}
          {filteredCentres.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-xl p-10 text-center text-gray-500">
              No centres match your filters.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function SelectionListsSection() {
  return (
    <section id="vet-selections" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
            2026 VET Selection
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            VET Centre Selection Lists
          </h2>
          <p className="text-gray-500">
            Official 2026 VET trainee selection lists for Milne Bay Province TVET centres. Click a
            centre to view the selected trainees.
          </p>
        </div>

        <div className="space-y-4">
          {VET_CENTRES.map((centre) => (
            <details
              key={centre}
              className="group bg-[#F8F6F1] rounded-xl border border-gray-100 overflow-hidden"
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-lg">
                    🏭
                  </span>
                  <h4 className="font-semibold text-[#0B2545] pr-8">{centre}</h4>
                </div>
                <span className="text-amber-500 transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="px-4 pb-4 pt-0 border-t border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#0D9488] text-white text-left">
                        <th className="px-3 py-2 font-semibold w-12">NO.</th>
                        <th className="px-3 py-2 font-semibold">PRIMARY SCHOOL</th>
                        <th className="px-3 py-2 font-semibold">NAME</th>
                        <th className="px-3 py-2 font-semibold w-20">GENDER</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(VET_SELECTION_DATA[centre] || []).map((student, i) => (
                        <tr
                          key={i}
                          className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                        >
                          <td className="px-3 py-2 text-center text-gray-700">{student.no}</td>
                          <td className="px-3 py-2 text-gray-700">{student.primary}</td>
                          <td className="px-3 py-2 font-medium text-[#0B2545]">{student.name}</td>
                          <td className="px-3 py-2 text-center">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                student.gender === "M"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-pink-100 text-pink-700"
                              }`}
                            >
                              {student.gender}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {(VET_SELECTION_DATA[centre] || []).length === 0 && (
                  <p className="text-gray-500 text-sm py-4 text-center">
                    Selection data not yet available for this centre
                  </p>
                )}
                <div className="mt-3 text-right">
                  <Link
                    to="/selections"
                    className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                  >
                    View Selection Lists →
                  </Link>
                </div>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-10 p-6 bg-teal-50 rounded-xl border border-teal-100 text-center">
          <h3
            className="text-lg font-bold text-[#0B2545] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Need the complete VET selection lists?
          </h3>
          <p className="text-gray-600 mb-4">
            Full PDF downloads with all selected trainees for each VET centre are available.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/selections"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded transition-colors"
            >
              View VET Selection Lists
            </Link>
            <Link
              to="#centres"
              className="inline-flex items-center gap-2 border border-teal-500 text-teal-600 hover:bg-teal-50 font-semibold px-5 py-2.5 rounded transition-colors"
            >
              View Centre Details →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function IndustrySection() {
  const PARTNERS = [
    {
      name: "PNG LNG Project",
      sector: "Oil & Gas",
      programs: "Engineering, Welding, Electrical, Safety",
      icon: "🛢️",
    },
    {
      name: "Ok Tedi Mining",
      sector: "Mining",
      programs: "Heavy Diesel, Electrical, Mechanical",
      icon: "⛏️",
    },
    {
      name: "Pacific Towing",
      sector: "Maritime",
      programs: "Deck Rating, Engine Rating, Marine Engineering",
      icon: "🚢",
    },
    {
      name: "Kumul Consolidated Holdings",
      sector: "State Enterprises",
      programs: "Multiple trades across subsidiaries",
      icon: "🏛️",
    },
    {
      name: "Alotau Chamber of Commerce",
      sector: "Private Sector",
      programs: "Hospitality, Business, Construction",
      icon: "🤝",
    },
    {
      name: "Provincial Health Authority",
      sector: "Health",
      programs: "Biomedical Equipment, Maintenance",
      icon: "🏥",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
            Industry Partnerships
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Training for Real Jobs
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-base leading-relaxed">
            Strong industry links ensure curriculum relevance, workplace placements, and employment
            pathways for graduates.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PARTNERS.map((p) => (
            <div
              key={p.name}
              className="bg-[#F8F6F1] rounded-xl p-6 border border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-3">{p.icon}</div>
              <h3
                className="text-lg font-bold text-[#0B2545] mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {p.name}
              </h3>
              <div className="text-teal-600 text-xs font-semibold uppercase tracking-wider mb-2">
                {p.sector}
              </div>
              <p className="text-gray-600 text-sm mb-3">{p.programs}</p>
              <div className="text-teal-600 text-xs font-medium">Active Partnership</div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-teal-50 rounded-xl border border-teal-100">
          <div className="flex items-start gap-4">
            <div className="text-3xl shrink-0">🎓</div>
            <div>
              <h3
                className="text-xl font-bold text-[#0B2545] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Apprenticeship & Traineeship Program
              </h3>
              <p className="text-gray-600 mb-4">
                The Division facilitates formal apprenticeships combining on-the-job training with
                structured off-the-job learning. Employers receive wage subsidies; apprentices earn
                while they learn.
              </p>
              <ul className="space-y-2 text-gray-700 text-sm grid sm:grid-cols-2">
                <li className="flex items-start gap-2">
                  <span className="text-teal-500">•</span> 4-year apprenticeships in Engineering,
                  Construction, Automotive
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500">•</span> 2-year traineeships in Hospitality,
                  Business, ICT
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500">•</span> Competency-based progression (not
                  time-based)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500">•</span> National Trade Testing on completion
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500">•</span> Pathway to Certificate IV & Diploma
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500">•</span> Employer incentives & training support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InitiativesSection() {
  const INITIATIVES = [
    {
      title: "New Centres in Alotau & Samarai",
      desc: "K5M investment for two new VET centres opening 2026. Alotau: expanded engineering/automotive. Samarai: maritime focus for island communities.",
      icon: "� - ️",
      status: "Underway",
      color: "bg-teal-500",
    },
    {
      title: "Mobile Training Units",
      desc: "Fully equipped training trucks delivering short courses to remote districts. 3 units operational reaching 500+ trainees annually in villages.",
      icon: "🚚",
      status: "Active",
      color: "bg-blue-500",
    },
    {
      title: "Recognition of Prior Learning (RPL)",
      desc: "Fast-track certification for experienced workers without formal qualifications. Assessment weekends at all centres. 200+ certified in 2025.",
      icon: "📜",
      status: "Expanding",
      color: "bg-amber-500",
    },
    {
      title: "Women in Trades Initiative",
      desc: "Targeted recruitment, mentoring, and support for women in non-traditional trades. 35% female enrolment target by 2027. Childcare at centres.",
      icon: "👩‍🔧",
      status: "Active",
      color: "bg-pink-500",
    },
    {
      title: "Green Skills & Renewable Energy",
      desc: "New solar installation, biogas, and energy efficiency modules. Partnership with PNG Power & international NGOs. Aligned with PNG Climate Goals.",
      icon: "☀️",
      status: "New",
      color: "bg-green-500",
    },
    {
      title: "Digital Skills Integration",
      desc: "Basic ICT & digital literacy embedded in all trade programs. Computer labs at all centres. E-portfolio for competency evidence.",
      icon: "💻",
      status: "Rolling Out",
      color: "bg-indigo-500",
    },
  ];

  return (
    <section className="bg-[#F8F6F1] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
            Key Initiatives
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Innovating Skills Development
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-base leading-relaxed">
            Strategic programs expanding access, improving quality, and aligning VET with emerging
            industry needs across Milne Bay.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIATIVES.map((i) => (
            <div
              key={i.title}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`${i.color} text-white rounded-lg p-2 shrink-0`}>
                  <span className="text-xl">{i.icon}</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-white/80 rounded">
                  {i.status}
                </span>
              </div>
              <h3
                className="text-lg font-bold text-[#0B2545] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {i.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{i.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EnrolmentSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
              How to Enrol
            </span>
            <h2
              className="text-4xl font-bold text-[#0B2545] mt-2 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Start Your Trade Career
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              VET enrolments open twice yearly (January & July intakes). Priority given to Grade
              10/12 school leavers and out-of-school youth aged 16–35.
            </p>
            <div className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Choose a Trade",
                  desc: "Review programs at vet.mbpeducation.gov.pg or visit your nearest centre. Consider your interests, aptitude, and local job market.",
                },
                {
                  step: "02",
                  title: "Check Eligibility",
                  desc: "Grade 10 certificate (minimum), medical fitness, age 16+. Mature entry (21+) considered with work experience. RPL available.",
                },
                {
                  step: "03",
                  title: "Submit Application",
                  desc: "Online at VET portal or paper form at any centre. Attach: certificates, ID, medical report, references. No application fee.",
                },
                {
                  step: "04",
                  title: "Selection & Interview",
                  desc: "Aptitude test + panel interview. Ranking based on grades, test, interview. Results within 2 weeks. Waitlist maintained.",
                },
                {
                  step: "05",
                  title: "Enrol & Commence",
                  desc: "Accept offer, pay subsidized fees (K200–K500/term), attend orientation. Tools & PPE provided. Training starts first Monday of term.",
                },
              ].map((s) => (
                <div key={s.step} className="flex gap-4">
                  <div
                    className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center shrink-0 text-xl"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {s.step}
                  </div>
                  <div>
                    <h3 className="text-[#0B2545] font-semibold">{s.title}</h3>
                    <p className="text-gray-600 text-sm">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-teal-50 rounded-2xl p-8 border border-teal-100">
            <h3
              className="text-2xl font-bold text-[#0B2545] mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              2026 Intake Dates
            </h3>
            <div className="space-y-4 mb-6">
              {[
                {
                  label: "January Intake Applications Open",
                  date: "1 October 2025",
                },
                {
                  label: "January Intake Applications Close",
                  date: "30 November 2025",
                },
                {
                  label: "January Intake Interviews",
                  date: "8–12 December 2025",
                },
                { label: "January Intake Commences", date: "26 January 2026" },
                {
                  label: "July Intake Applications Open",
                  date: "1 April 2026",
                },
                {
                  label: "July Intake Applications Close",
                  date: "31 May 2026",
                },
                { label: "July Intake Interviews", date: "9–13 June 2026" },
                { label: "July Intake Commences", date: "20 July 2026" },
              ].map((d) => (
                <div
                  key={d.label}
                  className="flex items-center justify-between py-3 border-b border-teal-100"
                >
                  <span className="text-gray-700">{d.label}</span>
                  <span className="font-semibold text-teal-700">{d.date}</span>
                </div>
              ))}
            </div>
            <Link
              to="/contact"
              className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded transition-colors"
            >
              Start an Enquiry →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SupportSection() {
  return (
    <section className="bg-[#0D9488] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <span className="text-amber-300 text-xs font-bold uppercase tracking-widest">
              Support & Resources
            </span>
            <h2
              className="text-4xl font-bold text-white mt-2 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              For Trainees, Employers & Trainers
            </h2>
            <p className="text-teal-100 leading-relaxed mb-8">
              Comprehensive support ecosystem ensuring quality training delivery and successful
              outcomes for all VET stakeholders.
            </p>
            <div className="space-y-4">
              {[
                {
                  icon: "📚",
                  title: "Training Resources",
                  desc: "Learning guides, assessment tools, e-learning portal, industry-standard equipment",
                },
                {
                  icon: "👨‍🏫",
                  title: "Trainer Development",
                  desc: "Certificate IV in Training & Assessment, industry currency programs, moderation",
                },
                {
                  icon: "🏢",
                  title: "Employer Services",
                  desc: "Apprentice sign-up, wage subsidies, workplace assessor training, skills audits",
                },
                {
                  icon: "💰",
                  title: "Funding & Scholarships",
                  desc: "Government subsidies, industry scholarships, tool allowances, travel support",
                },
                {
                  icon: "📊",
                  title: "Quality Assurance",
                  desc: "Internal audit, external moderation, TVET Authority compliance, tracer studies",
                },
                {
                  icon: "🎯",
                  title: "Job Placement",
                  desc: "Industry job board, resume workshops, interview prep, graduate tracking system",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 p-4 bg-white/10 rounded-xl border border-white/20 hover:border-amber-300/50 hover:bg-white/15 transition-all"
                >
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-teal-100 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-8 border border-white/20">
            <h3
              className="text-2xl font-bold text-white mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              VET Helpdesk
            </h3>
            <p className="text-teal-100 mb-6">
              Information on courses, enrolment, apprenticeships, RPL, employer incentives, and
              centre locations.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <span className="text-amber-300 text-xl">📞</span>
                <div>
                  <div className="text-sm text-teal-100">Provincial VET Coordinator</div>
                  <div className="font-semibold">+675 641 1234 (ext. 4)</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-amber-300 text-xl">✉️</span>
                <div>
                  <div className="text-sm text-teal-100">Email</div>
                  <div className="font-semibold">vet@mbpeducation.gov.pg</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-amber-300 text-xl">📍</span>
                <div>
                  <div className="text-sm text-teal-100">Office</div>
                  <div className="font-semibold">Alotau VET Centre, Milne Bay</div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-amber-300 hover:bg-amber-400 text-[#0B2545] font-semibold px-6 py-3 rounded transition-colors"
              >
                Contact VET Team →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DownloadsSection() {
  const DOWNLOADS = [
    {
      name: "VET Prospectus 2026",
      type: "PDF",
      size: "4.5 MB",
      category: "Guide",
    },
    {
      name: "Course Information Sheets (All Trades)",
      type: "PDF",
      size: "8.2 MB",
      category: "Curriculum",
    },
    {
      name: "Enrolment Application Form",
      type: "PDF",
      size: "650 KB",
      category: "Forms",
    },
    {
      name: "Apprenticeship Guidelines for Employers",
      type: "PDF",
      size: "2.1 MB",
      category: "Guidelines",
    },
    {
      name: "RPL Application & Evidence Guide",
      type: "PDF",
      size: "1.8 MB",
      category: "Assessment",
    },
    {
      name: "Centre Facility Standards",
      type: "PDF",
      size: "3.4 MB",
      category: "Standards",
    },
    {
      name: "Trainer Qualification Requirements",
      type: "PDF",
      size: "920 KB",
      category: "HR",
    },
    {
      name: "Graduate Tracer Study 2024",
      type: "PDF",
      size: "2.7 MB",
      category: "Reports",
    },
  ];

  return (
    <section className="py-16 px-4 bg-[#F8F6F1]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
              Resources
            </span>
            <h2
              className="text-4xl font-bold text-[#0B2545] mt-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Documents & Downloads
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
          {DOWNLOADS.map((doc) => (
            <Link
              key={doc.name}
              to="/contact"
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
                <div className="text-gray-500 text-xs mt-1">{doc.size}</div>
              </div>
              <span className="text-teal-500 shrink-0">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const FAQS = [
    {
      q: "What are the entry requirements for VET certificate courses?",
      a: "Minimum Grade 10 certificate pass. Some trades require specific subjects (e.g., Maths/Science for Engineering). Mature age entry (21+) with relevant work experience considered. Medical fitness certificate required.",
    },
    {
      q: "How much does VET training cost?",
      a: "Government-subsidized fees: K200–K500 per term depending on trade. Full fee-paying options available. Tool kits and PPE provided. Scholarships available for high-performing and disadvantaged students.",
    },
    {
      q: "Can I do VET while working?",
      a: "Yes. Evening/weekend classes available for Certificate I in some trades. Block release (2 weeks on, 2 weeks off) for apprentices. RPL allows experienced workers to certify without full-time study.",
    },
    {
      q: "What qualification will I receive?",
      a: "National Certificate Level 1 (NC1) on completion. Recognized by TVET Authority PNG. Pathways: NC2 → NC3 → Certificate IV → Diploma. Credit transfer to technical colleges and universities.",
    },
    {
      q: "How do I apply for an apprenticeship?",
      a: "Employer must register with Division. Apprentice signs training contract. Division facilitates registration with TVET Authority. Wage subsidies available for employers. Contact VET Helpdesk for forms.",
    },
    {
      q: "Are the new Samarai and Alotau centres open for 2026?",
      a: "Alotau VET Centre expansion: operational January 2026. Samarai VET Centre: opening July 2026 (maritime focus). Applications for both open October 2025. Limited places - apply early.",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
            Frequently Asked
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Common Questions
          </h2>
        </div>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <details
              key={i}
              className="group bg-[#F8F6F1] rounded-xl border border-gray-100 overflow-hidden"
            >
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                <h3 className="text-[#0B2545] font-semibold text-base pr-8">{faq.q}</h3>
                <span className="text-teal-400 transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="px-5 pb-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-200">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#07192E] text-white pt-14 pb-6 px-4" id="contact">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/assets/logo/mbp-logo-bg-removed.png"
                alt="Milne Bay Province Division of Education"
                className="w-10 h-10 shrink-0 object-contain bg-white rounded-full p-1"
              />
              <div>
                <div
                  className="font-bold text-sm"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Milne Bay Province
                </div>
                <div className="text-[#0D9488] text-xs">Division of Education</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Committed to quality education for all children and young people across Milne Bay
              Province, Papua New Guinea.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-[#C9A84C] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-[#C9A84C] mb-4">
              Related Agencies
            </h4>
            <ul className="space-y-2">
              {[
                { label: "National Dept. of Education", href: "/about" },
                { label: "Teaching Service Commission", href: "/contact" },
                { label: "National Library of PNG", href: "/news" },
                { label: "Flexible Open Distance Ed.", href: "/fode" },
                { label: "TVET Authority", href: "/vet" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-[#C9A84C] mb-4">
              Contact Us
            </h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div>
                <div className="text-white font-medium mb-0.5">Office Address</div>
                Division of Education, Alotau, Milne Bay Province, PNG
              </div>
              <div>
                <div className="text-white font-medium mb-0.5">Phone</div>+675 641 1234
              </div>
              <div>
                <div className="text-white font-medium mb-0.5">Email</div>
                info@mbpeducation.gov.pg
              </div>
              <div>
                <div className="text-white font-medium mb-0.5">Office Hours</div>
                Mon – Fri: 8:00am – 4:30pm
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-wrap justify-between items-center gap-3 text-sm text-gray-500">
          <span>© 2026 Milne Bay Province Division of Education. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/contact" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
            <Link to="/accessibility" className="hover:text-white transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function VETPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <PageHero />
      <OverviewSection />
      <ProgramsSection />
      <CentresSection />
      <SelectionListsSection />
      <IndustrySection />
      <InitiativesSection />
      <EnrolmentSection />
      <SupportSection />
      <DownloadsSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
