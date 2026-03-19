import { Command } from 'commander';
import { SkillScanner, findDuplicates } from '@skillscan/scanner';
import chalk from 'chalk';
import Table from 'cli-table3';
import { formatDuplicatesJson } from '../formatters/json.js';

export function createDuplicatesCommand(): Command {
  const command = new Command('duplicates')
    .description('Find duplicate skills')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      try {
        const scanner = new SkillScanner();
        const result = await scanner.scan();
        const groups = findDuplicates(result.skills);

        if (options.json) {
          console.log(formatDuplicatesJson(groups));
          return;
        }

        // Table format
        if (groups.length === 0) {
          console.log(chalk.green('✓ No duplicate skills found'));
          return;
        }

        console.log(chalk.yellow.bold(`Found ${groups.length} duplicate group(s):\n`));

        for (let i = 0; i < groups.length; i++) {
          const group = groups[i];
          console.log(chalk.cyan.bold(`Group ${i + 1}: "${group.name}"`));
          console.log(chalk.gray('─'.repeat(60)));

          const table = new Table({
            head: [
              chalk.cyan('ID'),
              chalk.cyan('Name'),
              chalk.cyan('Client'),
              chalk.cyan('Scope'),
              chalk.cyan('Status')
            ],
            colWidths: [12, 30, 15, 10, 15]
          });

          for (const skill of group.skills) {
            const isCanonical = skill.id === group.canonical.id;
            const status = isCanonical ? chalk.green('✓ Canonical') : '';

            table.push([
              skill.id.substring(0, 10),
              skill.name.substring(0, 28),
              skill.client.substring(0, 13),
              skill.scope,
              status
            ]);
          }

          console.log(table.toString());
          console.log(chalk.gray(`Recommendation: Keep ${chalk.bold(group.canonical.id)} (${group.canonical.client}/${group.canonical.scope})`));
          console.log();
        }

        console.log(chalk.gray(`Total: ${groups.length} duplicate group(s)`));
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  return command;
}
