import { spawn } from 'child_process';
import { logger } from './src/pairtest/lib/Logger.js';
import { serviceMessages } from './src/pairtest/lib/Messages.js';

process.on('unhandledRejection', (reason) => {
  logger.error(serviceMessages.globalUnhandledRejection(reason));
});
process.on('uncaughtException', (err) => {
  logger.error(serviceMessages.globalUncaughtException(err));
});

const cliProcess = spawn('node', ['src/cli/cli.js'], {
  stdio: 'inherit'
});

cliProcess.on('close', () => {
  console.log(`\n🦆 Goodbye, please come again! 🦆`);
}); 