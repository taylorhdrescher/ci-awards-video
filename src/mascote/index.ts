// Protótipo do mascote formado por uma bolinha de luz. Studio: npx remotion studio src/mascote/index.ts
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MASCOTE_DUR, MascoteLuz } from "./MascoteLuz";

const Root: React.FC = () =>
  React.createElement(
    React.Fragment,
    null,
    React.createElement(Composition, { id: "MascoteLuz", component: MascoteLuz, durationInFrames: MASCOTE_DUR, fps: 30, width: 1920, height: 1080 }),
    React.createElement(Composition, { id: "MascoteLuzVertical", component: MascoteLuz, durationInFrames: MASCOTE_DUR, fps: 30, width: 1080, height: 1920 }),
  );
registerRoot(Root);
