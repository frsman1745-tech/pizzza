import { useState } from "react";

// ── كلمة المرور — غيّرها لما تبي ──
const ADMIN_PASSWORD = "pizza2024";

// ── البيانات الابتدائية (نفس بيانات App.jsx) ──
const DEFAULT_FEATURED = [
  {
    id: "meter", label: "بيتزا المتر",
    priceOld: "150,000", priceNew: "1,500",
    sliceCount: 8, cols: 4,
    desc: "متر كامل من الشهية المتنوعة لتشاركه مع أحبّك",
  },
  {
    id: "sixtyforty", label: "بيتزا 60×40",
    priceOld: "140,000", priceNew: "1,400",
    sliceCount: 6, cols: 3,
    desc: "الحجم العائلي المثالي للتجمعات",
  },
  {
    id: "khanum", label: "بيتزا خانم",
    priceOld: null, priceNew: null,
    desc: "كرات العجين محشية بجبنة الشيدر على الأطراف",
    sizes: [
      { id: "sm", label: "صغيرة", priceOld: "45,000", priceNew: "450" },
      { id: "lg", label: "كبيرة", priceOld: "60,000", priceNew: "600" },
    ],
  },
];

const DEFAULT_MENU = [
  { id: "margarita",     label: "مارغريتا",        details: "جبنة القشقوان مع الصلصة الحمراء.", comingSoon: false },
  { id: "hawaii",        label: "هاواي",            details: "جبنة القشقوان مع الموزريلا وقطع البيروني بالإضافة إلى شرائح الأناناس.", comingSoon: false },
  { id: "teamscheese",   label: "التيمات تشيز",     details: "جبنة القشقوان مع موزريلا بالإضافة لكرات الطماطم والريحان.", comingSoon: false },
  { id: "supersupreme",  label: "سوبر سوبريم",      details: "المزيج المشهور والشهي من البيروني مع جبنة القشقوان والماشروم والفلفل الأخضر والزيتون الأسود.", comingSoon: false },
  { id: "chickenbbq",    label: "تشيكن باربيكيو",  details: "شرائح الدجاج مغمورة بصوص الباربيكيو اللذيذ وجبنة القشقوان مع شرائح البصل.", comingSoon: false },
  { id: "peperoni",      label: "ببروني",           details: "جبنة القشقوان مع المزيج الشهي من شرائح البيروني لحم البقر مع الثوم والكزبرة.", comingSoon: false },
  { id: "salami",        label: "سلامي",            details: "جبنة القشقوان مع شرائح لحم البقر.", comingSoon: false },
  { id: "hotdog",        label: "هوت دوغ",          details: "جبنة القشقوان مع حبات الهوت دوغ المدخن.", comingSoon: false },
  { id: "smokedchicken", label: "دجاج مدخن",        details: "جبنة القشقوان مع شرائح دجاج الحبش المدخن.", comingSoon: false },
  { id: "fajita",        label: "فاهيتا",           details: "جبنة القشقوان مع قطع دجاج الفاهيتا والماشروم والفلفل الأخضر بالإضافة إلى حبات الذرة.", comingSoon: false },
  { id: "cs1", label: "بيتزا الكريمة", details: "", comingSoon: true },
  { id: "cs2", label: "الثلاثي",        details: "", comingSoon: true },
  { id: "cs3", label: "بيتزا البحر",   details: "", comingSoon: true },
  { id: "cs4", label: "المكسيكية",      details: "", comingSoon: true },
  { id: "cs5", label: "بيتزا الخضار",  details: "", comingSoon: true },
];

/* ═══════════════════════════════════════════════════════════ */

export default function AdminPage() {
  const [authed, setAuthed]   = useState(false);
  const [pass,   setPass]     = useState("");
  const [error,  setError]    = useState("");
  const [tab,    setTab]      = useState("menu"); // menu | featured

  // البيانات — تُحفظ في localStorage عشان تبقى بعد الإغلاق
  const [menu,     setMenu]     = useState(() => load("admin_menu",     DEFAULT_MENU));
  const [featured, setFeatured] = useState(() => load("admin_featured", DEFAULT_FEATURED));

  // تعديل صنف
  const [editing, setEditing] = useState(null); // { type: "menu"|"featured", index: number }
  const [form,    setForm]    = useState({});

  function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
  }
  function save(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  /* ── تسجيل الدخول ── */
  function handleLogin(e) {
    e.preventDefault();
    if (pass === ADMIN_PASSWORD) { setAuthed(true); setError(""); }
    else setError("كلمة المرور غلط");
  }

  /* ── فتح التعديل ── */
  function openEdit(type, index) {
    const item = type === "menu" ? menu[index] : featured[index];
    setForm({ ...item });
    setEditing({ type, index });
  }

  /* ── حفظ التعديل ── */
  function saveEdit() {
    if (editing.type === "menu") {
      const updated = menu.map((it, i) => i === editing.index ? { ...form } : it);
      setMenu(updated);
      save("admin_menu", updated);
    } else {
      const updated = featured.map((it, i) => i === editing.index ? { ...form } : it);
      setFeatured(updated);
      save("admin_featured", updated);
    }
    setEditing(null);
  }

  /* ── إضافة صنف جديد (قائمة فقط) ── */
  function addItem() {
    const newItem = { id: Date.now().toString(), label: "صنف جديد", details: "", comingSoon: false };
    const updated = [...menu, newItem];
    setMenu(updated);
    save("admin_menu", updated);
    openEdit("menu", updated.length - 1);
  }

  /* ── حذف ── */
  function deleteItem(type, index) {
    if (!confirm("تحذف هذا الصنف؟")) return;
    if (type === "menu") {
      const updated = menu.filter((_, i) => i !== index);
      setMenu(updated); save("admin_menu", updated);
    } else {
      const updated = featured.filter((_, i) => i !== index);
      setFeatured(updated); save("admin_featured", updated);
    }
  }

  /* ════════════════ UI ════════════════ */
  const S = {
    page:   { minHeight: "100vh", background: "#0a0a0a", color: "#E5D3B3", fontFamily: "'Noto Kufi Arabic', sans-serif", direction: "rtl" },
    card:   { background: "#141414", border: "1px solid #252525", borderRadius: 14, padding: 20, marginBottom: 12 },
    input:  { width: "100%", padding: "10px 14px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, color: "#E5D3B3", fontFamily: "inherit", fontSize: ".88rem", outline: "none", marginTop: 6 },
    btn:    (bg, color) => ({ padding: "9px 18px", background: bg, border: "none", borderRadius: 10, color, cursor: "pointer", fontFamily: "inherit", fontSize: ".82rem", fontWeight: 700 }),
    label:  { fontSize: ".72rem", color: "#C8A96A88", letterSpacing: "1px", display: "block", marginTop: 14 },
  };

  /* ── صفحة الدخول ── */
  if (!authed) return (
    <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...S.card, width: 340, textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: 10 }}>🍕</div>
        <h1 style={{ color: "#C8A96A", marginBottom: 24, fontSize: "1.2rem" }}>بيتزا خانم — الأدمن</h1>
        {error && <p style={{ color: "#ef4444", marginBottom: 14, fontSize: ".82rem" }}>⚠ {error}</p>}
        <form onSubmit={handleLogin}>
          <input type="password" placeholder="كلمة المرور" value={pass}
            onChange={e => setPass(e.target.value)} style={S.input} required />
          <button type="submit" style={{ ...S.btn("linear-gradient(135deg,#C8A96A,#8B6B4A)", "#0f0f0f"), width: "100%", marginTop: 16, padding: 13 }}>
            دخول →
          </button>
        </form>
      </div>
    </div>
  );

  const items = tab === "menu" ? menu : featured;

  /* ── نافذة التعديل ── */
  const EditModal = editing !== null && (
    <div style={{ position: "fixed", inset: 0, background: "#000a", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
      <div style={{ ...S.card, width: "min(480px, 95vw)", maxHeight: "85vh", overflowY: "auto", border: "1px solid #C8A96A44" }}>
        <h2 style={{ color: "#C8A96A", marginBottom: 20, fontSize: "1rem" }}>تعديل الصنف</h2>

        <label style={S.label}>الاسم</label>
        <input style={S.input} value={form.label || ""} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} />

        {editing.type === "menu" && <>
          <label style={S.label}>الوصف</label>
          <textarea style={{ ...S.input, minHeight: 80, resize: "vertical" }}
            value={form.details || ""} onChange={e => setForm(p => ({ ...p, details: e.target.value }))} />

          <label style={S.label}>قريباً؟</label>
          <select style={S.input} value={form.comingSoon ? "yes" : "no"}
            onChange={e => setForm(p => ({ ...p, comingSoon: e.target.value === "yes" }))}>
            <option value="no">لا — يظهر في القائمة</option>
            <option value="yes">نعم — قريباً</option>
          </select>
        </>}

        {editing.type === "featured" && <>
          <label style={S.label}>الوصف</label>
          <textarea style={{ ...S.input, minHeight: 80, resize: "vertical" }}
            value={form.desc || ""} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} />

          <label style={S.label}>السعر القديم</label>
          <input style={S.input} value={form.priceOld || ""} onChange={e => setForm(p => ({ ...p, priceOld: e.target.value }))} placeholder="مثال: 150,000" />

          <label style={S.label}>السعر الجديد</label>
          <input style={S.input} value={form.priceNew || ""} onChange={e => setForm(p => ({ ...p, priceNew: e.target.value }))} placeholder="مثال: 1,500" />
        </>}

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button onClick={saveEdit} style={S.btn("#C8A96A", "#0f0f0f")}>💾 حفظ</button>
          <button onClick={() => setEditing(null)} style={S.btn("#1e1e1e", "#888")}>إلغاء</button>
        </div>
      </div>
    </div>
  );

  /* ── الداشبورد الرئيسي ── */
  return (
    <div style={S.page}>
      {EditModal}

      {/* Header */}
      <div style={{ background: "#111", borderBottom: "1px solid #1e1e1e", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span>🍕</span>
          <h1 style={{ fontSize: ".95rem", fontWeight: 700, color: "#C8A96A" }}>لوحة تحكم بيتزا خانم</h1>
        </div>
        <button onClick={() => setAuthed(false)} style={S.btn("#1e1e1e", "#666")}>خروج</button>
      </div>

      <div style={{ padding: 24 }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {[["menu", "قائمة البيتزا"], ["featured", "العروض المميزة"]].map(([key, lbl]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              ...S.btn(tab === key ? "#C8A96A" : "#141414", tab === key ? "#0f0f0f" : "#666"),
              border: `1px solid ${tab === key ? "#C8A96A" : "#252525"}`,
            }}>{lbl}</button>
          ))}
          {tab === "menu" && (
            <button onClick={addItem} style={{ ...S.btn("#0d1a0d", "#4CAF50"), border: "1px solid #4CAF5055", marginRight: "auto" }}>
              + إضافة صنف
            </button>
          )}
        </div>

        {/* قائمة الأصناف */}
        {items.map((item, i) => (
          <div key={item.id} style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, color: "#E5D3B3", marginBottom: 4 }}>
                {item.label}
                {item.comingSoon && <span style={{ marginRight: 8, fontSize: ".65rem", color: "#C8A96A", background: "#C8A96A22", padding: "2px 8px", borderRadius: 20 }}>قريباً</span>}
              </p>
              <p style={{ fontSize: ".72rem", color: "#555" }}>{item.details || item.desc || "—"}</p>
              {item.priceNew && <p style={{ fontSize: ".75rem", color: "#C8A96A", marginTop: 4 }}>{item.priceNew} ريال</p>}
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button onClick={() => openEdit(tab, i)} style={S.btn("#1a1a1a", "#C8A96A")}>✏️ تعديل</button>
              <button onClick={() => deleteItem(tab, i)} style={S.btn("#1a0d0d", "#ef4444")}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
