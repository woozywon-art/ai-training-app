import React from "react";

export const BUDDY_NAME = "코디";
export type Mood = "happy" | "talk" | "think" | "cheer" | "point";

/* 코디가 한국어로 읽어줍니다 (브라우저 음성, 계정/서버 불필요) */
export function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ko-KR";
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
}

export function Buddy({ mood = "happy", size = 72 }: { mood?: Mood; size?: number }) {
  const ink = "#1C2230", blue = "#2F6BFF", deep = "#2459D6";
  return (
    <svg width={size} height={(size * 112) / 100} viewBox="0 0 100 112" className={mood === "cheer" || mood === "talk" ? "buddy-bob" : ""} aria-hidden="true">
      <ellipse cx="50" cy="104" rx="22" ry="4.5" fill="#000" opacity="0.06" />
      {mood === "cheer" && <>
        <rect x="14" y="34" width="9" height="24" rx="4.5" fill={blue} transform="rotate(-38 18 46)" />
        <rect x="77" y="34" width="9" height="24" rx="4.5" fill={blue} transform="rotate(38 82 46)" />
      </>}
      {mood === "point" && <rect x="76" y="36" width="9" height="24" rx="4.5" fill={blue} className="buddy-point" transform="rotate(32 80 48)" />}
      {mood === "talk" && <rect x="15" y="46" width="9" height="20" rx="4.5" fill={blue} transform="rotate(-22 19 56)" />}
      <line x1="50" y1="11" x2="50" y2="22" stroke={blue} strokeWidth="3" />
      <circle cx="50" cy="8" r="4.5" fill="#F5A623" className="buddy-dot" />
      <rect x="34" y="68" width="32" height="17" rx="8.5" fill={deep} />
      <rect x="22" y="20" width="56" height="50" rx="18" fill={blue} />
      <rect x="29" y="29" width="42" height="30" rx="13" fill="#fff" />
      {mood === "think" ? <>
        <circle cx="43" cy="42" r="3" fill={ink} /><circle cx="59" cy="42" r="3" fill={ink} />
      </> : <>
        <circle cx="42" cy="44" r="4.2" fill={ink} /><circle cx="58" cy="44" r="4.2" fill={ink} />
        <circle cx="43.4" cy="42.6" r="1.3" fill="#fff" /><circle cx="59.4" cy="42.6" r="1.3" fill="#fff" />
      </>}
      {mood === "talk" && <ellipse cx="50" cy="52" rx="4" ry="3" fill={ink} />}
      {mood === "cheer" && <path d="M41 49 Q50 59 59 49" stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" />}
      {(mood === "happy" || mood === "point") && <path d="M43 50 Q50 56 57 50" stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" />}
      {mood === "think" && <rect x="47" y="51" width="6" height="2.6" rx="1.3" fill={ink} />}
      <circle cx="35" cy="51" r="3" fill="#FF9DB0" opacity="0.5" />
      <circle cx="65" cy="51" r="3" fill="#FF9DB0" opacity="0.5" />
    </svg>
  );
}

export function Guide({ mood = "talk", text, size = 64, tone = "blue", read = true }: { mood?: Mood; text: string; size?: number; tone?: "blue" | "amber" | "green"; read?: boolean }) {
  const c = tone === "amber" ? { bg: "var(--amberSoft)", bd: "var(--amber)", name: "#8a5a08" }
    : tone === "green" ? { bg: "var(--greenSoft)", bd: "var(--green)", name: "#0d7a57" }
      : { bg: "var(--blueSoft)", bd: "var(--blue)", name: "var(--blue)" };
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <div style={{ flexShrink: 0 }}><Buddy mood={mood} size={size} /></div>
      <div className="pop" style={{ position: "relative", flex: 1, background: c.bg, border: `1.5px solid ${c.bd}`, borderRadius: "4px 16px 16px 16px", padding: "13px 16px", marginTop: 6 }}>
        <span style={{ position: "absolute", left: -7, top: 14, width: 12, height: 12, background: c.bg, borderLeft: `1.5px solid ${c.bd}`, borderBottom: `1.5px solid ${c.bd}`, transform: "rotate(45deg)" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 5 }}>
          <span style={{ fontSize: 12.5, fontWeight: 800, color: c.name }}>{BUDDY_NAME}</span>
          {read && (
            <button onClick={() => speak(text)} aria-label="코디가 읽어주기"
              style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "inherit", cursor: "pointer", background: "#fff", border: `1.5px solid ${c.bd}`, color: c.name, borderRadius: 99, padding: "5px 11px", fontSize: 13, fontWeight: 800 }}>
              🔊 읽어주기
            </button>
          )}
        </div>
        <div style={{ fontSize: 17, lineHeight: 1.7, color: "var(--ink)", whiteSpace: "pre-line" }}>{text}</div>
      </div>
    </div>
  );
}
