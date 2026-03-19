import type { SkillscanConfig } from "./types.js";

export const DEFAULT_CONFIG: SkillscanConfig = {
  clients: {
    "claude-code": {
      label: "Claude Code",
      locations: [
        { path: "~/.claude/skills/*/SKILL.md", scope: "user" },
        { path: "~/.claude/plugins/cache/**/skills/*/SKILL.md", scope: "plugin" },
        { path: "~/.claude/plugins/marketplaces/**/skills/*/SKILL.md", scope: "marketplace" },
        { path: "$CWD/.claude/skills/*/SKILL.md", scope: "project" }
      ],
      parser: "yaml-frontmatter"
    },
    "codex": {
      label: "Codex",
      locations: [
        { path: "~/.agents/skills/*", scope: "user" },
        { path: "$CWD/.agents/skills/*", scope: "project" }
      ],
      parser: "yaml-frontmatter"
    }
  }
};
