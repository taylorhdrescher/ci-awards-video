// Protótipo do mascote formado por uma bolinha de luz. Studio: npx remotion studio src/mascote/index.ts
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MASCOTE_DUR, MascoteLuz } from "./MascoteLuz";
import { LOGO_LUZ_DUR, LogoLuz } from "./LogoLuz";

const Root: React.FC = () =>
  React.createElement(
    React.Fragment,
    null,
    React.createElement(Composition, { id: "MascoteLuz", component: MascoteLuz, durationInFrames: MASCOTE_DUR, fps: 30, width: 1920, height: 1080 }),
    React.createElement(Composition, { id: "CI200Luz", component: LogoLuz, durationInFrames: LOGO_LUZ_DUR, fps: 30, width: 1920, height: 1080 }),
    React.createElement(Composition, { id: "CI200LuzVertical", component: LogoLuz, durationInFrames: LOGO_LUZ_DUR, fps: 30, width: 1080, height: 1920 }),
    React.createElement(Composition, { id: "MascoteLuzVertical", component: MascoteLuz, durationInFrames: MASCOTE_DUR, fps: 30, width: 1080, height: 1920 }),
  );
registerRoot(Root);
