/**
 * Copies PHP API and Apache rules into dist/ for XAMPP deployment.
 */
import { cpSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

if (!existsSync(dist)) {
  console.error("Run npm run build first.");
  process.exit(1);
}

cpSync(join(root, "api"), join(dist, "api"), { recursive: true });
cpSync(join(root, "public", ".htaccess"), join(dist, ".htaccess"));
console.log("XAMPP bundle ready in dist/ — copy the dist folder to htdocs/adopt-a-reef/");
