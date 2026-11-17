import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [outDir, ...frames] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const opts = { serveUrl, id: process.env.COMP ?? "CIAwards", browserExecutable: process.env.REMOTION_BROWSER };
const composition = await selectComposition(opts);
for (const f of frames) {
  await renderStill({ ...opts, composition, frame: Number(f), output: `${outDir}/f${f.padStart(4, "0")}.jpg`, imageFormat: "jpeg", scale: 0.5 });
  console.log("ok", f);
}
