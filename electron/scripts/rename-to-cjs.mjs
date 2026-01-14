import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "dist-electron");

function renameJsToCjs(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) renameJsToCjs(full);
    else if (e.isFile() && e.name.endsWith(".js")) {
      const target = full.replace(/\.js$/, ".cjs");
      fs.renameSync(full, target);
    }
  }
}

if (!fs.existsSync(outDir)) {
  console.error("dist-electron does not exist:", outDir);
  process.exit(1);
}

renameJsToCjs(outDir);
console.log("Renamed Electron build output .js -> .cjs");
