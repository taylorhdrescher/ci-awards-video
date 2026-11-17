import React from "react";
import { Composition } from "remotion";
import { CIAwardsV9, V9_TOTAL } from "./V9";

export const RootV9: React.FC = () => (
  <>
    <Composition id="CIAwardsV9" component={CIAwardsV9} durationInFrames={V9_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="CIAwardsV9Vertical" component={CIAwardsV9} durationInFrames={V9_TOTAL} fps={30} width={1080} height={1920} />
  </>
);
