import { Link, useLocation } from "react-router-dom";
import { useState, type Dispatch, type SetStateAction } from "react";

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
            <a href="#" className="hover:text-[#C9A84C] transition-colors">
              NDoE Portal
            </a>
            <a href="#" className="hover:text-[#C9A84C] transition-colors">
              TSC Online
            </a>
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
                  location.pathname === link.href ||
                  (link.href !== "/" && location.pathname.startsWith(link.href))
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
    <section className="relative h-[400px] sm:h-[480px] overflow-hidden bg-[#0B2545]">
      <img
        src="https://images.unsplash.com/photo-1671883240914-22753874f0de?w=1600&h=900&fit=crop&auto=format"
        alt="Milne Bay Province landscape"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545]/90 via-[#0B2545]/70 to-[#163663]/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#E2C47A] text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] inline-block" />
            Milne Bay Province - Papua New Guinea
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            About the Division
            <span className="block text-[#14B8A6]"> of Education</span>
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-2xl">
            Learn about our mission, leadership, and commitment to quality education across Milne
            Bay Province.
          </p>
        </div>
      </div>
    </section>
  );
}

function MissionSection() {
  return (
    <section className="bg-[#F8F6F1] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#0D9488] text-xs font-bold uppercase tracking-widest">
              Our Purpose
            </span>
            <h2
              className="text-4xl font-bold text-[#0B2545] mt-2 mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Empowering Communities Through Education
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-lg">
              The Milne Bay Province Division of Education is committed to delivering equitable,
              quality education to every child and young person across our province - from the
              islands of Samarai to the highlands of Alotau.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              We work in partnership with teachers, parents, community leaders, and national
              government agencies to build a generation of capable, informed, and resilient citizens
              of Papua New Guinea.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Our vision is a province where every school - whether in urban Alotau or remote island
              communities - has the resources, qualified teachers, and support needed to help
              students thrive.
            </p>
            <Link
              to="/#programs"
              className="inline-flex items-center gap-2 bg-[#0B2545] text-white font-semibold px-6 py-3 rounded hover:bg-[#163663] transition-colors"
            >
              View Our Programs →
            </Link>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1615608178738-37d47d27c13d?w=800&h=600&fit=crop&auto=format"
                alt="Students in classroom"
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#0D9488] text-white rounded-xl p-5 shadow-lg hidden md:block">
              <div
                className="text-4xl font-bold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                312
              </div>
              <div className="text-sm text-teal-100">Schools Province-wide</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LeadershipSection() {
  const LEADERSHIP = [
    {
      name: "Dr. John K. Boro",
      title: "Provincial Education Advisor",
      bio: "Over 25 years in educational leadership across PNG. Holds a PhD in Educational Administration from UPNG.",
      icon: "👨‍💼",
    },
    {
      name: "Ms. Margaret M. Tari",
      title: "Deputy Advisor - Basic Education",
      bio: "Former head teacher with extensive experience in elementary and primary curriculum implementation.",
      icon: "👩‍🏫",
    },
    {
      name: "Mr. Peter G. Wai",
      title: "Deputy Advisor - Post Primary & VET",
      bio: "Specialist in secondary education pathways and vocational training coordination across the province.",
      icon: "👨‍🏫",
    },
    {
      name: "Ms. Grace L. Kila",
      title: "Director - FODE & Distance Learning",
      bio: "Champion of flexible learning for remote communities. Masters in Distance Education from DWU.",
      icon: "👩‍💻",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#0D9488] text-xs font-bold uppercase tracking-widest">
            Leadership Team
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Guiding Education in Milne Bay
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-base leading-relaxed">
            Our leadership team brings decades of combined experience in education administration,
            curriculum development, and community engagement.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LEADERSHIP.map((leader) => (
            <div
              key={leader.name}
              className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{leader.icon}</div>
              <div
                className="text-[#0B2545] font-bold text-lg mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {leader.name}
              </div>
              <div className="text-[#0D9488] text-sm font-semibold uppercase tracking-wider mb-3">
                {leader.title}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{leader.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HistorySection() {
  const MILESTONES = [
    {
      year: "1976",
      title: "Division Established",
      desc: "Milne Bay Province Division of Education formed following provincial government establishment.",
    },
    {
      year: "1995",
      title: "Organic Law Reforms",
      desc: "Education functions decentralized under the Organic Law on Provincial Governments.",
    },
    {
      year: "2002",
      title: "Elementary Reform",
      desc: "Introduction of Elementary Prep–Grade 2 in vernacular languages across the province.",
    },
    {
      year: "2015",
      title: "Tuition Fee Free Policy",
      desc: "National TFF policy implemented, dramatically increasing enrollment across all districts.",
    },
    {
      year: "2020",
      title: "COVID-19 Response",
      desc: "Rapid deployment of radio and home-based learning programs during school closures.",
    },
    {
      year: "2024",
      title: "New VET Centres",
      desc: "Approval and funding secured for new vocational training centres in Alotau and Samarai.",
    },
  ];

  return (
    <section className="bg-[#F8F6F1] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#0D9488] text-xs font-bold uppercase tracking-widest">
            Our Journey
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Key Milestones
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#C9A84C] hidden lg:block" />
          <div className="space-y-10">
            {MILESTONES.map((m) => (
              <div key={m.year} className="relative lg:pl-20">
                <div className="absolute left-0 top-4 w-16 h-16 lg:w-14 lg:h-14 lg:left-[-8px] rounded-full bg-[#0B2545] border-4 border-white flex items-center justify-center shadow-lg z-10">
                  <span
                    className="text-[#C9A84C] text-xs font-bold leading-none text-center"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {m.year}
                  </span>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 ml-4 lg:ml-0">
                  <h3
                    className="text-xl font-bold text-[#0B2545] mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {m.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const STATS = [
    { value: "312", label: "Schools", sub: "Province-wide" },
    { value: "48,200+", label: "Students", sub: "Enrolled 2026" },
    { value: "2,140", label: "Teachers", sub: "Qualified staff" },
    { value: "17", label: "Districts", sub: "Covered" },
    { value: "25+", label: "Years", sub: "Of Service" },
    { value: "4", label: "Programs", sub: "Education Streams" },
  ];

  return (
    <section className="bg-[#0B2545] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div
                className="text-4xl sm:text-5xl font-bold text-[#C9A84C]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {s.value}
              </div>
              <div className="text-white font-semibold mt-1">{s.label}</div>
              <div className="text-blue-300 text-sm">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnersSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#0D9488] text-xs font-bold uppercase tracking-widest">
            Partnerships
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Working Together for Education
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-base leading-relaxed">
            We collaborate with national agencies, development partners, and community organizations
            to deliver quality education.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "National Dept. of Education",
              desc: "Policy, curriculum & funding",
              icon: "🏛️",
            },
            {
              name: "Teaching Service Commission",
              desc: "Teacher registration & payroll",
              icon: "👨‍🏫",
            },
            {
              name: "TVET Authority",
              desc: "Vocational standards & quality",
              icon: "🔧",
            },
            {
              name: "Development Partners",
              desc: "UNICEF, AusAID, World Bank",
              icon: "🤝",
            },
          ].map((p) => (
            <div
              key={p.name}
              className="bg-[#F8F6F1] rounded-xl p-6 border border-gray-100 hover:border-[#C9A84C] hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-3">{p.icon}</div>
              <div
                className="text-[#0B2545] font-bold mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {p.name}
              </div>
              <div className="text-gray-600 text-sm">{p.desc}</div>
            </div>
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
                "National Dept. of Education",
                "Teaching Service Commission",
                "National Library of PNG",
                "Flexible Open Distance Ed.",
                "TVET Authority",
              ].map((l) => (
                <li key={l}>
                  <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                    {l}
                  </a>
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
                <div className="text-white font-medium mb-0.5">Phone</div>
                +675 641 1234
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
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Use
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <PageHero />
      <MissionSection />
      <LeadershipSection />
      <HistorySection />
      <StatsSection />
      <PartnersSection />
      <Footer />
    </div>
  );
}
