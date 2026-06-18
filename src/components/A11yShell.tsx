"use client";
import { useEffect } from "react";
import Onboarding from "./Onboarding";
import Splash from "./Splash";
import { bumpStreak } from "@/lib/streak";

export default function A11yShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const read = () => {
      const s = localStorage.getItem("aitr:scale");
      (document.documentElement.style as unknown as { zoom: string }).zoom = s || "1";
    };
    read();
    try { bumpStreak(); } catch {}
    window.addEventListener("aitr-scale", read);
    return () => window.removeEventListener("aitr-scale", read);
  }, []);
  return <>{children}<Splash /><Onboarding /></>;
}
