import InvalidPurchaseException from "../../src/pairtest/lib/InvalidPurchaseException";
import TicketService from "../../src/pairtest/TicketService";

describe('TicketService', () => {
  let ticketService;
  beforeEach(() => {
    ticketService = new TicketService();
  });
  describe('account ID must be a positive integer', () => {
    test('throws error for negative number', () => {
      const accountID = -5;
      expect(() => ticketService.purchaseTickets(accountID)).toThrow(InvalidPurchaseException);
    });
  });
});