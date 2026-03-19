import { readFileSync, existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { z } from "zod";
import { DEFAULT_CONFIG } from "./constants.js";
import type { SkillscanConfig } from "./types.js";

// Zod schemas for validation
const SkillScopeSchema = z.enum(["user", "plugin", "project", "marketplace"]);

const SkillLocationSchema = z.object({
  path: z.string(),
  scope: SkillScopeSchema,
});

const ClientConfigSchema = z.object({
  label: z.string(),
  locations: z.array(SkillLocationSchema),
  parser: z.string(),
});

const SkillscanConfigSchema = z.object({
  clients: z.record(z.string(), ClientConfigSchema),
});

/**
 * Returns the path to the user's config file, or null if it doesn't exist
 */
export function getConfigPath(): string | null {
  // Check environment variable first
  const envPath = process.env.SKILLSCAN_CONFIG;
  if (envPath && existsSync(envPath)) {
    return envPath;
  }

  // Check default location
  const defaultPath = join(homedir(), ".skillscan", "config.json");
  if (existsSync(defaultPath)) {
    return defaultPath;
  }

  return null;
}

/**
 * Loads and validates the skillscan configuration.
 *
 * Merge strategy: user-provided client entries REPLACE (not deep-merge)
 * default entries for that client. New client keys are added alongside defaults.
 */
export function loadConfig(): SkillscanConfig {
  let config: SkillscanConfig = { clients: { ...DEFAULT_CONFIG.clients } };

  const configPath = getConfigPath();
  if (configPath) {
    try {
      const userConfigJson = readFileSync(configPath, "utf-8");
      const userConfig = JSON.parse(userConfigJson);

      // Validate user config
      const validatedUserConfig = SkillscanConfigSchema.parse(userConfig);

      // Merge: user client entries replace defaults, new entries are added
      config = {
        clients: {
          ...DEFAULT_CONFIG.clients,
          ...validatedUserConfig.clients,
        },
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Invalid configuration at ${configPath}: ${error.errors
            .map((e) => `${e.path.join(".")}: ${e.message}`)
            .join(", ")}`
        );
      }
      throw new Error(`Failed to load configuration from ${configPath}: ${error}`);
    }
  }

  // Validate final merged config
  return SkillscanConfigSchema.parse(config);
}
