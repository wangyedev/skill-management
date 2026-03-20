import { normalizeSkillName } from "@skillscan/core";
import type { Skill, DuplicateGroup, SkillScope } from "@skillscan/core";

/**
 * Priority order for selecting canonical skills (higher = more preferred)
 */
const SCOPE_PRIORITY: Record<SkillScope, number> = {
  plugin: 3,
  user: 2,
  project: 1,
};

/**
 * Compares two version strings, preferring semver over git hashes
 * Returns positive if v1 > v2, negative if v1 < v2, 0 if equal
 */
function compareVersions(v1: string | undefined, v2: string | undefined): number {
  if (!v1 && !v2) return 0;
  if (!v1) return -1;
  if (!v2) return 1;

  // Check if both are semver-like (starts with a digit)
  const isSemver1 = /^\d/.test(v1);
  const isSemver2 = /^\d/.test(v2);

  // If both are semver, compare them
  if (isSemver1 && isSemver2) {
    // Split off prerelease suffix (e.g., "5.0.0-beta.1" -> "5.0.0" + "beta.1")
    const [base1, pre1] = v1.split("-", 2);
    const [base2, pre2] = v2.split("-", 2);

    const parts1 = base1.split(".").map((p) => parseInt(p, 10) || 0);
    const parts2 = base2.split(".").map((p) => parseInt(p, 10) || 0);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const p1 = parts1[i] || 0;
      const p2 = parts2[i] || 0;
      if (p1 !== p2) return p1 - p2;
    }

    // Same base version: release (no prerelease) wins over prerelease
    if (!pre1 && pre2) return 1;
    if (pre1 && !pre2) return -1;
    if (pre1 && pre2) return pre1.localeCompare(pre2);
    return 0;
  }

  // Prefer semver over git hash
  if (isSemver1 && !isSemver2) return 1;
  if (!isSemver1 && isSemver2) return -1;

  // Both are git hashes, compare lexicographically (fallback)
  return v1.localeCompare(v2);
}

/**
 * Selects the canonical skill from a group based on priority rules:
 * 1. Scope priority: plugin > user > project
 * 2. Within same scope, prefer latest version (semver > git hash)
 * 3. If no version, prefer by path (most recent)
 */
function selectCanonical(skills: Skill[]): Skill {
  if (skills.length === 0) {
    throw new Error("Cannot select canonical from empty skill list");
  }

  if (skills.length === 1) {
    return skills[0];
  }

  // Sort by priority
  const sorted = [...skills].sort((a, b) => {
    // First, compare by scope priority
    const scopeDiff = SCOPE_PRIORITY[b.scope] - SCOPE_PRIORITY[a.scope];
    if (scopeDiff !== 0) return scopeDiff;

    // Same scope, compare by version
    const versionDiff = compareVersions(b.version, a.version);
    if (versionDiff !== 0) return versionDiff;

    // Same scope and version (or no version), prefer by path (lexicographic)
    return b.path.localeCompare(a.path);
  });

  return sorted[0];
}

/**
 * Finds duplicate skills grouped by normalized name
 * Only returns groups with 2 or more skills
 *
 * @param skills - Array of skills to check for duplicates
 * @returns Array of duplicate groups with canonical instance selected
 */
export function findDuplicates(skills: Skill[]): DuplicateGroup[] {
  // Group skills by normalized name
  const groups = new Map<string, Skill[]>();

  for (const skill of skills) {
    const normalizedName = normalizeSkillName(skill.name);
    const group = groups.get(normalizedName);
    if (group) {
      group.push(skill);
    } else {
      groups.set(normalizedName, [skill]);
    }
  }

  // Filter to only groups with 2+ skills and create DuplicateGroup objects
  const duplicateGroups: DuplicateGroup[] = [];

  for (const [normalizedName, groupSkills] of groups) {
    if (groupSkills.length >= 2) {
      duplicateGroups.push({
        name: normalizedName,
        skills: groupSkills,
        canonical: selectCanonical(groupSkills),
      });
    }
  }

  return duplicateGroups;
}
