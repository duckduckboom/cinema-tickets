import readline from 'readline';
import TicketService from '../services/TicketService.js';
import TicketTypeRequest from '../pairtest/lib/TicketTypeRequest.js';
import InvalidPurchaseException from '../pairtest/lib/InvalidPurchaseException.js';
import { ADULT, CHILD, INFANT } from '../pairtest/lib/Constants.js';
import { cliMessages } from './cliMessages.js';
import { logger } from '../pairtest/lib/Logger.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function promptUser(question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer)));
}

async function promptForBookingDetails() {
  console.log(cliMessages.bookTicketsHeading);
  const accountId = await getValidUserInput(cliMessages.prompts.accountId);
  const adultAmount = await getValidUserInput(cliMessages.prompts.adultAmount);
  const childAmount = await getValidUserInput(cliMessages.prompts.childAmount);
  const infantAmount = await getValidUserInput(cliMessages.prompts.infantAmount);
  return { accountId, adultAmount, childAmount, infantAmount };
}

async function getValidUserInput(question) {
  while (true) {
    const answer = await promptUser(question);
    const num = Number(answer);
    if (Number.isInteger(num) && num >= 0) {
      return num;
    }
    logger.warn(`${cliMessages.logger.invalidInput}: "${answer}"`)
    console.log(cliMessages.prompts.invalidNumber);
  }
}

function combineTicketRequests({ adultAmount, childAmount, infantAmount }) {
  return [
    new TicketTypeRequest(ADULT, adultAmount),
    new TicketTypeRequest(CHILD, childAmount),
    new TicketTypeRequest(INFANT, infantAmount)
  ];
}

function displayResult(result) {
  const { ticketAmounts, totalCost, totalSeats, totalTickets } = result;
  const formatCurrency = (amount) => `£${amount.toFixed(2)}`;
  logger.info(`${cliMessages.logger.bookingSucceeded}: ${JSON.stringify(result)}`)
  console.log(cliMessages.summary.successHeading);
  console.log(cliMessages.summary.divider);
  console.log(`${cliMessages.summary.adult}${ticketAmounts.ADULT}`);
  console.log(`${cliMessages.summary.child}${ticketAmounts.CHILD}`);
  console.log(`${cliMessages.summary.infant}${ticketAmounts.INFANT}`);
  console.log(`${cliMessages.summary.totalTickets} ${totalTickets}`);
  console.log(`${cliMessages.summary.totalSeats} ${totalSeats}`);
  console.log(`${cliMessages.summary.totalCost} ${formatCurrency(totalCost)}`);
  console.log(cliMessages.summary.divider);
}

function displayError(error) {
  if (error instanceof InvalidPurchaseException) {
    logger.error(`${cliMessages.logger.bookingFailed}: ${error.message}`)
    console.error(`${cliMessages.errors.bookingFailed} ${error.message}`);
  } else {
    logger.error(`${cliMessages.logger.unexpectedError}: ${error}`)
    console.error(`${cliMessages.errors.unexpected} ${error}`);
  }
}

async function askToRetry() {
  const answer = await promptUser(cliMessages.prompts.retry);
  const retry = answer.trim().toLowerCase().startsWith('y');
  if (retry) {
    logger.info(cliMessages.logger.userRetry);
  } else {
    logger.info(cliMessages.logger.userNoRetry);
  }
  return retry;
}

async function makeBooking() {
  try {
    const userInput = await promptForBookingDetails();
    const requests = combineTicketRequests(userInput);
    const ticketService = new TicketService();
    const result = ticketService.purchaseTickets(userInput.accountId, ...requests);
    displayResult(result);
    return true;
  } catch (error) {
    displayError(error);
    return false;
  }
}

async function main() {
  console.clear();
  logger.info(cliMessages.logger.cliStarted);
  console.log(cliMessages.welcome);
  let bookingComplete = false;
  let wantsToRetry = true;

  while (!bookingComplete && wantsToRetry) {
    bookingComplete = await makeBooking();
    if (!bookingComplete) {
      wantsToRetry = await askToRetry();
    }
  } 
  logger.info(cliMessages.logger.cliExited);
  console.log(cliMessages.goodbye);
  rl.close();
}

main(); 