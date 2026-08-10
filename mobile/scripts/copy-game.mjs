/* The game is the three files in the repo root, and it stays there: `open
   index.html` has to keep working, which is the whole reason the Capacitor
   project lives in mobile/ rather than owning the root. www/ is therefore a
   build output — copied, gitignored, and never edited. Anything found in there
   that is not in this list is stale and goes. */
import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const mobile = resolve(here, "..");
const repo = resolve(mobile, "..");
const www = join(mobile, "www");

const FILES = ["index.html", "three.min.js"];

await rm(www, { recursive: true, force: true });
await mkdir(www, { recursive: true });
for (const f of FILES) await cp(join(repo, f), join(www, f));
console.log(`copied ${FILES.join(", ")} → mobile/www/`);
