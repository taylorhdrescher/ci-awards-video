import React from "react";
import { Composition } from "remotion";
import { CIAwardsV8, V8_TOTAL } from "./V8";

export const RootV8: React.FC = () => (
  <>
    <Composition id="CIAwardsV8" component={CIAwardsV8} durationInFrames={V8_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="CIAwardsV8Vertical" component={CIAwardsV8} durationInFrames={V8_TOTAL} fps={30} width={1080} height={1920} />
  </>
);
