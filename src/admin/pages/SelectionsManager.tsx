import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/admin/components/Toast";

const CSV_ALIASES: Record<string, string> = {
  grade: "grade_level",
  gradelevel: "grade_level",
  no: "position_no",
  number: "position_no",
  primary: "primary_school",
  primaryschool: "primary_school",
  firstname: "first_name",
  name: "student_name",
  fullname: "student_name",
  slf: "slf_no",
  slfno: "slf_no",
  transferredfrom: "transferred_from",
};

function csvKey(value: string) {
  const key = value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  return CSV_ALIASES[key] || key;
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      values.push(value.trim());
      value = "";
    } else {
      value += character;
    }
  }
  values.push(value.trim());
  return values;
}

function parseCsv(text: string) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]).map(csvKey);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce<Record<string, string>>((row, header, index) => {
      row[header] = values[index] || "";
      return row;
    }, {});
  });
}

function normalizeStudentRow(row: Record<string, string>, defaultGrade: number) {
  const grade = Number(row.grade_level || defaultGrade);
  return {
    grade_level: grade,
    school: row.school?.trim() || "",
    position_no: row.position_no === "" || row.position_no == null ? null : Number(row.position_no),
    primary_school: row.primary_school?.trim() || "",
    surname: row.surname?.trim() || "",
    first_name: row.first_name?.trim() || "",
    gender: row.gender?.trim() || "",
    student_name: row.student_name?.trim() || "",
    slf_no: row.slf_no?.trim() || "",
    transferred_from: row.transferred_from?.trim() || "",
  };
}

function SelectionStudentsManager() {
  const toast = useToast();
  const [grade, setGrade] = useState<9 | 11>(9);
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [uploading, setUploading] = useState(false);
  const [csvSchool, setCsvSchool] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>({
    grade_level: 9,
    school: "",
    position_no: "",
    primary_school: "",
    surname: "",
    first_name: "",
    gender: "",
    student_name: "",
    slf_no: "",
    transferred_from: "",
  });

  const load = async () => {
    try {
      setRows((await api.list("selection_students")) as any[]);
    } catch {
      setRows([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeGrade = (nextGrade: 9 | 11) => {
    setGrade(nextGrade);
    setForm((current: any) => ({ ...current, grade_level: nextGrade }));
  };

  const filtered = rows
    .filter((row) => {
      if (Number(row.grade_level) !== grade) return false;
      if (!q) return true;
      return `${row.school} ${row.primary_school} ${row.surname} ${row.first_name} ${row.student_name} ${row.slf_no}`
        .toLowerCase()
        .includes(q.toLowerCase());
    })
    .sort((a, b) => {
      const aName = grade === 9 ? `${a.surname} ${a.first_name}` : a.student_name;
      const bName = grade === 9 ? `${b.surname} ${b.first_name}` : b.student_name;
      return `${a.school} ${aName}`.localeCompare(`${b.school} ${bName}`);
    });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.school.trim()) {
      toast.error("School is required");
      return;
    }
    const payload = normalizeStudentRow(form, grade);
    if (editing) {
      await api.update("selection_students", editing.id, payload);
      toast.success("Student placement updated");
    } else {
      await api.create("selection_students", payload);
      toast.success("Student placement added");
    }
    setEditing(null);
    setForm((current: any) => ({ ...current, school: "", position_no: "", primary_school: "", surname: "", first_name: "", gender: "", student_name: "", slf_no: "", transferred_from: "" }));
    await load();
  }

  async function uploadCsv(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const parsed = parseCsv(await file.text());
      const imported = parsed
        .map((row) => normalizeStudentRow({ ...row, school: row.school || csvSchool }, grade))
        .filter((row) => (row.grade_level === 9 || row.grade_level === 11) && row.school);
      if (!imported.length) throw new Error("Choose a school and use the Grade 9 or Grade 11 CSV headings");
      setUploading(true);
      await api.bulkCreateSelectionStudents(imported);
      toast.success(`${imported.length} student rows imported`);
      await load();
    } catch (error: any) {
      toast.error(error.message || "CSV import failed");
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this student placement?")) return;
    try {
      await api.remove("selection_students", id);
      toast.success("Student placement deleted");
      await load();
    } catch (error: any) {
      toast.error(error.message || "Delete failed");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-bold text-[#0B2545] text-lg">Student Placement Lists</h2>
          <p className="text-sm text-gray-500">Manage the student tables shown on the public Post Primary page.</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search students..." className="px-3 py-2 rounded-full border border-gray-200 text-sm w-48" />
          <button
            type="button"
            onClick={() => changeGrade(9)}
            className={`px-4 py-2 rounded-full text-sm font-bold ${grade === 9 ? "bg-[#0B2545] text-white" : "bg-gray-100"}`}
          >
            Grade 9
          </button>
          <button
            type="button"
            onClick={() => changeGrade(11)}
            className={`px-4 py-2 rounded-full text-sm font-bold ${grade === 11 ? "bg-[#0B2545] text-white" : "bg-gray-100"}`}
          >
            Grade 11
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-[#0D9488] bg-teal-50/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="font-bold text-[#0B2545] text-sm">Bulk import from CSV</div>
            <div className="text-xs text-gray-500 mt-1">
              {grade === 9 ? "CSV headings: NO., PRIMARY SCHOOL, SURNAME, FIRST NAME, GENDER" : "CSV headings: NAME, Gender, SLF No, Transferred From"}
            </div>
            <input value={csvSchool} onChange={(event) => setCsvSchool(event.target.value)} placeholder="School for this CSV" className="mt-2 w-full max-w-sm px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm" />
          </div>
          <label className="inline-flex items-center cursor-pointer bg-[#0D9488] text-white text-sm font-bold px-4 py-2.5 rounded-full hover:bg-[#0b7a6e]">
            {uploading ? "Importing…" : "Upload CSV"}
            <input type="file" accept=".csv,text/csv" onChange={uploadCsv} disabled={uploading} className="hidden" />
          </label>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0B2545] text-white text-left">
              <th className="px-3 py-2">No.</th>
              <th className="px-3 py-2">School</th>
              {grade === 9 ? (
                <>
                  <th className="px-3 py-2">Primary school</th>
                  <th className="px-3 py-2">Student name</th>
                </>
              ) : (
                <>
                  <th className="px-3 py-2">Student name</th>
                  <th className="px-3 py-2">SLF No.</th>
                </>
              )}
              <th className="px-3 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-500">No student placements found.</td></tr>
            )}
            {filtered.map((row) => (
              <tr key={row.id} className="border-b odd:bg-white even:bg-[#F8F6F1]">
                <td className="px-3 py-2">{row.position_no || "-"}</td>
                <td className="px-3 py-2 font-medium text-[#0B2545]">{row.school}</td>
                <td className="px-3 py-2">{grade === 9 ? row.primary_school : row.student_name}</td>
                <td className="px-3 py-2">{grade === 9 ? `${row.surname} ${row.first_name}` : row.slf_no}</td>
                <td className="px-3 py-2 text-right">
                  <button type="button" onClick={() => { setEditing(row); setForm({ ...row, grade_level: grade }); }} className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full mr-1">Edit</button>
                  <button type="button" onClick={() => remove(row.id)} className="text-xs font-bold bg-red-50 text-red-600 px-3 py-1 rounded-full">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={submit} className="rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[#0B2545]">{editing ? "Edit" : "Add"} Grade {grade} placement</h3>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm({ ...form, school: "", position_no: "", primary_school: "", surname: "", first_name: "", gender: "", student_name: "", slf_no: "", transferred_from: "" }); }} className="text-xs bg-gray-100 px-3 py-1 rounded-full">Cancel</button>}
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-600">School</label>
            <input required value={form.school} onChange={(event) => setForm({ ...form, school: event.target.value })} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-600">Position no.</label>
            <input type="number" value={form.position_no} onChange={(event) => setForm({ ...form, position_no: event.target.value })} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" />
          </div>
          {grade === 9 ? (
            <>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-600">Primary school</label>
                <input value={form.primary_school} onChange={(event) => setForm({ ...form, primary_school: event.target.value })} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-600">Surname</label>
                <input required value={form.surname} onChange={(event) => setForm({ ...form, surname: event.target.value })} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-600">First name</label>
                <input required value={form.first_name} onChange={(event) => setForm({ ...form, first_name: event.target.value })} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-600">Student name</label>
                <input required value={form.student_name} onChange={(event) => setForm({ ...form, student_name: event.target.value })} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-600">SLF no.</label>
                <input value={form.slf_no} onChange={(event) => setForm({ ...form, slf_no: event.target.value })} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-600">Transferred from</label>
                <input value={form.transferred_from} onChange={(event) => setForm({ ...form, transferred_from: event.target.value })} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" />
              </div>
            </>
          )}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-600">Gender</label>
            <select value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm">
              <option value="">Select</option>
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
          </div>
        </div>
        <button className="mt-4 bg-[#0D9488] text-white font-bold px-5 py-2.5 rounded-full text-sm">{editing ? "Update placement" : "Add placement"}</button>
      </form>
    </div>
  );
}

function G9() {
  const toast = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    school: "",
    district: "Alotau",
    type: "Provincial High",
    capacity: 0,
    placed: 0,
    stream: "",
    cutoff: 0,
  });
  const [editing, setEditing] = useState<any>(null);
  const load = () => api.list("selections_grade9").then(setRows);
  useEffect(() => {
    load();
  }, []);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = {
      ...form,
      capacity: Number(form.capacity),
      placed: Number(form.placed),
      cutoff: Number(form.cutoff),
    };
    if (editing) {
      await api.update("selections_grade9", editing.id, p);
      toast.success("Grade 9 selection updated");
    } else {
      await api.create("selections_grade9", p);
      toast.success("Grade 9 selection created");
    }
    setEditing(null);
    setForm({
      school: "",
      district: "Alotau",
      type: "Provincial High",
      capacity: 0,
      placed: 0,
      stream: "",
      cutoff: 0,
    });
    load();
  }
  return (
    <div>
      <h3 className="font-bold text-[#0B2545] mb-3">Grade 9 (Grade 8 → 9)</h3>
      <div className="overflow-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0B2545] text-white text-left">
              <th className="px-3 py-2">School</th>
              <th className="px-3 py-2">District</th>
              <th className="px-3 py-2">Cap</th>
              <th className="px-3 py-2">Placed</th>
              <th className="px-3 py-2">Cutoff</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b odd:bg-white even:bg-[#F8F6F1]">
                <td className="px-3 py-2 font-medium">{r.school}</td>
                <td className="px-3 py-2">{r.district}</td>
                <td className="px-3 py-2">{r.capacity}</td>
                <td className="px-3 py-2">{r.placed}</td>
                <td className="px-3 py-2">{r.cutoff}</td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => {
                      setEditing(r);
                      setForm(r);
                    }}
                    className="text-xs font-bold bg-amber-100 px-2 py-1 rounded-full mr-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      await api.remove("selections_grade9", r.id);
                      toast.success("Grade 9 selection deleted");
                      load();
                    }}
                    className="text-xs font-bold bg-red-50 text-red-600 px-2 py-1 rounded-full"
                  >
                    Del
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form
        onSubmit={submit}
        className="mt-4 grid sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-gray-100"
      >
        {["school", "district", "type", "capacity", "placed", "stream", "cutoff"].map((k) => (
          <div key={k}>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-600">{k}</label>
            <input
              value={form[k] ?? ""}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm"
              placeholder={k}
            />
          </div>
        ))}
        <button className="sm:col-span-3 bg-[#0D9488] text-white font-bold py-2.5 rounded-full text-sm">
          {editing ? "Update" : "Add"} Grade 9
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm({
                school: "",
                district: "Alotau",
                type: "Provincial High",
                capacity: 0,
                placed: 0,
                stream: "",
                cutoff: 0,
              });
            }}
            className="text-xs bg-gray-100 px-3 py-1 rounded-full"
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}
function G11() {
  const toast = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    school: "",
    district: "Alotau",
    type: "Provincial High",
    capacity: 0,
    placed: 0,
    cutoff: 0,
  });
  const [editing, setEditing] = useState<any>(null);
  const load = () => api.list("selections_grade11").then(setRows);
  useEffect(() => {
    load();
  }, []);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      capacity: Number(form.capacity),
      placed: Number(form.placed),
      cutoff: Number(form.cutoff),
    };
    if (editing) {
      await api.update("selections_grade11", editing.id, payload);
      toast.success("Grade 11 selection updated");
    } else {
      await api.create("selections_grade11", payload);
      toast.success("Grade 11 selection created");
    }
    setEditing(null);
    setForm({
      school: "",
      district: "Alotau",
      type: "Provincial High",
      capacity: 0,
      placed: 0,
      cutoff: 0,
    });
    load();
  }
  return (
    <div>
      <h3 className="font-bold text-[#0B2545] mb-3">Grade 11 (Grade 10 → 11) - school totals</h3>
      <div className="rounded-xl border border-gray-100 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#163663] text-white text-left">
              <th className="px-3 py-2">School</th>
              <th className="px-3 py-2">District</th>
              <th className="px-3 py-2">Capacity</th>
              <th className="px-3 py-2">Placed</th>
              <th className="px-3 py-2">Cutoff</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b odd:bg-white even:bg-[#F8F6F1]">
                <td className="px-3 py-2 font-medium">{r.school}</td>
                <td className="px-3 py-2">{r.district}</td>
                <td className="px-3 py-2">{r.capacity ?? "Not set"}</td>
                <td className="px-3 py-2">{r.placed ?? "Not set"}</td>
                <td className="px-3 py-2">{r.cutoff ?? "Not set"}</td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => {
                      setEditing(r);
                      setForm(r);
                    }}
                    className="text-xs font-bold bg-amber-100 px-2 py-1 rounded-full mr-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      await api.remove("selections_grade11", r.id);
                      toast.success("Grade 11 selection deleted");
                      load();
                    }}
                    className="text-xs font-bold bg-red-50 text-red-600 px-2 py-1 rounded-full"
                  >
                    Del
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form
        onSubmit={submit}
        className="mt-4 grid sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-gray-100"
      >
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-gray-600">
            School
          </label>
          <input
            value={form.school}
            onChange={(e) => setForm({ ...form, school: e.target.value })}
            className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-gray-600">
            District
          </label>
          <input
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
            className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-gray-600">Type</label>
          <input
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm"
          />
        </div>
        {["capacity", "placed", "cutoff"].map((key) => (
          <div key={key}>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-600">{key}</label>
            <input
              type="number"
              value={form[key] ?? 0}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
          </div>
        ))}
        <button className="sm:col-span-2 bg-[#0D9488] text-white font-bold py-2.5 rounded-full text-sm">
          {editing ? "Update" : "Add"} Grade 11
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="text-xs bg-gray-100 px-3 py-1 rounded-full"
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}
export default function SelectionsManager() {
  const toast = useToast();
  const [tab, setTab] = useState<"g9" | "g11">("g9");
  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold text-[#0B2545]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Selections
        </h1>
        <p className="text-sm text-gray-500">
          Grade 9 & 11 selection lists - used on /selections page.
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setTab("g9")}
          className={`px-5 py-2.5 rounded-full text-sm font-bold border ${
            tab === "g9" ? "bg-[#0B2545] text-white border-[#0B2545]" : "bg-white border-gray-200"
          }`}
        >
          Grade 9
        </button>
        <button
          onClick={() => setTab("g11")}
          className={`px-5 py-2.5 rounded-full text-sm font-bold border ${
            tab === "g11" ? "bg-[#0B2545] text-white border-[#0B2545]" : "bg-white border-gray-200"
          }`}
        >
          Grade 11
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <SelectionStudentsManager />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        {tab === "g9" ? <G9 /> : <G11 />}
      </div>
    </div>
  );
}
