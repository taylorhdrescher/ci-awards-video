import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

const FONTS: [string, string, string, string][] = [
  ["Barlow Condensed", "BarlowCondensed-600-normal", "600", "normal"],
  ["Barlow Condensed", "BarlowCondensed-700-normal", "700", "normal"],
  ["Barlow Condensed", "BarlowCondensed-800-normal", "800", "normal"],
  ["Barlow Condensed", "BarlowCondensed-600-italic", "600", "italic"],
  ["Barlow", "Barlow-400-normal", "400", "normal"],
  ["Barlow", "Barlow-500-normal", "500", "normal"],
  ["Barlow", "Barlow-600-normal", "600", "normal"],
  ["Barlow", "Barlow-700-normal", "700", "normal"],
  ["Barlow", "Barlow-500-italic", "500", "italic"],
];
FONTS.forEach(([family, file, weight, style]) => {
  loadFont({ family, url: staticFile(`fonts/${file}.woff2`), weight, style });
});

export const FONT_TITLE = "'Barlow Condensed', sans-serif";
export const FONT_BODY = "'Barlow', sans-serif";
export const C = {
  ink: "#0d120f",
  brown: "#1d1a12",
  gold: "#e3b93f",
  goldLight: "#f7dc7a",
  goldDeep: "#a9811d",
  yellow: "#ffde00",
  amber: "#ffc72c",
  green: "#367c2b",
  greenBright: "#5ec24a",
  lime: "#c9db8a",
  cream: "#f2e6c4",
  white: "#ffffff",
};

export const GOLD_GRADIENT =
  "linear-gradient(100deg, #a9811d 0%, #f7dc7a 22%, #e3b93f 40%, #fff3c4 50%, #e3b93f 60%, #a9811d 80%, #f7dc7a 100%)";

export const FPS = 30;
