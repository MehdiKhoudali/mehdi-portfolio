import { promises as fs } from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const indexPath = path.join(dist, "index.html");
const index = await fs.readFile(indexPath, "utf8");
const assets = await fs.readdir(path.join(dist, "assets"));

if (!index.includes('<div id="root"></div>')) {
  throw new Error("Production HTML is missing the React root");
}

if (!assets.some((file) => file.endsWith(".js"))) {
  throw new Error("Production build is missing a JavaScript bundle");
}

if (!assets.some((file) => file.endsWith(".css"))) {
  throw new Error("Production build is missing a CSS bundle");
}

console.log("Verified production HTML, JavaScript, and CSS artifacts.");
