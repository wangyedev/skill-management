#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createListCommand } from './commands/list.js';
import { createInspectCommand } from './commands/inspect.js';
import { createDeleteCommand } from './commands/delete.js';
import { createConfigCommand } from './commands/config.js';
import { createDuplicatesCommand } from './commands/duplicates.js';
import { createServeCommand } from './commands/serve.js';

// Get package.json for version
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

const program = new Command();

program
  .name('skillscan')
  .description('Cross-client skill discovery and management tool')
  .version(packageJson.version);

// Register commands
program.addCommand(createListCommand());
program.addCommand(createInspectCommand());
program.addCommand(createDeleteCommand());
program.addCommand(createConfigCommand());
program.addCommand(createDuplicatesCommand());
program.addCommand(createServeCommand());

// Set list as default command if no command specified
const args = process.argv;
const hasCommand = args.some(arg =>
  ['list', 'inspect', 'delete', 'config', 'duplicates', 'serve', '--help', '-h', '--version', '-V'].includes(arg)
);

if (!hasCommand && args.length > 2) {
  // Insert 'list' command before the options
  args.splice(2, 0, 'list');
}

program.parse(args);
