import { AppFrame } from "@/components/AppFrame";
import { RewardPreview } from "@/components/RewardPreview";

export default function Chapter027RewardPage() {
  return (
    <AppFrame variant="museum-light">
      <main className="page-shell page-shell-museum-flow">
        <section className="section-heading">
          <div>
            <p className="small-text">奖励</p>
            <h1>白虎岭全景预览</h1>
          </div>
        </section>
        <RewardPreview />
      </main>
    </AppFrame>
  );
}
