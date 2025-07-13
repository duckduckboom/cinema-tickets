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
    test('throws error for decimal number', () => {
      const accountID = 5.5;
      expect(() => ticketService.purchaseTickets(accountID)).toThrow(InvalidPurchaseException);
    });
    test('throws error for string with digits', () => {
      const accountID = "10";
      expect(() => ticketService.purchaseTickets(accountID)).toThrow(InvalidPurchaseException);
    });
    test('throws error for boolean true', () => {
      const accountID = true;
      expect(() => ticketService.purchaseTickets(accountID)).toThrow(InvalidPurchaseException);
    }); 
    test('throws error for boolean false', () => {
      const accountID = false;
      expect(() => ticketService.purchaseTickets(accountID)).toThrow(InvalidPurchaseException);
    });
    test('throws error for null', () => {
      const accountID = null;
      expect(() => ticketService.purchaseTickets(accountID)).toThrow(InvalidPurchaseException);
    });
    test('throws error for undefined', () => {
      const accountID = undefined;
      expect(() => ticketService.purchaseTickets(accountID)).toThrow(InvalidPurchaseException);
    });
  });
});