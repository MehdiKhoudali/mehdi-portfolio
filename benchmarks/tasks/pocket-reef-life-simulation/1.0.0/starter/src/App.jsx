import { useMemo } from "react";
import { createSimulation } from "./simulation";

export function App() {
  const snapshot = useMemo(() => createSimulation().getSnapshot(), []);

  return (
    <main className="starter-shell">
      <p className="eyebrow">Pocket Reef / Field 01</p>
      <h1>A world in one tide.</h1>
      <p>Tune the current. Watch life answer.</p>
      <div className="starter-readout" aria-label="Initial simulation state">
        <span>{Math.round(snapshot.algae)} algae</span>
        <span>{snapshot.grazers} grazers</span>
        <span>{snapshot.hunters} hunters</span>
      </div>
    </main>
  );
}
