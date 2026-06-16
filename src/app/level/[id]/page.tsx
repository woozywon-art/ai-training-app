import { notFound } from "next/navigation";
import { levelById, LEVELS, PRACTICE, INTRO } from "@/lib/course";
import LessonPlayer from "@/components/LessonPlayer";

export function generateStaticParams() {
  return [...INTRO, ...LEVELS, ...PRACTICE].map((l) => ({ id: String(l.id) }));
}

export default async function LevelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const level = levelById(Number(id));
  if (!level) notFound();
  return <LessonPlayer level={level} />;
}
