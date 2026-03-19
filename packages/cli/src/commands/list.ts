import { Command } from 'commander';
import { SkillScanner } from '@skillscan/scanner';
import type { SkillScope } from '@skillscan/core';
import { formatSkillsTable } from '../formatters/table.js';
import { formatSkillsJson } from '../formatters/json.js';

export function createListCommand(): Command {
  const command = new Command('list')
    .description('List all skills')
    .option('-c, --client <name>', 'Filter by client name')
    .option('-s, --scope <scope>', 'Filter by scope (user/shared/system)')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      try {
        const scanner = new SkillScanner();
        const result = await scanner.scan();

        let skills = result.skills;

        // Apply filters
        if (options.client) {
          skills = skills.filter(skill =>
            skill.client.toLowerCase() === options.client.toLowerCase()
          );
        }

        if (options.scope) {
          const scope = options.scope.toLowerCase() as SkillScope;
          skills = skills.filter(skill => skill.scope === scope);
        }

        // Determine output format
        const useJson = options.json || !process.stdout.isTTY;

        if (useJson) {
          console.log(formatSkillsJson(skills));
        } else {
          console.log(formatSkillsTable(skills));
        }

        // Report errors if any
        if (result.errors.length > 0 && !useJson) {
          console.error(`\nWarning: ${result.errors.length} error(s) occurred during scanning`);
        }
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  return command;
}
