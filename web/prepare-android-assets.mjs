import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const target = join(here, "..", "app", "src", "main", "assets");

await rm(target, { recursive: true, force: true });
await mkdir(join(target, "vendor"), { recursive: true });

async function assemble(output, names) {
  const chunks = await Promise.all(names.map((name) => readFile(join(here, "parts", name), "utf8")));
  await writeFile(join(target, output), chunks.join(""), "utf8");
}

await assemble("app.js", ["app.js.01.part", "app.js.02.part", "app.js.03.part", "app.js.04.part", "app.js.05.part"]);
await assemble("index.html", ["index.html.01.part", "index.html.02.part", "index.html.03.part"]);
await assemble("styles.css", ["styles.css.01.part", "styles.css.02.part", "styles.css.03.part"]);

for (const file of ["app-icon.svg", "ENGINE_LICENSE.txt", "REACT_LICENSE.txt"]) {
  await cp(join(here, file), join(target, file));
}

await cp(
  join(here, "node_modules", "react", "umd", "react.production.min.js"),
  join(target, "vendor", "react.production.min.js")
);
await cp(
  join(here, "node_modules", "react-dom", "umd", "react-dom.production.min.js"),
  join(target, "vendor", "react-dom.production.min.js")
);

console.log("Prepared Android web assets at", target);
