import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import { INVALID_ACCOUNT_ID } from './lib/Errors.js';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException
    try {
      this.#validateAccountId(accountId);
      return accountId;
    } catch (error) {
      throw error;
    }

  }

  // Private methods
  #validateAccountId(accountId) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException(INVALID_ACCOUNT_ID);
    }
  }

}
