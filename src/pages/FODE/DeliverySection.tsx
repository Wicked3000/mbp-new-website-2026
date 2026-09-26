export function DeliverySection() {
  const METHODS = [
    {
      name: "Printed Course Materials",
      desc: "Full curriculum textbooks, workbooks, and assignment booklets delivered to centres and correspondence sites. Updated annually.",
      icon: "📦",
      availability: "All Centres",
    },
    {
      name: "Digital Learning Platform",
      desc: "Moodle LMS with interactive lessons, videos, quizzes, and progress tracking. Offline app for areas without internet.",
      icon: "💻",
      availability: "8 Centres + App",
    },
    {
      name: "Radio Broadcast Lessons",
      desc: "Weekly 30-min lessons on NBC Milne Bay & community radio. Covers all core subjects. Schedule distributed each term.",
      icon: "📻",
      availability: "Province-wide",
    },
    {
      name: "Tutorial Support Sessions",
      desc: "Face-to-face tutorials at centres (weekly/fortnightly). Tutor-marked assignments with feedback. Practical sessions for science.",
      icon: "👨‍🏫",
      availability: "All Centres",
    },
    {
      name: "WhatsApp Study Groups",
      desc: "Subject-specific groups with tutor moderation. Peer support, quick questions, assignment reminders. 85% student participation.",
      icon: "💬",
      availability: "Mobile Coverage Areas",
    },
    {
      name: "Mobile Centre Visits",
      desc: "Staff visit remote correspondence sites quarterly for enrolment, material distribution, exams, and counselling.",
      icon: "🚤",
      availability: "25+ Remote Sites",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
            Delivery Methods
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Multi-Modal Learning Delivery
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-base leading-relaxed">
            Students choose the mode that works for their location and circumstances. Most combine
            multiple methods for best results.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {METHODS.map((m) => (
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
            <div className="text-3xl shrink-0">📱</div>
            <div>
              <h3
                className="text-xl font-bold text-[#0B2545] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                FODE Mobile App (New 2026)
              </h3>
              <p className="text-gray-600 mb-4">
                Offline-first Android app with full course materials, video lessons, assignment
                submission, progress tracking, and tutor chat. Free download at centres or via APK.
              </p>
              <ul className="space-y-2 text-gray-700 text-sm grid sm:grid-cols-2">
                <li className="flex items-start gap-2">
                  <span className="text-teal-500">•</span> Works offline - syncs when online
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500">•</span> Push notifications for deadlines &
                  announcements
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500">•</span> Assignment photo upload & voice notes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500">•</span> Progress dashboard & exam countdown
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500">•</span> Low data mode for expensive connections
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500">•</span> Tok Pisin & English interface
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
