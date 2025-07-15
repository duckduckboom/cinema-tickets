import pty from 'node-pty';


describe('DuckFlix CLI simulation', () => {
  it('should successfully book tickets with valid input', (done) => {
    const cli = spawnCLI();
    let output = '';
    let step = 0;

    cli.on('data', (data) => {
      output += data;
      if (step === 0 && /account ID/i.test(output)) {
        cli.write('5\r');
        step++;
      } else if (step === 1 && /ADULT tickets/i.test(output)) {
        cli.write('2\r');
        step++;
      } else if (step === 2 && /CHILD tickets/i.test(output)) {
        cli.write('3\r');
        step++;
      } else if (step === 3 && /INFANT tickets/i.test(output)) {
        cli.write('1\r');
        step++;
      } else if (/Booking succeeded/i.test(output)) {

        setTimeout(() => {
          try {
            const cleaned = cleanOutput(output);
            expect(cleaned).toContain('Booking succeeded');
            expect(cleaned).toContain('Adult tickets: 2');
            expect(cleaned).toContain('Child tickets: 3');
            expect(cleaned).toContain('Infant tickets: 1');
            expect(cleaned).toContain('Total tickets: 6');
            expect(cleaned).toContain('Total seats: 5');
            expect(cleaned).toContain('Total cost: £95.00');
          } finally {
            // --- TEARDOWN ---
            teardownCLI(cli, done);
          }
        }, 100);
      }
    });
  });

  it('should successfully book tickets when reprompted for valid input', (done) => {
    const cli = spawnCLI();
    let output = '';
    let step = 0;

    cli.on('data', (data) => {
      output += data;
      if (step === 0 && /account ID/i.test(output)) {
        cli.write('5\r');
        step++;
      } else if (step === 1 && /ADULT tickets/i.test(output)) {
        cli.write('AA\r');
        step++;
      } else if (step === 2 && /ADULT tickets/i.test(output)) {
        cli.write('2\r');
        step++;
      } else if (step === 3 && /CHILD tickets/i.test(output)) {
        cli.write('undefined\r');
        step++;
      } else if (step === 4 && /CHILD tickets/i.test(output)) {
        cli.write('3\r');
        step++;
      } else if (step === 5 && /INFANT tickets/i.test(output)) {
        cli.write('1\r');
        step++;
      } else if (/Booking succeeded/i.test(output)) {

        setTimeout(() => {
          try {
            const cleaned = cleanOutput(output);
            expect(cleaned).toContain('Booking succeeded');
            expect(cleaned).toContain('Adult tickets: 2');
            expect(cleaned).toContain('Child tickets: 3');
            expect(cleaned).toContain('Infant tickets: 1');
            expect(cleaned).toContain('Total tickets: 6');
            expect(cleaned).toContain('Total seats: 5');
            expect(cleaned).toContain('Total cost: £95.00');
          } finally {

            teardownCLI(cli, done);
          }
        }, 100);
      }
    });
  });

  it('should not complete a full booking flow with too many tickets', (done) => {
    const cli = spawnCLI();
    let output = '';
    let step = 0;
    const timeout = setupTimeout(cli, done);

    cli.on('data', (data) => {
      output += data;
      if (step === 0 && /account ID/i.test(output)) {
        cli.write('5\r'); step++;
      } else if (step === 1 && /ADULT tickets/i.test(output)) {
        cli.write('5\r'); step++;
      } else if (step === 2 && /CHILD tickets/i.test(output)) {
        cli.write('0\r'); step++;
      } else if (step === 3 && /INFANT tickets/i.test(output)) {
        cli.write('25\r'); step++;
      } else if (/try again/i.test(output) && step < 10) {
        cli.write('n\r'); step = 10;
      } else if (/Thank you for using DuckFlix/i.test(output)) {

        setTimeout(() => {
          try {
            const cleaned = cleanOutput(output);
            expect(cleaned).toMatch(/only purchase up to 25 tickets/i);
            expect(cleaned).toMatch(/Thank you for using DuckFlix/i);
          } finally {

            teardownCLI(cli, done, timeout);
          }
        }, 100);
      }
    });
  });
}); 


// Helper functions
function cleanOutput(str) {
  let cleaned = str.replace(/\x1b|\u001b/g, '');
  cleaned = cleaned.replace(/\[[0-9;]*m/g, '');
  cleaned = cleaned.replace(/\r\n|\r/g, '\n');
  return cleaned;
}

function spawnCLI() {
  return pty.spawn('node', ['src/cli/cli.js'], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.cwd(),
    env: process.env
  });
}

function teardownCLI(cli, done, timeout) {
  if (timeout) clearTimeout(timeout);
  if (cli) cli.kill();
  done();
}

function setupTimeout(cli, done, ms = 15000) {
  return setTimeout(() => {
    console.error('Test timed out.');
    teardownCLI(cli, done);
  }, ms);
}