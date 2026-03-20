import { Command } from 'commander';
import { createApp } from '../server/index.js';

export function createServeCommand(): Command {
  const command = new Command('serve')
    .description('Start the API server for the skillscan dashboard')
    .option('-p, --port <port>', 'Port to listen on', '3847')
    .action(async (options) => {
      try {
        const port = parseInt(options.port, 10);

        if (isNaN(port) || port < 1 || port > 65535) {
          console.error('Error: Invalid port number. Must be between 1 and 65535.');
          process.exit(1);
        }

        const app = createApp();

        const server = app.listen(port, '127.0.0.1', () => {
          console.log(`Skillscan dashboard running at http://localhost:${port}`);
          console.log(`API endpoints available at http://localhost:${port}/api/...`);
        }).on('error', (err: NodeJS.ErrnoException) => {
          if (err.code === 'EADDRINUSE') {
            console.error(`Error: Port ${port} is already in use`);
          } else {
            console.error(`Error starting server: ${err.message}`);
          }
          process.exit(1);
        });

        // Graceful shutdown
        const shutdown = () => {
          console.log('\nShutting down server...');
          server.close(() => {
            console.log('Server stopped');
            process.exit(0);
          });
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  return command;
}
