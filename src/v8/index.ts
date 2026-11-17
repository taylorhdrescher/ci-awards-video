// Ponto de entrada só da V8 (não carrega as composições antigas nem suas fontes).
// Studio: npx remotion studio src/v8/index.ts
import { registerRoot } from "remotion";
import { RootV8 } from "./Root";
registerRoot(RootV8);
