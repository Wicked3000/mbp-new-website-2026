import { useState } from "react";
import whatsappCartoon from "../../assets/whatsapp/whatsapp-cartoon-img.png";
import { api } from "@/lib/api";

export function HelpCTASection() {
  const [phone, setPhone] = useState("");
  const [channel, setChannel] = useState("Official announcements");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.subscribeWhatsApp(phone, channel);
      setPhone("");
      setChannel("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-14 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-[22px] bg-[#0B2545] overflow-hidden relative">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#0D9488]/20 blur-2xl" />
          <div className="relative grid lg:grid-cols-2 gap-8 p-8 sm:p-10">
            <div>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-[#C9A84C] text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Support
              </span>
              <h2
                className="text-3xl font-bold text-white mt-3 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Stay connected to education updates
              </h2>
              <p className="text-blue-100/80 mt-3 leading-relaxed">
                Subscribe your WhatsApp number to receive official announcements, school updates,
                examination information, and Division notices.
              </p>
              <p className="text-blue-100/70 mt-3 text-sm leading-relaxed">
                Choose the channel that best matches your needs. We will add your number to the
                appropriate Division WhatsApp channel or group.
              </p>
              <div className="relative mt-7 overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#164e72]/70 via-white/5 to-[#0D9488]/20 p-3 shadow-2xl">
                <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-[#C9A84C]/20 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-[#0D9488]/30 blur-2xl" />
                <div className="relative flex items-center justify-center">
                  <img
                    src={whatsappCartoon}
                    alt="Person holding a phone with WhatsApp"
                    className="h-64 w-full object-contain object-bottom drop-shadow-[0_20px_18px_rgba(0,0,0,0.28)] sm:h-72"
                  />
                </div>
                <span className="relative mt-1 block text-center text-[10px] font-bold uppercase tracking-[0.28em] text-[#C9A84C]">
                  Milne Bay, connected
                </span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="text-lg font-bold text-[#0B2545]">Join WhatsApp updates</div>
              <p className="text-sm text-gray-500 mt-1">
                Enter your mobile number to subscribe to official education updates.
              </p>
              <form onSubmit={subscribe} className="mt-5 space-y-4">
                <div>
                  <label
                    htmlFor="whatsapp-phone"
                    className="text-xs font-bold uppercase tracking-widest text-gray-600"
                  >
                    WhatsApp number
                  </label>
                  <input
                    id="whatsapp-phone"
                    type="tel"
                    inputMode="tel"
                    required
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+675 7XXX XXXX"
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20"
                  />
                </div>
                <div>
                  <label
                    htmlFor="whatsapp-channel"
                    className="text-xs font-bold uppercase tracking-widest text-gray-600"
                  >
                    Updates channel
                  </label>
                  <select
                    id="whatsapp-channel"
                    value={channel}
                    onChange={(event) => setChannel(event.target.value)}
                    required
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#0D9488]"
                  >
                    <option value="">Select a channel</option>
                    <option>Official announcements</option>
                    <option>Parent and guardian updates</option>
                    <option>Teacher updates</option>
                    <option>FODE and distance learning</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-[#0D9488] text-white font-bold px-6 py-3 rounded-full hover:bg-[#0b7a6e] transition-colors text-sm disabled:opacity-60"
                >
                  {status === "loading" ? "Subscribing..." : "Subscribe to WhatsApp updates"}
                </button>
                <div aria-live="polite" className="min-h-5 text-sm font-semibold">
                  {status === "success" && (
                    <p className="text-emerald-700">
                      You are subscribed. Thank you for staying connected.
                    </p>
                  )}
                  {status === "error" && (
                    <p className="text-red-600">
                      We could not save your subscription right now. Please try again.
                    </p>
                  )}
                </div>
              </form>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Avg. response
                within 24 hours • Mon–Fri 8am–4:30pm
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
