import InvalidPurchaseException from '../pairtest/lib/InvalidPurchaseException.js';
import { INVALID_ACCOUNT_ID } from '../pairtest/lib/Errors.js';
import TicketCalculationService from './TicketCalculationService.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';
import { ADULT, CHILD, INFANT } from '../pairtest/lib/Constants.js';


export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    try {
    this.#validateAccountId(accountId);
  
    const ticketAmounts = { [ADULT]: 0, [CHILD]: 0, [INFANT]: 0 };

    ticketTypeRequests.forEach(req => {
      const ticketType = req.getTicketType();
      const ticketAmount = req.getNoOfTickets();
      ticketAmounts[ticketType] += ticketAmount;
    });

    const { totalCost, totalSeats } = TicketCalculationService.calculateTotals(ticketAmounts);

    this.#processPayment(accountId, totalCost);
    this.#reserveSeats(accountId, totalSeats);

    return { accountId, ticketAmounts, totalCost, totalSeats, success: true };
    } catch (error) {
      if (error instanceof InvalidPurchaseException) {
        throw new InvalidPurchaseException(INVALID_ACCOUNT_ID);
      }
    }g
  }

  // Private methods
  #validateAccountId(accountId) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException(INVALID_ACCOUNT_ID);
    }
  }

  #processPayment(accountId, totalCost) {
    const paymentService = new TicketPaymentService();
    paymentService.makePayment(accountId, totalCost);
  }

  #reserveSeats(accountId, totalSeats) {
    const seatService = new SeatReservationService();
    seatService.reserveSeat(accountId, totalSeats);
  }

}
