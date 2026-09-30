"use client";

import { useState } from "react";
import { useEntity } from "@/hooks/useDynamic";
import { api } from "@/lib/api";
import Reveal from "@/components/Reveal";

export function HelpCTASection() {
  const CTA_FALLBACK = {
    badge: "Support",
    heading: "Stay connected to education updates",
    body: "Subscribe your WhatsApp number to receive official announcements, school updates, examination information, and Division notices.",
    sub_body:
      "Choose the channel that best matches your needs. We will add your number to the appropriate Division WhatsApp channel or group.",
    image: "/assets/whatsapp/whatsapp-cartoon-img.png",
    image_alt: "Person holding a phone with WhatsApp",
    tagline: "Milne Bay, connected",
    form_title: "Join WhatsApp updates",
    form_body: "Enter your mobile number to subscribe to official education updates.",
    phone_label: "WhatsApp number",
    phone_placeholder: "+675 7XXX XXXX",
    channel_label: "Updates channel",
    channel_prompt: "Select a channel",
    button_label: "Subscribe to WhatsApp updates",
    button_loading_label: "Subscribing...",
    response_note: "Avg. response within 24 hours • Mon–Fri 8am–4:30pm",
  };
  const CHANNELS_FALLBACK = [
    { name: "Official announcements" },
    { name: "Parent and guardian updates" },
    { name: "Teacher updates" },
    { name: "FODE and distance learning" },
  ];
  const { data: ctaRows } = useEntity("home_cta", [CTA_FALLBACK]);
  const { data: channels } = useEntity("home_cta_channels", CHANNELS_FALLBACK);
  const cta = { ...CTA_FALLBACK, ...(ctaRows?.[0] || {}) };

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
      <Reveal className="max-w-7xl mx-auto">
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
                {cta.badge}
              </span>
              <h2
                className="text-3xl font-bold text-white mt-3 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {cta.heading}
              </h2>
              <p className="text-blue-100/80 mt-3 leading-relaxed">{cta.body}</p>
              <p className="text-blue-100/70 mt-3 text-sm leading-relaxed">{cta.sub_body}</p>
              <div className="relative mt-7 overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#164e72]/70 via-white/5 to-[#0D9488]/20 p-3 shadow-2xl">
                <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-[#C9A84C]/20 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-[#0D9488]/30 blur-2xl" />
                <div className="relative flex items-center justify-center">
                  <img loading="lazy" decoding="async"
                    src={cta.image}
                    alt={cta.image_alt}
                    className="h-64 w-full object-contain object-bottom drop-shadow-[0_20px_18px_rgba(0,0,0,0.28)] sm:h-72"
                  />
                </div>
                <span className="relative mt-1 block text-center text-[10px] font-bold uppercase tracking-[0.28em] text-[#C9A84C]">
                  {cta.tagline}
                </span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="text-lg font-bold text-[#0B2545]">{cta.form_title}</div>
              <p className="text-sm text-gray-500 mt-1">{cta.form_body}</p>
              <form onSubmit={subscribe} className="mt-5 space-y-4">
                <div>
                  <label
                    htmlFor="whatsapp-phone"
                    className="text-xs font-bold uppercase tracking-widest text-gray-600"
                  >
                    {cta.phone_label}
                  </label>
                  <input
                    id="whatsapp-phone"
                    type="tel"
                    inputMode="tel"
                    required
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder={cta.phone_placeholder}
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20"
                  />
                </div>
                <div>
                  <label
                    htmlFor="whatsapp-channel"
                    className="text-xs font-bold uppercase tracking-widest text-gray-600"
                  >
                    {cta.channel_label}
                  </label>
                  <select
                    id="whatsapp-channel"
                    value={channel}
                    onChange={(event) => setChannel(event.target.value)}
                    required
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#0D9488]"
                  >
                    <option value="">{cta.channel_prompt}</option>
                    {channels.map((row: any) => (
                      <option key={row.id ?? row.name} value={row.name}>
                        {row.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-[#0D9488] text-white font-bold px-6 py-3 rounded-full hover:bg-[#0b7a6e] transition-colors text-sm disabled:opacity-60"
                >
                  {status === "loading" ? cta.button_loading_label : cta.button_label}
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
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                {cta.response_note}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
