const fs = require("fs");
const path = require("path");

const outDir = path.join(process.cwd(), "dist-electron");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, "package.json"),
  JSON.stringify({ type: "commonjs" }, null, 2),
  "utf8"
);

console.log("Wrote dist-electron/package.json with type=commonjs");
