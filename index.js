import { spawn } from 'child_process';

const cliProcess = spawn('node', ['src/cli/cli.js'], {
  stdio: 'inherit'
});

cliProcess.on('close', (code) => {
  console.log(`\n🦆 Goodbye, please come again! 🦆`);
}); 