import readline from 'readline';
import TicketService from '../services/TicketService.js';
import TicketTypeRequest from '../pairtest/lib/TicketTypeRequest.js';
import InvalidPurchaseException from '../pairtest/lib/InvalidPurchaseException.js';
import { ADULT, CHILD, INFANT } from '../pairtest/lib/Constants.js';


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function promptUser(question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer)));
}

async function promptForBookingDetails() {
  console.log('\nLet\'s book your tickets!\n');
  const accountId = await getValidUserInput('👤 Please enter your account ID: ');
  const adultAmount = await getValidUserInput('How many ADULT tickets would you like? ');
  const childAmount = await getValidUserInput('How many CHILD tickets would you like? ');
  const infantAmount = await getValidUserInput('How many INFANT tickets would you like? ');
  return { accountId, adultAmount, childAmount, infantAmount };
}

async function getValidUserInput(question) {
  while (true) {
    const answer = await promptUser(question);
    const num = Number(answer);
    if (Number.isInteger(num) && num >= 0) {
      return num;
    }
    console.log("Please enter a valid whole number that's greater than 0.");
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
  console.log('\n🥳🎬 Booking succeeded! 🎬🥳');
  console.log('------------------');
  console.log(`Adult tickets: ${ticketAmounts.ADULT}`);
  console.log(`Child tickets: ${ticketAmounts.CHILD}`);
  console.log(`Infant tickets: ${ticketAmounts.INFANT}`);
  console.log('\n🎟️ Total tickets:', totalTickets);
  console.log('💺 Total seats:', totalSeats);
    console.log('💰 Total cost:', formatCurrency(totalCost));
  console.log('----------------------');
}

function displayError(error) {
  if (error instanceof InvalidPurchaseException) {
    console.error('\n🚨 Booking failed:', error.message, '🚨');
  } else {
    console.error('\n🚨 Unexpected error:', error, '🚨');
  }
}

async function askToRetry() {
  const answer = await promptUser('Would you like to try again? (y/n): ');
  return answer.trim().toLowerCase().startsWith('y');
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
  console.log('🦆  Welcome to DuckFlix! 🦆');
  let bookingComplete = false;
  let wantsToRetry = true;

  while (!bookingComplete && wantsToRetry) {
    bookingComplete = await makeBooking();
    if (!bookingComplete) {
      wantsToRetry = await askToRetry();
    }
  } 
  console.log('\nThank you for using DuckFlix! 🍿');
  rl.close();
}

main(); 