import { Command } from 'commander';
import { SkillScanner } from '@skillscan/scanner';
import chalk from 'chalk';
import readline from 'readline';

/**
 * Prompt user for confirmation
 */
function confirm(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(message + ' (y/N): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

export function createDeleteCommand(): Command {
  const command = new Command('delete')
    .description('Delete a skill by ID')
    .argument('<id>', 'Skill ID to delete')
    .option('-f, --force', 'Skip confirmation prompt')
    .action(async (id: string, options) => {
      try {
        const scanner = new SkillScanner();
        const detail = await scanner.inspect(id);

        if (!detail) {
          console.error(chalk.red(`Error: Skill with ID '${id}' not found`));
          process.exit(1);
        }

        // Show skill info
        console.log(chalk.yellow.bold('⚠ About to delete:'));
        console.log(chalk.bold('  ID:     ') + detail.id);
        console.log(chalk.bold('  Name:   ') + detail.name);
        console.log(chalk.bold('  Client: ') + detail.client);
        console.log(chalk.bold('  File:   ') + detail.path);

        // Ask for confirmation unless --force
        if (!options.force) {
          const confirmed = await confirm('\nAre you sure you want to delete this skill?');
          if (!confirmed) {
            console.log(chalk.gray('Deletion cancelled'));
            process.exit(0);
          }
        }

        // Perform deletion
        const success = await scanner.delete(id);

        if (success) {
          console.log(chalk.green('✓ Skill deleted successfully'));
        } else {
          console.error(chalk.red('Error: Failed to delete skill'));
          process.exit(1);
        }
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  return command;
}
