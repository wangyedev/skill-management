import matter from "gray-matter";
import type { SkillParser, ParseResult } from "./types.js";

/**
 * Parser that extracts YAML frontmatter from markdown files using gray-matter
 */
export class YamlFrontmatterParser implements SkillParser {
  parse(rawContent: string): ParseResult {
    const result = matter(rawContent);

    return {
      frontmatter: result.data,
      content: result.content,
      rawContent,
    };
  }
}
