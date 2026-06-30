import { AppFrame } from "@/components/AppFrame";
import { TimelineGame } from "@/components/TimelineGame";

export default function Chapter027GamePage() {
  return (
    <AppFrame>
      <main className="page-shell">
        <section className="section-heading">
          <div>
            <p className="small-text">小游戏</p>
            <h1>白虎岭真相时间线</h1>
          </div>
        </section>
        <TimelineGame />
      </main>
    </AppFrame>
  );
}
