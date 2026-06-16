import type { Metadata, Viewport } from "next";
import "./globals.css";
import A11yShell from "@/components/A11yShell";

export const metadata: Metadata = {
  title: "AI 실무자 교육 과정",
  description: "ChatGPT·Claude 기반 — 실무에 바로 쓰는 AI 교육",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <A11yShell>{children}</A11yShell>
      </body>
    </html>
  );
}
