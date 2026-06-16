"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { GOAL, INTRO, DAYS, PRACTICE, levelById, type Level } from "@/lib/course";
import { Guide } from "@/components/Buddy";

const BUILDER = Array.from({ length: 20 }, (_, k) => k + 1);
const ALL: Level[] = [...INTRO, ...BUILDER.map((i) => levelById(i)!), ...PRACTICE];
type Tab = "home" | "explore" | "me" | "settings";

export default function Home() {
  const [tab, setTab] = useState<Tab>("home");
  const [done, setDone] = useState<Record<number, boolean>>({});
  const reload = () => { const d: Record<number, boolean> = {}; ALL.forEach((l) => { if (localStorage.getItem(`aitr:done:${l.id}`)) d[l.id] = true; }); setDone(d); };
  useEffect(reload, []);
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", paddingBottom: 86 }}>
      {tab === "home" && <HomeTab done={done} setTab={setTab} />}
      {tab === "explore" && <ExploreTab done={done} />}
      {tab === "me" && <MeTab done={done} setTab={setTab} />}
      {tab === "settings" && <SettingsTab onReset={reload} />}
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}

/* ===================== 홈 (야놀자형 런처) ===================== */
function HomeTab({ done, setTab }: { done: Record<number, boolean>; setTab: (t: Tab) => void }) {
  const [qy, setQy] = useState("");
  const dn = ALL.filter((l) => done[l.id]).length;
  const nextId = [...INTRO.map((l) => l.id), ...BUILDER, ...PRACTICE.map((l) => l.id)].find((i) => !done[i]) ?? 90;
  const nextLv = levelById(nextId)!;
  const nextBuilder = BUILDER.find((i) => !done[i]) ?? 1;

  const trk = (k: string) => `/track/${encodeURIComponent(k)}`;
  const quick = [
    { icon: "🚀", label: "시작하기", soft: "var(--amberSoft)", to: trk("intro") },
    { icon: "🧱", label: "만들기", soft: "var(--blueSoft)", to: trk("builder") },
    { icon: "💡", label: "기획·설계", soft: "var(--blueSoft)", to: trk("기획") },
    { icon: "🏛️", label: "법무", soft: "var(--blueSoft)", to: trk("법무") },
    { icon: "🧮", label: "세무·회계", soft: "var(--greenSoft)", to: trk("세무·회계") },
    { icon: "💼", label: "영업", soft: "var(--greenSoft)", to: trk("영업") },
    { icon: "🎧", label: "고객응대", soft: "var(--greenSoft)", to: trk("CS") },
    { icon: "📣", label: "마케팅", soft: "var(--greenSoft)", to: trk("마케팅") },
    { icon: "📊", label: "데이터", soft: "var(--greenSoft)", to: trk("데이터") },
    { icon: "🏭", label: "운영", soft: "var(--greenSoft)", to: trk("운영") },
    { icon: "📚", label: "전체", soft: "var(--bg)", action: () => setTab("explore") },
  ];

  const results = useMemo(() => {
    const k = qy.trim().toLowerCase();
    if (!k) return [];
    return ALL.filter((l) => l.title.toLowerCase().includes(k) || l.tags.some((t) => t.toLowerCase().includes(k)) || l.goal.toLowerCase().includes(k));
  }, [qy]);

  return (
    <main className="fade">
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--bg)", padding: "14px 18px 10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
          <img src="/coddi.svg" alt="코디" width={32} height={32} style={{ borderRadius: 9, display: "block" }} />
          <b style={{ fontSize: 17 }}>AI 실무자 교육</b>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid var(--line)", borderRadius: 12, padding: "11px 14px" }}>
          <span style={{ fontSize: 16, opacity: 0.6 }}>🔍</span>
          <input value={qy} onChange={(e) => setQy(e.target.value)} placeholder="무엇을 배워볼까요? (예: 콜드 메시지, 배포)" style={{ flex: 1, border: "none", outline: "none", fontFamily: "inherit", fontSize: 15, background: "transparent" }} />
          {qy && <button onClick={() => setQy("")} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 15, color: "var(--soft)" }}>✕</button>}
        </div>
      </div>

      {qy ? (
        <div style={{ padding: "8px 18px" }} className="fade">
          <div style={{ fontSize: 13, color: "var(--soft)", margin: "6px 0 10px", fontWeight: 700 }}>검색 결과 {results.length}개</div>
          <div style={{ display: "grid", gap: 9 }}>
            {results.map((l) => <LessonRow key={l.id} l={l} done={done[l.id]} />)}
            {results.length === 0 && <div style={{ color: "var(--soft)", fontSize: 14, padding: 20, textAlign: "center" }}>검색 결과가 없어요.</div>}
          </div>
        </div>
      ) : (
        <div style={{ padding: "4px 0 0" }}>
          <div style={{ padding: "0 18px 4px" }}>
            <Guide mood={dn === 0 ? "happy" : "cheer"} size={54} read={false} text={dn === 0 ? "AI를 실무에 ‘써먹는’ 법, 저랑 같이 시작해요! 아래 아이콘에서 골라 눌러보세요 👇" : `벌써 ${dn}개나 했네요, 멋져요! 이어서 가볼까요? 😊`} />
          </div>
          {/* 이어서 학습 */}
          <div style={{ padding: "0 18px" }}>
            <Link href={`/level/${nextId}`} prefetch className="lift" style={{ display: "flex", alignItems: "center", gap: 14, background: "var(--stage)", color: "#fff", borderRadius: 16, padding: "16px 18px" }}>
              <span style={{ fontSize: 26 }}>{dn === 0 ? "✨" : "▶"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "#9DB4FF", fontWeight: 800 }}>{dn === 0 ? "여기서 시작" : "이어서 학습하기"} · {dn}/{ALL.length}</div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{nextLv.title}</div>
              </div>
              <span style={{ fontSize: 22 }}>›</span>
            </Link>
          </div>

          {/* 퀵 아이콘 그리드 (리모컨) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, padding: "16px 12px 6px" }}>
            {quick.map((q) => {
              const inner = (
                <div className="lift" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "8px 2px", cursor: "pointer", minWidth: 0 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 15, background: q.soft, display: "grid", placeItems: "center", fontSize: 23, flexShrink: 0 }}>{q.icon}</div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink)", textAlign: "center", lineHeight: 1.15, width: "100%", overflow: "hidden", textOverflow: "ellipsis" }}>{q.label}</span>
                </div>
              );
              return q.to ? <Link key={q.label} href={q.to} prefetch style={{ textDecoration: "none" }}>{inner}</Link>
                : <button key={q.label} onClick={q.action} style={{ border: "none", background: "none", padding: 0, fontFamily: "inherit" }}>{inner}</button>;
            })}
          </div>

          {/* 추천: 실무 (가로 스크롤) */}
          <Section title="🎯 실무에 바로 쓰기" more={() => setTab("explore")}>
            <HScroll>
              {PRACTICE.map((l) => <BigCard key={l.id} l={l} done={done[l.id]} accent="var(--green)" />)}
            </HScroll>
          </Section>

          {/* 추천: 만들기 20레벨 (가로 스크롤) */}
          <Section title="🧱 만들기 마스터 (20레벨)">
            <HScroll>
              {BUILDER.map((i) => { const l = levelById(i)!; return <BigCard key={i} l={l} done={done[i]} accent="var(--blue)" num={`Lv.${String(i).padStart(2, "0")}`} />; })}
            </HScroll>
          </Section>

          {/* 시작하기 */}
          <Section title="🚀 처음이라면">
            <HScroll>
              {INTRO.map((l) => <BigCard key={l.id} l={l} done={done[l.id]} accent="var(--amber)" />)}
            </HScroll>
          </Section>

          <div style={{ margin: "12px 18px 0", background: "var(--stage)", color: "#cfd6e6", borderRadius: 14, padding: "14px 16px", fontSize: 12.5, lineHeight: 1.6 }}>
            <div style={{ fontSize: 11, letterSpacing: 1, color: "#8FB0FF", fontWeight: 800, marginBottom: 6 }}>이 교육의 목표</div>{GOAL}
          </div>
        </div>
      )}
    </main>
  );
}

function Section({ title, more, children }: { title: string; more?: () => void; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 22 }}>
      <div style={{ display: "flex", alignItems: "center", padding: "0 18px 10px" }}>
        <b style={{ fontSize: 16, flex: 1 }}>{title}</b>
        {more && <button onClick={more} style={{ border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700, color: "var(--soft)" }}>더보기 ›</button>}
      </div>
      {children}
    </section>
  );
}
function HScroll({ children }: { children: React.ReactNode }) {
  return <div className="hscroll" style={{ display: "flex", gap: 11, overflowX: "auto", padding: "0 18px 4px", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>{children}</div>;
}
function BigCard({ l, done, accent, num }: { l: Level; done?: boolean; accent: string; num?: string }) {
  return (
    <Link href={`/level/${l.id}`} prefetch className="lift" style={{ flexShrink: 0, width: 168, background: "#fff", border: "1px solid var(--line)", borderRadius: 14, padding: 14, textDecoration: "none", display: "flex", flexDirection: "column", gap: 8, minHeight: 132 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11.5, fontWeight: 800, color: accent }}>{num || l.tags[0]}</span>
        {done && <span style={{ fontSize: 11.5, fontWeight: 800, color: "var(--green)" }}>✓ 완료</span>}
      </div>
      <div style={{ fontSize: 14.5, fontWeight: 800, lineHeight: 1.35, color: "var(--ink)" }}>{l.title}</div>
      <div style={{ fontSize: 12, color: "var(--soft)", lineHeight: 1.45, marginTop: "auto" }}>{l.goal.length > 42 ? l.goal.slice(0, 42) + "…" : l.goal}</div>
    </Link>
  );
}
function LessonRow({ l, done }: { l: Level; done?: boolean }) {
  return (
    <Link href={`/level/${l.id}`} prefetch className="card lift" style={{ display: "flex", alignItems: "center", gap: 12, padding: 14 }}>
      <span style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: "grid", placeItems: "center", fontSize: 13, fontWeight: 800, background: done ? "var(--greenSoft)" : "var(--bg)", color: done ? "var(--green)" : "var(--soft)" }}>{done ? "✓" : (l.day >= 1 && l.day <= 7 ? String(l.id).padStart(2, "0") : "•")}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.3 }}>{l.title}</div>
        <div style={{ fontSize: 12, color: "var(--soft)", marginTop: 2 }}>{l.tags.join(" · ")}</div>
      </div>
      <span style={{ color: "var(--soft)", fontSize: 18 }}>›</span>
    </Link>
  );
}

/* ===================== 둘러보기 ===================== */
function ExploreTab({ done }: { done: Record<number, boolean> }) {
  const groups: Record<string, Level[]> = {};
  PRACTICE.forEach((l) => { (groups[l.tags[0]] ||= []).push(l); });
  return (
    <main className="fade">
      <TopBar title="둘러보기" />
      <div style={{ padding: "0 18px" }}>
        <div style={{ margin: "8px 0 16px" }}><Guide mood="point" size={54} read={false} text="필요한 일을 골라보세요! 각 레슨은 ‘AI에게 이렇게 시켜라’로 알려드려요." /></div>
        <div style={{ fontSize: 13, fontWeight: 800, color: "var(--blue)", background: "var(--blueSoft)", display: "inline-block", borderRadius: 8, padding: "4px 11px", marginBottom: 9 }}>시작하기</div>
        <div style={{ display: "grid", gap: 9, marginBottom: 22 }}>{INTRO.map((l) => <LessonRow key={l.id} l={l} done={done[l.id]} />)}</div>
        <div style={{ fontSize: 13, fontWeight: 800, color: "var(--blue)", background: "var(--blueSoft)", display: "inline-block", borderRadius: 8, padding: "4px 11px", marginBottom: 9 }}>만들기 마스터 (20레벨)</div>
        <div style={{ display: "grid", gap: 9, marginBottom: 22 }}>{BUILDER.map((i) => <LessonRow key={i} l={levelById(i)!} done={done[i]} />)}</div>
        {Object.entries(groups).map(([tag, items]) => (
          <div key={tag}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--green)", background: "var(--greenSoft)", display: "inline-block", borderRadius: 8, padding: "4px 11px", marginBottom: 9 }}>{tag}</div>
            <div style={{ display: "grid", gap: 9, marginBottom: 22 }}>{items.map((l) => <LessonRow key={l.id} l={l} done={done[l.id]} />)}</div>
          </div>
        ))}
      </div>
    </main>
  );
}

/* ===================== 내 학습 ===================== */
function MeTab({ done, setTab }: { done: Record<number, boolean>; setTab: (t: Tab) => void }) {
  const dn = ALL.filter((l) => done[l.id]).length;
  const pct = Math.round((dn / ALL.length) * 100);
  const nextId = ALL.map((l) => l.id).find((i) => !done[i]) ?? 90;
  const nextLv = levelById(nextId)!;
  const r = 52, c = 2 * Math.PI * r;
  return (
    <main className="fade">
      <TopBar title="내 학습" />
      <div style={{ padding: "0 18px" }}>
        <div style={{ marginBottom: 14, marginTop: 8 }}><Guide mood={pct >= 100 ? "cheer" : "talk"} size={54} read={false} text={pct === 0 ? "여기서 진행률을 볼 수 있어요. 한 걸음씩 같이 가요!" : `지금까지 ${pct}% 왔어요. 정말 잘하고 있어요!`} /></div>
        <div className="card" style={{ display: "grid", placeItems: "center", padding: 24 }}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r={r} fill="none" stroke="var(--line)" strokeWidth="12" />
            <circle cx="70" cy="70" r={r} fill="none" stroke="var(--green)" strokeWidth="12" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform="rotate(-90 70 70)" style={{ transition: "stroke-dashoffset .5s" }} />
            <text x="70" y="64" textAnchor="middle" fontSize="30" fontWeight="800" fill="var(--ink)">{pct}%</text>
            <text x="70" y="86" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--soft)">{dn}/{ALL.length} 완료</text>
          </svg>
        </div>
        <Link href={`/level/${nextId}`} prefetch className="lift" style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--stage)", color: "#fff", borderRadius: 16, padding: "16px 18px", margin: "14px 0" }}>
          <span style={{ fontSize: 24 }}>{dn === 0 ? "✨" : "▶"}</span>
          <div style={{ flex: 1 }}><div style={{ fontSize: 12, color: "#9DB4FF", fontWeight: 800 }}>{dn === 0 ? "여기서 시작" : "이어서 학습하기"}</div><div style={{ fontSize: 16, fontWeight: 800 }}>{nextLv.title}</div></div>
          <span style={{ fontSize: 22 }}>›</span>
        </Link>
        <button onClick={() => setTab("home")} className="btn-ghost" style={{ width: "100%" }}>홈으로</button>
      </div>
    </main>
  );
}

/* ===================== 설정 ===================== */
function SettingsTab({ onReset }: { onReset: () => void }) {
  const [scale, setScale] = useState(1);
  useEffect(() => { const s = localStorage.getItem("aitr:scale"); if (s) setScale(Number(s)); }, []);
  function setSize(v: number) { setScale(v); localStorage.setItem("aitr:scale", String(v)); window.dispatchEvent(new Event("aitr-scale")); }
  function reset() { if (!confirm("학습 진도를 모두 초기화할까요?")) return; ALL.forEach((l) => localStorage.removeItem(`aitr:done:${l.id}`)); onReset(); alert("초기화했어요."); }
  const SIZES = [{ v: 1, l: "보통" }, { v: 1.18, l: "크게" }, { v: 1.38, l: "아주 크게" }];
  return (
    <main className="fade">
      <TopBar title="설정" />
      <div style={{ padding: "0 18px" }}>
        <div className="card" style={{ marginTop: 8 }}>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 12 }}>글자 크기</div>
          <div style={{ display: "flex", gap: 8 }}>
            {SIZES.map((s) => <button key={s.v} onClick={() => setSize(s.v)} style={{ flex: 1, fontFamily: "inherit", cursor: "pointer", border: `2px solid ${scale === s.v ? "var(--blue)" : "var(--line)"}`, background: scale === s.v ? "var(--blueSoft)" : "#fff", color: scale === s.v ? "var(--blue)" : "var(--ink)", borderRadius: 12, padding: "13px 6px", fontWeight: 800, fontSize: 15 }}>{s.l}</button>)}
          </div>
        </div>
        <div className="card" style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>읽어주기</div>
          <p style={{ fontSize: 13.5, color: "var(--soft)", margin: "0 0 12px" }}>레슨에서 코디 말풍선의 🔊 읽어주기를 누르면 소리로 들려줘요.</p>
          <button onClick={() => window.speechSynthesis && window.speechSynthesis.cancel()} className="btn-ghost" style={{ width: "100%" }}>⏹ 읽어주기 멈춤</button>
        </div>
        <div className="card" style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>앱 둘러보기</div>
          <p style={{ fontSize: 13.5, color: "var(--soft)", margin: "0 0 12px" }}>코디의 첫 안내(투어)를 다시 볼 수 있어요.</p>
          <button onClick={() => window.dispatchEvent(new Event("aitr-tour"))} className="btn-ghost" style={{ width: "100%" }}>👋 코디 투어 다시 보기</button>
        </div>
        <div className="card" style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>진도 초기화</div>
          <button onClick={reset} className="btn-ghost" style={{ width: "100%", color: "var(--red)", borderColor: "var(--redSoft)", marginTop: 6 }}>진도 초기화</button>
        </div>
      </div>
    </main>
  );
}

function TopBar({ title }: { title: string }) {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--bg)", borderBottom: "1px solid var(--line)", padding: "16px 18px", display: "flex", alignItems: "center", gap: 10 }}>
      <img src="/coddi.svg" alt="코디" width={32} height={32} style={{ borderRadius: 9, display: "block" }} />
      <b style={{ fontSize: 17 }}>{title}</b>
    </div>
  );
}
function BottomNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { k: Tab; icon: string; label: string }[] = [
    { k: "home", icon: "🏠", label: "홈" },
    { k: "explore", icon: "🧭", label: "둘러보기" },
    { k: "me", icon: "📊", label: "내 학습" },
    { k: "settings", icon: "⚙️", label: "설정" },
  ];
  return (
    <nav style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 50, background: "#fff", borderTop: "1px solid var(--line)", display: "flex", paddingBottom: "env(safe-area-inset-bottom)", boxShadow: "0 -6px 20px -14px rgba(0,0,0,0.2)" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", width: "100%" }}>
        {items.map((it) => (
          <button key={it.k} onClick={() => setTab(it.k)} style={{ flex: 1, fontFamily: "inherit", cursor: "pointer", background: "none", border: "none", padding: "9px 0 11px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 21, lineHeight: 1, filter: tab === it.k ? "none" : "grayscale(1) opacity(0.5)" }}>{it.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: tab === it.k ? "var(--blue)" : "var(--soft)" }}>{it.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
