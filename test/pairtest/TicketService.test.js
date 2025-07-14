import InvalidPurchaseException from "../../src/pairtest/lib/InvalidPurchaseException.js";
import TicketService from "../../src/pairtest/TicketService";

describe('TicketService', () => {
  let ticketService;
  
  beforeEach(() => {
    ticketService = new TicketService();
  });

  describe('account ID must be a positive integer', () => {
    test('error if negative number', () => {
      const accountID = -5;
      expect(() => ticketService.purchaseTickets(accountID)).toThrow(InvalidPurchaseException);
    });
    test('error if decimal number', () => {
      const accountID = 5.5;
      expect(() => ticketService.purchaseTickets(accountID)).toThrow(InvalidPurchaseException);
    });
    test('error if string with digits', () => {
      const accountID = "10";
      expect(() => ticketService.purchaseTickets(accountID)).toThrow(InvalidPurchaseException);
    });
    test('error if boolean true', () => {
      const accountID = true;
      expect(() => ticketService.purchaseTickets(accountID)).toThrow(InvalidPurchaseException);
    }); 
    test('error if boolean false', () => {
      const accountID = false;
      expect(() => ticketService.purchaseTickets(accountID)).toThrow(InvalidPurchaseException);
    });
    test('error if null', () => {
      const accountID = null;
      expect(() => ticketService.purchaseTickets(accountID)).toThrow(InvalidPurchaseException);
    });
    test('error if undefined', () => {
      const accountID = undefined;
      expect(() => ticketService.purchaseTickets(accountID)).toThrow(InvalidPurchaseException);
    });
  });
});