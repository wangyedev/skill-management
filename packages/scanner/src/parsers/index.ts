import type { SkillParser } from "./types.js";
import { YamlFrontmatterParser } from "./yaml-frontmatter.js";

const parsers = new Map<string, SkillParser>();

// Register default parsers
parsers.set("yaml-frontmatter", new YamlFrontmatterParser());

/**
 * Get a parser by name
 * @param name - Parser name (e.g., "yaml-frontmatter")
 * @returns The parser instance
 * @throws Error if parser not found
 */
export function getParser(name: string): SkillParser {
  const parser = parsers.get(name);
  if (!parser) {
    throw new Error(`Parser not found: ${name}`);
  }
  return parser;
}

// Re-export types
export type { SkillParser, ParseResult } from "./types.js";
