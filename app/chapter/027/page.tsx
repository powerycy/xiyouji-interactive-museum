import { AppFrame } from "@/components/AppFrame";
import { ChapterScene } from "@/components/ChapterScene";
import { chapter027 } from "@/content/xiyouji";

export default function Chapter027Page() {
  return (
    <AppFrame>
      <main className="page-shell">
        <section className="section-heading">
          <div>
            <p className="small-text">第二七回 · {chapter027.originalTitle}</p>
            <h1>{chapter027.title}</h1>
          </div>
          <p className="small-text">点击白虎岭场景热点，阅读展签并收集核心线索。</p>
        </section>
        <ChapterScene />
      </main>
    </AppFrame>
  );
}
