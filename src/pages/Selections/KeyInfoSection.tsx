import { Link } from "react-router-dom";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

export function KeyInfoSection() {
  return (
    <section className="bg-[#F8F6F1] py-12 px-4">
      <Reveal className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            {
              icon: "📅",
              title: "Release Date",
              value: "Early Jan 2026",
              desc: "After Grade 8 & 10 results",
            },
            {
              icon: "🏫",
              title: "Schools Covered",
              value: "24 Secondary",
              desc: "Provincial & National High",
            },
            {
              icon: "👥",
              title: "Students Placed",
              value: "6,500+",
              desc: "Grade 9 & 11 combined",
            },
            {
              icon: "📋",
              title: "Selection Basis",
              value: "Merit & Choice",
              desc: "Exam marks + preferences",
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="text-3xl mb-3"><Icon name={item.icon} size={24} /></div>
              <div
                className="text-2xl font-bold text-[#0B2545] mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {item.value}
              </div>
              <div className="text-[#C9A84C] text-sm font-semibold uppercase tracking-wider mb-1">
                {item.title}
              </div>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
