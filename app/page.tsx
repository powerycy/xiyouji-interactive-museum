import { AppFrame } from "@/components/AppFrame";
import { MapView } from "@/components/MapView";

export default function HomePage() {
  return (
    <AppFrame variant="museum-light">
      <main className="page-shell page-shell-map">
        <MapView />
      </main>
    </AppFrame>
  );
}
