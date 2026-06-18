export function bumpStreak(): number {
  if (typeof window === "undefined") return 0;
  const today = new Date().toDateString();
  try {
    const raw = localStorage.getItem("aitr:streak");
    const s = raw ? (JSON.parse(raw) as { count: number; last: string }) : { count: 0, last: "" };
    if (s.last === today) return s.count;
    const yest = new Date(Date.now() - 86400000).toDateString();
    const count = s.last === yest ? s.count + 1 : 1;
    localStorage.setItem("aitr:streak", JSON.stringify({ count, last: today }));
    return count;
  } catch { return 1; }
}
export function getStreak(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem("aitr:streak");
    if (!raw) return 0;
    const s = JSON.parse(raw) as { count: number; last: string };
    const today = new Date().toDateString();
    const yest = new Date(Date.now() - 86400000).toDateString();
    return s.last === today || s.last === yest ? s.count : 0;
  } catch { return 0; }
}
