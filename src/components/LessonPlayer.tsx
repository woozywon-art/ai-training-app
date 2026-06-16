"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Level, Slide } from "@/lib/course";
import { Buddy, Guide } from "./Buddy";
import { levelTag } from "@/lib/course";

export default function LessonPlayer({ level }: { level: Level }) {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [checked, setChecked] = useState(false);

  if (!level.filled || level.slides.length === 0) {
    return (
      <Shell level={level}>
        <div className="card fade">
          <Guide mood="think" tone="amber" text={`아직 이 레벨은 준비 중이에요. 목표만 먼저 살짝 알려드릴게요!`} />
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: "16px 0 10px" }}>{level.title}</h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, margin: "0 0 14px" }}>{level.goal}</p>
          {level.photos.length > 0 && (
            <div style={{ background: "var(--bg)", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: "var(--soft)", marginBottom: 8 }}>📷 이 레벨에 들어갈 사진</div>
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8, color: "var(--soft)", fontSize: 14 }}>
                {level.photos.map((p, k) => <li key={k}>{p}</li>)}
              </ul>
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <Link href="/" className="btn-ghost">← 과정 지도</Link>
            <Link href={`/level/${level.id}/exam`} className="btn" style={{ flex: 1, textAlign: "center" }}>미션 보기 →</Link>
          </div>
        </div>
      </Shell>
    );
  }

  const slides = level.slides;
  const s = slides[i];
  const last = i === slides.length - 1;
  const gate = s.type === "check" && !checked;

  function next() {
    if (!last) { setI(i + 1); setChecked(false); return; }
    localStorage.setItem(`aitr:lesson:${level.id}`, "1");
    router.push(`/level/${level.id}/exam`);
  }

  return (
    <Shell level={level}>
      {i === 0 && (
        <div style={{ marginBottom: 14 }}>
          <Guide mood="talk" text={`안녕하세요! 저는 가이드 코디예요 👋\n‘${level.title}’ 함께 가볍게 배워볼까요?`} />
        </div>
      )}
      <div style={{ display: "flex", gap: 5, marginBottom: 16 }}>
        {slides.map((_, k) => <div key={k} style={{ flex: 1, height: 6, borderRadius: 99, background: k <= i ? "var(--blue)" : "var(--line)" }} />)}
      </div>
      <div key={i} className="pop">
        {s.type === "visual" && <VisualSlide s={s} />}
        {s.type === "text" && <TextSlide s={s} />}
        {s.type === "table" && <TableSlide s={s} />}
        {s.type === "prompt" && <PromptSlide s={s} />}
        {s.type === "ui" && <UiSlide s={s} />}
        {s.type === "check" && <CheckCard s={s} onChecked={() => setChecked(true)} />}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        {i > 0 && <button onClick={() => { setI(i - 1); setChecked(false); }} className="btn-ghost">← 이전</button>}
        <button onClick={next} disabled={gate} className="btn lift" style={{ flex: 1 }}>
          {last ? "이 레벨 미션 하기 →" : "다음 →"}
        </button>
      </div>
    </Shell>
  );
}

function Shell({ level, children }: { level: Level; children: React.ReactNode }) {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "0 18px 110px" }}>
      <div style={{ position: "sticky", top: 0, background: "var(--bg)", borderBottom: "1px solid var(--line)", margin: "0 -18px 18px", padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, zIndex: 10 }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid var(--line)", background: "#fff", borderRadius: 99, padding: "7px 13px", fontWeight: 800, fontSize: 13.5, color: "var(--ink)" }}>🏠 홈</Link>
        <b style={{ fontSize: 15.5 }}>{levelTag(level)} · {level.title}</b>
      </div>
      {children}
    </main>
  );
}

function VisualSlide({ s }: { s: Extract<Slide, { type: "visual" }> }) {
  const [open, setOpen] = useState<number | null>(null);
  const [imgError, setImgError] = useState(false);
  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        <span style={{ background: "var(--blueSoft)", color: "var(--blue)", borderRadius: 8, padding: "4px 10px", fontSize: 12.5, fontWeight: 800 }}>{s.badge}</span>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{s.title}</h2>
      </div>
      <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: 14, overflow: "hidden", background: "var(--stage)" }}>
        {s.img.src && !imgError ? (
          <img src={s.img.src} alt={s.img.desc} onError={() => setImgError(true)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center", padding: 24, border: "2px dashed #3A4255", borderRadius: 14, color: "#A7B0C2" }}>
            <div>
              <div style={{ fontSize: 30, marginBottom: 10 }}>📷</div>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: "#D7DEEC", marginBottom: 6 }}>여기에 이미지를 넣어주세요</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.55, maxWidth: 460, margin: "0 auto" }}>{s.img.desc}</div>
              <div style={{ fontSize: 12, color: "#7B879B", marginTop: 8 }}>{s.img.size} · 직접 캡처해 전달</div>
            </div>
          </div>
        )}
        {s.callouts.map((c, k) => (
          <button key={k} onClick={() => setOpen(open === k ? null : k)} className="ping"
            style={{ position: "absolute", left: `${c.x}%`, top: `${c.y}%`, transform: "translate(-50%,-50%)", width: 28, height: 28, borderRadius: 99, border: "2px solid #fff", cursor: "pointer", background: open === k ? "#fff" : "var(--amber)", color: open === k ? "var(--ink)" : "#fff", fontWeight: 800, fontSize: 13 }}>{k + 1}</button>
        ))}
        {open !== null && (
          <div className="pop" style={{ position: "absolute", left: "50%", bottom: 12, transform: "translateX(-50%)", maxWidth: "86%", background: "#fff", color: "var(--ink)", borderRadius: 10, padding: "9px 14px", fontSize: 13.5, fontWeight: 700, boxShadow: "0 6px 20px rgba(0,0,0,0.3)" }}>{s.callouts[open].label}</div>
        )}
      </div>
      <div style={{ marginTop: 16 }}><Guide mood="point" text={s.caption} /></div>
      {s.callouts.length > 0 && <p style={{ fontSize: 13, color: "var(--soft)", margin: "10px 2px 0" }}>💡 화면 위 숫자를 눌러 각 부분 설명을 확인하세요.</p>}
    </div>
  );
}

function TextSlide({ s }: { s: Extract<Slide, { type: "text" }> }) {
  return (
    <div className="card">
      <span style={{ background: "var(--blueSoft)", color: "var(--blue)", borderRadius: 8, padding: "4px 10px", fontSize: 12.5, fontWeight: 800 }}>{s.badge}</span>
      <h2 style={{ fontSize: 21, fontWeight: 800, margin: "12px 0 14px" }}>{s.title}</h2>
      <Guide mood="talk" text={s.body} />
    </div>
  );
}

function CheckCard({ s, onChecked }: { s: Extract<Slide, { type: "check" }>; onChecked: () => void }) {
  const [pick, setPick] = useState<number | null>(null);
  const correct = pick === s.answer;
  const mood = pick === null ? "think" : correct ? "cheer" : "talk";
  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ background: "var(--amberSoft)", color: "var(--amber)", borderRadius: 8, padding: "4px 10px", fontSize: 12.5, fontWeight: 800 }}>중간 점검</span>
        <span style={{ fontSize: 13, color: "var(--soft)", fontWeight: 700 }}>코디의 질문!</span>
      </div>
      <div style={{ marginBottom: 14 }}><Guide mood={mood} tone="amber" text={s.q} size={56} /></div>
      <div style={{ display: "grid", gap: 9 }}>
        {s.options.map((op, k) => {
          let bd = "var(--line)", bg = "#fff";
          if (pick !== null) { if (k === s.answer) { bd = "var(--green)"; bg = "var(--greenSoft)"; } else if (k === pick) { bd = "var(--red)"; bg = "var(--redSoft)"; } }
          return (
            <button key={k} disabled={pick !== null} onClick={() => { setPick(k); onChecked(); }}
              style={{ textAlign: "left", fontFamily: "inherit", cursor: pick === null ? "pointer" : "default", background: bg, border: `2px solid ${bd}`, borderRadius: 12, padding: "14px 15px", fontSize: 15.5, fontWeight: 700 }}>{op}</button>
          );
        })}
      </div>
      {pick !== null && (
        <div className="pop" style={{ marginTop: 12, background: correct ? "var(--greenSoft)" : "var(--amberSoft)", borderRadius: 12, padding: "12px 15px", fontSize: 15, fontWeight: 700, color: correct ? "#0d7a57" : "#8a5a08" }}>
          {correct ? "✓ " : "💡 "}{correct ? s.ok : s.no}
        </div>
      )}
    </div>
  );
}

function TableSlide({ s }: { s: Extract<Slide, { type: "table" }> }) {
  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ background: "var(--blueSoft)", color: "var(--blue)", borderRadius: 8, padding: "4px 10px", fontSize: 12.5, fontWeight: 800 }}>{s.badge}</span>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{s.title}</h2>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
          <thead>
            <tr>{s.columns.map((c, k) => (
              <th key={k} style={{ textAlign: "left", padding: "10px 12px", background: "var(--bg)", borderBottom: "2px solid var(--line)", fontWeight: 800, whiteSpace: "nowrap" }}>{c}</th>
            ))}</tr>
          </thead>
          <tbody>
            {s.rows.map((row, r) => (
              <tr key={r}>{row.map((cell, c) => (
                <td key={c} style={{ padding: "11px 12px", borderBottom: "1px solid var(--line)", fontWeight: c === 0 ? 800 : 500, color: c === 0 ? "var(--blue)" : "var(--ink)", verticalAlign: "top" }}>{cell}</td>
              ))}</tr>
            ))}
          </tbody>
        </table>
      </div>
      {s.caption && <p style={{ fontSize: 15.5, lineHeight: 1.6, margin: "14px 2px 0", color: "var(--soft)" }}>{s.caption}</p>}
    </div>
  );
}

function UiSlide({ s }: { s: Extract<Slide, { type: "ui" }> }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ background: "var(--blueSoft)", color: "var(--blue)", borderRadius: 8, padding: "4px 10px", fontSize: 12.5, fontWeight: 800 }}>{s.badge}</span>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{s.title}</h2>
      </div>
      <p style={{ textAlign: "center", color: "var(--soft)", fontSize: 14, margin: "0 0 12px", fontWeight: 600 }}>반짝이는 번호를 눌러보세요 👇</p>
      <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: 14, overflow: "hidden", border: "1px solid var(--line)" }}>
        <div style={{ display: "flex", height: "100%", background: "#F3F4F7" }}>
          <div style={{ width: "26%", background: "#fff", borderRight: "1px solid var(--line)", padding: "8%" }}>
            <div style={{ background: "var(--blueSoft)", color: "var(--blue)", borderRadius: 8, padding: "8% 4%", fontSize: 11, fontWeight: 800, textAlign: "center" }}>+ 새 대화</div>
            <div style={{ marginTop: "8%", display: "grid", gap: 6 }}>{[0, 1, 2].map((k) => <div key={k} style={{ height: 8, background: "#EEE", borderRadius: 5 }} />)}</div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, padding: "4%", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ alignSelf: "flex-end", background: "var(--blue)", color: "#fff", borderRadius: "12px 12px 2px 12px", padding: "6px 10px", fontSize: 11, maxWidth: "70%" }}>안녕!</div>
              <div style={{ alignSelf: "flex-start", background: "#fff", border: "1px solid var(--line)", borderRadius: "12px 12px 12px 2px", padding: "6px 10px", fontSize: 11, maxWidth: "80%" }}>안녕하세요! 무엇을 도와드릴까요?</div>
            </div>
            <div style={{ padding: "3%", display: "flex", gap: 8, alignItems: "center", borderTop: "1px solid var(--line)", background: "#fff" }}>
              <div style={{ flex: 1, height: 28, background: "#F3F4F7", borderRadius: 8, display: "flex", alignItems: "center", padding: "0 10px", color: "#B7B9C0", fontSize: 11 }}>여기에 입력…</div>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--blue)", color: "#fff", display: "grid", placeItems: "center", fontSize: 14 }}>↑</div>
            </div>
          </div>
        </div>
        {s.spots.map((c, k) => (
          <button key={k} onClick={() => setOpen(open === k ? null : k)} className="ping"
            style={{ position: "absolute", left: `${c.x}%`, top: `${c.y}%`, transform: "translate(-50%,-50%)", width: 28, height: 28, borderRadius: 99, border: "2px solid #fff", cursor: "pointer", background: open === k ? "var(--ink)" : "var(--amber)", color: "#fff", fontWeight: 800, fontSize: 13, boxShadow: "0 3px 10px rgba(0,0,0,0.3)" }}>{k + 1}</button>
        ))}
      </div>
      <div style={{ marginTop: 16 }}><Guide mood="point" text={s.caption} /></div>
      {open !== null && (
        <div className="pop" style={{ marginTop: 10, background: "var(--amberSoft)", border: "1.5px solid var(--amber)", borderRadius: 12, padding: "12px 15px", fontSize: 15.5, fontWeight: 700, color: "#8a5a08" }}>{s.spots[open].label}</div>
      )}
    </div>
  );
}

function PromptSlide({ s }: { s: Extract<Slide, { type: "prompt" }> }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    try { navigator.clipboard?.writeText(s.prompt); } catch {}
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div className="card" style={{ borderColor: "var(--blue)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ background: "var(--blue)", color: "#fff", borderRadius: 8, padding: "4px 10px", fontSize: 12.5, fontWeight: 800 }}>{s.badge}</span>
        <h2 style={{ fontSize: 19, fontWeight: 800, margin: 0 }}>{s.title}</h2>
      </div>
      <div style={{ position: "relative", background: "var(--stage)", color: "#E8EDFB", borderRadius: 12, padding: "16px 16px 14px", fontSize: 15, lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {s.prompt}
      </div>
      <button onClick={copy} className="btn lift" style={{ width: "100%", marginTop: 12, background: copied ? "var(--green)" : "var(--blue)" }}>
        {copied ? "복사됐어요 ✓ — AI에 붙여넣어 보세요" : "📋 프롬프트 복사하기"}
      </button>
      {s.tip && <p style={{ fontSize: 14, color: "var(--soft)", margin: "12px 2px 0", lineHeight: 1.6 }}>💡 {s.tip}</p>}
    </div>
  );
}
