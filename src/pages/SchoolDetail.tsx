import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useEntity } from "@/hooks/useDynamic";
import { DISTRICT_FALLBACK, SCHOOL_FALLBACK, hasCoords, mapsUrl } from "@/data/fallbacks";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

function Stat({ label, value, tone = "default" }: { label: string; value: any; tone?: string }) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 ${
        tone === "accent" ? "bg-[#0B2545] border-[#0B2545] text-white" : "bg-white border-gray-100"
      }`}
    >
      <div
        className={`text-[10px] font-bold uppercase tracking-widest ${
          tone === "accent" ? "text-teal-200/80" : "text-gray-500"
        }`}
      >
        {label}
      </div>
      <div className={`text-2xl font-bold mt-0.5 ${tone === "accent" ? "text-white" : "text-[#0B2545]"}`}>
        {value === null || value === undefined || value === "" || value === 0 ? "—" : value}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-2 border-b border-gray-100 last:border-0">
      <dt className="text-xs font-bold uppercase tracking-wider text-gray-400 sm:w-40 shrink-0">
        {label}
      </dt>
      <dd className="text-gray-800 mt-0.5 sm:mt-0 break-words">{value}</dd>
    </div>
  );
}

function YesNo({ label, value }: { label: string; value: any }) {
  if (value === null || value === undefined || value === "") return null;
  const yes = String(value).toLowerCase() === "yes" || value === true || value === 1;
  return (
    <div className="flex items-center justify-between rounded-lg bg-[#F8F6F1] border border-gray-100 px-3 py-2">
      <span className="text-sm text-gray-600">{label}</span>
      <span
        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
          yes ? "bg-[#0D9488] text-white" : "bg-gray-200 text-gray-500"
        }`}
      >
        {yes ? "Yes" : "No"}
      </span>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h2
        className="text-lg font-bold text-[#0B2545] mb-3"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function SchoolDetailPage() {
  const { id } = useParams();
  const { data: schoolData } = useEntity("schools", SCHOOL_FALLBACK as any);
  const { data: districtData } = useEntity("districts", DISTRICT_FALLBACK as any);

  const school = useMemo(() => {
    const list = schoolData as any[];
    return list.find((s) => String(s.id) === String(id)) ?? null;
  }, [schoolData, id]);

  const district = useMemo(() => {
    if (!school) return null;
    const list = districtData as any[];
    return (
      list.find((d) => String(d.id) === String(school.district_id)) ??
      list.find((d) => (d.name || "").toLowerCase() === (school.district || "").toLowerCase()) ??
      null
    );
  }, [districtData, school]);

  if (!school) {
    return (
      <div
        className="min-h-screen bg-[#F8F6F1]"
        style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}
      >
        <SiteHeader />
        <section className="max-w-3xl mx-auto px-4 py-24 text-center">
          <h1
            className="text-3xl sm:text-4xl font-bold text-[#0B2545] mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            School not found
          </h1>
          <p className="text-gray-600 mb-8">
            We could not find that school. It may have been renamed or removed.
          </p>
          <Link
            to="/#coverage"
            className="inline-flex bg-[#0B2545] text-white font-bold px-6 py-3 rounded-full"
          >
            Back to Coverage
          </Link>
        </section>
        <SiteFooter />
      </div>
    );
  }

  const enrolled = Number(school.enrolled) || 0;
  const capacity = Number(school.capacity) || 0;
  const male = Number(school.male) || 0;
  const female = Number(school.female) || 0;
  const teachers = Number(school.teachers) || 0;
  const staff = Number(school.staff) || 0;
  const hasFigures = male + female + teachers + staff > 0;
  const rollUp = male + female;
  const mismatch = hasFigures && rollUp > 0 && rollUp !== enrolled;
  const pct = capacity ? Math.min(100, Math.round((enrolled / capacity) * 100)) : null;
  const ratio = teachers > 0 ? Math.round(enrolled / teachers) : null;

  return (
    <div
      className="min-h-screen bg-[#F8F6F1]"
      style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}
    >
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0B2545]">
        {school.img ? (
          <img
            src={school.img}
            alt=""
            aria-hidden="true"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
        ) : (
          <img
            src="/assets/education_programs/map/milne_bay_map.jpg"
            alt=""
            aria-hidden="true"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07192E]/92 via-[#0B2545]/85 to-[#0B2545]/55" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest">
            <Link to="/#coverage" className="text-[#C9A84C] hover:text-white transition-colors">
              ← Coverage
            </Link>
            {district && (
              <>
                <span className="text-white/30">/</span>
                <Link
                  to={`/districts/${district.id ?? district.name}`}
                  className="text-[#C9A84C] hover:text-white transition-colors"
                >
                  {district.name}
                </Link>
              </>
            )}
          </nav>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {school.type && (
              <span className="text-[11px] font-bold uppercase tracking-wider bg-[#C9A84C] text-[#0B2545] px-3 py-1.5 rounded-full">
                {school.type}
              </span>
            )}
            {school.level && (
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/10 border border-white/20 text-white px-3 py-1.5 rounded-full">
                {school.level}
              </span>
            )}
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {school.name}
          </h1>
          <p className="text-blue-100 mt-3 max-w-2xl">
            {district ? `${district.name} District` : school.district}
            {school.location ? ` • ${school.location}` : ""}
          </p>

          {hasCoords(school) && (
            <a
              href={mapsUrl(school)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white font-semibold px-5 py-2.5 rounded-full hover:bg-white hover:text-[#0B2545] transition-colors text-sm"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Open in Google Maps
            </a>
          )}
        </div>
      </section>

      {/* Key figures */}
      <section className="max-w-5xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat label="Total students" value={enrolled} tone="accent" />
          <Stat label="Teachers" value={teachers} />
          <Stat label="Non-teaching staff" value={staff} />
          <Stat label="Capacity" value={capacity || null} />
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Identity */}
            <Section title="School details">
              <dl>
                <Row label="Official name" value={school.name} />
                <Row label="School code" value={school.code} />
                <Row label="Type" value={school.type} />
                <Row label="Level" value={school.level} />
                <Row label="Category" value={school.category} />
                <Row label="Day / boarding" value={school.day_boarding} />
                <Row
                  label="Established"
                  value={school.established ? school.established : null}
                />
                <Row label="District" value={district?.name || school.district} />
                <Row label="Township / locality" value={school.location} />
              </dl>
            </Section>

            {/* Student roll */}
            <Section title="Student roll">
              {hasFigures ? (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <Stat label="Male" value={male || null} />
                    <Stat label="Female" value={female || null} />
                    <Stat label="Total" value={enrolled} />
                  </div>

                  {rollUp > 0 && (
                    <div className="mt-5">
                      <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
                        <div className="bg-[#0B2545]" style={{ width: `${(male / rollUp) * 100}%` }} />
                        <div
                          className="bg-[#14B8A6]"
                          style={{ width: `${(female / rollUp) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-sm bg-[#0B2545]" /> Male{" "}
                          {Math.round((male / rollUp) * 100)}%
                        </span>
                        <span className="flex items-center gap-1.5">
                          Female {Math.round((female / rollUp) * 100)}%
                          <span className="w-2.5 h-2.5 rounded-sm bg-[#14B8A6]" />
                        </span>
                      </div>
                    </div>
                  )}

                  {mismatch && (
                    <p className="mt-4 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                      Male and female total {rollUp}, which does not match the roll of {enrolled}.
                      Please check the figures with the District Education Office.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  The male and female breakdown has not been published for this school yet.
                </p>
              )}

              {pct !== null && (
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                    <span>
                      {enrolled} of {capacity} places filled
                    </span>
                    <span className="font-bold text-[#0B2545]">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#0D9488]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}

              <dl className="mt-4">
                <Row label="Day students" value={Number(school.day_students) || null} />
                <Row label="Boarders" value={Number(school.boarders) || null} />
              </dl>
            </Section>

            {/* Staffing */}
            <Section title="Staffing">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                <Stat label="Teachers" value={teachers || null} />
                <Stat label="Non-teaching staff" value={staff || null} />
                <Stat
                  label="Students per teacher"
                  value={ratio}
                  tone={ratio && ratio > 40 ? "default" : "default"}
                />
              </div>
              <dl>
                <Row label="Principal" value={school.principal} />
                <Row label="Head teacher" value={school.head_teacher} />
                <Row label="Teachers (male)" value={Number(school.teachers_male) || null} />
                <Row
                  label="Teachers (female)"
                  value={Number(school.teachers_female) || null}
                />
                <Row
                  label="Untrained teachers"
                  value={Number(school.untrained_teachers) || null}
                />
                <Row
                  label="Administrative officers"
                  value={Number(school.admin_officers) || null}
                />
                <Row label="Support staff" value={Number(school.support_staff) || null} />
              </dl>
            </Section>

            {/* Facilities */}
            <Section title="Facilities & infrastructure">
              <dl className="mb-4">
                <Row
                  label="Classrooms"
                  value={Number(school.classrooms) || null}
                />
                <Row
                  label="Land area"
                  value={school.land_hectares ? `${school.land_hectares} hectares` : null}
                />
              </dl>
              <div className="grid sm:grid-cols-2 gap-2">
                <YesNo label="Library" value={school.has_library} />
                <YesNo label="Computer lab" value={school.has_computer_lab} />
                <YesNo label="Science lab" value={school.has_science_lab} />
                <YesNo label="Sports field" value={school.has_sports_field} />
                <YesNo label="Boarding facilities" value={school.has_boarding} />
              </div>
            </Section>

            {/* Academics */}
            <Section title="Academics & programmes">
              <dl>
                <Row label="Streams / subjects" value={school.streams} />
                <Row label="Exam centre" value={school.exam_centre} />
                <Row label="Extra-curricular" value={school.extracurricular} />
              </dl>
              {!school.streams && !school.exam_centre && !school.extracurricular && (
                <p className="text-sm text-gray-500">
                  Academic programme details have not been published yet.
                </p>
              )}
            </Section>

            {/* Logistics */}
            <Section title="Students & logistics">
              <dl>
                <Row label="School transport" value={school.transport} />
                <Row label="Uniform" value={school.uniform} />
                <Row label="Fees / funding" value={school.fees} />
              </dl>
              {!school.transport && !school.uniform && !school.fees && (
                <p className="text-sm text-gray-500">
                  Transport, uniform and fee information has not been published yet.
                </p>
              )}
            </Section>

            {school.notes && (
              <Section title="Additional notes">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{school.notes}</p>
              </Section>
            )}
          </div>

          {/* Contact sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2
                className="text-lg font-bold text-[#0B2545] mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Contact
              </h2>
              <dl>
                <Row label="Contact person" value={school.contact_person} />
                <Row label="Phone" value={school.contact} />
                <Row label="Alternate phone" value={school.alt_phone} />
                <Row
                  label="Email"
                  value={
                    school.email ? (
                      <a href={`mailto:${school.email}`} className="text-[#0D9488] hover:underline">
                        {school.email}
                      </a>
                    ) : null
                  }
                />
                <Row label="Head teacher" value={school.head_teacher} />
              </dl>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2
                className="text-lg font-bold text-[#0B2545] mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Location
              </h2>
              <dl>
                <Row label="Township" value={school.location} />
                <Row label="District" value={district?.name || school.district} />
                <Row label="Postal address" value={school.address} />
                <Row
                  label="Coordinates"
                  value={
                    hasCoords(school) ? (
                      <span className="font-mono text-xs">
                        {school.lat}, {school.lng}
                      </span>
                    ) : null
                  }
                />
              </dl>

              {hasCoords(school) ? (
                <a
                  href={mapsUrl(school)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0D9488] hover:text-[#0B2545] transition-colors"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Open in Google Maps
                </a>
              ) : (
                <p className="mt-4 text-xs text-gray-500 bg-[#F8F6F1] border border-gray-100 rounded-lg px-3 py-2">
                  Map coordinates have not been published for this school yet.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {district && (
                <Link
                  to={`/districts/${district.id ?? district.name}`}
                  className="text-center bg-[#0B2545] text-white font-bold px-5 py-2.5 rounded-full hover:bg-[#163663] transition-colors text-sm"
                >
                  Other schools in {district.name}
                </Link>
              )}
              <Link
                to="/contact"
                className="text-center bg-[#C9A84C] text-[#0B2545] font-bold px-5 py-2.5 rounded-full hover:bg-[#d4b45e] transition-colors text-sm"
              >
                Contact the Division
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}