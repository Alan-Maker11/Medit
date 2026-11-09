import fs from "node:fs";
import path from "node:path";

/** Whether /public/medit-logo.png exists, so pages can conditionally render it. */
export function hasMeditLogo(): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", "medit-logo.png"));
}
