import { createHash } from "crypto";
import { homedir } from "os";
import { resolve } from "path";

/**
 * Expands ~ to home directory and $CWD to current working directory
 */
export function expandPath(p: string): string {
  let expanded = p;

  // Expand ~ to home directory
  if (expanded.startsWith("~/")) {
    expanded = expanded.replace("~", homedir());
  } else if (expanded === "~") {
    expanded = homedir();
  }

  // Expand $CWD to current working directory
  if (expanded.includes("$CWD")) {
    expanded = expanded.replace(/\$CWD/g, process.cwd());
  }

  return resolve(expanded);
}

/**
 * Generates a 12-character ID from the SHA-256 hash of an absolute path
 */
export function generateId(absolutePath: string): string {
  const hash = createHash("sha256");
  hash.update(absolutePath);
  return hash.digest("hex").substring(0, 12);
}

/**
 * Normalizes a skill name for comparison (lowercase, trimmed)
 */
export function normalizeSkillName(name: string): string {
  return name.trim().toLowerCase();
}
