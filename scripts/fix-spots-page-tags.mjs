import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const p = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/app/spots/page.tsx",
);
let t = fs.readFileSync(p, "utf8");
t = t.replaceAll("motionlessFiltersRow", "div");
t = t.replaceAll("motionlessPage", "div");
fs.writeFileSync(p, t);
console.log("fixed", p);
