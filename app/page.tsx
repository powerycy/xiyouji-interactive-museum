import { AppFrame } from "@/components/AppFrame";
import { MapView } from "@/components/MapView";

export default function HomePage() {
  return (
    <AppFrame>
      <main className="page-shell">
        <section className="section-heading">
          <div>
            <p className="small-text">原著路线</p>
            <h1>取经大地图</h1>
          </div>
          <p className="small-text">白虎岭已开放，完成后解锁黑松林预览。</p>
        </section>
        <MapView />
      </main>
    </AppFrame>
  );
}
