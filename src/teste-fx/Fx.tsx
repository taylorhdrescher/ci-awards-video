import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";

const Box: React.FC = () => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", left: f * 40, top: 300, width: 200, height: 200, background: "#9b6bff", borderRadius: 30 }} />;
};
export const Fx: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#06040f" }}>
      <CameraMotionBlur shutterAngle={180} samples={10}>
        <Box />
      </CameraMotionBlur>
    </AbsoluteFill>
  );
};
