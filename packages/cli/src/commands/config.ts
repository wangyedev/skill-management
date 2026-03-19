import { Command } from 'commander';
import { loadConfig, getConfigPath } from '@skillscan/core';
import { resolveSkillPaths } from '@skillscan/scanner';
import chalk from 'chalk';

export function createConfigCommand(): Command {
  const command = new Command('config')
    .description('Show current configuration')
    .action(async () => {
      try {
        const config = await loadConfig();
        const configPath = getConfigPath();

        console.log(chalk.cyan.bold('Configuration'));
        console.log(chalk.gray('─'.repeat(60)));
        console.log(chalk.bold('Config file: ') + configPath);
        console.log();

        console.log(chalk.cyan.bold('Clients'));
        console.log(chalk.gray('─'.repeat(60)));

        const clientEntries = Object.entries(config.clients);

        if (clientEntries.length === 0) {
          console.log(chalk.gray('No clients configured'));
        } else {
          for (const [clientName, clientConfig] of clientEntries) {
            console.log(chalk.bold(`\n${clientConfig.label} (${clientName}):`));
            console.log(chalk.gray(`  Parser: ${clientConfig.parser}`));

            for (const location of clientConfig.locations) {
              console.log(chalk.gray(`  Scope: ${location.scope}`));
              console.log(chalk.gray(`  Pattern: ${location.path}`));

              try {
                const resolvedPaths = await resolveSkillPaths([location]);
                console.log(chalk.gray(`  Found: ${resolvedPaths.length} file(s)`));
              } catch (error) {
                console.log(chalk.red(`  Error: ${error instanceof Error ? error.message : String(error)}`));
              }
            }
          }
        }
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  return command;
}
