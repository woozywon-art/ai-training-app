"use client";
import { useEffect, useState } from "react";
import { Buddy } from "./Buddy";

export default function Splash() {
  const [hide, setHide] = useState(false);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("aitr:splash")) { setGone(true); return; }
    sessionStorage.setItem("aitr:splash", "1");
    const t1 = setTimeout(() => setHide(true), 1300);
    const t2 = setTimeout(() => setGone(true), 1850);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  if (gone) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 400, background: "linear-gradient(135deg,#3D7BFF,#2454D6)", display: "grid", placeItems: "center", opacity: hide ? 0 : 1, transition: "opacity .55s ease", pointerEvents: hide ? "none" : "auto" }}>
      <div style={{ textAlign: "center" }}>
        <div className="buddy-bob" style={{ display: "inline-block" }}><Buddy mood="cheer" size={120} /></div>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 24, marginTop: 14 }}>AI 실무자 교육</div>
        <div style={{ color: "#CBD9FF", fontSize: 14, marginTop: 6 }}>AI를 ‘써먹는’ 법, 코디와 함께</div>
        <div style={{ marginTop: 18, display: "flex", gap: 7, justifyContent: "center" }}>
          {[0, 1, 2].map((k) => <span key={k} className="splash-dot" style={{ width: 8, height: 8, borderRadius: 99, background: "#fff", animationDelay: `${k * 0.16}s` }} />)}
        </div>
      </div>
    </div>
  );
}
