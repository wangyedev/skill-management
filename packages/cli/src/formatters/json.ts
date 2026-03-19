import type { Skill, SkillDetail, DuplicateGroup } from '@skillscan/core';

/**
 * Format skills as JSON
 */
export function formatSkillsJson(skills: Skill[]): string {
  return JSON.stringify(skills, null, 2);
}

/**
 * Format skill detail as JSON
 */
export function formatSkillDetailJson(detail: SkillDetail): string {
  return JSON.stringify(detail, null, 2);
}

/**
 * Format duplicate groups as JSON
 */
export function formatDuplicatesJson(groups: DuplicateGroup[]): string {
  return JSON.stringify(groups, null, 2);
}
