// Lista os arquivos de public/ em src/v8/assets.json (mídias que faltam viram espaço reservado no vídeo).
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
const root = new URL("../public/", import.meta.url).pathname;
const out = [];
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : out.push(relative(root, p).split("\\").join("/")); } };
walk(root);
writeFileSync(new URL("../src/v8/assets.json", import.meta.url), JSON.stringify(out.sort(), null, 1) + "\n");
console.log(out.length, "arquivos em public/");
