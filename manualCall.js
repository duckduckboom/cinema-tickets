import TicketService from './src/services/TicketService.js';
import TicketTypeRequest from './src/pairtest/lib/TicketTypeRequest.js';
import { ADULT, CHILD, INFANT } from './src/pairtest/lib/Constants.js';

const ticketService = new TicketService();

const accountId = 5;
const requests = [
  new TicketTypeRequest(ADULT, 15),
  new TicketTypeRequest(ADULT, 15),
  new TicketTypeRequest(INFANT, 0)
];

console.log('Testing TicketService with:');
console.log(`  Account ID: ${accountId}`);
console.log('  Ticket requests:');
requests.forEach(req => {
  console.log(`    - ${req.getNoOfTickets()} x ${req.getTicketType()}`);
});

try {
  const result = ticketService.purchaseTickets(accountId, ...requests);
  console.log('\nBooking succeeded!');
  console.log(result);
} catch (err) {
  console.log('\nBooking failed:');
  console.log(err.message);
}