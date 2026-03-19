# skillscan

Cross-client skill discovery and management tool. Scans, indexes, and deduplicates AI coding assistant skills (Claude Code, Codex) across user, project, and plugin scopes.

## Architecture

npm workspace monorepo with four packages:

```
packages/
├── core/        — Shared types, constants, config loading (Zod validation)
├── scanner/     — File discovery (fast-glob), YAML frontmatter parsing, deduplication
├── cli/         — Commander-based CLI + Express API server
└── dashboard/   — React + Vite + Tailwind CSS frontend (react-query)
```

## Quick Start

```bash
npm install
npm run build

# List discovered skills
node packages/cli/dist/bin.js list

# Launch dashboard (API server + frontend)
npm run dev:serve
```

## CLI Commands

```
skillscan list                   List all skills
skillscan list --scope plugin    Filter by scope (user/project/plugin)
skillscan list --client codex    Filter by client
skillscan list --json            JSON output
skillscan inspect <id>           Show full skill details
skillscan duplicates             Find duplicate skills
skillscan config                 Show active configuration
skillscan delete <id>            Delete a skill file
skillscan serve                  Start API server + dashboard
```

## Scopes

| Scope | Location | Description |
|-------|----------|-------------|
| `user` | `~/.claude/skills/*/SKILL.md` | Personal skills |
| `plugin` | `~/.claude/plugins/cache/**/skills/*/SKILL.md` | Installed plugin skills |
| `project` | `$CWD/.claude/skills/*/SKILL.md` | Project-local skills |

Plugin-scoped skills retain `marketplace`, `plugin`, and `version` as metadata fields for provenance tracking.

## Configuration

Place a config file at `~/.skillscan/config.json` or set `SKILLSCAN_CONFIG` env var. Client entries in the user config replace defaults for that client.

```json
{
  "clients": {
    "claude-code": {
      "label": "Claude Code",
      "locations": [
        { "path": "~/.claude/skills/*/SKILL.md", "scope": "user" }
      ],
      "parser": "yaml-frontmatter"
    }
  }
}
```

## Development

```bash
npm run build              # Build all packages
npm run dev:cli             # Build CLI and run it
npm run dev:dashboard       # Vite dev server for dashboard
npm run dev:serve           # Full stack (API + dashboard)
```

## License

MIT
