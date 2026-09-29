import { Link } from "react-router-dom";
import PageHeroBanner, { NAVY_HERO } from "@/components/PageHero";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import { useEntity } from "@/hooks/useDynamic";
import { STATS_FALLBACK } from "@/data/fallbacks";
import { StatsRow } from "@/components/StatsRow";


// The fallback lives in src/data/fallbacks.ts, shared with the home page: the two
// pages each had their own and disagreed, so one showed four figures with the API up
// and six with it down. See STATS_FALLBACK there.

/**
 * The banner rotates: each photograph brings its own words with it, rather than
 * a fixed heading sitting over a changing picture. The wording is taken from the
 * sections further down this page, so the banner and the content agree.
 *
 * The images are the site's own slider photographs rather than remote ones, so
 * the banner does not depend on a third-party host being reachable.
 */
const HERO_SLIDES = [
  {
    image: "/assets/slider/mbp-img1.jpg",
    imageAlt: "Milne Bay students and community learning",
    eyebrow: "Milne Bay Province - Papua New Guinea",
    title: "About the Division",
    highlight: " of Education",
    lead: "Learn about our mission, leadership, and commitment to quality education across Milne Bay Province.",
  },
  {
    image: "/assets/slider/mbp-img2.jpg",
    imageAlt: "Milne Bay Province schools and education",
    eyebrow: "Our Mission",
    title: "Empowering Communities",
    highlight: " Through Education",
    lead: "Committed to delivering equitable, quality education to every child and young person across our province.",
  },
  {
    image: "/assets/slider/mbp-img3.jpg",
    imageAlt: "Milne Bay coastal education community",
    eyebrow: "Our Commitment",
    title: "Serving Every",
    highlight: " Community",
    lead: "Working in partnership with teachers, parents and community leaders - from the islands of Samarai to the highlands of Alotau.",
  },
];

function PageHero() {
  return <PageHeroBanner theme={NAVY_HERO} slides={HERO_SLIDES} />;
}

function MissionSection() {
  return (
    <section className="bg-[#F8F6F1] py-16 px-4">
      <Reveal className="max-w-7xl mx-auto">
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
      </Reveal>
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
      <Reveal className="max-w-7xl mx-auto">
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
              <div className="text-4xl mb-4"><Icon name={leader.icon} size={32} /></div>
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
      </Reveal>
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
          {/* The spine only exists at lg, where the badge sits in the margin. */}
          <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-[#C9A84C] hidden lg:block" />
          <div className="space-y-8 lg:space-y-10">
            {MILESTONES.map((m) => (
              /* The badge is in the flow below lg and absolute at lg and up.
                 Absolutely positioned, it was anchored at left-0 while the card
                 was only pushed in by ml-4, so on a phone the 64px circle
                 covered most of the card and the year sat on the paragraph. */
              <div key={m.year} className="relative lg:pl-20">
                <div className="lg:absolute lg:left-[-7px] lg:top-0 w-16 h-16 lg:w-14 lg:h-14 rounded-full bg-[#0B2545] border-4 border-white flex items-center justify-center shadow-lg mb-4 lg:mb-0 lg:z-10">
                  <span
                    className="text-[#C9A84C] text-xs font-bold leading-none text-center"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {m.year}
                  </span>
                </div>
                <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100">
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
  /*
   * Read from the stats entity rather than a local array. This used to hold its
   * own copy of these six figures, which meant the Division could edit them in
   * the admin and the About page would silently keep showing the old numbers -
   * it had already drifted, claiming more districts than the site held.
   */
  const { data } = useEntity("stats", STATS_FALLBACK as any);
  const list = (data as any[]).map((s: any) => ({
    value: s.value_text ?? s.value,
    label: s.label,
    sub: s.sub,
  }));

  return (
    <section className="bg-[#0B2545] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          {/* The shared row, so these figures look the same as the home page's.
              This was a separate six-column grid holding four items, which left
              two empty columns and pushed the numbers off to the left. */}
          <StatsRow items={list} />
        </Reveal>
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
              <div className="text-3xl mb-3"><Icon name={p.icon} size={24} /></div>
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

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>
      <SiteHeader />
      <main id="main-content">
        <PageHero />
        <MissionSection />
        <LeadershipSection />
        <HistorySection />
        <StatsSection />
        <PartnersSection />
      </main>
      <SiteFooter />
    </div>
  );
}
