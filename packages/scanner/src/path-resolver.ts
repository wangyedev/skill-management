import fg from "fast-glob";
import { expandPath } from "@skillscan/core";
import type { SkillLocation, SkillScope } from "@skillscan/core";

export interface ResolvedSkillPath {
  path: string;       // absolute path to the file
  scope: SkillScope;
}

export interface PathResolutionResult {
  paths: ResolvedSkillPath[];
  errors: Array<{ pattern: string; error: string }>;
}

/**
 * Resolves skill file paths from location configurations
 * Expands ~ and $CWD, then uses fast-glob to find matching files
 *
 * @param locations - Array of skill location configurations with glob patterns
 * @returns Resolved paths and any errors encountered
 */
export async function resolveSkillPaths(
  locations: SkillLocation[]
): Promise<PathResolutionResult> {
  const paths: ResolvedSkillPath[] = [];
  const errors: Array<{ pattern: string; error: string }> = [];

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
        paths.push({
          path,
          scope: location.scope,
        });
      }
    } catch (error) {
      errors.push({
        pattern: location.path,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { paths, errors };
}
