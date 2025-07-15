import InvalidPurchaseException from '../pairtest/lib/InvalidPurchaseException.js';
import * as Errors from '../pairtest/lib/Errors.js';
import TicketCalculationService from './TicketCalculationService.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';
import { ADULT, CHILD, INFANT, TICKET_TYPES } from '../pairtest/lib/Constants.js';


export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    try {
    this.#validateAccountId(accountId);
    this.#validateTicketTypeRequests(ticketTypeRequests);
  
    const ticketAmounts = { [ADULT]: 0, [CHILD]: 0, [INFANT]: 0 };
    ticketTypeRequests.forEach(req => {
      const ticketType = req.getTicketType();
      const ticketAmount = req.getNoOfTickets();
      ticketAmounts[ticketType] += ticketAmount;
    });

    this.#validateTicketRules(ticketAmounts);

    const { totalCost, totalSeats } = TicketCalculationService.calculateTotals(ticketAmounts);

    this.#processPayment(accountId, totalCost);
    this.#reserveSeats(accountId, totalSeats);

    return { accountId, ticketAmounts, totalCost, totalSeats, success: true };
    } catch (error) {
      if (error instanceof InvalidPurchaseException) {
        throw error;
      } 
      throw new InvalidPurchaseException(`Unexpected error during ticket purchase: ${error.message}`);
    }
  }

  // Private methods
  #validateAccountId(accountId) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException(Errors.INVALID_ACCOUNT_ID);
    }
  }

  #validateTicketTypeRequests(ticketTypeRequests) {
    if (this.#isInvalidArray(ticketTypeRequests)) {
      throw new InvalidPurchaseException(Errors.EMPTY_TICKET_REQUEST);
    }
    ticketTypeRequests.forEach(req => {
      if (!this.#isValidTicketType(req.getTicketType())) {
        throw new InvalidPurchaseException(Errors.INVALID_TICKET_TYPE(TICKET_TYPES));
      }
      if (!this.#isValidTicketAmount(req.getNoOfTickets())) {
        throw new InvalidPurchaseException(Errors.INVALID_TICKET_UNITS);
      }
    });
  }

  #isValidTicketType(type) {
    return [ADULT, CHILD, INFANT].includes(type);
  }

  #isValidTicketAmount(amount) {
    return Number.isInteger(amount) && amount >= 0;
  }

  #validateTicketRules(ticketAmounts) {
    this.#validateWithinTicketLimits(ticketAmounts);
    this.#validateAdultRequired(ticketAmounts);
    this.#validateInfantAdultRatio(ticketAmounts);
  }

  #validateWithinTicketLimits(ticketAmounts) {
    const totalTickets = TicketCalculationService.calculateTotalTickets(ticketAmounts);
    if (totalTickets === 0) {
      throw new InvalidPurchaseException(Errors.EMPTY_TICKET_REQUEST);
    } 
    if (totalTickets > 25) {
      throw new InvalidPurchaseException(Errors.TOO_MANY_TICKETS);
    }
  }

  #validateAdultRequired(ticketAmounts) {
    const hasNoAdults = ticketAmounts[ADULT] === 0;
    const hasChildren = ticketAmounts[CHILD] > 0;
    const hasInfants = ticketAmounts[INFANT] > 0;

    if (hasNoAdults && (hasChildren || hasInfants)) {
      throw new InvalidPurchaseException(Errors.ADULT_REQUIRED);
    }
  }

  #validateInfantAdultRatio(ticketAmounts) {
    if (ticketAmounts[INFANT] > ticketAmounts[ADULT]) {
      throw new InvalidPurchaseException(Errors.TOO_MANY_INFANTS_TO_ADULTS);
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

  #isInvalidArray(arr) {
    return !Array.isArray(arr) || arr.length === 0;
  }
}
