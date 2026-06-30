import { AppFrame } from "@/components/AppFrame";
import { StudioPreview } from "@/components/StudioPreview";

export default function StudioPage() {
  return (
    <AppFrame>
      <main className="page-shell">
        <section className="section-heading">
          <div>
            <p className="small-text">只读本地工作台</p>
            <h1>Studio</h1>
          </div>
          <p className="small-text">预览 seed、热点、权重、小游戏和奖励资源。</p>
        </section>
        <StudioPreview />
      </main>
    </AppFrame>
  );
}
