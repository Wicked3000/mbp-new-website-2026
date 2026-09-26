import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

function PageHero() {
  return (
    <section className="relative h-[400px] sm:h-[480px] overflow-hidden bg-[#0B2545]">
      <img
        src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&h=900&fit=crop&auto=format"
        alt="Inclusive education"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545]/90 via-[#0B2545]/70 to-[#163663]/40" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
            Accessibility Statement
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Accessibility
            <span className="block text-teal-400"> for Everyone</span>
          </h1>
          <p className="text-teal-100 text-lg leading-relaxed max-w-2xl">
            We are committed to making our website and digital services accessible to all users,
            regardless of ability or technology.
          </p>
        </div>
      </div>
    </section>
  );
}

function StatementSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="bg-teal-50 rounded-2xl p-8 border border-teal-100 mb-12">
          <h2
            className="text-2xl font-bold text-[#0B2545] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Our Commitment
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The Milne Bay Province Division of Education is committed to ensuring digital
            accessibility for people with disabilities. We are continually improving the user
            experience for everyone and applying relevant accessibility standards.
          </p>
          <p className="text-gray-700 leading-relaxed">
            This website aims to conform to <strong>WCAG 2.1 Level AA</strong> standards. We
            recognize that some areas may not yet fully meet these standards, and we are actively
            working to address them.
          </p>
        </div>

        <div className="space-y-8">
          {[
            {
              title: "Compliance Status",
              items: [
                "Partially conformant with WCAG 2.1 Level AA",
                "Known issues documented below with remediation timeline",
                "Third-party content (embedded maps, external links) may not meet standards",
                "PDF documents published before 2024 may not be fully accessible",
              ],
            },
            {
              title: "Accessibility Features Implemented",
              items: [
                "Semantic HTML5 structure with proper heading hierarchy (h1–h6)",
                "Sufficient colour contrast ratios (minimum 4.5:1 for text)",
                "Keyboard navigation support for all interactive elements",
                "Focus indicators visible on all focusable elements",
                "Alt text for all informative images and non-text content",
                "Form labels associated with inputs; error messages announced",
                "Responsive design works at 200% zoom without horizontal scrolling",
                "Skip to main content link for keyboard users",
                "ARIA labels and roles where native HTML insufficient",
                "Language attribute set; lang changes marked where applicable",
              ],
            },
            {
              title: "Known Limitations & Workarounds",
              items: [
                "Some older PDF documents lack tagging - request accessible versions via contact form",
                "Embedded Google Map lacks full keyboard control - use text address or external map link",
                "Data tables on selection pages may be difficult on mobile - Excel downloads provided",
                "Colour used as sole indicator in some status badges - text labels also present",
                "Auto-playing media not present; no flashing content above threshold",
              ],
            },
          ].map((section) => (
            <div key={section.title}>
              <h3
                className="text-xl font-bold text-[#0B2545] mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 p-3 bg-[#F8F6F1] rounded-lg border border-gray-100"
                  >
                    <span className="text-teal-500 shrink-0 mt-0.5">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const FEATURES = [
    {
      category: "Visual",
      features: [
        "High contrast mode compatible",
        "Scalable text up to 200%",
        "Consistent colour palette (WCAG AA)",
        "No colour-only information",
        "Focus visible on all elements",
      ],
    },
    {
      category: "Navigation",
      features: [
        "Keyboard accessible (Tab, Enter, Esc)",
        "Skip to main content link",
        "Logical tab order",
        "Clear focus indicators",
        "Breadcrumbs on deep pages",
      ],
    },
    {
      category: "Content",
      features: [
        "Semantic heading structure",
        "Descriptive link text",
        "Alt text for all images",
        "Plain language principles",
        "Expandable sections (FAQs)",
      ],
    },
    {
      category: "Forms",
      features: [
        "Labels for all inputs",
        "Error messages announced",
        "Required fields marked",
        "Input purpose autocomplete",
        "Validation on submit",
      ],
    },
    {
      category: "Technical",
      features: [
        "Valid HTML5 & CSS",
        "ARIA landmarks (main, nav, aside)",
        "Language declaration",
        "Responsive viewport",
        "No auto-refresh or timeouts",
      ],
    },
    {
      category: "Assistive Tech",
      features: [
        "Screen reader tested (NVDA, VoiceOver)",
        "Voice control compatible",
        "High contrast OS mode works",
        "ZoomText/magnifier compatible",
        "Braille display compatible",
      ],
    },
  ];

  return (
    <section className="py-16 px-4 bg-[#F8F6F1]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
            Features
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Accessibility Features
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.category} className="bg-white rounded-xl p-6 border border-gray-100">
              <h3
                className="text-lg font-bold text-[#0B2545] mb-4 flex items-center gap-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <span className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 text-sm font-bold">
                  {f.category.charAt(0)}
                </span>
                {f.category}
              </h3>
              <ul className="space-y-2">
                {f.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-teal-500 shrink-0 mt-1">•</span>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestingSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-3xl font-bold text-[#0B2545] mb-8 text-center"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Testing & Evaluation
        </h2>
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {[
            {
              title: "Automated Testing",
              tools: "axe-core, Lighthouse, WAVE",
              frequency: "Every deploy",
              status: "Passing",
            },
            {
              title: "Manual Testing",
              tools: "Keyboard-only, Screen readers",
              frequency: "Monthly",
              status: "Ongoing",
            },
            {
              title: "User Testing",
              tools: "People with disabilities",
              frequency: "Quarterly",
              status: "Planned",
            },
            {
              title: "Code Review",
              tools: "ESLint a11y plugin",
              frequency: "Every PR",
              status: "Enforced",
            },
          ].map((t) => (
            <div key={t.title} className="bg-[#F8F6F1] rounded-xl p-6 border border-gray-100">
              <h3 className="font-bold text-[#0B2545] mb-2">{t.title}</h3>
              <p className="text-gray-600 text-sm mb-2">
                <strong>Tools:</strong> {t.tools}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                <strong>Frequency:</strong> {t.frequency}
              </p>
              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                {t.status}
              </span>
            </div>
          ))}
        </div>

        <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
          <h3
            className="text-lg font-bold text-[#0B2545] mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Remediation Roadmap 2026
          </h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-teal-500">•</span> Q1: Audit all PDFs published before 2024;
              remediate or replace top 20
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-500">•</span> Q2: Implement user testing with disability
              organisations in Milne Bay
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-500">•</span> Q3: Add transcript/caption support for any
              future video content
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-500">•</span> Q4: Full WCAG 2.1 AA audit by third party;
              publish conformance claim
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function FeedbackSection() {
  return (
    <section className="py-16 px-4 bg-[#F8F6F1]">
      <div className="max-w-2xl mx-auto text-center">
        <h2
          className="text-3xl font-bold text-[#0B2545] mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Report an Accessibility Issue
        </h2>
        <p className="text-gray-600 mb-8">
          If you encounter a barrier on this site, please let us know. We take all feedback
          seriously and aim to respond within 5 business days.
        </p>
        <div className="space-y-4 text-left">
          <Link
            to="/contact"
            className="block p-4 bg-white rounded-xl border border-gray-100 hover:border-teal-300 hover:shadow-lg transition-all"
          >
            <h3 className="font-bold text-[#0B2545] mb-1">Online Form</h3>
            <p className="text-gray-600 text-sm">
              Use our contact form (select "Accessibility" as subject)
            </p>
          </Link>
          <a
            href="mailto:accessibility@mbpeducation.gov.pg"
            className="block p-4 bg-white rounded-xl border border-gray-100 hover:border-teal-300 hover:shadow-lg transition-all"
          >
            <h3 className="font-bold text-[#0B2545] mb-1">Email</h3>
            <p className="text-gray-600 text-sm">accessibility@mbpeducation.gov.pg</p>
          </a>
          <a
            href="tel:+6756411234"
            className="block p-4 bg-white rounded-xl border border-gray-100 hover:border-teal-300 hover:shadow-lg transition-all"
          >
            <h3 className="font-bold text-[#0B2545] mb-1">Phone</h3>
            <p className="text-gray-600 text-sm">
              +675 641 1234 (ask for Accessibility Coordinator)
            </p>
          </a>
        </div>
        <p className="text-gray-500 text-sm mt-6">
          Please include: page URL, assistive technology used, description of the barrier, and
          suggested improvement.
        </p>
      </div>
    </section>
  );
}

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>
      <SiteHeader />
      <PageHero />
      <StatementSection />
      <FeaturesSection />
      <TestingSection />
      <FeedbackSection />
      <SiteFooter />
    </div>
  );
}
