"use client";
import { useEffect, useState } from "react";
import { Buddy, speak, BUDDY_NAME, type Mood } from "./Buddy";

const STEPS: { mood: Mood; title: string; text: string }[] = [
  { mood: "happy", title: "안녕하세요! 저는 코디예요 👋", text: "이 앱은 ‘공부’가 아니라, AI를 실무에 써먹는 법을 알려드려요. 제가 옆에서 친근하게 도와줄게요!" },
  { mood: "point", title: "홈에서 골라 들어가요", text: "홈 위쪽 아이콘(시작하기·만들기·영업·세무 등)을 누르면, 원하는 레벨을 직접 골라 바로 배울 수 있어요." },
  { mood: "talk", title: "핵심은 ‘복사용 프롬프트’", text: "레슨마다 AI에게 시킬 프롬프트가 있어요. 복사 버튼을 눌러 ChatGPT나 Claude에 붙여넣으면 끝이에요!" },
  { mood: "cheer", title: "미션으로 직접 해봐요", text: "배운 걸로 AI에게 진짜 결과물을 만들고 ‘미션 완료’를 누르면, 같은 트랙의 다음 레벨로 쭉 이어져요." },
  { mood: "happy", title: "준비됐어요!", text: "아래 탭(배우기·둘러보기·내 학습·설정)으로 언제든 이동할 수 있어요. 자, 같이 시작해볼까요?" },
];

export default function Onboarding() {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  useEffect(() => {
    const start = () => { setI(0); setOpen(true); };
    if (!localStorage.getItem("aitr:onboarded")) start();
    window.addEventListener("aitr-tour", start);
    return () => window.removeEventListener("aitr-tour", start);
  }, []);
  if (!open) return null;
  const s = STEPS[i];
  const last = i === STEPS.length - 1;
  function close() { localStorage.setItem("aitr:onboarded", "1"); if (window.speechSynthesis) window.speechSynthesis.cancel(); setOpen(false); }
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(14,19,32,0.62)", display: "grid", placeItems: "center", padding: 20 }}>
      <div className="pop" style={{ width: "100%", maxWidth: 380, background: "#fff", borderRadius: 24, padding: "26px 22px 18px", textAlign: "center", boxShadow: "0 30px 80px -30px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "grid", placeItems: "center" }}><Buddy mood={s.mood} size={104} /></div>
        <div style={{ fontSize: 12, fontWeight: 800, color: "var(--blue)", marginTop: 6 }}>{BUDDY_NAME}</div>
        <h2 style={{ fontSize: 21, fontWeight: 800, margin: "8px 0 10px", lineHeight: 1.3 }}>{s.title}</h2>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--ink)", margin: "0 0 8px" }}>{s.text}</p>
        <button onClick={() => speak(`${s.title}. ${s.text}`)} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "inherit", cursor: "pointer", background: "#fff", border: "1.5px solid var(--blue)", color: "var(--blue)", borderRadius: 99, padding: "5px 12px", fontSize: 13, fontWeight: 800, marginBottom: 16 }}>🔊 읽어주기</button>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 16 }}>
          {STEPS.map((_, k) => <span key={k} style={{ width: k === i ? 22 : 7, height: 7, borderRadius: 99, background: k === i ? "var(--blue)" : "var(--line)", transition: "width .2s" }} />)}
        </div>
        <div style={{ display: "flex", gap: 9 }}>
          {i > 0 ? <button onClick={() => setI(i - 1)} className="btn-ghost lift" style={{ flexShrink: 0 }}>← 이전</button>
                 : <button onClick={close} className="btn-ghost lift" style={{ flexShrink: 0 }}>건너뛰기</button>}
          <button onClick={() => (last ? close() : setI(i + 1))} className="btn lift" style={{ flex: 1 }}>{last ? "시작하기 🚀" : "다음 →"}</button>
        </div>
      </div>
    </div>
  );
}
