// Unified API client: tries PHP backend first, falls back to localStorage mock
const BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost/mbp-api";

function token() {
  return localStorage.getItem("mbp_admin_token") || "";
}

async function request(path: string, opts: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((opts.headers as any) || {}),
  };
  const t = token();
  if (t) headers["Authorization"] = `Bearer ${t}`;
  try {
    const res = await fetch(`${BASE}${path}`, { ...opts, headers });
    if (res.status === 204) return null;
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = j.details ? `${j.error}: ${j.details}` : j.error || `HTTP ${res.status}`;
      const err: any = new Error(msg);
      err.status = res.status;
      err.details = j.details;
      if (res.status === 401) err.__auth = true;
      if (opts.method === undefined || opts.method === "GET" || res.status === 401)
        err.__fallback = true;
      throw err;
    }
    return j;
  } catch (e: any) {
    if (e?.status === 401) e.__fallback = true;
    if (opts.method === undefined || opts.method === "GET") {
      (e as any).__fallback = true;
    }
    // for saving (POST/PUT/DELETE) also allow fallback on 401/auth errors so admin never blocks
    if (e?.__auth) e.__fallback = true;
    // network errors
    if (e?.message?.includes("Failed to fetch") || e?.message?.includes("NetworkError"))
      e.__fallback = true;
    throw e;
  }
}

// localStorage fallback store
const LS_KEY = "mbp_mock_db_v1";
type MockDB = Record<string, any[]>;
function loadMock(): MockDB {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveMock(db: MockDB) {
  localStorage.setItem(LS_KEY, JSON.stringify(db));
}
function ensureMock(entity: string, seed: any[]) {
  const db = loadMock();
  if (!db[entity]) {
    db[entity] = seed;
    saveMock(db);
  }
}

// seeds for fallback (subset)
const SEEDS: Record<string, any[]> = {
  hero_slides: [
    {
      id: 1,
      src: "/assets/slider/mbp-img1.png",
      alt: "Milne Bay students and community learning",
      sort_order: 1,
      is_active: 1,
    },
    {
      id: 2,
      src: "/assets/slider/mbp-img2.png",
      alt: "Milne Bay Province schools and education",
      sort_order: 2,
      is_active: 1,
    },
    {
      id: 3,
      src: "/assets/slider/mbp-img3.png",
      alt: "Milne Bay coastal education community",
      sort_order: 3,
      is_active: 1,
    },
  ],
  news: [
    {
      id: 1,
      tag: "Announcement",
      tag_color: "bg-[#0D9488]",
      news_date: "September 18, 2026",
      title: "Grade 8 and Grade 10 Examination Timetable Released",
      excerpt:
        "The Division of Education has officially released the 2026 examination timetable for all Grade 8 and Grade 10 students across Milne Bay Province.",
      img: "https://images.unsplash.com/photo-1627423896085-e3e694d88e40?w=600&h=380&fit=crop&auto=format",
      is_published: 1,
      is_previous: 0,
    },
    {
      id: 2,
      tag: "Programs",
      tag_color: "bg-[#C9A84C] text-[#0B2545]",
      news_date: "September 10, 2026",
      title: "New VET Training Centres to Open in Alotau and Samarai",
      excerpt:
        "Two new Vocational Education and Training centres are set to open in Term 4, expanding skills-based learning opportunities for youth across the province.",
      img: "https://images.unsplash.com/photo-1632215861513-130b66fe97f4?w=600&h=380&fit=crop&auto=format",
      is_published: 1,
      is_previous: 0,
    },
    {
      id: 3,
      tag: "Notice",
      tag_color: "bg-[#0B2545]",
      news_date: "August 29, 2026",
      title: "School Subsidy Payment Schedule for Term 4 Now Available",
      excerpt:
        "Head teachers and school boards are advised to collect the Term 4 subsidy payment schedules from the Division office by 5 October 2026.",
      img: "https://images.unsplash.com/photo-1632932693914-89b90ae3d16d?w=600&h=380&fit=crop&auto=format",
      is_published: 1,
      is_previous: 0,
    },
  ],
  notices: [
    {
      id: 1,
      notice_date: "Sep 22",
      title: "PEB Meeting – October 2026 agenda published",
      is_published: 1,
    },
    {
      id: 2,
      notice_date: "Sep 17",
      title: "Teacher Relief Grant applications close 30 Sep",
      is_published: 1,
    },
    {
      id: 3,
      notice_date: "Sep 12",
      title: "Grade 12 trial exam results now available",
      is_published: 1,
    },
    {
      id: 4,
      notice_date: "Sep 5",
      title: "School board compliance audit schedule released",
      is_published: 1,
    },
    {
      id: 5,
      notice_date: "Aug 28",
      title: "Curriculum support materials distributed to all districts",
      is_published: 1,
    },
    {
      id: 6,
      notice_date: "Aug 20",
      title: "Annual School Sports Carnival registration open",
      is_published: 1,
    },
  ],
  events: [
    {
      id: 1,
      month: "OCT",
      day: "07",
      title: "Grade 8 National Examinations",
      event_time: "8:00 AM • All Centres",
      cat: "Examinations",
      color: "bg-[#0B2545]",
    },
    {
      id: 2,
      month: "OCT",
      day: "14",
      title: "PEB Quarterly Meeting in Alotau",
      event_time: "9:00 AM • Provincial HQ",
      cat: "Governance",
      color: "bg-[#0D9488]",
    },
    {
      id: 3,
      month: "NOV",
      day: "03",
      title: "School Sports Carnival 2026",
      event_time: "All Day • Alotau Oval",
      cat: "Co-Curricular",
      color: "bg-[#C9A84C] text-[#0B2545]",
    },
    {
      id: 4,
      month: "DEC",
      day: "05",
      title: "Grade 10 & 12 Results Release",
      event_time: "Online & School Noticeboards",
      cat: "Results",
      color: "bg-[#163663]",
    },
  ],
  programs: [
    {
      id: 1,
      code: "01",
      label: "Basic Education",
      level: "Elementary – Grade 8",
      description:
        "Providing foundational literacy, numeracy and life skills for all children from Prep through to Grade 8 across Milne Bay.",
      color: "bg-[#0B2545]",
      accent: "bg-teal-500",
      href: "/basic",
      img: "/assets/education_programs/basic/banner.png",
      sort_order: 1,
    },
    {
      id: 2,
      code: "02",
      label: "Post Primary",
      level: "Grade 9 – Grade 12",
      description:
        "Secondary education pathways preparing students for tertiary admission, technical training, and employment in the formal sector.",
      color: "bg-[#163663]",
      accent: "bg-amber-400",
      href: "/post",
      img: "/assets/education_programs/post/banner.png",
      sort_order: 2,
    },
    {
      id: 3,
      code: "03",
      label: "VET",
      level: "Vocational Education",
      description:
        "Skills and trades training for out-of-school youth and adults, delivered through registered VET providers across the province.",
      color: "bg-[#0D9488]",
      accent: "bg-amber-300",
      href: "/vet",
      img: "/assets/education_programs/vet/banner.png",
      sort_order: 3,
    },
    {
      id: 4,
      code: "04",
      label: "FODE",
      level: "Flexible Open & Distance",
      description:
        "Distance and open learning enabling students in remote areas to access quality secondary education without leaving their communities.",
      color: "bg-[#0B2545]",
      accent: "bg-teal-400",
      href: "/fode",
      img: "/assets/education_programs/fode/banner.png",
      sort_order: 4,
    },
  ],
  stats: [
    {
      id: 1,
      value_text: "312",
      label: "Schools",
      sub: "Province-wide",
      sort_order: 1,
    },
    {
      id: 2,
      value_text: "48,200+",
      label: "Students",
      sub: "Enrolled 2026",
      sort_order: 2,
    },
    {
      id: 3,
      value_text: "2,140",
      label: "Teachers",
      sub: "Qualified staff",
      sort_order: 3,
    },
    {
      id: 4,
      value_text: "17",
      label: "Districts",
      sub: "Covered",
      sort_order: 4,
    },
  ],
  districts: [
    { id: 1, name: "Alotau", schools: 42, type: "Urban", students: "6,800+" },
    {
      id: 2,
      name: "Samarai-Murua",
      schools: 22,
      type: "Island",
      students: "1,900+",
    },
    { id: 3, name: "Esa'ala", schools: 15, type: "Island", students: "1,600+" },
    {
      id: 4,
      name: "Kiriwina-Goodenough",
      schools: 18,
      type: "Island",
      students: "2,100+",
    },
    { id: 5, name: "Huhu", schools: 21, type: "Rural", students: "2,300+" },
    {
      id: 6,
      name: "Rabaruana",
      schools: 28,
      type: "Rural",
      students: "3,200+",
    },
    { id: 7, name: "Losuia", schools: 17, type: "Island", students: "1,700+" },
    { id: 8, name: "Dobu", schools: 16, type: "Island", students: "1,800+" },
  ],
  leadership: [
    {
      id: 1,
      name: "Dr. John K. Boro",
      title: "Provincial Education Advisor",
      bio: "Over 25 years in educational leadership across PNG. Holds a PhD in Educational Administration from UPNG.",
      icon: "👨‍💼",
      sort_order: 1,
    },
    {
      id: 2,
      name: "Ms. Margaret M. Tari",
      title: "Deputy Advisor - Basic Education",
      bio: "Former head teacher with extensive experience in elementary and primary curriculum implementation.",
      icon: "👩‍🏫",
      sort_order: 2,
    },
    {
      id: 3,
      name: "Mr. Peter G. Wai",
      title: "Deputy Advisor - Post Primary & VET",
      bio: "Specialist in secondary education pathways and vocational training coordination across the province.",
      icon: "👨‍🏫",
      sort_order: 3,
    },
    {
      id: 4,
      name: "Ms. Grace L. Kila",
      title: "Director - FODE & Distance Learning",
      bio: "Champion of flexible learning for remote communities. Masters in Distance Education from DWU.",
      icon: "👩‍💻",
      sort_order: 4,
    },
  ],
  quick_links: [
    {
      id: 1,
      icon: "calendar",
      label: "Term Dates",
      description: "2026 Academic Calendar",
      href: "/#news",
      sort_order: 1,
    },
    {
      id: 2,
      icon: "school",
      label: "School Directory",
      description: "Find schools in Milne Bay",
      href: "/basic#schools",
      sort_order: 2,
    },
    {
      id: 3,
      icon: "file",
      label: "Forms & Downloads",
      description: "Official documents",
      href: "/basic",
      sort_order: 3,
    },
    {
      id: 4,
      icon: "phone",
      label: "Emergency Contacts",
      description: "Helpline & support",
      href: "/contact",
      sort_order: 4,
    },
  ],
  partners: [
    { id: 1, name: "National Dept. of Education", sort_order: 1 },
    { id: 2, name: "Teaching Service Commission", sort_order: 2 },
    { id: 3, name: "TVET Authority", sort_order: 3 },
    { id: 4, name: "UNICEF PNG", sort_order: 4 },
    { id: 5, name: "Australia PNG Partnership", sort_order: 5 },
    { id: 6, name: "World Bank", sort_order: 6 },
  ],
  selections_grade9: [
    {
      id: 1,
      school: "Cameron Secondary School",
      district: "Alotau",
      type: "National High",
      capacity: 300,
      placed: 298,
      stream: "Science, Humanities, Business",
      cutoff: 185,
    },
    {
      id: 2,
      school: "Alotau Secondary School",
      district: "Alotau",
      type: "Provincial High",
      capacity: 250,
      placed: 248,
      stream: "Science, Humanities, Business, Technical",
      cutoff: 165,
    },
    {
      id: 3,
      school: "Bwesiruru Secondary",
      district: "Alotau",
      type: "Provincial High",
      capacity: 180,
      placed: 178,
      stream: "Science, Humanities, Business",
      cutoff: 145,
    },
    {
      id: 4,
      school: "Hagita Secondary School",
      district: "Alotau",
      type: "Provincial High",
      capacity: 160,
      placed: 158,
      stream: "Humanities, Business, Technical",
      cutoff: 135,
    },
    {
      id: 5,
      school: "Kiriwina Secondary School",
      district: "Kiriwina-Goodenough",
      type: "Provincial High",
      capacity: 120,
      placed: 118,
      stream: "Humanities, Business",
      cutoff: 125,
    },
  ],
  selections_grade11: [
    {
      id: 1,
      school: "Cameron Secondary School",
      district: "Alotau",
      type: "National High",
      streams_json: '{"Science":80,"Humanities":60,"Business":40}',
      placed_json: '{"Science":78,"Humanities":58,"Business":38}',
      cutoff_json: '{"Science":220,"Humanities":200,"Business":190}',
    },
    {
      id: 2,
      school: "Alotau Secondary School",
      district: "Alotau",
      type: "Provincial High",
      streams_json: '{"Science":60,"Humanities":50,"Business":40,"Technical":30}',
      placed_json: '{"Science":58,"Humanities":48,"Business":38,"Technical":28}',
      cutoff_json: '{"Science":200,"Humanities":185,"Business":175,"Technical":165}',
    },
  ],
  downloads: [
    {
      id: 1,
      name: "Basic Education Handbook 2026",
      type: "PDF",
      size_text: "2.4 MB",
      category: "Policy",
      description: "Complete handbook",
      file_path: "",
    },
  ],
  contact_messages: [],
  site_settings: [],
};

// Ensure seeds exist in LS
Object.keys(SEEDS).forEach((k) => ensureMock(k, SEEDS[k as keyof typeof SEEDS]));

export const api = {
  // Auth
  async login(username: string, password: string) {
    // try backend first
    try {
      const r = await request("/auth/login.php", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      if (r?.token) {
        localStorage.setItem("mbp_admin_token", r.token);
        localStorage.setItem("mbp_admin_user", JSON.stringify(r.user));
        return r;
      }
    } catch (e: any) {
      // fallback mock login: admin/password
      if (username === "admin" && password === "password") {
        const token = "mock_" + Math.random().toString(36).slice(2);
        localStorage.setItem("mbp_admin_token", token);
        localStorage.setItem(
          "mbp_admin_user",
          JSON.stringify({ id: 1, username: "admin", role: "super_admin" }),
        );
        return {
          token,
          user: {
            id: 1,
            username: "admin",
            role: "super_admin",
            email: "admin@mbpeducation.gov.pg",
          },
        };
      }
      throw new Error("Invalid credentials");
    }
    throw new Error("Login failed");
  },
  logout() {
    localStorage.removeItem("mbp_admin_token");
    localStorage.removeItem("mbp_admin_user");
  },
  user() {
    try {
      return JSON.parse(localStorage.getItem("mbp_admin_user") || "null");
    } catch {
      return null;
    }
  },
  isAuthed() {
    return !!token();
  },

  // generic
  async list(entity: string) {
    try {
      const r = await request(`/entities.php?entity=${entity}`);
      return r.data as any[];
    } catch (e: any) {
      if (e.__fallback) {
        if (entity === "whatsapp_subscribers") {
          return JSON.parse(localStorage.getItem("mbp_whatsapp_subscribers") || "[]");
        }
        const db = loadMock();
        return db[entity] || [];
      }
      throw e;
    }
  },
  async get(entity: string, id: any) {
    try {
      const r = await request(`/entities.php?entity=${entity}&id=${id}`);
      return r.data;
    } catch (e: any) {
      if (e.__fallback) {
        const db = loadMock();
        return (db[entity] || []).find((x: any) => String(x.id) === String(id));
      }
      throw e;
    }
  },
  async create(entity: string, payload: any) {
    try {
      const r = await request(`/entities.php?entity=${entity}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return r;
    } catch (e: any) {
      if (e.__fallback) {
        if (entity === "whatsapp_subscribers") {
          const subscribers = JSON.parse(localStorage.getItem("mbp_whatsapp_subscribers") || "[]");
          const id = Math.max(0, ...subscribers.map((item: any) => item.id || 0)) + 1;
          subscribers.push({ id, ...payload, created_at: new Date().toISOString() });
          localStorage.setItem("mbp_whatsapp_subscribers", JSON.stringify(subscribers));
          return { id };
        }
        const db = loadMock();
        const arr = db[entity] || [];
        const id = Math.max(0, ...arr.map((x: any) => x.id || 0)) + 1;
        const row = { id, ...payload };
        arr.push(row);
        db[entity] = arr;
        saveMock(db);
        return { id };
      }
      throw e;
    }
  },
  async update(entity: string, id: any, payload: any) {
    try {
      const r = await request(`/entities.php?entity=${entity}&id=${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      return r;
    } catch (e: any) {
      if (e.__fallback) {
        if (entity === "whatsapp_subscribers") {
          const subscribers = JSON.parse(localStorage.getItem("mbp_whatsapp_subscribers") || "[]");
          const idx = subscribers.findIndex((item: any) => String(item.id) === String(id));
          if (idx >= 0) subscribers[idx] = { ...subscribers[idx], ...payload };
          localStorage.setItem("mbp_whatsapp_subscribers", JSON.stringify(subscribers));
          return { ok: true };
        }
        const db = loadMock();
        const arr = db[entity] || [];
        const idx = arr.findIndex((x: any) => String(x.id) === String(id));
        if (idx >= 0) arr[idx] = { ...arr[idx], ...payload };
        saveMock(db);
        return { ok: true };
      }
      throw e;
    }
  },
  async remove(entity: string, id: any) {
    try {
      const r = await request(`/entities.php?entity=${entity}&id=${id}`, {
        method: "DELETE",
      });
      return r;
    } catch (e: any) {
      if (e.__fallback) {
        if (entity === "whatsapp_subscribers") {
          const subscribers = JSON.parse(localStorage.getItem("mbp_whatsapp_subscribers") || "[]");
          const filtered = subscribers.filter((item: any) => String(item.id) !== String(id));
          localStorage.setItem("mbp_whatsapp_subscribers", JSON.stringify(filtered));
          return { ok: true };
        }
        const db = loadMock();
        db[entity] = (db[entity] || []).filter((x: any) => String(x.id) !== String(id));
        saveMock(db);
        return { ok: true };
      }
      throw e;
    }
  },
  async settings() {
    try {
      const r = await request(`/entities.php?entity=site_settings`);
      return r.data as Record<string, string>;
    } catch (e: any) {
      if (e.__fallback) {
        const db = loadMock();
        // site_settings stored differently; return map
        const rows = (db["site_settings"] || []) as any[];
        const m: Record<string, string> = {};
        // if empty, seed defaults
        if (!rows.length) {
          const defaults: Record<string, string> = {
            site_phone: "+675 641 1234",
            site_email: "info@mbpeducation.gov.pg",
            site_hours: "Mon – Fri: 8:00am – 4:30pm",
            site_address: "Division of Education, Alotau, Milne Bay Province, PNG",
          };
          return defaults;
        }
        rows.forEach((r) => (m[r.skey] = r.svalue));
        return m;
      }
      throw e;
    }
  },
  async updateSetting(key: string, value: string) {
    try {
      const r = await request(`/entities.php?entity=site_settings`, {
        method: "POST",
        body: JSON.stringify({ skey: key, svalue: value }),
      });
      return r;
    } catch (e: any) {
      if (e.__fallback) {
        const db = loadMock();
        let arr = db["site_settings"] || [];
        const idx = arr.findIndex((x: any) => x.skey === key);
        if (idx >= 0) arr[idx].svalue = value;
        else arr.push({ skey: key, svalue: value });
        db["site_settings"] = arr;
        saveMock(db);
        return { ok: true };
      }
      throw e;
    }
  },
  async bulkCreateSelectionStudents(rows: any[]) {
    try {
      return await request("/selections/students/bulk", {
        method: "POST",
        body: JSON.stringify({ rows }),
      });
    } catch (e: any) {
      if (!e.__fallback) throw e;
      const db = loadMock();
      const arr = db["selection_students"] || [];
      const firstId = Math.max(0, ...arr.map((item: any) => item.id || 0));
      rows.forEach((row, index) => arr.push({ id: firstId + index + 1, ...row }));
      db["selection_students"] = arr;
      saveMock(db);
      return { ok: true, count: rows.length, local: true };
    }
  },
  async subscribeWhatsApp(phone: string, source: string) {
    const normalizedPhone = phone.replace(/[^\d+]/g, "");
    if (!/^\+?\d{7,15}$/.test(normalizedPhone)) throw new Error("Enter a valid WhatsApp number");
    try {
      return await request("/whatsapp/subscribe", {
        method: "POST",
        body: JSON.stringify({ phone: normalizedPhone, source }),
      });
    } catch (e: any) {
      if (!e.__fallback) throw e;
      const key = "mbp_whatsapp_subscribers";
      const subscribers = JSON.parse(localStorage.getItem(key) || "[]");
      if (!subscribers.some((item: any) => item.phone === normalizedPhone))
        subscribers.push({
          phone: normalizedPhone,
          source,
          created_at: new Date().toISOString(),
        });
      localStorage.setItem(key, JSON.stringify(subscribers));
      return { ok: true, local: true };
    }
  },
  async contact(payload: any) {
    // public contact does fallback to messages store
    try {
      const r = await request(`/contact.php`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return r;
    } catch (e: any) {
      // fallback
      const db = loadMock();
      const arr = db["contact_messages"] || [];
      const id = Math.max(0, ...arr.map((x: any) => x.id || 0)) + 1;
      arr.push({
        id,
        ...payload,
        status: "new",
        created_at: new Date().toISOString(),
      });
      db["contact_messages"] = arr;
      saveMock(db);
      return { ok: true };
    }
  },
  async upload(file: File): Promise<string> {
    const toDataUrl = () =>
      new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.onerror = () => rej(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
    const fd = new FormData();
    fd.append("file", file);
    const t = token();
    const headers: Record<string, string> = {};
    if (t) headers["Authorization"] = `Bearer ${t}`;
    const uploadUrl = BASE.endsWith("/api") ? `${BASE}/upload` : `${BASE}/upload.php`;
    try {
      const r = await fetch(uploadUrl, {
        method: "POST",
        headers,
        body: fd,
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || `Upload failed ${r.status}`);
      if (j.url) return j.url as string;
      throw new Error("No url in response");
    } catch (e: any) {
      // offline or backend not deployed - fallback to data URL so device upload always works
      return await toDataUrl();
    }
  },

  async dashboard() {
    try {
      const r = await request(`/stats/dashboard.php`);
      return r.data;
    } catch (e: any) {
      if (e.__fallback) {
        const db = loadMock();
        return {
          news: (db.news || []).length,
          notices: (db.notices || []).length,
          events: (db.events || []).length,
          messages_new: (db.contact_messages || []).filter((x: any) => x.status === "new").length,
          messages_total: (db.contact_messages || []).length,
          schools: 312,
          districts: (db.districts || []).length,
          recent_messages: (db.contact_messages || []).slice(-5).reverse(),
        };
      }
      throw e;
    }
  },
};
