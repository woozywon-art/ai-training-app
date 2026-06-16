import type { Metadata, Viewport } from "next";
import "./globals.css";
import A11yShell from "@/components/A11yShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-training-app.vercel.app"),
  title: "AI 실무자 교육 — 코디와 함께",
  description: "ChatGPT·Claude 기반, AI를 실무에 ‘써먹는’ 법. 코디가 친근하게 알려줘요.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "AI 교육", statusBarStyle: "default" },
  openGraph: {
    title: "AI 실무자 교육",
    description: "AI를 실무에 써먹는 법, 코디와 함께",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2F6BFF",
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
