import * as Errors from '../../../src/pairtest/lib/Errors.js';
import { serviceMessages } from '../../../src/pairtest/lib/Messages.js';
import { cliMessages } from '../../../src/cli/cliMessages.js';

describe('Error messages and helpers', () => {
 it('should generate a correct INVALID_TICKET_TYPE message for a list of types', () => {
    const types = ['ADULT', 'CHILD', 'INFANT'];
    expect(Errors.INVALID_TICKET_TYPE(types)).toBe('type must be ADULT, CHILD, or INFANT');
  });
});

describe('Service message templates', () => {
  it('should format validatedInput', () => {
    const summary = [{ type: 'ADULT', amount: 2 }];
    const message = serviceMessages.validatedInput(1, summary);
    expect(message).toMatch(/TicketService: Validated accountId/);
  });

  it('should format errorInPurchase with error included', () => {
    expect(serviceMessages.errorInPurchase('something went QUACK')).toMatch(/something went QUACK/);
  });

  it('should format invalidAccountId with accountId', () => {
    expect(serviceMessages.invalidAccountId(42)).toMatch(/42/);
  });

  it('should format invalidTicketType and invalidTicketAmount with the relevant value', () => {
    expect(serviceMessages.invalidTicketType('DUCK')).toMatch(/DUCK/);
    expect(serviceMessages.invalidTicketAmount(99)).toMatch(/99/);
  });

  it('should format tooManyTickets with ticket count', () => {
    expect(serviceMessages.tooManyTickets(30)).toMatch(/30/);
  });

  it('should format payment and seat reservation errors with the error', () => {
    expect(serviceMessages.paymentServiceError('fail')).toMatch(/fail/);
    expect(serviceMessages.seatReservationServiceError('fail')).toMatch(/fail/);
  });

  it('should format global error messages with the reason or error', () => {
    expect(serviceMessages.globalUnhandledRejection('Duck')).toMatch(/Duck/);
    expect(serviceMessages.globalUncaughtException('QUACK')).toMatch(/QUACK/);
  });
});

describe('CLI messages structure', () => {
  it('should have all the relevant sections', () => {
    expect(cliMessages).toHaveProperty('welcome');
    expect(cliMessages).toHaveProperty('goodbye');
    expect(cliMessages).toHaveProperty('bookTicketsHeading');
    expect(cliMessages).toHaveProperty('prompts');
    expect(cliMessages).toHaveProperty('summary');
    expect(cliMessages).toHaveProperty('errors');
    expect(cliMessages).toHaveProperty('logger');
  });
});
