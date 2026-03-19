/**
 * Metadata extracted from Claude Code skill paths
 */
export interface ClaudeCodeMetadata {
  plugin?: string;
  version?: string;
  marketplace?: string;
}

/**
 * Extracts metadata from Claude Code skill file paths
 *
 * Supported patterns:
 * - /cache/{marketplace}/{plugin}/{version}/skills/{name}/SKILL.md
 * - /marketplaces/{marketplace}/skills/{name}/SKILL.md
 * - /marketplaces/{marketplace}/plugins/{plugin}/skills/{name}/SKILL.md
 *
 * Versions can be semver (5.0.5) or git hashes (385c1469c567)
 *
 * @param absolutePath - Absolute path to the skill file
 * @returns Extracted metadata
 */
export function extractClaudeCodeMetadata(absolutePath: string): ClaudeCodeMetadata {
  const metadata: ClaudeCodeMetadata = {};

  // Normalize path separators for cross-platform compatibility
  const normalizedPath = absolutePath.replace(/\\/g, "/");

  // Pattern 1: /cache/{marketplace}/{plugin}/{version}/skills/{name}/SKILL.md
  const cachePattern = /\/cache\/([^/]+)\/([^/]+)\/([^/]+)\/skills\/[^/]+\/SKILL\.md$/i;
  const cacheMatch = normalizedPath.match(cachePattern);
  if (cacheMatch) {
    metadata.marketplace = cacheMatch[1];
    metadata.plugin = cacheMatch[2];
    metadata.version = cacheMatch[3];
    return metadata;
  }

  // Pattern 2: /marketplaces/{marketplace}/plugins/{plugin}/skills/{name}/SKILL.md
  const marketplacePluginPattern = /\/marketplaces\/([^/]+)\/plugins\/([^/]+)\/skills\/[^/]+\/SKILL\.md$/i;
  const marketplacePluginMatch = normalizedPath.match(marketplacePluginPattern);
  if (marketplacePluginMatch) {
    metadata.marketplace = marketplacePluginMatch[1];
    metadata.plugin = marketplacePluginMatch[2];
    return metadata;
  }

  // Pattern 3: /marketplaces/{marketplace}/skills/{name}/SKILL.md
  const marketplacePattern = /\/marketplaces\/([^/]+)\/skills\/[^/]+\/SKILL\.md$/i;
  const marketplaceMatch = normalizedPath.match(marketplacePattern);
  if (marketplaceMatch) {
    metadata.marketplace = marketplaceMatch[1];
    return metadata;
  }

  return metadata;
}
