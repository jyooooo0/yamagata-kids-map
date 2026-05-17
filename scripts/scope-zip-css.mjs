import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(fileURLToPath(new URL(".", import.meta.url)), "..");
const srcCss = fs.readFileSync(path.join(root, "_zip-ref", "styles.css"), "utf8");
const scoped = srcCss.replace(/(^|[\s>+~,{])(\.app)\b/gm, "$1#yamagata-zip-root $2");
const outDir = path.join(root, "src", "styles");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "yamagata-zip-scoped.css"), scoped);
