import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Cell } from "recharts";

const COLORS = {
  bg: "#0f1117",
  card: "#1a1d27",
  border: "#2a2d3a",
  accent: "#e63946",
  gold: "#f4a261",
  green: "#2ec4b6",
  blue: "#457b9d",
  purple: "#7b2d8b",
  text: "#e0e0e0",
  muted: "#8b8fa8",
  warning: "#f4a261",
  danger: "#e63946",
  safe: "#2ec4b6",
};

// ============================================================
// DATA
// ============================================================
const rooms = ["ICU Kapuas", "PICU", "ICU IPIT", "IPIT Non ICU"];

const prevalenceData = {
  "ICU Kapuas": {
    darah: { total: 259, topBug: "K. pneumoniae", topN: 59, topPct: 23 },
    sputum: { total: 819, topBug: "K. pneumoniae", topN: 191, topPct: 24 },
    urine: { total: 375, topBug: "E. coli", topN: 76, topPct: 21 },
    pus: { total: 121, topBug: "E. coli", topN: 44, topPct: 36 },
  },
  PICU: {
    darah: { total: 83, topBug: "K. pneumoniae", topN: 29, topPct: 35 },
    sputum: { total: 219, topBug: "K. pneumoniae", topN: 62, topPct: 28 },
    urine: { total: 28, topBug: "E. coli", topN: 6, topPct: 21 },
    pus: { total: 17, topBug: "E. coli", topN: 6, topPct: 35 },
  },
  "ICU IPIT": {
    darah: { total: 15, topBug: "K. pneumoniae", topN: 5, topPct: 33 },
    sputum: { total: 88, topBug: "K. pneumoniae", topN: 31, topPct: 35 },
    urine: { total: 19, topBug: "E. coli", topN: 9, topPct: 47 },
    pus: { total: 8, topBug: "P. aeruginosa", topN: 3, topPct: 38 },
  },
  "IPIT Non ICU": {
    darah: { total: 22, topBug: "S. aureus", topN: 11, topPct: 50 },
    sputum: { total: 181, topBug: "K. pneumoniae", topN: 71, topPct: 39 },
    urine: { total: 70, topBug: "E. coli", topN: 32, topPct: 46 },
    pus: { total: 86, topBug: "P. aeruginosa", topN: 23, topPct: 26 },
  },
};

// Carbapenem resistance % per room per key bug
const carbapenemData = [
  { room: "ICU Kapuas", bug: "A. baumannii", pct: 80, specimen: "Darah" },
  { room: "ICU Kapuas", bug: "K. pneumoniae", pct: 20, specimen: "Darah" },
  { room: "ICU Kapuas", bug: "P. aeruginosa", pct: 36, specimen: "Darah" },
  { room: "ICU Kapuas", bug: "A. baumannii", pct: 81, specimen: "Sputum" },
  { room: "ICU Kapuas", bug: "K. pneumoniae", pct: 10, specimen: "Sputum" },
  { room: "ICU Kapuas", bug: "A. baumannii", pct: 84, specimen: "Urine" },
  { room: "ICU Kapuas", bug: "K. pneumoniae", pct: 38, specimen: "Urine" },
  { room: "PICU", bug: "A. baumannii", pct: 100, specimen: "Darah" },
  { room: "PICU", bug: "K. pneumoniae", pct: 20, specimen: "Darah" },
  { room: "PICU", bug: "A. baumannii", pct: 79, specimen: "Sputum" },
  { room: "PICU", bug: "K. pneumoniae", pct: 13, specimen: "Sputum" },
  { room: "PICU", bug: "P. aeruginosa", pct: 11, specimen: "Sputum" },
  { room: "ICU IPIT", bug: "A. baumannii", pct: 78, specimen: "Sputum" },
  { room: "ICU IPIT", bug: "P. aeruginosa", pct: 10, specimen: "Sputum" },
  { room: "IPIT Non ICU", bug: "A. baumannii", pct: 16, specimen: "Sputum" },
  { room: "IPIT Non ICU", bug: "A. baumannii", pct: 80, specimen: "Pus" },
  { room: "IPIT Non ICU", bug: "P. aeruginosa", pct: 43, specimen: "Pus" },
];

// ESBL
const esblData = [
  { room: "ICU Kapuas", bug: "K. pneumoniae", pct: 68, specimen: "Darah" },
  { room: "ICU Kapuas", bug: "E. coli", pct: 75, specimen: "Darah" },
  { room: "ICU Kapuas", bug: "K. pneumoniae", pct: 53, specimen: "Sputum" },
  { room: "ICU Kapuas", bug: "E. coli", pct: 80, specimen: "Sputum" },
  { room: "ICU Kapuas", bug: "K. pneumoniae", pct: 81, specimen: "Urine" },
  { room: "ICU Kapuas", bug: "E. coli", pct: 61, specimen: "Urine" },
  { room: "PICU", bug: "K. pneumoniae", pct: 75, specimen: "Darah" },
  { room: "PICU", bug: "E. coli", pct: 100, specimen: "Darah" },
  { room: "PICU", bug: "K. pneumoniae", pct: 70, specimen: "Sputum" },
  { room: "PICU", bug: "E. coli", pct: 88, specimen: "Sputum" },
  { room: "ICU IPIT", bug: "K. pneumoniae", pct: 49, specimen: "Sputum" },
  { room: "ICU IPIT", bug: "E. coli", pct: 71, specimen: "Sputum" },
  { room: "IPIT Non ICU", bug: "K. pneumoniae", pct: 42, specimen: "Sputum" },
  { room: "IPIT Non ICU", bug: "E. coli", pct: 72, specimen: "Sputum" },
  { room: "IPIT Non ICU", bug: "E. coli", pct: 77, specimen: "Pus" },
  { room: "IPIT Non ICU", bug: "K. pneumoniae", pct: 50, specimen: "Pus" },
];

// MRSA
const mrsaData = [
  { room: "ICU Kapuas", pct: 39, n: 18, specimen: "Darah" },
  { room: "ICU Kapuas", pct: 4, n: 23, specimen: "Sputum" },
  { room: "ICU Kapuas", pct: 33, n: 9, specimen: "Pus" },
  { room: "PICU", pct: 55, n: 9, specimen: "Darah" },
  { room: "PICU", pct: 30, n: 10, specimen: "Sputum" },
  { room: "PICU", pct: 50, n: 2, specimen: "Pus" },
  { room: "ICU IPIT", pct: 0, n: 1, specimen: "Sputum" },
  { room: "IPIT Non ICU", pct: 22, n: 9, specimen: "Darah" },
  { room: "IPIT Non ICU", pct: 33, n: 3, specimen: "Sputum" },
  { room: "IPIT Non ICU", pct: 40, n: 15, specimen: "Pus" },
];

// Antibiogram sensitivity - key antibiotics for K. pneumoniae blood (ICU Kapuas - best data)
const kpneuSensitivity = [
  { antibiotic: "MEM", "ICU Kapuas": 78, PICU: 89, "ICU IPIT": 100, "IPIT Non ICU": 99 },
  { antibiotic: "AK", "ICU Kapuas": 73, PICU: 65, "ICU IPIT": 97, "IPIT Non ICU": 93 },
  { antibiotic: "TIG", "ICU Kapuas": 82, PICU: 94, "ICU IPIT": 77, "IPIT Non ICU": 92 },
  { antibiotic: "GEN", "ICU Kapuas": 43, PICU: 31, "ICU IPIT": 68, "IPIT Non ICU": 72 },
  { antibiotic: "CIP", "ICU Kapuas": 25, PICU: 24, "ICU IPIT": 26, "IPIT Non ICU": 35 },
  { antibiotic: "CAZ", "ICU Kapuas": 34, PICU: 29, "ICU IPIT": 68, "IPIT Non ICU": 52 },
  { antibiotic: "CRO", "ICU Kapuas": 28, PICU: 29, "ICU IPIT": 51, "IPIT Non ICU": 44 },
  { antibiotic: "SCF", "ICU Kapuas": 66, PICU: 81, "ICU IPIT": 77, "IPIT Non ICU": 98 },
];

// A. baumannii sputum sensitivity
const abasSensitivity = [
  { antibiotic: "AK", "ICU Kapuas": 56, PICU: 63, "ICU IPIT": 90, "IPIT Non ICU": 90 },
  { antibiotic: "TIG", "ICU Kapuas": 52, PICU: 53, "ICU IPIT": 87, "IPIT Non ICU": 87 },
  { antibiotic: "MEM", "ICU Kapuas": 19, PICU: 20, "ICU IPIT": 84, "IPIT Non ICU": 84 },
  { antibiotic: "SCF", "ICU Kapuas": 67, PICU: 69, "ICU IPIT": 92, "IPIT Non ICU": 92 },
  { antibiotic: "GEN", "ICU Kapuas": 15, PICU: 20, "ICU IPIT": 81, "IPIT Non ICU": 81 },
  { antibiotic: "CIP", "ICU Kapuas": 14, PICU: 20, "ICU IPIT": 65, "IPIT Non ICU": 65 },
];

// Gap summary per room
const gapSummary = {
  "ICU Kapuas": {
    strengths: [
      "Data paling lengkap – antibiogram tersedia untuk semua spesimen",
      "Jumlah isolat memadai untuk analisis statistik",
      "Data 3 bakteri utama tersedia di spesimen darah",
    ],
    gaps: [
      "Colistin/Polymyxin B tidak diuji – padahal CR-Acinetobacter 80%",
      "Tidak ada antibiogram pus (n=121, tapi hanya E. coli yang memenuhi threshold)",
      "K. pneumoniae urine: MEM sensitivity rendah (43%) tanpa alternatif last-resort",
      "Tidak ada data Ceftazidime-Avibactam untuk KPC/MBL producer",
    ],
    alert: "KRITIS",
    alertColor: COLORS.danger,
  },
  PICU: {
    strengths: [
      "Antibiogram sputum tersedia untuk 3 bakteri (K. pneumoniae, A. baumannii, P. aeruginosa)",
      "Data MRSA tersedia per spesimen",
    ],
    gaps: [
      "A. baumannii darah: CR 100% – tidak ada antibiogram karena n<30",
      "Tidak ada antibiogram urine (n=28, di bawah threshold)",
      "Tidak ada antibiogram pus (n=17)",
      "Colistin tidak diuji untuk pengelolaan CRGNB",
      "Data darah: 2 spesies utama (K. pneumoniae & A. baumannii) tanpa antibiogram lengkap",
    ],
    alert: "KRITIS",
    alertColor: COLORS.danger,
  },
  "ICU IPIT": {
    strengths: [
      "Antibiogram sputum K. pneumoniae tersedia (n=31)",
      "K. pneumoniae sputum: MEM sensitivity tinggi (100%) – belum banyak resistensi carbapenem",
      "CR rate lebih rendah dibanding ICU Kapuas",
    ],
    gaps: [
      "Volume isolat sangat kecil – hampir semua spesimen <30 (darah n=15, urine n=19, pus n=8)",
      "Tidak ada antibiogram darah, urine, pus",
      "A. baumannii CR 78% di sputum tapi n=23 – tidak cukup untuk antibiogram",
      "Data MRSA hanya 1 isolat – tidak representatif",
    ],
    alert: "WASPADA",
    alertColor: COLORS.warning,
  },
  "IPIT Non ICU": {
    strengths: [
      "Antibiogram sputum tersedia untuk 3 kelompok bakteri",
      "Antibiogram pus (gabungan E. coli + K. pneumoniae) tersedia",
      "Antibiogram urine E. coli tersedia",
      "CR rate lebih rendah (IPIT non ICU = lebih sedikit paparan antibiotik sebelumnya)",
    ],
    gaps: [
      "Tidak ada antibiogram darah (n=22)",
      "A. baumannii pus CR 80% tapi n=5 – tidak ada antibiogram",
      "P. aeruginosa pus CR 43% – tidak ada antibiogram tersendiri",
      "MRSA pus 40% tanpa antibiogram Staphylococcus",
      "Pengelompokan 'Batang Gram Negatif' menyembunyikan profil resistensi per spesies",
    ],
    alert: "WASPADA",
    alertColor: COLORS.warning,
  },
};

// ============================================================
// COMPONENTS
// ============================================================

function Badge({ text, color }) {
  return (
    <span style={{
      background: color + "22",
      color: color,
      border: `1px solid ${color}55`,
      borderRadius: 4,
      padding: "2px 8px",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 1,
    }}>{text}</span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 10,
      padding: 20,
      ...style,
    }}>{children}</div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ color: COLORS.muted, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
      {children}
    </div>
  );
}

function StatBox({ label, value, sub, color = COLORS.accent }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "monospace" }}>{value}</div>
      <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 1 }}>{sub}</div>}
    </div>
  );
}

function RoomOverview({ room }) {
  const d = prevalenceData[room];
  const gap = gapSummary[room];
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.text }}>{room}</div>
          <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>Total volume isolat</div>
        </div>
        <Badge text={gap.alert} color={gap.alertColor} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {["darah", "sputum", "urine", "pus"].map(sp => (
          <div key={sp} style={{
            background: COLORS.bg,
            borderRadius: 8,
            padding: "10px 12px",
            borderLeft: `3px solid ${COLORS.blue}`,
          }}>
            <div style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1 }}>{sp}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.text, fontFamily: "monospace" }}>{d[sp].total}</div>
            <div style={{ fontSize: 10, color: COLORS.muted }}>#{1} {d[sp].topBug} ({d[sp].topPct}%)</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ResistanceHeatmap({ title, data, rooms: roomList }) {
  const bugs = [...new Set(data.map(d => d.bug))];
  const specimens = [...new Set(data.map(d => d.specimen))];

  const getVal = (room, bug, specimen) => {
    const found = data.find(d => d.room === room && d.bug === bug && d.specimen === specimen);
    return found ? found.pct : null;
  };

  const getColor = (pct) => {
    if (pct === null) return COLORS.border;
    if (pct >= 70) return COLORS.danger;
    if (pct >= 40) return COLORS.warning;
    return COLORS.green;
  };

  return (
    <Card>
      <SectionTitle>{title}</SectionTitle>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ color: COLORS.muted, textAlign: "left", padding: "6px 8px", fontSize: 11 }}>Bakteri</th>
              <th style={{ color: COLORS.muted, textAlign: "left", padding: "6px 8px", fontSize: 11 }}>Spesimen</th>
              {roomList.map(r => (
                <th key={r} style={{ color: COLORS.muted, padding: "6px 8px", fontSize: 10, textAlign: "center" }}>{r}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bugs.flatMap(bug =>
              specimens.map((specimen, si) => {
                const vals = roomList.map(r => getVal(r, bug, specimen));
                if (vals.every(v => v === null)) return null;
                return (
                  <tr key={`${bug}-${specimen}`} style={{ borderTop: si === 0 ? `1px solid ${COLORS.border}` : "none" }}>
                    <td style={{ color: COLORS.text, padding: "5px 8px", fontStyle: "italic", fontSize: 11 }}>
                      {si === 0 ? bug : ""}
                    </td>
                    <td style={{ color: COLORS.muted, padding: "5px 8px", fontSize: 11 }}>{specimen}</td>
                    {roomList.map(r => {
                      const v = getVal(r, bug, specimen);
                      return (
                        <td key={r} style={{ padding: "5px 8px", textAlign: "center" }}>
                          {v !== null ? (
                            <span style={{
                              background: getColor(v) + "33",
                              color: getColor(v),
                              borderRadius: 4,
                              padding: "2px 6px",
                              fontWeight: 700,
                              fontFamily: "monospace",
                              fontSize: 12,
                            }}>{v}%</span>
                          ) : (
                            <span style={{ color: COLORS.border }}>—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              }).filter(Boolean)
            )}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 11, color: COLORS.muted }}>
        <span><span style={{ color: COLORS.danger }}>■</span> ≥70% (Kritis)</span>
        <span><span style={{ color: COLORS.warning }}>■</span> 40-69% (Waspada)</span>
        <span><span style={{ color: COLORS.green }}>■</span> &lt;40% (Aman)</span>
      </div>
    </Card>
  );
}

function SensitivityChart({ data, title, bug }) {
  const roomColors = {
    "ICU Kapuas": COLORS.accent,
    PICU: COLORS.gold,
    "ICU IPIT": COLORS.green,
    "IPIT Non ICU": COLORS.blue,
  };

  return (
    <Card>
      <SectionTitle>{title}</SectionTitle>
      <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 12, fontStyle: "italic" }}>{bug}</div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis dataKey="antibiotic" tick={{ fill: COLORS.muted, fontSize: 11 }} />
          <YAxis domain={[0, 100]} tick={{ fill: COLORS.muted, fontSize: 10 }} />
          <Tooltip
            contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8 }}
            labelStyle={{ color: COLORS.text }}
            formatter={(val, name) => [`${val}%`, name]}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: COLORS.muted }} />
          {Object.entries(roomColors).map(([room, color]) => (
            <Bar key={room} dataKey={room} fill={color} radius={[3, 3, 0, 0]} maxBarSize={18} />
          ))}
        </BarChart>
      </ResponsiveContainer>
      <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 8 }}>%Sensitivitas (%S) — semakin tinggi semakin efektif</div>
    </Card>
  );
}

function GapAnalysisCard({ room }) {
  const gap = gapSummary[room];
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.text }}>{room}</div>
        <Badge text={gap.alert} color={gap.alertColor} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: COLORS.green, fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>✓ KEKUATAN DATA</div>
        {gap.strengths.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <span style={{ color: COLORS.green, flexShrink: 0 }}>✓</span>
            <span style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.5 }}>{s}</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 14 }}>
        <div style={{ fontSize: 11, color: COLORS.danger, fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>✗ KESENJANGAN / GAP</div>
        {gap.gaps.map((g, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <span style={{ color: COLORS.danger, flexShrink: 0 }}>✗</span>
            <span style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.5 }}>{g}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function MRSATable() {
  const byRoom = {};
  mrsaData.forEach(d => {
    if (!byRoom[d.room]) byRoom[d.room] = [];
    byRoom[d.room].push(d);
  });

  return (
    <Card>
      <SectionTitle>Prevalensi MRSA per Ruangan & Spesimen</SectionTitle>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
            <th style={{ color: COLORS.muted, textAlign: "left", padding: "6px 8px" }}>Ruangan</th>
            <th style={{ color: COLORS.muted, textAlign: "left", padding: "6px 8px" }}>Spesimen</th>
            <th style={{ color: COLORS.muted, textAlign: "center", padding: "6px 8px" }}>n S. aureus</th>
            <th style={{ color: COLORS.muted, textAlign: "center", padding: "6px 8px" }}>MRSA %</th>
            <th style={{ color: COLORS.muted, textAlign: "center", padding: "6px 8px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {mrsaData.map((d, i) => {
            const color = d.pct >= 40 ? COLORS.danger : d.pct >= 20 ? COLORS.warning : COLORS.green;
            return (
              <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}22` }}>
                <td style={{ color: COLORS.text, padding: "6px 8px" }}>{d.room}</td>
                <td style={{ color: COLORS.muted, padding: "6px 8px" }}>{d.specimen}</td>
                <td style={{ color: COLORS.muted, padding: "6px 8px", textAlign: "center", fontFamily: "monospace" }}>{d.n}</td>
                <td style={{ padding: "6px 8px", textAlign: "center" }}>
                  <span style={{ color, fontWeight: 700, fontFamily: "monospace" }}>{d.pct}%</span>
                </td>
                <td style={{ padding: "6px 8px", textAlign: "center" }}>
                  <Badge
                    text={d.pct >= 40 ? "TINGGI" : d.pct >= 20 ? "SEDANG" : "RENDAH"}
                    color={color}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

function RecommendationCard() {
  const recs = [
    {
      priority: "SEGERA",
      color: COLORS.danger,
      items: [
        "Tambahkan uji Colistin/Polymyxin B untuk A. baumannii dan P. aeruginosa carbapenem-resistant di ICU & PICU",
        "PICU: A. baumannii darah CR 100% – konsultasi PPRA untuk protokol terapi empirik khusus",
        "ICU Kapuas: K. pneumoniae urine CR 38% – pertimbangkan kombinasi Fosfomycin + Carbapenem",
        "Gabungkan data ICU IPIT dengan ICU Kapuas untuk memenuhi threshold antibiogram",
      ]
    },
    {
      priority: "JANGKA MENENGAH",
      color: COLORS.warning,
      items: [
        "Lakukan uji Ceftazidime-Avibactam untuk deteksi KPC/MBL producer di semua ICU",
        "IPIT Non ICU: Pisahkan antibiogram per spesies (jangan digabung sebagai 'Batang Gram Negatif')",
        "PICU: Perluas panel antibiotik – tambahkan Piperacillin-Tazobactam dan Imipenem",
        "Buat protokol antibiogram bersama ICU-PICU-IPIT untuk memenuhi minimum 30 isolat per spesies",
      ]
    },
    {
      priority: "JANGKA PANJANG",
      color: COLORS.green,
      items: [
        "Implementasi whole genome sequencing untuk CRKP dan CRAB – identifikasi mekanisme resistensi",
        "Buat dashboard real-time resistensi berbasis data laboratorium SIMRS",
        "Integrasi data klinis (mortalitas, lama rawat) dengan profil resistensi per ruangan",
        "Lakukan perbandingan tren tahunan 2023-2025 untuk early warning sistem",
      ]
    },
  ];

  return (
    <Card>
      <SectionTitle>Rekomendasi Prioritas</SectionTitle>
      {recs.map((rec, i) => (
        <div key={i} style={{ marginBottom: i < recs.length - 1 ? 20 : 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 3, height: 16, background: rec.color, borderRadius: 2 }} />
            <Badge text={rec.priority} color={rec.color} />
          </div>
          {rec.items.map((item, j) => (
            <div key={j} style={{ display: "flex", gap: 10, marginBottom: 8, paddingLeft: 11 }}>
              <span style={{ color: rec.color, fontSize: 14, flexShrink: 0 }}>→</span>
              <span style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
        </div>
      ))}
    </Card>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [tab, setTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "resistance", label: "Pola Resistensi" },
    { id: "sensitivity", label: "Sensitivitas Antibiotik" },
    { id: "gap", label: "Gap Analysis" },
    { id: "recom", label: "Rekomendasi" },
  ];

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: COLORS.text }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: "18px 24px" }}>
        <div style={{ fontSize: 11, color: COLORS.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
          RSUD Dr. Saiful Anwar Malang · Antibiogram 2025
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.text }}>
          Analisis Khusus: <span style={{ color: COLORS.accent }}>ICU · PICU · IPIT</span>
        </div>
      </div>

      {/* Alert Banner */}
      <div style={{
        background: COLORS.danger + "18",
        borderBottom: `1px solid ${COLORS.danger}44`,
        padding: "10px 24px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 12,
      }}>
        <span style={{ color: COLORS.danger, fontWeight: 800 }}>⚠ PERINGATAN KRITIS:</span>
        <span style={{ color: COLORS.text }}>
          A. baumannii carbapenem-resistant mencapai <strong>100% di PICU</strong> dan <strong>80% di ICU Kapuas</strong> (darah).
          Colistin/Polymyxin B <strong>tidak diuji</strong> di seluruh ruangan ini.
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, padding: "16px 24px 0", borderBottom: `1px solid ${COLORS.border}` }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: tab === t.id ? COLORS.accent + "22" : "transparent",
            color: tab === t.id ? COLORS.accent : COLORS.muted,
            border: `1px solid ${tab === t.id ? COLORS.accent + "55" : "transparent"}`,
            borderBottom: "none",
            borderRadius: "6px 6px 0 0",
            padding: "8px 16px",
            fontSize: 12,
            fontWeight: tab === t.id ? 700 : 400,
            cursor: "pointer",
          }}>{t.label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>

        {tab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              {rooms.map(r => <RoomOverview key={r} room={r} />)}
            </div>
            {/* Key stats */}
            <Card>
              <SectionTitle>Sorotan Kritis Lintas Ruangan</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
                <StatBox label="CR-Acinetobacter PICU (Darah)" value="100%" color={COLORS.danger} sub="n=15 isolat" />
                <StatBox label="CR-Acinetobacter ICU Kapuas (Darah)" value="80%" color={COLORS.danger} sub="n=56 isolat" />
                <StatBox label="MRSA PICU (Darah)" value="55%" color={COLORS.warning} sub="n=9 isolat" />
                <StatBox label="ESBL E.coli ICU IPIT (Sputum)" value="71%" color={COLORS.warning} sub="n=7 isolat" />
              </div>
            </Card>
          </div>
        )}

        {tab === "resistance" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <ResistanceHeatmap
              title="Carbapenem-Resistant Rate per Ruangan"
              data={carbapenemData}
              rooms={rooms}
            />
            <ResistanceHeatmap
              title="ESBL Rate per Ruangan"
              data={esblData}
              rooms={rooms}
            />
            <MRSATable />
          </div>
        )}

        {tab === "sensitivity" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ padding: "8px 12px", background: COLORS.blue + "22", borderRadius: 8, fontSize: 12, color: COLORS.text, borderLeft: `3px solid ${COLORS.blue}` }}>
              <strong>Catatan:</strong> ICU IPIT dan IPIT Non ICU menggunakan data sputum K. pneumoniae (spesimen dengan antibiogram paling lengkap).
              Data ICU Kapuas dan PICU dari sputum kecuali disebutkan lain.
            </div>
            <SensitivityChart
              data={kpneuSensitivity}
              title="Sensitivitas Antibiotik — Klebsiella pneumoniae (Sputum/Darah)"
              bug="Perbandingan %S antar ruangan ICU/PICU/IPIT"
            />
            <SensitivityChart
              data={abasSensitivity}
              title="Sensitivitas Antibiotik — Acinetobacter baumannii (Sputum)"
              bug="Patogen dengan carbapenem resistance tertinggi di semua ruangan kritis"
            />
            <Card>
              <SectionTitle>Interpretasi Klinis</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { bug: "K. pneumoniae", room: "ICU Kapuas & PICU", finding: "MEM sensitivity 78-89% – masih bisa digunakan sebagai pilihan utama, tapi harus dikombinasikan. CIP hanya 25% – jangan digunakan empirik.", color: COLORS.warning },
                  { bug: "A. baumannii", room: "ICU Kapuas & PICU", finding: "MEM hanya 19-20%, AK 56-63% – hanya TIG dan SCF yang relatif lebih baik. Tanpa Colistin, opsi terapi sangat terbatas.", color: COLORS.danger },
                  { bug: "K. pneumoniae", room: "ICU IPIT & IPIT Non ICU", finding: "MEM masih 99-100% sensitif – regimen berbasis carbapenem masih efektif. Lebih baik dari ICU Kapuas.", color: COLORS.green },
                  { bug: "A. baumannii", room: "ICU IPIT & IPIT Non ICU", finding: "Data terbatas (n<30). CR 78% di ICU IPIT, namun interpretasi antibiogram tidak tersedia. Butuh data lebih.", color: COLORS.warning },
                ].map((item, i) => (
                  <div key={i} style={{ background: COLORS.bg, borderRadius: 8, padding: 14, borderLeft: `3px solid ${item.color}` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: item.color, fontStyle: "italic", marginBottom: 4 }}>{item.bug}</div>
                    <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 6 }}>{item.room}</div>
                    <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.6 }}>{item.finding}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {tab === "gap" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              {rooms.map(r => <GapAnalysisCard key={r} room={r} />)}
            </div>
            <Card>
              <SectionTitle>Matriks Ketersediaan Antibiogram</SectionTitle>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                      <th style={{ color: COLORS.muted, textAlign: "left", padding: "8px" }}>Spesimen</th>
                      {rooms.map(r => <th key={r} style={{ color: COLORS.muted, textAlign: "center", padding: "8px", fontSize: 11 }}>{r}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { sp: "Darah", vals: ["parsial (3 sp)", "tidak ada", "tidak ada", "tidak ada"] },
                      { sp: "Sputum", vals: ["lengkap (4 sp)", "lengkap (3 sp)", "parsial (1 sp)", "parsial (3 sp)"] },
                      { sp: "Urine", vals: ["parsial (3 sp)", "tidak ada", "tidak ada", "parsial (1 sp)"] },
                      { sp: "Pus", vals: ["parsial (1 sp)", "tidak ada", "tidak ada", "gabungan"] },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}22` }}>
                        <td style={{ color: COLORS.text, padding: "8px", fontWeight: 600 }}>{row.sp}</td>
                        {row.vals.map((v, j) => {
                          const color = v.startsWith("lengkap") ? COLORS.green : v === "tidak ada" ? COLORS.danger : COLORS.warning;
                          return (
                            <td key={j} style={{ padding: "8px", textAlign: "center" }}>
                              <Badge text={v} color={color} />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {tab === "recom" && <RecommendationCard />}

      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: "16px 24px", fontSize: 11, color: COLORS.muted }}>
        Sumber: Antibiogram Kumulatif RSUD Dr. Saiful Anwar Malang Periode 2025 · Instalasi Mikrobiologi Klinik · Diterbitkan Maret 2026
      </div>
    </div>
  );
}
