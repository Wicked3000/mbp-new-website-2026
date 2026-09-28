import { useState } from "react";
// Served from public/assets like every other image on the site, rather than
// imported as a module: the assets were moved into public/ when they were
// re-encoded, so a bundler import would resolve to a path that no longer exists.
const contactBanner = "/assets/contact/contact-banner-img.jpg";
import { api } from "@/lib/api";
import PageHeroBanner, { NAVY_HERO } from "@/components/PageHero";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

function ContactIcon({ name, className = "w-5 h-5" }: { name: string; className?: string }) {
  const paths = {
    pin: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    phone: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4 8.81 2 2 0 0 1 6 6.63h3a2 2 0 0 1 2 1.72c.15 1.13.48 2.22.97 3.23a2 2 0 0 1-.57 2.11l-1.4 1.4a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.11-.57c1.01.49 2.1.82 3.23.97a2 2 0 0 1 1.72 2Z" />
    ),
    email: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
  };

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name as keyof typeof paths] || paths.pin}
    </svg>
  );
}

function PageHero() {
  return (
    <PageHeroBanner
      theme={NAVY_HERO}
      image={contactBanner}
      imageAlt="Contact Milne Bay Education"
      imagePosition="object-[90%_100%]"
      imageOpacity={55}
      eyebrow="We’re Here to Help"
      title="Contact Us"
      lead="Visit, call or send a message. Our team across Alotau and district offices is ready to support students, parents and teachers."
      contentClassName="max-w-3xl rounded-3xl border border-white/15 bg-[#07192E]/35 p-6 sm:p-8 backdrop-blur-md shadow-2xl"
      overlay={
        <>
          <div className="absolute -left-44 -bottom-52 w-[34rem] h-[34rem] rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="absolute right-[38%] -top-44 w-[28rem] h-[28rem] rounded-full bg-sky-300/10 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#07192E]/65 to-transparent" />
          <svg
            className="contact-banner-wave absolute inset-x-0 -bottom-10 h-52 w-full opacity-70"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 72C180 30 330 108 520 62s330-30 680 26v32H0Z"
              fill="#0D9488"
              fillOpacity=".42"
            />
            <path
              d="M0 94c190-42 350 30 540-12s340-24 660 14v24H0Z"
              fill="#07192E"
              fillOpacity=".82"
            />
          </svg>
        </>
      }
    />
  );
}

function ContactCards() {
  return (
    <section className="py-14 px-4 bg-[#F8F6F1] -mt-8 relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: "pin",
              title: "Head Office",
              lines: ["Division of Education", "Alotau, Milne Bay Province", "Papua New Guinea"],
              action: "Get Directions →",
            },
            {
              icon: "phone",
              title: "Phone",
              lines: [
                "+675 641 1234 (Main)",
                "+675 641 1235 (Helpdesk)",
                "Mon–Fri 8:00am – 4:30pm",
              ],
              action: "Call Now →",
            },
            {
              icon: "email",
              title: "Email",
              lines: [
                "info@mbpeducation.gov.pg",
                "help@mbpeducation.gov.pg",
                "Response within 24 hours",
              ],
              action: "Send Email →",
            },
            {
              icon: "clock",
              title: "Office Hours",
              lines: ["Monday – Friday", "8:00am – 4:30pm", "Closed weekends & public holidays"],
              action: "View Holidays →",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0B2545] text-white flex items-center justify-center text-xl mb-4">
                <ContactIcon name={c.icon} className="w-6 h-6" />
              </div>
              <div
                className="font-bold text-[#0B2545] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {c.title}
              </div>
              {c.lines.map((l) => (
                <div key={l} className="text-gray-600 text-sm leading-relaxed">
                  {l}
                </div>
              ))}
              <div className="text-[#0D9488] text-sm font-semibold mt-4">{c.action}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VisitMap() {
  return (
    <div className="mt-8 bg-[#F8F6F1] rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      <div
        className="relative min-h-[340px] overflow-hidden bg-[#DCEAE8]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(11,37,69,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(11,37,69,.08) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      >
        <div className="absolute -left-16 top-20 h-20 w-[120%] -rotate-12 rounded-[50%] border-[18px] border-white/60" />
        <div className="absolute -right-20 bottom-14 h-28 w-[90%] rotate-6 rounded-[50%] border-[20px] border-[#0D9488]/15" />
        <div className="absolute left-[16%] top-[24%] h-24 w-40 rounded-2xl bg-white/55" />
        <div className="absolute right-[14%] top-[18%] h-32 w-48 rounded-2xl bg-white/45" />
        <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="w-16 h-16 rounded-full bg-[#0B2545] text-white grid place-items-center shadow-xl ring-8 ring-white/70 mx-auto">
            <ContactIcon name="pin" className="w-8 h-8" />
          </div>
          <div className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#0B2545] shadow-lg">
            Division of Education
          </div>
        </div>
        <div className="absolute left-5 bottom-5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#0B2545] shadow">
          Alotau, Milne Bay Province
        </div>
      </div>
      <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-12 h-12 shrink-0 rounded-xl bg-[#0D9488] text-white grid place-items-center">
          <ContactIcon name="pin" className="w-6 h-6" />
        </div>
        <div>
          <h3
            className="text-xl font-bold text-[#0B2545]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Visit Us
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Division of Education, Main Street, Alotau, Milne Bay Province, Papua New Guinea.
          </p>
        </div>
      </div>
    </div>
  );
}

function FormSection() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    category: "General Enquiry",
    district: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setSending(true);
    try {
      await api.contact(form);
      setSent(true);
    } catch (e: any) {
      setErr(e.message || "Failed to send");
    } finally {
      setSending(false);
    }
  }
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <span className="text-[#0D9488] text-xs font-bold uppercase tracking-widest">
              Send a Message
            </span>
            <h2
              className="text-3xl font-bold text-[#0B2545] mt-2 mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              How can we help?
            </h2>
            <p className="text-gray-500 mb-8">
              Complete the form and our team will respond within one business day.
            </p>
            {sent ? (
              <div
                role="status"
                aria-live="polite"
                className="bg-teal-50 border border-teal-200 rounded-xl p-8 text-center"
              >
                <ContactIcon name="check" className="w-10 h-10 mx-auto mb-3 text-[#0D9488]" />
                <div className="text-[#0B2545] font-bold text-lg mb-1">Message sent</div>
                <p className="text-gray-600 text-sm">
                  Thank you. We’ll respond via email or phone shortly. For urgent matters please
                  call +675 641 1234.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 text-[#0D9488] font-semibold text-sm hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {err && (
                  <div
                    role="alert"
                    className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-xl"
                  >
                    {err}
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="text-sm font-semibold text-gray-700">
                      Full Name <span aria-hidden="true">*</span>
                    </label>
                    <input
                      required
                      id="contact-name"
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      placeholder="John Doe"
                      className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="text-sm font-semibold text-gray-700">
                      Phone
                    </label>
                    <input
                      value={form.phone}
                      id="contact-phone"
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+675 7000 0000"
                      className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-email" className="text-sm font-semibold text-gray-700">
                    Email <span aria-hidden="true">*</span>
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none text-sm"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-category"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Category
                    </label>
                    <select
                      value={form.category}
                      id="contact-category"
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none text-sm"
                    >
                      <option>General Enquiry</option>
                      <option>Enrolment & Transfers</option>
                      <option>Examinations & Selections</option>
                      <option>Teacher Support</option>
                      <option>FODE / VET</option>
                      <option>Complaint</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="contact-district"
                      className="text-sm font-semibold text-gray-700"
                    >
                      District
                    </label>
                    <select
                      value={form.district}
                      id="contact-district"
                      onChange={(e) => setForm({ ...form, district: e.target.value })}
                      className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none text-sm"
                    >
                      <option value="">Select district</option>
                      <option>Alotau</option>
                      <option>Es'ala</option>
                      <option>Kiriwina-Goodenough</option>
                      <option>Samarai-Murua</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-subject" className="text-sm font-semibold text-gray-700">
                    Subject <span aria-hidden="true">*</span>
                  </label>
                  <input
                    required
                    id="contact-subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Brief subject"
                    className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="text-sm font-semibold text-gray-700">
                    Message <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    required
                    id="contact-message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe your enquiry in detail…"
                    className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none text-sm resize-none"
                  />
                </div>
                <button
                  disabled={sending}
                  aria-busy={sending}
                  type="submit"
                  className="w-full sm:w-auto bg-[#0B2545] hover:bg-[#163663] text-white font-semibold px-8 py-3.5 rounded-lg transition-colors disabled:opacity-60"
                >
                  {sending ? "Sending…" : "Send Message →"}
                </button>
                <p className="text-xs text-gray-400">
                  By submitting you agree to our privacy policy. We never share your details. Saved
                  to MySQL contact_messages.
                </p>
              </form>
            )}
          </div>
          <div className="lg:col-span-2">
            <div className="bg-[#0B2545] rounded-2xl p-6 text-white">
              <h3
                className="font-bold text-lg mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                District Education Contacts
              </h3>
              <div className="space-y-3 text-sm max-h-[520px] overflow-auto pr-1">
                {[
                  ["Alotau District", "+675 641 1234 ext. 101", "alotau@mbpeducation.gov.pg"],
                  ["Esa'ala District", "+675 641 1234 ext. 102", "esaala@mbpeducation.gov.pg"],
                  ["Kiriwina-Goodenough", "+675 641 1234 ext. 103", "kiriwina@mbpeducation.gov.pg"],
                  ["Samarai-Murua", "+675 641 1234 ext. 104", "samarai@mbpeducation.gov.pg"],
                  ["Huhu District", "+675 641 1234 ext. 105", "huhu@mbpeducation.gov.pg"],
                  ["Rabaruana District", "+675 641 1234 ext. 106", "rabaruana@mbpeducation.gov.pg"],
                ].map(([d, p, e]) => (
                  <div key={d} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="font-semibold text-white">{d}</div>
                    <div className="text-teal-200 text-xs mt-1">{p}</div>
                    <div className="text-teal-200 text-xs">{e}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-[#C9A84C] rounded-xl p-4 text-[#0B2545]">
                <div className="font-bold text-sm">Emergency Helpdesk</div>
                <div className="text-sm mt-1">For urgent school closures or safety issues:</div>
                <div className="font-bold mt-1 flex items-center justify-center gap-2">
                  <ContactIcon name="phone" className="w-4 h-4" />
                  <span>+675 641 1234 • help@mbpeducation.gov.pg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <VisitMap />
      </div>
    </section>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>
      <SiteHeader />
      <PageHero />
      <main id="main-content">
        <ContactCards />
      </main>
      <FormSection />
      <SiteFooter />
    </div>
  );
}
