import React, { useState, useEffect } from "react";
import {
  ArrowUp, ArrowDown, Clock, Coins, Landmark, Globe, ChevronRight,
  Lock, TrendingUp, Mail, Phone, MapPin, Send, Sparkles, Sun, Moon, Calculator, X, ArrowLeftRight
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

const SUPABASE_URL = "https://ynpecciuamfizivuszly.supabase.co";
const SUPABASE_KEY = "sb_publishable_2hgm6bXKKgKHvneRPVu9dA_g-b4v7A-";
const sbHeaders = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };
async function sbGet(table, query = "select=*") {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, { headers: sbHeaders });
  if (!res.ok) throw new Error(`${table} fetch failed`);
  return res.json();
}

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Cairo:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
`;

const MODES = {
  dark: {
    bg: "#0A0A0A", surface: "#161514", text: "#F7F3E8", muted: "rgba(247,243,232,0.55)",
    line: "rgba(255,255,255,0.05)", pillBg: "rgba(255,255,255,0.06)", overlay: "rgba(255,255,255,0.04)", overlayBorder: "rgba(255,255,255,0.1)",
  },
  light: {
    bg: "#F5F1E6", surface: "#FFFFFF", text: "#161514", muted: "rgba(22,21,20,0.55)",
    line: "rgba(10,10,10,0.08)", pillBg: "rgba(10,10,10,0.06)", overlay: "rgba(10,10,10,0.03)", overlayBorder: "rgba(10,10,10,0.12)",
  },
};
const THEMES = [
  { id: "coral", accent: "#FF2882", accent2: "#FF6FA8", deep: "#8F0043" },
  { id: "blaze", accent: "#FF6900", accent2: "#FFA35C", deep: "#8F3A00" },
  { id: "citrus", accent: "#C7D400", accent2: "#EBFF00", deep: "#5C6600" },
  { id: "mint", accent: "#00D673", accent2: "#5CFFAE", deep: "#00522B" },
  { id: "sky", accent: "#05C7D6", accent2: "#5CF3FF", deep: "#014A52" },
];

const BLACK = "var(--bg)", CARD = "var(--surface)", PAPER = "var(--text)", MUTED = "var(--muted)";
const INK = "#0A0A0A", ORANGE = "var(--accent)", AMBER = "var(--deep)", GOLD = "var(--accent2)";
const GREEN = "#49B980", RED = "#E2574C";

const DEFAULT_CURRENCIES = [
  { code: "EUR", symbol: "\u20ac", flag: "\ud83c\uddea\ud83c\uddfa", buy: 258.4, sell: 261.9, base: 261.9 },
  { code: "USD", symbol: "$", flag: "\ud83c\uddfa\ud83c\uddf8", buy: 237.1, sell: 240.3, base: 240.3 },
  { code: "GBP", symbol: "\u00a3", flag: "\ud83c\uddec\ud83c\udde7", buy: 298.55, sell: 302.1, base: 302.1 },
  { code: "CHF", symbol: "Fr", flag: "\ud83c\udde8\ud83c\udded", buy: 270.2, sell: 273.85, base: 273.85 },
  { code: "CAD", symbol: "$", flag: "\ud83c\udde8\ud83c\udde6", buy: 171.4, sell: 174.1, base: 174.1 },
  { code: "AED", symbol: "\u062f.\u0625", flag: "\ud83c\udde6\ud83c\uddea", buy: 64.3, sell: 65.6, base: 65.6 },
];

const DEFAULT_GOLD_ITEMS = [
  { key: "k24", buy: 12850, sell: 13100, base: 13100 },
  { key: "k21", buy: 11240, sell: 11460, base: 11460 },
  { key: "k18", buy: 9630, sell: 9820, base: 9820 },
  { key: "cassee", buy: 9950, sell: 10180, base: 10180 },
  { key: "casseeIt", buy: 10420, sell: 10650, base: 10650 },
];

const NEWS_TOPICS = [{ key: "dzMarket" }, { key: "goldGlobal" }, { key: "visaUpdate" }, { key: "intlFx" }];

// Sample chart series (placeholder — wire to your real market-data API)
function genSeries(base, points, vol) {
  let v = base;
  const arr = [];
  for (let i = 0; i < points; i++) {
    v += (Math.sin(i / 3) + (Math.random() - 0.5)) * vol;
    arr.push({ i, v: Math.round(v * 100) / 100 });
  }
  return arr;
}
const CHART_ASSETS = {
  EUR: { week: genSeries(260, 7, 0.6), month: genSeries(258, 30, 0.8), year: genSeries(250, 12, 3) },
  USD: { week: genSeries(238, 7, 0.5), month: genSeries(236, 30, 0.7), year: genSeries(228, 12, 2.5) },
  GOLD: { week: genSeries(13000, 7, 60), month: genSeries(12800, 30, 90), year: genSeries(11800, 12, 300) },
};

const T = {
  ar: {
    dir: "rtl", font: "'Cairo', sans-serif",
    tagline: "\u0627\u0644\u0633\u0648\u0642 \u0628\u064a\u0646 \u064a\u062f\u064a\u0643\u060c \u0623\u064a\u0646\u0645\u0627 \u0643\u0646\u062a",
    tabs: { rates: "\u0627\u0644\u0639\u0645\u0644\u0627\u062a", gold: "\u0627\u0644\u0630\u0647\u0628", market: "\u0627\u0644\u0633\u0648\u0642", news: "\u0623\u062e\u0628\u0627\u0631", contact: "\u0627\u062a\u0635\u0644" },
    live: "\u0645\u0628\u0627\u0634\u0631", buy: "\u0634\u0631\u0627\u0621", sell: "\u0628\u064a\u0639",
    ratesHeader: "\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0635\u0631\u0641 \u00b7 \u062f\u062c", goldHeader: "\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0630\u0647\u0628 \u00b7 \u0644\u0644\u063a\u0631\u0627\u0645",
    goldNames: { k24: "\u0630\u0647\u0628 24 \u0642\u064a\u0631\u0627\u0637", k21: "\u0630\u0647\u0628 21 \u0642\u064a\u0631\u0627\u0637", k18: "\u0630\u0647\u0628 18 \u0642\u064a\u0631\u0627\u0637", cassee: "\u0630\u0647\u0628 \u0645\u0643\u0633\u0648\u0631", casseeIt: "\u0645\u0643\u0633\u0648\u0631 \u0625\u064a\u0637\u0627\u0644\u064a" },
    newsHeader: "\u0622\u062e\u0631 \u0627\u0644\u0645\u0633\u062a\u062c\u062f\u0627\u062a",
    newsTopics: { dzMarket: "\u0633\u0648\u0642 \u0627\u0644\u0635\u0631\u0641 \u0641\u064a \u0627\u0644\u062c\u0632\u0627\u0626\u0631", goldGlobal: "\u0623\u0633\u0648\u0627\u0642 \u0627\u0644\u0630\u0647\u0628 \u0627\u0644\u0639\u0627\u0644\u0645\u064a\u0629", visaUpdate: "\u0645\u0633\u062a\u062c\u062f\u0627\u062a \u0627\u0644\u062a\u0623\u0634\u064a\u0631\u0627\u062a", intlFx: "\u0627\u0644\u0639\u0645\u0644\u0627\u062a \u0627\u0644\u062f\u0648\u0644\u064a\u0629" },
    newsPlaceholder: "\u0627\u0631\u0628\u0637 \u0645\u0635\u062f\u0631 \u0623\u062e\u0628\u0627\u0631 \u062d\u064a\u0651 \u0644\u0639\u0631\u0636 \u0622\u062e\u0631 \u0627\u0644\u0645\u0633\u062a\u062c\u062f\u0627\u062a \u0647\u0646\u0627",
    newsEmpty: "\u0644\u0627 \u062a\u0648\u062c\u062f \u0623\u062e\u0628\u0627\u0631 \u062d\u0627\u0644\u064a\u0627\u064b",
    licensed: "\u0645\u0643\u062a\u0628 \u0627\u0644\u062c\u0632\u0627\u0626\u0631",
    myOffice: "\u0645\u0643\u062a\u0628\u064a", bankA: "\u0627\u0644\u0628\u0646\u0643 \u0623", bankB: "\u0627\u0644\u0628\u0646\u0643 \u0628",
    premiumTitle: "\u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u0633\u0648\u0642 \u00b7 \u0645\u0645\u064a\u0632",
    premiumDesc: "\u0645\u0646\u062d\u0646\u064a\u0627\u062a \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0639\u0628\u0631 \u0627\u0644\u0632\u0645\u0646 \u0644\u0644\u0639\u0645\u0644\u0627\u062a \u0648\u0627\u0644\u0630\u0647\u0628 \u0645\u0639 \u0627\u062a\u062c\u0627\u0647 \u0627\u0644\u0633\u0648\u0642",
    unlock: "\u0627\u0634\u062a\u0631\u0627\u0643 \u0627\u0644\u0645\u0645\u064a\u0632", week: "\u0623\u0633\u0628\u0648\u0639", month: "\u0634\u0647\u0631", year: "\u0633\u0646\u0629",
    contactHeader: "\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627", sendMsg: "\u0625\u0631\u0633\u0627\u0644",
    yourMsg: "\u0627\u0643\u062a\u0628 \u0631\u0633\u0627\u0644\u062a\u0643...", locked: "\u0645\u062d\u062a\u0648\u0649 \u0645\u062d\u062c\u0648\u0632",
    converter: "\u0645\u062d\u0648\u0644 \u0627\u0644\u0639\u0645\u0644\u0627\u062a",
    converterNote: "\u0633\u0639\u0631 \u062a\u0642\u0631\u064a\u0628\u064a \u0628\u0646\u0627\u0621\u064b \u0639\u0644\u0649 \u0645\u062a\u0648\u0633\u0637 \u0627\u0644\u0634\u0631\u0627\u0621 \u0648\u0627\u0644\u0628\u064a\u0639",
  },
  fr: {
    dir: "ltr", font: "'IBM Plex Sans', sans-serif",
    tagline: "Le march\u00e9 dans votre main, o\u00f9 que vous soyez.",
    tabs: { rates: "Devises", gold: "Or", market: "March\u00e9", news: "Actualit\u00e9s", contact: "Contact" },
    live: "en direct", buy: "achat", sell: "vente",
    ratesHeader: "Taux de change \u00b7 DZD", goldHeader: "Cours de l'or \u00b7 par gramme",
    goldNames: { k24: "Or 24 carats", k21: "Or 21 carats", k18: "Or 18 carats", cassee: "Or cass\u00e9", casseeIt: "Cass\u00e9 italien" },
    newsHeader: "Derni\u00e8res actualit\u00e9s",
    newsTopics: { dzMarket: "March\u00e9 des changes en Alg\u00e9rie", goldGlobal: "March\u00e9s mondiaux de l'or", visaUpdate: "Actualit\u00e9s des visas", intlFx: "Devises internationales" },
    newsPlaceholder: "Connectez une source d'actualit\u00e9s pour afficher les derniers titres ici",
    newsEmpty: "Aucune actualit\u00e9 pour le moment",
    licensed: "Bureau d'Alger",
    myOffice: "Mon bureau", bankA: "Banque A", bankB: "Banque B",
    premiumTitle: "Analyse de march\u00e9 \u00b7 Premium",
    premiumDesc: "Historique des taux devises et or, avec tendance du march\u00e9",
    unlock: "D\u00e9bloquer Premium", week: "Semaine", month: "Mois", year: "Ann\u00e9e",
    contactHeader: "Contactez-nous", sendMsg: "Envoyer",
    yourMsg: "\u00c9crivez votre message...", locked: "Contenu verrouill\u00e9",
    converter: "Convertisseur",
    converterNote: "Taux estimatif bas\u00e9 sur la moyenne achat/vente",
  },
  en: {
    dir: "ltr", font: "'IBM Plex Sans', sans-serif",
    tagline: "The market in your hands, wherever you are.",
    tabs: { rates: "Currency", gold: "Gold", market: "Market", news: "News", contact: "Contact" },
    live: "live", buy: "buy", sell: "sell",
    ratesHeader: "Exchange rates \u00b7 DZD", goldHeader: "Gold rates \u00b7 per gram",
    goldNames: { k24: "24 carat gold", k21: "21 carat gold", k18: "18 carat gold", cassee: "Scrap gold", casseeIt: "Italian scrap" },
    newsHeader: "Latest updates",
    newsTopics: { dzMarket: "Algerian currency market", goldGlobal: "Global gold markets", visaUpdate: "Visa updates", intlFx: "International currencies" },
    newsPlaceholder: "Connect a news source to show live headlines here",
    newsEmpty: "No news yet",
    licensed: "Algiers Office",
    myOffice: "My office", bankA: "Bank A", bankB: "Bank B",
    premiumTitle: "Market analysis \u00b7 Premium",
    premiumDesc: "Historical currency & gold rates with market trend direction",
    unlock: "Unlock Premium", week: "Week", month: "Month", year: "Year",
    contactHeader: "Contact us", sendMsg: "Send",
    yourMsg: "Write your message...", locked: "Locked content",
    converter: "Converter",
    converterNote: "Estimated rate based on buy/sell average",
  },
};

function FlagIcon({ code, size = 26 }) {
  const s = { width: size, height: size * 0.75, display: "block", borderRadius: 2 };
  switch (code) {
    case "EUR":
      return (
        <svg style={s} viewBox="0 0 30 20"><rect width="30" height="20" fill="#003399" />
          {[...Array(12)].map((_, i) => { const a = (i / 12) * 2 * Math.PI; const cx = 15 + 7 * Math.sin(a); const cy = 10 - 7 * Math.cos(a); return <circle key={i} cx={cx} cy={cy} r="1" fill="#FFCC00" />; })}
        </svg>
      );
    case "USD":
      return (
        <svg style={s} viewBox="0 0 30 20">
          <rect width="30" height="20" fill="#B22234" />
          {[2, 4, 6, 8, 10, 12].map((y) => <rect key={y} y={y} width="30" height="1.5" fill="#fff" />)}
          <rect width="13" height="11" fill="#3C3B6E" />
        </svg>
      );
    case "GBP":
      return (
        <svg style={s} viewBox="0 0 30 20">
          <rect width="30" height="20" fill="#00247D" />
          <path d="M0,0 L30,20 M30,0 L0,20" stroke="#fff" strokeWidth="3" />
          <path d="M0,0 L30,20 M30,0 L0,20" stroke="#CF142B" strokeWidth="1.2" />
          <path d="M15,0 V20 M0,10 H30" stroke="#fff" strokeWidth="5" />
          <path d="M15,0 V20 M0,10 H30" stroke="#CF142B" strokeWidth="2.2" />
        </svg>
      );
    case "CHF":
      return (
        <svg style={s} viewBox="0 0 30 20"><rect width="30" height="20" fill="#D52B1E" />
          <rect x="12.5" y="4" width="5" height="12" fill="#fff" /><rect x="8" y="8.5" width="14" height="5" fill="#fff" />
        </svg>
      );
    case "CAD":
      return (
        <svg style={s} viewBox="0 0 30 20">
          <rect width="30" height="20" fill="#fff" /><rect width="7.5" height="20" fill="#D52B1E" /><rect x="22.5" width="7.5" height="20" fill="#D52B1E" />
          <path d="M15 5 L16.5 9 L20 8 L18 11.5 L20.5 13 L17 13.5 L17.5 17 L15 14.5 L12.5 17 L13 13.5 L9.5 13 L12 11.5 L10 8 L13.5 9 Z" fill="#D52B1E" />
        </svg>
      );
    case "AED":
      return (
        <svg style={s} viewBox="0 0 30 20">
          <rect width="30" height="6.67" y="0" fill="#00732F" /><rect width="30" height="6.67" y="6.67" fill="#fff" /><rect width="30" height="6.66" y="13.34" fill="#000" />
          <rect width="8" height="20" fill="#FF0000" />
        </svg>
      );
    default:
      return <div style={{ ...s, background: "var(--overlay-border)" }} />;
  }
}
function ConverterModal({ t, currencies, open, onClose }) {
  const [amount, setAmount] = useState("1");
  const [fromCode, setFromCode] = useState("EUR");
  const [toCode, setToCode] = useState("DZD");
  if (!open) return null;

  const rateToDzd = (code) => {
    if (code === "DZD") return 1;
    const c = currencies.find((x) => x.code === code);
    return c ? (c.buy + c.sell) / 2 : 1;
  };
  const amt = parseFloat(amount) || 0;
  const inDzd = amt * rateToDzd(fromCode);
  const result = toCode === "DZD" ? inDzd : inDzd / rateToDzd(toCode);
  const options = ["DZD", ...currencies.map((c) => c.code)];

  const swap = () => { setFromCode(toCode); setToCode(fromCode); };

  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 30, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", background: CARD, borderRadius: 16, padding: 18, border: "1px solid var(--line)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Calculator size={15} color={ORANGE} />
            <span style={{ fontFamily: t.font, fontSize: 13, fontWeight: 600, color: PAPER }}>{t.converter}</span>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "var(--pill-bg)", borderRadius: 8, width: 26, height: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={13} color={MUTED} />
          </button>
        </div>

        <input
          value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal"
          style={{ width: "100%", boxSizing: "border-box", background: "var(--overlay)", border: "1px solid var(--overlay-border)", borderRadius: 10, padding: "10px 12px", color: PAPER, fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, fontWeight: 600, marginBottom: 12 }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <select value={fromCode} onChange={(e) => setFromCode(e.target.value)} style={{ flex: 1, background: "var(--overlay)", border: "1px solid var(--overlay-border)", borderRadius: 9, padding: "9px 8px", color: PAPER, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5 }}>
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <button onClick={swap} style={{ border: "none", background: "var(--pill-bg)", borderRadius: 8, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <ArrowLeftRight size={14} color={ORANGE} />
          </button>
          <select value={toCode} onChange={(e) => setToCode(e.target.value)} style={{ flex: 1, background: "var(--overlay)", border: "1px solid var(--overlay-border)", borderRadius: 9, padding: "9px 8px", color: PAPER, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5 }}>
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div style={{ background: "var(--overlay)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
          <p style={{ margin: 0, fontFamily: "'IBM Plex Mono', monospace", fontSize: 19, fontWeight: 600, color: ORANGE }}>
            {result.toLocaleString(undefined, { maximumFractionDigits: 2 })} {toCode}
          </p>
        </div>
        <p style={{ marginTop: 10, marginBottom: 0, fontSize: 10, color: MUTED, textAlign: "center", fontFamily: t.font }}>{t.converterNote}</p>
      </div>
    </div>
  );
}

function trend(item) {
  const d = item.sell - item.base;
  if (Math.abs(d) < 0.005) return "flat";
  return d > 0 ? "up" : "down";
}
function TrendIcon({ item }) {
  const t2 = trend(item);
  if (t2 === "flat") return null;
  return t2 === "up" ? <ArrowUp size={11} color={GREEN} strokeWidth={2.5} /> : <ArrowDown size={11} color={RED} strokeWidth={2.5} />;
}

function LangSwitch({ lang, setLang }) {
  return (
    <div style={{ display: "flex", gap: 4, background: "var(--pill-bg)", borderRadius: 8, padding: 3 }}>
      {["ar", "fr", "en"].map((l) => (
        <button key={l} onClick={() => setLang(l)} style={{
          border: "none", cursor: "pointer", padding: "5px 9px", borderRadius: 6,
          fontSize: 11, fontWeight: 600, textTransform: "uppercase",
          background: lang === l ? ORANGE : "transparent", color: lang === l ? INK : MUTED,
          fontFamily: "'IBM Plex Sans', sans-serif",
        }}>{l}</button>
      ))}
    </div>
  );
}

function AppearancePopover({ mode, setMode, themeId, setThemeId, open, setOpen }) {
  if (!open) return null;
  return (
    <div style={{
      position: "absolute", top: 44, insetInlineEnd: 16, zIndex: 20, width: 190,
      background: CARD, border: "1px solid var(--line)", borderRadius: 12, padding: 12,
      boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
    }}>
      <div style={{ display: "flex", gap: 3, background: "var(--pill-bg)", borderRadius: 8, padding: 3, marginBottom: 10 }}>
        {["dark", "light"].map((mv) => (
          <button key={mv} onClick={() => setMode(mv)} style={{
            flex: 1, border: "none", cursor: "pointer", padding: "6px 0", borderRadius: 6,
            background: mode === mv ? ORANGE : "transparent", color: mode === mv ? INK : MUTED,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 11, fontWeight: 600,
          }}>
            {mv === "dark" ? <Moon size={12} /> : <Sun size={12} />}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {THEMES.map((th) => (
          <button key={th.id} onClick={() => setThemeId(th.id)} style={{
            flex: 1, height: 26, borderRadius: 7, cursor: "pointer",
            background: `linear-gradient(135deg, ${th.accent}, ${th.accent2})`,
            border: themeId === th.id ? "2px solid #fff" : "2px solid transparent",
          }} />
        ))}
      </div>
    </div>
  );
}

function TabBar({ tab, setTab, t }) {
  const items = [
    { key: "rates", icon: Landmark }, { key: "gold", icon: Coins }, { key: "market", icon: TrendingUp },
    { key: "news", icon: Sparkles }, { key: "contact", icon: Mail },
  ];
  return (
    <div style={{ display: "flex", background: CARD, borderTop: "1px solid var(--line)" }}>
      {items.map(({ key, icon: Icon }) => (
        <button key={key} onClick={() => setTab(key)} style={{
          flex: 1, border: "none", background: "transparent", cursor: "pointer",
          padding: "10px 2px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        }}>
          <Icon size={17} color={tab === key ? ORANGE : MUTED} strokeWidth={tab === key ? 2.4 : 1.8} />
          <span style={{ fontSize: 9.5, fontWeight: 600, color: tab === key ? ORANGE : MUTED, fontFamily: t.font }}>{t.tabs[key]}</span>
        </button>
      ))}
    </div>
  );
}

function SourceTabs({ t, source, setSource, bankNameA }) {
  const options = [{ key: "office", label: t.myOffice }, { key: "a", label: bankNameA }];
  return (
    <div style={{ display: "flex", gap: 3, background: "var(--pill-bg)", borderRadius: 9, padding: 3, marginBottom: 12 }}>
      {options.map((o) => (
        <button key={o.key} onClick={() => setSource(o.key)} style={{
          flex: 1, border: "none", cursor: "pointer", padding: "7px 6px", borderRadius: 7,
          fontFamily: t.font, fontSize: 11.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          background: source === o.key ? ORANGE : "transparent", color: source === o.key ? INK : MUTED,
        }}>{o.label}</button>
      ))}
    </div>
  );
}

function RatesTab({ t, source, setSource, bankNameA, currencies, bankRates, lastUpdated }) {
  const rows = currencies.map((c) => {
    if (source === "office") return c;
    const br = bankRates.find((b) => b.code === c.code);
    if (!br) return c;
    const r = { buy: br.a_buy, sell: br.a_sell };
    return { ...c, buy: r.buy, sell: r.sell, base: r.sell };
  });
  return (
    <div style={{ padding: "16px 16px 8px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <p style={{ margin: 0, fontSize: 11.5, fontWeight: 600, letterSpacing: 0.4, textTransform: "uppercase", color: MUTED, fontFamily: t.font }}>{t.ratesHeader}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Clock size={10} color={MUTED} strokeWidth={2.5} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: MUTED, fontWeight: 600 }}>{lastUpdated || "\u2013"}</span>
        </div>
      </div>
      <SourceTabs t={t} source={source} setSource={setSource} bankNameA={bankNameA} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map((c) => (
          <div key={c.code} style={{ background: CARD, borderRadius: 12, padding: "11px 13px", display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid var(--line)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--overlay)", border: "1px solid var(--overlay-border)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <FlagIcon code={c.code} size={22} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 600, color: PAPER }}>{c.code}</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: MUTED }}>{c.symbol}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ textAlign: "end" }}>
                <p style={{ margin: 0, fontSize: 9, textTransform: "uppercase", color: MUTED }}>{t.buy}</p>
                <p style={{ margin: 0, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13.5, fontWeight: 600, color: PAPER }}>{c.buy.toFixed(2)}</p>
              </div>
              <div style={{ textAlign: "end", minWidth: 56 }}>
                <p style={{ margin: 0, fontSize: 9, textTransform: "uppercase", color: MUTED }}>{t.sell}</p>
                <div style={{ display: "flex", gap: 3, alignItems: "center", justifyContent: "flex-end" }}>
                  <p style={{ margin: 0, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13.5, fontWeight: 600, color: ORANGE }}>{c.sell.toFixed(2)}</p>
                  <TrendIcon item={c} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GoldTab({ t, goldItems }) {
  return (
    <div style={{ padding: "16px 16px 8px" }}>
      <p style={{ margin: "0 0 12px", fontSize: 11.5, fontWeight: 600, letterSpacing: 0.4, textTransform: "uppercase", color: MUTED, fontFamily: t.font }}>{t.goldHeader}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {goldItems.map((g) => (
          <div key={g.key} style={{ background: `linear-gradient(135deg, ${CARD} 0%, #201A0D 100%)`, border: `1px solid color-mix(in srgb, ${GOLD} 20%, transparent)`, borderRadius: 12, padding: "12px 13px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${GOLD}, ${AMBER})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Coins size={15} color={INK} strokeWidth={2} />
              </div>
              <span style={{ fontFamily: t.font, fontSize: 13, fontWeight: 600, color: PAPER }}>{t.goldNames[g.key]}</span>
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ textAlign: "end" }}>
                <p style={{ margin: 0, fontSize: 9, textTransform: "uppercase", color: MUTED }}>{t.buy}</p>
                <p style={{ margin: 0, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, fontWeight: 600, color: PAPER }}>{g.buy.toLocaleString()} <span style={{ fontSize: 9.5, color: MUTED }}>DZD</span></p>
              </div>
              <div style={{ textAlign: "end", minWidth: 62 }}>
                <p style={{ margin: 0, fontSize: 9, textTransform: "uppercase", color: MUTED }}>{t.sell}</p>
                <div style={{ display: "flex", gap: 3, alignItems: "center", justifyContent: "flex-end" }}>
                  <p style={{ margin: 0, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, fontWeight: 600, color: GOLD }}>{g.sell.toLocaleString()} <span style={{ fontSize: 9.5, color: MUTED }}>DZD</span></p>
                  <TrendIcon item={g} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketTab({ t, unlocked, setUnlocked }) {
  const [asset, setAsset] = useState("EUR");
  const [period, setPeriod] = useState("month");
  const data = CHART_ASSETS[asset][period];
  const first = data[0].v, last = data[data.length - 1].v;
  const up = last >= first;

  return (
    <div style={{ padding: "16px 16px 8px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
        <TrendingUp size={14} color={GOLD} />
        <p style={{ margin: 0, fontSize: 11.5, fontWeight: 600, letterSpacing: 0.4, textTransform: "uppercase", color: MUTED, fontFamily: t.font }}>{t.premiumTitle}</p>
      </div>
      <p style={{ margin: "0 0 12px", fontSize: 11.5, color: MUTED, fontFamily: t.font }}>{t.premiumDesc}</p>

      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          {["EUR", "USD", "GOLD"].map((a) => (
            <button key={a} onClick={() => setAsset(a)} style={{
              border: "none", cursor: "pointer", padding: "6px 12px", borderRadius: 8,
              fontFamily: t.font, fontSize: 11.5, fontWeight: 600,
              background: asset === a ? ORANGE : "var(--pill-bg)", color: asset === a ? INK : MUTED,
            }}>{a}</button>
          ))}
        </div>

        <div style={{ background: CARD, border: "1px solid var(--line)", borderRadius: 14, padding: "14px 10px 6px", filter: unlocked ? "none" : "blur(5px)", pointerEvents: unlocked ? "auto" : "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px 8px" }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 18, fontWeight: 600, color: PAPER }}>
              {last.toLocaleString()} {asset === "GOLD" ? "DZD" : "DZD"}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 600, color: up ? GREEN : RED }}>
              {up ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
              {(((last - first) / first) * 100).toFixed(2)}%
            </span>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="mktGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={up ? "#49B980" : "#E2574C"} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={up ? "#49B980" : "#E2574C"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="i" hide />
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip contentStyle={{ background: "#161514", border: "none", borderRadius: 8, fontSize: 11 }} labelFormatter={() => ""} />
              <Area type="monotone" dataKey="v" stroke={up ? "#49B980" : "#E2574C"} strokeWidth={2} fill="url(#mktGrad)" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 3, background: "var(--pill-bg)", borderRadius: 8, padding: 3, margin: "6px 6px 10px" }}>
            {["week", "month", "year"].map((p) => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                flex: 1, border: "none", cursor: "pointer", padding: "6px 0", borderRadius: 6,
                fontFamily: t.font, fontSize: 11, fontWeight: 600,
                background: period === p ? ORANGE : "transparent", color: period === p ? INK : MUTED,
              }}>{t[p]}</button>
            ))}
          </div>
        </div>

        {!unlocked && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 10, textAlign: "center", padding: 20,
          }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${GOLD}, ${ORANGE})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Lock size={20} color={INK} />
            </div>
            <p style={{ margin: 0, fontFamily: t.font, fontSize: 12.5, fontWeight: 600, color: PAPER }}>{t.locked}</p>
            <button onClick={() => setUnlocked(true)} style={{
              border: "none", cursor: "pointer", padding: "10px 20px", borderRadius: 10,
              background: `linear-gradient(135deg, ${ORANGE}, ${GOLD})`, color: INK,
              fontFamily: t.font, fontWeight: 600, fontSize: 13,
            }}>{t.unlock}</button>
          </div>
        )}
      </div>
    </div>
  );
}

const CATEGORY_LABELS = {
  fr: { devise: "Devise", or: "Or", petrole: "P\u00e9trole", commerce: "Commerce", securite: "S\u00e9curit\u00e9", international: "International" },
  ar: { devise: "\u0627\u0644\u0639\u0645\u0644\u0627\u062a", or: "\u0627\u0644\u0630\u0647\u0628", petrole: "\u0627\u0644\u0628\u062a\u0631\u0648\u0644", commerce: "\u0627\u0644\u062a\u062c\u0627\u0631\u0629", securite: "\u0627\u0644\u0623\u0645\u0646", international: "\u062f\u0648\u0644\u064a" },
  en: { devise: "Currency", or: "Gold", petrole: "Oil", commerce: "Trade", securite: "Security", international: "International" },
};

function NewsTab({ t, lang, news, newsError }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const catLabels = CATEGORY_LABELS[lang] || CATEGORY_LABELS.fr;

  return (
    <div style={{ padding: "16px 16px 8px" }}>
      <p style={{ margin: "0 0 12px", fontSize: 11.5, fontWeight: 600, letterSpacing: 0.4, textTransform: "uppercase", color: MUTED, fontFamily: t.font }}>{t.newsHeader}</p>
      {newsError && (
        <p style={{ fontSize: 11, color: MUTED, fontFamily: t.font, marginBottom: 10 }}>{t.newsPlaceholder}</p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {news.length === 0 && !newsError && (
          <p style={{ fontSize: 11.5, color: MUTED, fontFamily: t.font }}>{t.newsEmpty}</p>
        )}
        {news.map((n) => (
          <a key={n.id} href={n.source_url || undefined} target={n.source_url ? "_blank" : undefined} rel="noreferrer" style={{ textDecoration: "none", background: CARD, borderRadius: 12, padding: "12px 13px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, border: "1px solid var(--line)" }}>
            <div>
              <span style={{ display: "inline-block", fontSize: 9, fontWeight: 700, color: ORANGE, background: "color-mix(in srgb, var(--accent) 15%, transparent)", padding: "2px 7px", borderRadius: 5, marginBottom: 5, fontFamily: t.font }}>
                {catLabels[n.category] || n.category}
              </span>
              <p style={{ margin: "0 0 3px", fontFamily: t.font, fontSize: 12.5, fontWeight: 600, color: PAPER }}>{n.title}</p>
              <p style={{ margin: 0, fontSize: 11, color: MUTED, fontFamily: t.font }}>{n.summary}</p>
            </div>
            <ChevronRight size={16} color={MUTED} style={{ flexShrink: 0, marginTop: 3 }} />
          </a>
        ))}
      </div>
    </div>
  );
}

function ContactTab({ t }) {
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div style={{ padding: "16px 16px 8px" }}>
      <p style={{ margin: "0 0 12px", fontSize: 11.5, fontWeight: 600, letterSpacing: 0.4, textTransform: "uppercase", color: MUTED, fontFamily: t.font }}>{t.contactHeader}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
        {[{ icon: MapPin, val: "Ouargla, Alg\u00e9rie" }, { icon: Phone, val: "+213 XX XX XX XX" }, { icon: Mail, val: "contact@dzchange.dz" }].map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, background: CARD, borderRadius: 10, padding: "10px 12px", border: "1px solid var(--line)" }}>
            <r.icon size={15} color={ORANGE} />
            <span style={{ fontFamily: t.font, fontSize: 12.5, color: PAPER }}>{r.val}</span>
          </div>
        ))}
      </div>
      <textarea
        value={msg} onChange={(e) => setMsg(e.target.value)} placeholder={t.yourMsg} rows={4}
        style={{ width: "100%", resize: "none", background: "var(--overlay)", border: "1px solid var(--overlay-border)", borderRadius: 10, padding: 10, color: PAPER, fontFamily: t.font, fontSize: 12.5, marginBottom: 10, boxSizing: "border-box" }}
      />
      <button onClick={() => { setSent(true); setMsg(""); setTimeout(() => setSent(false), 1800); }} style={{
        width: "100%", border: "none", cursor: "pointer", padding: "11px 0", borderRadius: 10,
        background: sent ? GREEN : `linear-gradient(135deg, ${ORANGE}, ${AMBER})`, color: INK,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: t.font, fontWeight: 600, fontSize: 13,
      }}>
        <Send size={14} /> {t.sendMsg}
      </button>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("fr");
  const [tab, setTab] = useState("rates");
  const [source, setSource] = useState("office");
  const [themeId, setThemeId] = useState("blaze");
  const [mode, setMode] = useState("dark");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [converterOpen, setConverterOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [currencies, setCurrencies] = useState(DEFAULT_CURRENCIES);
  const [goldItems, setGoldItems] = useState(DEFAULT_GOLD_ITEMS);
  const [bankRates, setBankRates] = useState([]);
  const [bankNameA, setBankNameA] = useState("Banque d'Alg\u00e9rie");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [news, setNews] = useState([]);
  const [newsError, setNewsError] = useState(false);

  useEffect(() => {
    sbGet("news_items", "select=*&order=published_at.desc&limit=20")
      .then(setNews)
      .catch(() => setNewsError(true));
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [flags, curr, gold, banks, names] = await Promise.all([
          Promise.resolve(DEFAULT_CURRENCIES),
          sbGet("currency_rates"),
          sbGet("gold_rates"),
          sbGet("bank_rates"),
          sbGet("bank_names"),
        ]);
        if (cancelled) return;
        const merged = curr.map((c) => {
          const meta = flags.find((f) => f.code === c.code) || {};
          return { code: c.code, symbol: meta.symbol, flag: meta.flag, buy: c.buy, sell: c.sell, base: c.sell };
        });
        setCurrencies(merged);
        setGoldItems(gold.map((g) => ({ key: g.key, buy: g.buy, sell: g.sell, base: g.sell })));
        const grouped = {};
        banks.forEach((b) => {
          grouped[b.code] = grouped[b.code] || { code: b.code };
          grouped[b.code][b.bank + "_buy"] = b.buy;
          grouped[b.code][b.bank + "_sell"] = b.sell;
        });
        setBankRates(Object.values(grouped));
        const a = names.find((n) => n.slot === "a");
        if (a) setBankNameA(a.name);
        const timestamps = curr.map((c) => c.updated_at).filter(Boolean).sort();
        if (timestamps.length) {
          const d = new Date(timestamps[timestamps.length - 1]);
          setLastUpdated(d.toLocaleDateString("fr-DZ", { day: "2-digit", month: "2-digit" }) + " \u00b7 " + d.toLocaleTimeString("fr-DZ", { hour: "2-digit", minute: "2-digit" }));
        }
      } catch (e) {
        setLoadError(true);
      }
    }
    load();
    const interval = setInterval(load, 30000); // rafraîchit toutes les 30s
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const theme = THEMES.find((x) => x.id === themeId) || THEMES[1];
  const m = MODES[mode];
  const t = T[lang];

  return (
    <div style={{
      minHeight: "100vh", width: "100%", background: `radial-gradient(circle at 50% -10%, #241C10 0%, ${BLACK} 55%)`,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px",
      fontFamily: "'IBM Plex Sans', sans-serif",
      "--accent": theme.accent, "--accent2": theme.accent2, "--deep": theme.deep,
      "--bg": m.bg, "--surface": m.surface, "--text": m.text, "--muted": m.muted,
      "--line": m.line, "--pill-bg": m.pillBg, "--overlay": m.overlay, "--overlay-border": m.overlayBorder,
    }}>
      <style>{FONTS}</style>
      <style>{`
        .dzc-root, .dzc-root * { transition: background-color 0.22s ease, color 0.22s ease, border-color 0.22s ease; }
        @keyframes flag-float { 0%,100% { transform: translateY(0px) rotate(-2deg); } 50% { transform: translateY(-6px) rotate(2deg); } }
        .dzc-content::-webkit-scrollbar { width: 5px; }
        .dzc-content::-webkit-scrollbar-thumb { background: var(--line); border-radius: 4px; }
      `}</style>

      <div className="dzc-root" style={{ position: "relative" }}>
        <div style={{
          position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)",
          width: 46, height: 46, borderRadius: "50%", background: "#FFFFFF",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
          boxShadow: "0 8px 20px rgba(0,0,0,0.35), 0 0 0 3px #0A0A0A",
          animation: "flag-float 3.2s ease-in-out infinite", zIndex: 5,
        }}>{"\ud83c\udde9\ud83c\uddff"}</div>

        <div dir={t.dir} style={{
          width: 390, maxWidth: "100%", borderRadius: 30, overflow: "hidden", background: BLACK,
          boxShadow: `0 30px 70px rgba(0,0,0,0.6), 0 0 0 1px color-mix(in srgb, ${ORANGE} 13%, transparent)`,
          border: "6px solid #050505", position: "relative",
        }}>
          <div style={{ background: `linear-gradient(135deg, #1A1408 0%, ${BLACK} 60%)`, padding: "18px 18px 14px", borderBottom: `1px solid color-mix(in srgb, ${GOLD} 13%, transparent)`, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 24, color: "#fff" }}>DZ</span>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 24, background: `linear-gradient(135deg, ${GOLD}, ${ORANGE})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginInlineStart: 4 }}>Change</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <LangSwitch lang={lang} setLang={setLang} />
                <button onClick={() => setConverterOpen(true)} style={{ width: 28, height: 28, borderRadius: 8, border: "none", cursor: "pointer", background: "var(--pill-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Calculator size={13} color={MUTED} />
                </button>
                <button onClick={() => setPopoverOpen((v) => !v)} style={{ width: 28, height: 28, borderRadius: 8, border: "none", cursor: "pointer", background: "var(--pill-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {mode === "dark" ? <Moon size={13} color={MUTED} /> : <Sun size={13} color={MUTED} />}
                </button>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ margin: 0, fontSize: 11.5, color: MUTED, fontFamily: t.font }}>{t.tagline}</p>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: GOLD, border: `1px solid color-mix(in srgb, ${GOLD} 27%, transparent)`, padding: "2px 7px", borderRadius: 5 }}>{t.licensed}</span>
              {lastUpdated && (
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: MUTED, marginInlineStart: 6 }}>
                  {"\u2022 " + lastUpdated}
                </span>
              )}
            </div>
            <AppearancePopover mode={mode} setMode={setMode} themeId={themeId} setThemeId={setThemeId} open={popoverOpen} setOpen={setPopoverOpen} />
          </div>

          <ConverterModal t={t} currencies={currencies} open={converterOpen} onClose={() => setConverterOpen(false)} />

          <div className="dzc-content" style={{ height: 430, overflowY: "auto" }}>
            {tab === "rates" && <RatesTab t={t} source={source} setSource={setSource} bankNameA={bankNameA} currencies={currencies} bankRates={bankRates} lastUpdated={lastUpdated} />}
            {tab === "gold" && <GoldTab t={t} goldItems={goldItems} />}
            {tab === "market" && <MarketTab t={t} unlocked={unlocked} setUnlocked={setUnlocked} />}
            {tab === "news" && <NewsTab t={t} lang={lang} news={news} newsError={newsError} />}
            {tab === "contact" && <ContactTab t={t} />}
          </div>

          <TabBar tab={tab} setTab={setTab} t={t} />
        </div>
      </div>
    </div>
  );
}
