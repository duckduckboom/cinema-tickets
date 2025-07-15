import InvalidPurchaseException from '../pairtest/lib/InvalidPurchaseException.js';
import * as Errors from '../pairtest/lib/Errors.js';
import TicketCalculationService from './TicketCalculationService.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';
import { ADULT, CHILD, INFANT, TICKET_TYPES } from '../pairtest/lib/Constants.js';
import { logger } from '../pairtest/lib/Logger.js';
import { serviceMessages } from '../pairtest/lib/Messages.js';


export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    try {
    this.#validateAccountId(accountId);
    this.#validateTicketTypeRequests(ticketTypeRequests);
    logger.info(serviceMessages.validatedInput(accountId, ticketTypeRequests.map(r => ({type: r.getTicketType(), amount: r.getNoOfTickets()}))));
  
    const ticketAmounts = this.#combineTicketRequests(ticketTypeRequests);

    this.#validateTicketRules(ticketAmounts);

    const { totalCost, totalSeats } = TicketCalculationService.calculateTotals(ticketAmounts);
    const totalTickets = TicketCalculationService.calculateTotalTickets(ticketAmounts);

    this.#handlePayment(accountId, totalCost);
    this.#handleSeatReservation(accountId, totalSeats);

    logger.info(serviceMessages.purchaseSucceeded);
    return { accountId, ticketAmounts, totalCost, totalSeats, totalTickets, success: true };
    } catch (error) {
      logger.error(serviceMessages.errorInPurchase(error));
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
    ticketTypeRequests.forEach(req => {
      if (!this.#isValidTicketType(req.getTicketType())) {
        logger.warn(serviceMessages.invalidTicketType(req.getTicketType()));
        throw new InvalidPurchaseException(Errors.INVALID_TICKET_TYPE(TICKET_TYPES));
      }
      if (!this.#isValidTicketAmount(req.getNoOfTickets())) {
        logger.warn(serviceMessages.invalidTicketAmount(req.getNoOfTickets()));
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
      logger.warn(serviceMessages.zeroTickets);
      throw new InvalidPurchaseException(Errors.EMPTY_TICKET_REQUEST);
    } 
    if (totalTickets > 25) {
      logger.warn(serviceMessages.tooManyTickets(totalTickets));
      throw new InvalidPurchaseException(Errors.TOO_MANY_TICKETS);
    }
  }

  #validateAdultRequired(ticketAmounts) {
    const hasNoAdults = ticketAmounts[ADULT] === 0;
    const hasChildren = ticketAmounts[CHILD] > 0;
    const hasInfants = ticketAmounts[INFANT] > 0;

    if (hasNoAdults && (hasChildren || hasInfants)) {
      logger.warn(serviceMessages.noAdults);
      throw new InvalidPurchaseException(Errors.ADULT_REQUIRED);
    }
  }

  #validateInfantAdultRatio(ticketAmounts) {
    if (ticketAmounts[INFANT] > ticketAmounts[ADULT]) {
      throw new InvalidPurchaseException(Errors.TOO_MANY_INFANTS_TO_ADULTS);
    }
  }

  #handlePayment(accountId, totalCost) {
    try {
      this.#callPaymentService(accountId, totalCost);
    } catch (error) {
      logger.error(serviceMessages.paymentServiceError(error));
      throw new InvalidPurchaseException(
        `Unexpected error during ticket purchase: Payment gateway error: ${error.message}`
      );
    }
  }

  #handleSeatReservation(accountId, totalSeats) {
    try {
      this.#callSeatReservationService(accountId, totalSeats);
    } catch (error) {
      logger.error(serviceMessages.seatReservationServiceError(error));
      throw new InvalidPurchaseException(
        `Unexpected error during ticket purchase: Seat reservation error: ${error.message}`
      );
    }
  }

  #callPaymentService(accountId, totalCost) {
    const paymentService = new TicketPaymentService();
    paymentService.makePayment(accountId, totalCost);
  }

  #callSeatReservationService(accountId, totalSeats) {
    const seatService = new SeatReservationService();
    seatService.reserveSeat(accountId, totalSeats);
  }

  #combineTicketRequests(ticketTypeRequests) {
    const ticketAmounts = { [ADULT]: 0, [CHILD]: 0, [INFANT]: 0 };
    ticketTypeRequests.forEach(req => {
      const ticketType = req.getTicketType();
      const ticketAmount = req.getNoOfTickets();
      ticketAmounts[ticketType] += ticketAmount;
    });
    return ticketAmounts;
  }
}
