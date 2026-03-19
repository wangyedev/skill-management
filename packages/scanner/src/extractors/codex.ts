/**
 * Metadata extracted from Codex skill paths
 */
export interface CodexMetadata {
  plugin?: string;
  version?: string;
}

/**
 * Extracts metadata from Codex skill file paths
 *
 * Note: Codex paths don't typically encode as much metadata in the path structure,
 * so this extractor returns minimal information for now.
 *
 * @param _absolutePath - Absolute path to the skill file (unused for now)
 * @returns Extracted metadata
 */
export function extractCodexMetadata(_absolutePath: string): CodexMetadata {
  const metadata: CodexMetadata = {};

  // For now, Codex doesn't have specific path patterns to extract from
  // This can be extended in the future if Codex adopts structured paths

  return metadata;
}
