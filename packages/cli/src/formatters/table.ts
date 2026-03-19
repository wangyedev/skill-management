import Table from 'cli-table3';
import chalk from 'chalk';
import type { Skill } from '@skillscan/core';

/**
 * Truncate text to a maximum length
 */
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Format skills as a pretty table
 */
export function formatSkillsTable(skills: Skill[]): string {
  const table = new Table({
    head: [
      chalk.cyan('ID'),
      chalk.cyan('Name'),
      chalk.cyan('Client'),
      chalk.cyan('Scope'),
      chalk.cyan('Plugin'),
      chalk.cyan('Version')
    ],
    colWidths: [12, 30, 15, 10, 15, 10]
  });

  for (const skill of skills) {
    table.push([
      truncate(skill.id, 10),
      truncate(skill.name, 28),
      truncate(skill.client, 13),
      skill.scope,
      truncate(skill.plugin || '-', 13),
      skill.version || '-'
    ]);
  }

  let output = table.toString();

  // Add footer with count
  output += '\n' + chalk.gray(`Total: ${skills.length} skill${skills.length === 1 ? '' : 's'}`);

  return output;
}
