import Link from "next/link";
export default function NotFound() {
  return (
    <main style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
      <div className="fade">
        <div style={{ color: "var(--blue)", fontWeight: 800, marginBottom: 10 }}>404</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 18px" }}>없는 페이지예요</h1>
        <Link href="/" className="btn">과정 지도로</Link>
      </div>
    </main>
  );
}
