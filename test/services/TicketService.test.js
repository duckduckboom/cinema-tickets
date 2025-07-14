import { describe, jest } from '@jest/globals';
let TicketService;
let TicketTypeRequest;
import { INVALID_ACCOUNT_ID, EMPTY_TICKET_REQUEST, TOO_MANY_TICKETS, ADULT_REQUIRED, TOO_MANY_INFANTS_TO_ADULTS } from '../../src/pairtest/lib/Errors.js';
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
    });
  });

  describe('Input validation', () => {
    describe('Account ID must be a positive integer', () => {
      test('should accept positive integer', () => {
        const validAccountId = 5;
        const validTicketBooking = new TicketTypeRequest(ADULT, 1);
        expect(() => ticketService.purchaseTickets(validAccountId, validTicketBooking)).not.toThrow(InvalidPurchaseException);
      });
      test ('should present message about invalid account ID', () => {
        const accountID = 'DUCK';
        expect(() => ticketService.purchaseTickets(accountID)).toThrow(INVALID_ACCOUNT_ID);
      });
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

    test('should throw if not given TicketTypeRequest instances', () => {
      expect(() => ticketService.purchaseTickets(5, {})).toThrow();
      expect(() => ticketService.purchaseTickets(5, "not a ticket")).toThrow();
      expect(() => ticketService.purchaseTickets(5, 123)).toThrow();
    });
  });

  describe('Business Logic', () => {
    describe('Valid bookings', () => {
      test('should allow exactly 25 tickets', () => {
        const accountId = 5;
        const adultAmount = 10;
        const childAmount = 10;
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
          totalCost,
          totalSeats: seatsNeeded,
          success: true
        });
      });

      test('should allow booking with equal adults and infants', () => {
        const accountId = 5;
        const adultAmount = 5;
        const childAmount = 0;
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
          totalCost,
          totalSeats: seatsNeeded,
          success: true
        });
      });

      test('should allow booking with adults and children', () => {
        const accountId = 5;
        const adultAmount = 2;
        const childAmount = 3;
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
          totalCost,
          totalSeats: seatsNeeded,
          success: true
        });
      });
    });

    describe('Invalid bookings', () => {
       const accountId = 5;
      test('should not allow booking more than 25 tickets', () => {
        const requests = [new TicketTypeRequest(ADULT, 20), new TicketTypeRequest(CHILD, 6)];
        expect(() => ticketService.purchaseTickets(accountId, ...requests)).toThrow(TOO_MANY_TICKETS);
      });

      test('should not allow booking with no adults', () => {
        const requests = [new TicketTypeRequest(CHILD, 5), new TicketTypeRequest(INFANT, 2)];
        expect(() => ticketService.purchaseTickets(accountId, ...requests)).toThrow(ADULT_REQUIRED);
      });

      // should be 1:1 infant to adults, as an infant needs to sit on adult lap
      test('should not allow more infants than adults', () => {
        const requests = [new TicketTypeRequest(ADULT, 1), new TicketTypeRequest(INFANT, 2)];
        expect(() => ticketService.purchaseTickets(accountId, ...requests)).toThrow(TOO_MANY_INFANTS_TO_ADULTS);
      });

      test('should not allow booking with infants and no adults', () => {
        const requests = [new TicketTypeRequest(INFANT, 5)];
        expect(() => ticketService.purchaseTickets(accountId, ...requests)).toThrow(ADULT_REQUIRED);
      });

      test('should not allow booking with children and no adults', () => {
        const requests = [new TicketTypeRequest(CHILD, 5)];
        expect(() => ticketService.purchaseTickets(accountId, ...requests)).toThrow(ADULT_REQUIRED);
      });
      test('should not allow booking with zero tickets', () => {
        const requests = [];
        expect(() => ticketService.purchaseTickets(accountId, ...requests)).toThrow(EMPTY_TICKET_REQUEST);
      });
    });

   

  });
});