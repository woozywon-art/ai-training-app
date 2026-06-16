import TrackView from "@/components/TrackView";
import { PRACTICE } from "@/lib/course";

export function generateStaticParams() {
  const tags = Array.from(new Set(PRACTICE.map((l) => l.tags[0])));
  return [{ key: "intro" }, { key: "builder" }, ...tags.map((t) => ({ key: t }))];
}
export const dynamicParams = true;

export default async function Page({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  return <TrackView trackKey={decodeURIComponent(key)} />;
}
