import { useEntity } from "@/hooks/useDynamic";

export function DeliverySection() {
  const METHODS_FALLBACK = [
    { name: "Printed Course Materials", desc: "Full curriculum textbooks, workbooks, and assignment booklets delivered to centres and correspondence sites. Updated annually.", icon: "📦", availability: "All Centres" },
    { name: "Digital Learning Platform", desc: "Moodle LMS with interactive lessons, videos, quizzes, and progress tracking. Offline app for areas without internet.", icon: "💻", availability: "8 Centres + App" },
    { name: "Radio Broadcast Lessons", desc: "Weekly 30-min lessons on NBC Milne Bay & community radio. Covers all core subjects. Schedule distributed each term.", icon: "📻", availability: "Province-wide" },
    { name: "Tutorial Support Sessions", desc: "Face-to-face tutorials at centres (weekly/fortnightly). Tutor-marked assignments with feedback. Practical sessions for science.", icon: "👨‍🏫", availability: "All Centres" },
    { name: "WhatsApp Study Groups", desc: "Subject-specific groups with tutor moderation. Peer support, quick questions, assignment reminders. 85% student participation.", icon: "💬", availability: "Mobile Coverage Areas" },
    { name: "Mobile Centre Visits", desc: "Staff visit remote correspondence sites quarterly for enrolment, material distribution, exams, and counselling.", icon: "🚤", availability: "25+ Remote Sites" },
  ];
  const APP_FALLBACK = [
    { icon: "📱", heading: "FODE Mobile App (New 2026)", body: "Offline-first Android app with full course materials, video lessons, assignment submission, progress tracking, and tutor chat. Free download at centres or via APK.", bullet: "Works offline - syncs when online" },
    { icon: "📱", heading: "FODE Mobile App (New 2026)", body: "Offline-first Android app with full course materials, video lessons, assignment submission, progress tracking, and tutor chat. Free download at centres or via APK.", bullet: "Push notifications for deadlines & announcements" },
    { icon: "📱", heading: "FODE Mobile App (New 2026)", body: "Offline-first Android app with full course materials, video lessons, assignment submission, progress tracking, and tutor chat. Free download at centres or via APK.", bullet: "Assignment photo upload & voice notes" },
    { icon: "📱", heading: "FODE Mobile App (New 2026)", body: "Offline-first Android app with full course materials, video lessons, assignment submission, progress tracking, and tutor chat. Free download at centres or via APK.", bullet: "Progress dashboard & exam countdown" },
    { icon: "📱", heading: "FODE Mobile App (New 2026)", body: "Offline-first Android app with full course materials, video lessons, assignment submission, progress tracking, and tutor chat. Free download at centres or via APK.", bullet: "Low data mode for expensive connections" },
    { icon: "📱", heading: "FODE Mobile App (New 2026)", body: "Offline-first Android app with full course materials, video lessons, assignment submission, progress tracking, and tutor chat. Free download at centres or via APK.", bullet: "Tok Pisin & English interface" },
  ];
  const { data: methods } = useEntity("fode_delivery_methods", METHODS_FALLBACK);
  const { data: appRows } = useEntity("fode_app_callout", APP_FALLBACK);
  const { data: headings } = useEntity("fode_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "delivery") || {
      eyebrow: "Delivery Methods",
      heading: "Multi-Modal Learning Delivery",
      blurb: "Students choose the mode that works for their location and circumstances. Most combine multiple methods for best results.",
    };
  const callout = appRows[0] || { icon: "📱", heading: "FODE Mobile App (New 2026)", body: "" };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
            {heading.eyebrow}
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {heading.heading}
          </h2>
          {heading.blurb && (
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-base leading-relaxed">
              {heading.blurb}
            </p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {methods.map((m: any) => (
            <div
              key={m.name}
              className="bg-[#F8F6F1] rounded-xl p-6 border border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-3">{m.icon}</div>
              <h3
                className="text-lg font-bold text-[#0B2545] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {m.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{m.desc}</p>
              <div className="text-teal-600 text-xs font-medium">Available: {m.availability}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-teal-50 rounded-xl border border-teal-100">
          <div className="flex items-start gap-4">
            <div className="text-3xl shrink-0">{callout.icon}</div>
            <div>
              <h3
                className="text-xl font-bold text-[#0B2545] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {callout.heading}
              </h3>
              <p className="text-gray-600 mb-4">{callout.body}</p>
              <ul className="space-y-2 text-gray-700 text-sm grid sm:grid-cols-2">
                {appRows.map((row: any, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-teal-500">•</span> {row.bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
