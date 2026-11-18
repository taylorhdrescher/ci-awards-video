import React from "react";
import { Composition } from "remotion";
import { CIAwardsV10, V10_TOTAL } from "./V10";

export const RootV10: React.FC = () => (
  <>
    <Composition id="CIAwardsV10" component={CIAwardsV10} durationInFrames={V10_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="CIAwardsV10Vertical" component={CIAwardsV10} durationInFrames={V10_TOTAL} fps={30} width={1080} height={1920} />
  </>
);
