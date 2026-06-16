import { notFound } from "next/navigation";
import { levelById, LEVELS, PRACTICE, INTRO } from "@/lib/course";
import ExamView from "@/components/ExamView";

export function generateStaticParams() {
  return [...INTRO, ...LEVELS, ...PRACTICE].map((l) => ({ id: String(l.id) }));
}

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const level = levelById(Number(id));
  if (!level) notFound();
  return <ExamView level={level} />;
}
