"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { INTRO, DAYS, PRACTICE, levelById, type Level } from "@/lib/course";
import { Guide } from "@/components/Buddy";

const BUILDER = Array.from({ length: 20 }, (_, k) => k + 1);

export default function TrackView({ trackKey }: { trackKey: string }) {
  const [done, setDone] = useState<Record<number, boolean>>({});

  let title = trackKey, sub = "";
  let groups: { label?: string; lessons: Level[] }[] = [];
  if (trackKey === "intro") {
    title = "시작하기"; sub = "AI 도구 비교 · API";
    groups = [{ lessons: INTRO }];
  } else if (trackKey === "builder") {
    title = "만들기 마스터"; sub = "혼자 풀스택 제품 만들기 · 20레벨";
    groups = DAYS.map((d) => ({ label: `Day ${d.day} · ${d.name}`, lessons: d.levels.map((id) => levelById(id)!) }));
  } else {
    title = trackKey; sub = "현업에 바로 쓰는 실무 가이드";
    groups = [{ lessons: PRACTICE.filter((l) => l.tags[0] === trackKey) }];
  }
  const allIds = groups.flatMap((g) => g.lessons.map((l) => l.id));

  useEffect(() => {
    const d: Record<number, boolean> = {};
    allIds.forEach((i) => { if (localStorage.getItem(`aitr:done:${i}`)) d[i] = true; });
    setDone(d);
  }, [trackKey]);

  const dn = allIds.filter((i) => done[i]).length;

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 18px 60px" }} className="fade">
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "var(--bg)", borderBottom: "1px solid var(--line)", margin: "0 -18px 16px", padding: "12px 18px", display: "flex", alignItems: "center", gap: 10 }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid var(--line)", background: "#fff", borderRadius: 99, padding: "7px 13px", fontWeight: 800, fontSize: 13.5, color: "var(--ink)" }}>🏠 홈</Link>
        <b style={{ fontSize: 16 }}>{title}</b>
      </div>

      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 14, color: "var(--soft)", margin: "0 0 10px" }}>{sub}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, height: 8, background: "var(--line)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${Math.round((dn / allIds.length) * 100)}%`, height: "100%", background: "var(--green)", borderRadius: 99 }} />
          </div>
          <span style={{ fontSize: 12.5, fontWeight: 800, color: "var(--soft)" }}>{dn}/{allIds.length}</span>
        </div>
      </div>

      <div style={{ margin: "0 0 14px" }}><Guide mood="point" size={52} read={false} text={`‘${title}’ 트랙이에요. 원하는 레벨을 골라 시작해요! 각 레벨은 AI로 직접 해보는 미션으로 끝나요.`} /></div>

      {groups.map((g, gi) => (
        <section key={gi} style={{ marginBottom: 18 }}>
          {g.label && <div style={{ fontSize: 12.5, fontWeight: 800, color: "var(--blue)", background: "var(--blueSoft)", display: "inline-block", borderRadius: 8, padding: "4px 11px", marginBottom: 9 }}>{g.label}</div>}
          <div style={{ display: "grid", gap: 9 }}>
            {g.lessons.map((l) => {
              const num = l.day >= 1 && l.day <= 7 ? `Lv.${String(l.id).padStart(2, "0")}` : "";
              return (
                <Link key={l.id} href={`/level/${l.id}`} prefetch className="card lift" style={{ display: "flex", alignItems: "center", gap: 12, padding: 15 }}>
                  <span style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0, display: "grid", placeItems: "center", fontSize: 13, fontWeight: 800, background: done[l.id] ? "var(--greenSoft)" : "var(--bg)", color: done[l.id] ? "var(--green)" : "var(--soft)" }}>{done[l.id] ? "✓" : num.replace("Lv.", "") || "●"}</span>
                  <div style={{ flex: 1 }}>
                    {num && <span style={{ fontSize: 11.5, fontWeight: 800, color: "var(--blue)" }}>{num}</span>}
                    <div style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.3 }}>{l.title}</div>
                    <div style={{ fontSize: 12, color: "var(--soft)", marginTop: 2 }}>{l.goal.length > 46 ? l.goal.slice(0, 46) + "…" : l.goal}</div>
                  </div>
                  <span style={{ color: "var(--soft)", fontSize: 18 }}>›</span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
