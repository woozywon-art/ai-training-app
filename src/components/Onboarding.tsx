"use client";
import { useEffect, useState } from "react";
import { Buddy, speak, BUDDY_NAME, type Mood } from "./Buddy";

type Step = { center?: boolean; target?: string; mood: Mood; title: string; text: string };
const STEPS: Step[] = [
  { center: true, mood: "happy", title: "안녕하세요! 저는 코디예요 👋", text: "이 앱은 ‘공부’가 아니라, AI를 실무에 써먹는 법을 알려드려요. 제가 하나씩 안내할게요!" },
  { target: '[data-tour="search"]', mood: "point", title: "검색으로 빠르게", text: "배우고 싶은 주제(예: 콜드 메시지)를 여기서 바로 찾을 수 있어요." },
  { target: '[data-tour="quick"]', mood: "point", title: "여기서 골라요", text: "시작하기·만들기·영업·세무 같은 분야를 눌러 원하는 레벨로 들어가요." },
  { target: '[data-tour="continue"]', mood: "talk", title: "이어서 학습", text: "하던 곳부터 바로 이어서 할 수 있어요." },
  { target: '[data-tour="nav"]', mood: "point", title: "아래 탭으로 이동", text: "배우기·둘러보기·내 학습·설정으로 언제든 옮겨다녀요." },
  { center: true, mood: "cheer", title: "준비 끝!", text: "레슨마다 ‘복사용 프롬프트’를 AI에 붙여넣고, 미션으로 직접 해보면 돼요. 시작해볼까요?" },
];

export default function Onboarding() {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  useEffect(() => {
    const start = () => { setI(0); setOpen(true); };
    let t: ReturnType<typeof setTimeout>;
    if (!localStorage.getItem("aitr:onboarded")) t = setTimeout(start, 2000);
    window.addEventListener("aitr-tour", start);
    return () => { window.removeEventListener("aitr-tour", start); if (t) clearTimeout(t); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const step = STEPS[i];
    if (step.center || !step.target) { setRect(null); return; }
    let raf = 0;
    const measure = () => {
      const el = document.querySelector(step.target!) as HTMLElement | null;
      if (!el) { setRect(null); return; }
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    };
    const el = document.querySelector(step.target!) as HTMLElement | null;
    if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
    const t = setTimeout(measure, 360);
    const onMove = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    window.addEventListener("resize", onMove);
    window.addEventListener("scroll", onMove, true);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); window.removeEventListener("resize", onMove); window.removeEventListener("scroll", onMove, true); };
  }, [i, open]);

  if (!open) return null;
  const step = STEPS[i];
  const last = i === STEPS.length - 1;
  const first = i === 0;
  function close() { localStorage.setItem("aitr:onboarded", "1"); if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel(); setOpen(false); }
  function next() { if (last) close(); else setI(i + 1); }
  function prev() { if (i > 0) setI(i - 1); }

  const pad = 8;
  const r = (!step.center && rect) ? { top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 } : null;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const below = r ? r.top < vh * 0.5 : true;
  const tipPos: React.CSSProperties = r
    ? (below ? { top: Math.min(r.top + r.height + 14, vh - 220) } : { bottom: vh - r.top + 14 })
    : {};

  const dots = (
    <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "14px 0" }}>
      {STEPS.map((_, k) => <span key={k} style={{ width: k === i ? 20 : 7, height: 7, borderRadius: 99, background: k === i ? "var(--blue)" : "var(--line)", transition: "width .2s" }} />)}
    </div>
  );

  const card = (compact: boolean) => (
    <div onClick={(e) => e.stopPropagation()} className="pop" style={{ background: "#fff", borderRadius: 20, padding: compact ? "15px 16px 13px" : "24px 22px 16px", boxShadow: "0 24px 70px -28px rgba(0,0,0,0.55)", maxWidth: 380, margin: "0 auto" }}>
      {compact ? (
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div style={{ flexShrink: 0 }}><Buddy mood={step.mood} size={62} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: "var(--blue)" }}>{BUDDY_NAME}</div>
            <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.3, margin: "1px 0 4px" }}>{step.title}</div>
            <div style={{ fontSize: 14, lineHeight: 1.55, color: "var(--ink)" }}>{step.text}</div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "grid", placeItems: "center" }}><Buddy mood={step.mood} size={96} /></div>
          <div style={{ fontSize: 12, fontWeight: 800, color: "var(--blue)", marginTop: 6 }}>{BUDDY_NAME}</div>
          <h2 style={{ fontSize: 21, fontWeight: 800, margin: "6px 0 9px", lineHeight: 1.3 }}>{step.title}</h2>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--ink)", margin: 0 }}>{step.text}</p>
          <button onClick={() => speak(`${step.title}. ${step.text}`)} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "inherit", cursor: "pointer", background: "#fff", border: "1.5px solid var(--blue)", color: "var(--blue)", borderRadius: 99, padding: "5px 12px", fontSize: 13, fontWeight: 800, marginTop: 14 }}>🔊 읽어주기</button>
        </div>
      )}
      {dots}
      <div style={{ display: "flex", gap: 9 }}>
        {first ? <button onClick={close} className="btn-ghost lift" style={{ flexShrink: 0 }}>건너뛰기</button>
               : <button onClick={prev} className="btn-ghost lift" style={{ flexShrink: 0 }}>← 이전</button>}
        <button onClick={next} className="btn lift" style={{ flex: 1 }}>{last ? "시작하기 🚀" : "다음 →"}</button>
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300 }}>
      <div onClick={next} style={{ position: "fixed", inset: 0, background: r ? "transparent" : "rgba(14,19,32,0.72)", cursor: "pointer" }} />
      {r && <div style={{ position: "fixed", top: r.top, left: r.left, width: r.width, height: r.height, borderRadius: 14, boxShadow: "0 0 0 9999px rgba(14,19,32,0.72)", outline: "3px solid #fff", pointerEvents: "none", transition: "all .25s ease" }} />}
      {r ? (
        <div style={{ position: "fixed", left: 12, right: 12, zIndex: 301, ...tipPos }}>{card(true)}</div>
      ) : (
        <div style={{ position: "fixed", inset: 0, zIndex: 301, display: "grid", placeItems: "center", padding: 20, pointerEvents: "none" }}>
          <div style={{ pointerEvents: "auto", width: "100%" }}>{card(false)}</div>
        </div>
      )}
    </div>
  );
}
