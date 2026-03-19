import { Command } from 'commander';
import { SkillScanner } from '@skillscan/scanner';
import chalk from 'chalk';

export function createInspectCommand(): Command {
  const command = new Command('inspect')
    .description('Inspect a skill by ID')
    .argument('<id>', 'Skill ID to inspect')
    .action(async (id: string) => {
      try {
        const scanner = new SkillScanner();
        const detail = await scanner.inspect(id);

        if (!detail) {
          console.error(chalk.red(`Error: Skill with ID '${id}' not found`));
          process.exit(1);
        }

        // Display metadata header
        console.log(chalk.cyan.bold('Skill Details'));
        console.log(chalk.gray('─'.repeat(60)));
        console.log(chalk.bold('ID:        ') + detail.id);
        console.log(chalk.bold('Name:      ') + detail.name);
        console.log(chalk.bold('Client:    ') + detail.client);
        console.log(chalk.bold('Scope:     ') + detail.scope);
        console.log(chalk.bold('Plugin:    ') + (detail.plugin || '-'));
        console.log(chalk.bold('Version:   ') + (detail.version || '-'));
        console.log(chalk.bold('File:      ') + detail.path);

        if (detail.description) {
          console.log(chalk.bold('Description: ') + detail.description);
        }

        // Display content
        console.log('\n' + chalk.cyan.bold('Content'));
        console.log(chalk.gray('─'.repeat(60)));
        console.log(detail.content);

        // Display raw content if different
        if (detail.rawContent && detail.rawContent !== detail.content) {
          console.log('\n' + chalk.cyan.bold('Raw Content'));
          console.log(chalk.gray('─'.repeat(60)));
          console.log(detail.rawContent);
        }
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  return command;
}
