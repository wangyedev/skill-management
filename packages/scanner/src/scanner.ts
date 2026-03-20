import { readFile, unlink } from "fs/promises";
import { basename, dirname } from "path";
import { loadConfig, generateId, expandPath } from "@skillscan/core";
import type {
  SkillscanConfig,
  Skill,
  SkillDetail,
  ScanResult,
  ScanError,
} from "@skillscan/core";
import { getParser } from "./parsers/index.js";
import { resolveSkillPaths } from "./path-resolver.js";
import { extractClaudeCodeMetadata } from "./extractors/claude-code.js";
import { extractCodexMetadata } from "./extractors/codex.js";

/**
 * Main scanner class for discovering and managing skills
 */
export class SkillScanner {
  private config: SkillscanConfig;

  constructor(config?: SkillscanConfig) {
    this.config = config ?? loadConfig();
  }

  /**
   * Scans all configured locations and returns normalized Skill objects
   */
  async scan(): Promise<ScanResult> {
    const skills: Skill[] = [];
    const errors: ScanError[] = [];

    // Process each client
    for (const [clientName, clientConfig] of Object.entries(this.config.clients)) {
      try {
        // Resolve all file paths for this client
        const resolution = await resolveSkillPaths(clientConfig.locations);
        for (const err of resolution.errors) {
          errors.push({ path: err.pattern, error: err.error });
        }
        const resolvedPaths = resolution.paths;

        // Get the parser for this client
        const parser = getParser(clientConfig.parser);

        // Process each file
        for (const { path, scope } of resolvedPaths) {
          try {
            const rawContent = await readFile(path, "utf-8");
            const parseResult = parser.parse(rawContent);

            // Extract metadata from path based on client
            let pathMetadata: {
              plugin?: string;
              version?: string;
              marketplace?: string;
            } = {};

            if (clientName === "claude-code") {
              pathMetadata = extractClaudeCodeMetadata(path);
            } else if (clientName === "codex") {
              pathMetadata = extractCodexMetadata(path);
            }

            // Get skill name from frontmatter or derive from directory name
            const rawName = parseResult.frontmatter.name;
            let name: string;
            if (typeof rawName === 'string' && rawName.trim()) {
              name = rawName;
            } else {
              const skillDir = dirname(path);
              name = basename(skillDir);
            }

            // Get description from frontmatter or use empty string
            const rawDesc = parseResult.frontmatter.description;
            const description = typeof rawDesc === 'string' ? rawDesc : "";

            // Build the Skill object
            const skill: Skill = {
              id: generateId(path),
              name,
              description,
              client: clientName,
              scope,
              path,
              frontmatter: parseResult.frontmatter,
              ...pathMetadata,
            };

            skills.push(skill);
          } catch (error) {
            errors.push({
              path,
              error: error instanceof Error ? error.message : String(error),
            });
          }
        }
      } catch (error) {
        // Client-level error (e.g., parser not found)
        errors.push({
          path: `client:${clientName}`,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return {
      skills,
      errors,
      scannedAt: new Date().toISOString(),
    };
  }

  /**
   * Returns full detail for a skill by ID (includes markdown content)
   */
  async inspect(id: string): Promise<SkillDetail | null> {
    // First, scan to find the skill with this ID
    const scanResult = await this.scan();
    const skill = scanResult.skills.find((s) => s.id === id);

    if (!skill) {
      return null;
    }

    // Read the file again to get the full content
    try {
      const rawContent = await readFile(skill.path, "utf-8");

      // Get the parser for this client
      const clientConfig = this.config.clients[skill.client];
      if (!clientConfig) {
        return null;
      }

      const parser = getParser(clientConfig.parser);
      const parseResult = parser.parse(rawContent);

      // Return SkillDetail
      const skillDetail: SkillDetail = {
        ...skill,
        content: parseResult.content,
        rawContent: parseResult.rawContent,
      };

      return skillDetail;
    } catch (error) {
      return null;
    }
  }

  /**
   * Deletes a skill file by ID
   * @returns true if deleted, false if not found
   */
  async delete(id: string): Promise<boolean> {
    const scanResult = await this.scan();
    const skill = scanResult.skills.find((s) => s.id === id);

    if (!skill) {
      return false;
    }

    if (!this.isPathWithinConfiguredLocations(skill.path)) {
      throw new Error(`Refusing to delete: path is outside configured skill directories`);
    }

    try {
      await unlink(skill.path);
      return true;
    } catch (error) {
      return false;
    }
  }

  private isPathWithinConfiguredLocations(skillPath: string): boolean {
    for (const clientConfig of Object.values(this.config.clients)) {
      for (const location of clientConfig.locations) {
        const expandedBase = expandPath(
          location.path.replace(/\*.*$/, '')  // Strip glob portion
        );
        if (skillPath.startsWith(expandedBase)) {
          return true;
        }
      }
    }
    return false;
  }
}
