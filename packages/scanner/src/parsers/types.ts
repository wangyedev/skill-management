export interface ParseResult {
  frontmatter: Record<string, unknown>;
  content: string;       // markdown content without frontmatter
  rawContent: string;    // original raw file content
}

export interface SkillParser {
  parse(rawContent: string): ParseResult;
}
