import fg from "fast-glob";
import { expandPath } from "@skillscan/core";
import type { SkillLocation, SkillScope } from "@skillscan/core";

export interface ResolvedSkillPath {
  path: string;       // absolute path to the file
  scope: SkillScope;
}

/**
 * Resolves skill file paths from location configurations
 * Expands ~ and $CWD, then uses fast-glob to find matching files
 *
 * @param locations - Array of skill location configurations with glob patterns
 * @returns Array of resolved absolute file paths with their scopes
 */
export async function resolveSkillPaths(
  locations: SkillLocation[]
): Promise<ResolvedSkillPath[]> {
  const results: ResolvedSkillPath[] = [];

  for (const location of locations) {
    // Expand environment variables and tildes
    const expandedPath = expandPath(location.path);

    try {
      // Use fast-glob to resolve the pattern
      const matchedPaths = await fg(expandedPath, {
        absolute: true,
        onlyFiles: true,
        followSymbolicLinks: false,
      });

      // Add all matched paths with the scope
      for (const path of matchedPaths) {
        results.push({
          path,
          scope: location.scope,
        });
      }
    } catch (error) {
      // Silently skip locations that fail to resolve
      // The scanner will handle individual file errors
      continue;
    }
  }

  return results;
}
