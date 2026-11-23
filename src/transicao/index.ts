// Transição com o logo CI200 branco (overlay transparente). Studio: npx remotion studio src/transicao/index.ts
import React from "react";
import { Composition, registerRoot } from "remotion";
import { TRANSICAO_DUR, TransicaoCI200, TransicaoCI200Previa } from "./TransicaoCI200";

const c = (id: string, component: React.FC, d: number, w: number, h: number) => React.createElement(Composition, { id, component, durationInFrames: d, fps: 30, width: w, height: h });
const Root: React.FC = () =>
  React.createElement(
    React.Fragment,
    null,
    c("TransicaoCI200", TransicaoCI200, TRANSICAO_DUR, 1920, 1080),
    c("TransicaoCI200Vertical", TransicaoCI200, TRANSICAO_DUR, 1080, 1920),
    c("TransicaoCI200Previa", TransicaoCI200Previa, TRANSICAO_DUR + 50, 1920, 1080),
  );
registerRoot(Root);
