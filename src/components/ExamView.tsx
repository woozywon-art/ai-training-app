"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Level, ExamItem } from "@/lib/course";
import { Guide } from "./Buddy";
import { levelTag, INTRO, PRACTICE } from "@/lib/course";

export default function ExamView({ level }: { level: Level }) {
  const e = level.exam;
  const router = useRouter();
  const [view, setView] = useState<"mission" | "take" | "result">("mission");
  const [picks, setPicks] = useState<Record<number, number>>({});
  const hasSub = !!e.submission;
  const hasQuiz = e.items.length > 0;

  const nextId = (() => {
    if (level.day >= 1 && level.day <= 7) return level.id < 20 ? level.id + 1 : null;
    const intro = INTRO.map((l) => l.id);
    if (intro.includes(level.id)) { const i = intro.indexOf(level.id); return i < intro.length - 1 ? intro[i + 1] : null; }
    const same = PRACTICE.filter((l) => l.tags[0] === level.tags[0]).map((l) => l.id);
    const i = same.indexOf(level.id); return i >= 0 && i < same.length - 1 ? same[i + 1] : null;
  })();

  function complete() {
    localStorage.setItem(`aitr:done:${level.id}`, "1");
    router.push(nextId ? `/level/${nextId}` : "/");
  }

  // 자동 채점(객관식·진위형)
  const objItems = e.items.filter((i) => i.kind !== "주관식");
  const objTotal = objItems.reduce((a, i) => a + i.pts, 0);
  const objGot = e.items.reduce((a, it, idx) => ((it.kind === "객관식" || it.kind === "진위형") && picks[idx] === it.answer ? a + it.pts : a), 0);

  /* ---------------- 미션 화면 (기본) ---------------- */
  if (view === "mission")
    return (
      <Shell level={level}>
        <div style={{ marginBottom: 16 }}>
          <Guide mood="cheer" tone="green" text={hasSub
            ? "레슨 잘 따라왔어요! 이제 배운 걸 직접 해볼 시간이에요. 천천히 만들어보면 돼요."
            : "여기까지 잘 했어요! 이 레벨은 개념 위주예요. 가볍게 정리하고 넘어가요."} />
        </div>

        {hasSub ? (
          <div className="card" style={{ border: "2px solid var(--blue)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 22 }}>🎯</span>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>이번 레벨 미션</h2>
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>{e.submission!.title}</div>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--ink)", margin: "0 0 14px", whiteSpace: "pre-line" }}>{e.submission!.desc}</p>
            <div style={{ background: "var(--bg)", borderRadius: 12, padding: "13px 15px" }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: "var(--soft)", marginBottom: 8 }}>이렇게 됐는지 확인해요</div>
              <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9, fontSize: 15.5 }}>
                {e.submission!.rubric.map((r, k) => <li key={k}>{r}</li>)}
              </ul>
            </div>
            <div style={{ marginTop: 16, background: "var(--greenSoft)", border: "1.5px solid var(--green)", borderRadius: 12, padding: "14px 16px", fontSize: 16, fontWeight: 800, color: "#0d7a57", textAlign: "center" }}>
              📨 다 만들었으면, 관리자에게 결과물을 제출해보세요!
            </div>
          </div>
        ) : (
          <div className="card">
            <div style={{ fontSize: 12.5, fontWeight: 800, color: "var(--soft)", marginBottom: 6 }}>이 레벨에서 기억할 것</div>
            <div style={{ fontSize: 16.5, fontWeight: 700, lineHeight: 1.6 }}>{level.goal}</div>
            <p style={{ fontSize: 14.5, color: "var(--soft)", margin: "12px 0 0" }}>개념 위주라 따로 제출물은 없어요. 아래 ‘복습 퀴즈’로 가볍게 확인만 해도 좋아요.</p>
          </div>
        )}

        <button onClick={complete} className="btn lift" style={{ width: "100%", marginTop: 18, background: "var(--green)" }}>
          ✅ {hasSub ? "미션 완료" : "완료"}{nextId ? " — 다음 레벨로 →" : " — 끝! 🎉"}
        </button>
        {hasQuiz && (
          <button onClick={() => setView("take")} className="btn-ghost" style={{ width: "100%", marginTop: 10 }}>
            복습 퀴즈 풀어보기 (선택)
          </button>
        )}
        <Link href="/" className="btn-ghost" style={{ display: "block", textAlign: "center", marginTop: 10 }}>홈으로</Link>
      </Shell>
    );

  /* ---------------- 복습 퀴즈 ---------------- */
  if (view === "take")
    return (
      <Shell level={level}>
        <div style={{ marginBottom: 14 }}><Guide mood="think" tone="amber" text="복습 퀴즈예요. 부담 갖지 말고 가볍게 풀어봐요!" size={52} /></div>
        <div style={{ display: "grid", gap: 12 }}>
          {e.items.map((it, idx) => (
            <ItemInput key={idx} idx={idx} it={it} pick={picks[idx]} onPick={(v) => setPicks({ ...picks, [idx]: v })} />
          ))}
        </div>
        <button onClick={() => setView("result")} className="btn lift" style={{ width: "100%", marginTop: 16 }}>채점해 보기 →</button>
        <button onClick={() => setView("mission")} className="btn-ghost" style={{ width: "100%", marginTop: 10 }}>← 미션으로</button>
      </Shell>
    );

  /* ---------------- 퀴즈 결과 ---------------- */
  return (
    <Shell level={level}>
      <div style={{ marginBottom: 14 }}>
        <Guide mood={objGot >= objTotal * 0.7 ? "cheer" : "talk"} tone="green" text={`복습 퀴즈에서 ${objGot}점(객관식·진위형 ${objTotal}점 만점)을 맞혔어요. 잘했어요! 틀린 건 정답을 보고 한 번 더 익혀요.`} />
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {e.items.map((it, idx) => <ItemResult key={idx} idx={idx} it={it} pick={picks[idx]} />)}
      </div>
      <button onClick={complete} className="btn lift" style={{ width: "100%", marginTop: 18, background: "var(--green)" }}>✅ 완료{nextId ? " — 다음 레벨로 →" : " — 끝! 🎉"}</button>
      <button onClick={() => { setView("take"); setPicks({}); }} className="btn-ghost" style={{ width: "100%", marginTop: 10 }}>다시 풀기</button>
    </Shell>
  );
}

function Shell({ level, children }: { level: Level; children: React.ReactNode }) {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "0 18px 120px" }} className="fade">
      <div style={{ position: "sticky", top: 0, background: "var(--bg)", borderBottom: "1px solid var(--line)", margin: "0 -18px 18px", padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, zIndex: 10 }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid var(--line)", background: "#fff", borderRadius: 99, padding: "7px 13px", fontWeight: 800, fontSize: 13.5, color: "var(--ink)" }}>🏠 홈</Link>
        <b style={{ fontSize: 15.5 }}>{levelTag(level)} · 미션</b>
      </div>
      {children}
    </main>
  );
}

function ItemInput({ idx, it, pick, onPick }: { idx: number; it: ExamItem; pick?: number; onPick: (v: number) => void }) {
  return (
    <div className="card">
      <div style={{ fontSize: 12.5, fontWeight: 800, color: "var(--blue)", marginBottom: 8 }}>{idx + 1}. {it.kind}</div>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, lineHeight: 1.45 }}>{it.q}</div>
      {it.kind === "객관식" && (
        <div style={{ display: "grid", gap: 8 }}>
          {it.options.map((op, j) => (
            <button key={j} onClick={() => onPick(j)} style={{ textAlign: "left", fontFamily: "inherit", cursor: "pointer", background: pick === j ? "var(--blueSoft)" : "#fff", border: `2px solid ${pick === j ? "var(--blue)" : "var(--line)"}`, borderRadius: 10, padding: "12px 14px", fontSize: 15.5, fontWeight: 600 }}>{op}</button>
          ))}
        </div>
      )}
      {it.kind === "진위형" && (
        <div style={{ display: "flex", gap: 8 }}>
          {["O", "X"].map((op, j) => (
            <button key={j} onClick={() => onPick(j)} style={{ flex: 1, fontFamily: "inherit", cursor: "pointer", background: pick === j ? "var(--blueSoft)" : "#fff", border: `2px solid ${pick === j ? "var(--blue)" : "var(--line)"}`, borderRadius: 10, padding: "14px", fontSize: 19, fontWeight: 800 }}>{op}</button>
          ))}
        </div>
      )}
      {it.kind === "주관식" && <textarea rows={2} className="field" placeholder="답을 적어보세요 (채점 후 모범답안과 비교)" />}
    </div>
  );
}

function ItemResult({ idx, it, pick }: { idx: number; it: ExamItem; pick?: number }) {
  if (it.kind === "주관식")
    return (
      <div className="card">
        <div style={{ fontSize: 12.5, fontWeight: 800, color: "var(--blue)", marginBottom: 6 }}>{idx + 1}. 주관식</div>
        <div style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 8 }}>{it.q}</div>
        <div style={{ background: "var(--greenSoft)", borderRadius: 10, padding: "10px 13px", fontSize: 14.5, color: "#0d7a57" }}><b>모범답안: </b>{it.sample}</div>
      </div>
    );
  const correct = pick === it.answer;
  const ans = it.kind === "진위형" ? (it.answer === 0 ? "O" : "X") : it.options[it.answer];
  return (
    <div className="card" style={{ borderColor: correct ? "var(--green)" : "var(--red)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12.5, fontWeight: 800, color: "var(--blue)" }}>{idx + 1}. {it.kind}</span>
        <span style={{ fontWeight: 800, color: correct ? "var(--green)" : "var(--red)" }}>{correct ? "정답 ✓" : "오답 ✗"}</span>
      </div>
      <div style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 6 }}>{it.q}</div>
      {!correct && <div style={{ fontSize: 14.5, color: "var(--soft)" }}>정답: <b style={{ color: "var(--ink)" }}>{ans}</b></div>}
    </div>
  );
}
