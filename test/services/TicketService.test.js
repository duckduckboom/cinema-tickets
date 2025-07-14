import { jest } from '@jest/globals';
let TicketService
let TicketTypeRequest
let InvalidPurchaseException;
let ADULT, CHILD, INFANT;
let ADULT_PRICE, CHILD_PRICE, INFANT_PRICE;
let mockPaymentService, mockSeatService;

jest.unstable_mockModule('../../src/thirdparty/paymentgateway/TicketPaymentService.js', () => ({
  default: jest.fn().mockImplementation(() => mockPaymentService)
}));
jest.unstable_mockModule('../../src/thirdparty/seatbooking/SeatReservationService.js', () => ({
  default: jest.fn().mockImplementation(() => mockSeatService)
}));

describe('TicketService', () => {
  let ticketService;

  beforeAll(async () => {
    ({ default: TicketService } = await import('../../src/services/TicketService.js'));
    ({ default: TicketTypeRequest } = await import('../../src/pairtest/lib/TicketTypeRequest.js'));
    ({ default: InvalidPurchaseException } = await import('../../src/pairtest/lib/InvalidPurchaseException.js'));
    const constants = await import('../../src/pairtest/lib/Constants.js');
    ADULT = constants.ADULT;
    CHILD = constants.CHILD;
    INFANT = constants.INFANT;
    ADULT_PRICE = constants.TICKET_PRICES.ADULT;
    CHILD_PRICE = constants.TICKET_PRICES.CHILD;
    INFANT_PRICE = constants.TICKET_PRICES.INFANT;
  });

  beforeEach(() => {
    ticketService = new TicketService();
    mockPaymentService = { makePayment: jest.fn() };
    mockSeatService = { reserveSeat: jest.fn() };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Given a valid ticket purchase request', () => {
    test('should call mockPaymentService', () => {
      const accountId = 1;
      ticketService.purchaseTickets(accountId, new TicketTypeRequest(ADULT, 1));
      expect(mockPaymentService.makePayment).toHaveBeenCalledWith(accountId, 25);
    });

    test('should call mockSeatService', () => {
      const accountId = 2;
      ticketService.purchaseTickets(accountId, new TicketTypeRequest(ADULT, 2));
      expect(mockSeatService.reserveSeat).toHaveBeenCalledWith(accountId, 2);
    });

    test('should allow booking with 5 adults, 5 children, and 5 infant', () => {
      const accountId = 5;
      const adultAmount = 5;
      const childAmount = 5;
      const infantAmount = 5;
      const seatsNeeded = adultAmount + childAmount;
      const totalCost = (ADULT_PRICE * adultAmount) + (CHILD_PRICE * childAmount) + (INFANT_PRICE * infantAmount);
      
      const result = ticketService.purchaseTickets(
        accountId,
        new TicketTypeRequest(ADULT, adultAmount),
        new TicketTypeRequest(CHILD, childAmount),
        new TicketTypeRequest(INFANT, infantAmount)
      );

      expect(result).toEqual({
        accountId,
        ticketAmounts: { [ADULT]: adultAmount, [CHILD]: childAmount, [INFANT]: infantAmount },
        totalCost: totalCost,
        totalSeats: seatsNeeded,
        success: true
      });
    
      expect(mockPaymentService.makePayment).toHaveBeenCalledWith(accountId, totalCost);
      expect(mockSeatService.reserveSeat).toHaveBeenCalledWith(accountId, seatsNeeded);
    });

    test('should allow booking with zero children and infants', () => {
      const accountId = 5;
      const adultAmount = 5;
      const childAmount = 0;
      const infantAmount = 0;
      const seatsNeeded = adultAmount + childAmount;
      const totalCost = (ADULT_PRICE * adultAmount) + (CHILD_PRICE * childAmount) + (INFANT_PRICE * infantAmount);
      
      const result = ticketService.purchaseTickets(
        accountId,
        new TicketTypeRequest(ADULT, adultAmount),
        new TicketTypeRequest(CHILD, childAmount),
        new TicketTypeRequest(INFANT, infantAmount)
      );

      expect(result).toEqual({
        accountId,
        ticketAmounts: { [ADULT]: adultAmount, [CHILD]: childAmount, [INFANT]: infantAmount },
        totalCost: totalCost,
        totalSeats: seatsNeeded,
        success: true
      });
    
      expect(mockPaymentService.makePayment).toHaveBeenCalledWith(accountId, totalCost);
      expect(mockSeatService.reserveSeat).toHaveBeenCalledWith(accountId, seatsNeeded);
    });


  });

  describe('Account ID must be a positive integer', () => {
    test('should error if negative number', () => {
      const accountID = -5;
      expect(() => ticketService.purchaseTickets(accountID)).toThrow(InvalidPurchaseException);
    });
    test('should error if decimal number', () => {
      const accountID = 5.5;
      expect(() => ticketService.purchaseTickets(accountID)).toThrow(InvalidPurchaseException);
    });
    test('should error if string with digits', () => {
      const accountID = "10";
      expect(() => ticketService.purchaseTickets(accountID)).toThrow(InvalidPurchaseException);
    });
    test('should error if boolean true', () => {
      const accountID = true;
      expect(() => ticketService.purchaseTickets(accountID)).toThrow(InvalidPurchaseException);
    }); 
    test('should error if boolean false', () => {
      const accountID = false;
      expect(() => ticketService.purchaseTickets(accountID)).toThrow(InvalidPurchaseException);
    });
    test('should error if null', () => {
      const accountID = null;
      expect(() => ticketService.purchaseTickets(accountID)).toThrow(InvalidPurchaseException);
    });
    test('should error if undefined', () => {
      const accountID = undefined;
      expect(() => ticketService.purchaseTickets(accountID)).toThrow(InvalidPurchaseException);
    });
  });

   describe('Input validation', () => {
    
  });

  describe('Business Logic', () => {

  });
});