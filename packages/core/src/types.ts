export type SkillScope = "user" | "plugin" | "project";

export interface SkillLocation {
  path: string;       // glob pattern like "~/.claude/skills/*/SKILL.md"
  scope: SkillScope;
}

export interface ClientConfig {
  label: string;
  locations: SkillLocation[];
  parser: string;     // e.g., "yaml-frontmatter"
}

export interface SkillscanConfig {
  clients: Record<string, ClientConfig>;
}

export interface Skill {
  id: string;           // SHA-256 hash of absolute path (first 12 chars)
  name: string;         // From frontmatter
  description: string;  // From frontmatter
  client: string;       // "claude-code" | "codex" | ...
  scope: SkillScope;    // "user" | "plugin" | "project"
  path: string;         // Absolute path
  plugin?: string;      // e.g., "superpowers"
  version?: string;     // e.g., "5.0.5" or git hash
  marketplace?: string; // e.g., "claude-plugins-official"
  frontmatter: Record<string, unknown>;
}

export interface SkillDetail extends Skill {
  content: string;      // Full markdown content (without frontmatter)
  rawContent: string;   // Raw file content
}

export interface DuplicateGroup {
  name: string;
  skills: Skill[];
  canonical: Skill;     // Recommended instance
}

export interface ScanResult {
  skills: Skill[];
  errors: ScanError[];
  scannedAt: string;    // ISO timestamp
}

export interface ScanError {
  path: string;
  error: string;
}
