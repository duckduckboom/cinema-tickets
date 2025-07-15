import { describe, jest } from '@jest/globals';
let TicketService;
let TicketTypeRequest;
import * as Errors from '../../src/pairtest/lib/Errors.js';
let InvalidPurchaseException;
let ADULT, CHILD, INFANT, TICKET_TYPES;
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
    TICKET_TYPES = constants.TICKET_TYPES;
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

     test('should error if payment service fail due to accountID', () => {
      const accountId = 1;
      mockPaymentService.makePayment.mockImplementation(() => {
        throw new TypeError('accountId must be an integer');
      });
      expect(() =>
        ticketService.purchaseTickets(accountId, new TicketTypeRequest(ADULT, 1))
      ).toThrow('Unexpected error during ticket purchase: Payment gateway error: accountId must be an integer');
    });

    test('should error if payment service fails due to payment total', () => {
      const accountId = 1;
      mockPaymentService.makePayment.mockImplementation(() => {
        throw new TypeError('totalAmountToPay must be an integer');
      });
      expect(() =>
        ticketService.purchaseTickets(accountId, new TicketTypeRequest(ADULT, 1))
      ).toThrow('Unexpected error during ticket purchase: Payment gateway error: totalAmountToPay must be an integer');
    });

    test('should throw InvalidPurchaseException if seat reservation fails with accountId TypeError', () => {
      const accountId = 1;
      mockSeatService.reserveSeat.mockImplementation(() => {
        throw new TypeError('accountId must be an integer');
      });

      expect(() =>
        ticketService.purchaseTickets(accountId, new TicketTypeRequest(ADULT, 1))
      ).toThrow('Unexpected error during ticket purchase: Seat reservation error: accountId must be an integer');
    });

    test('should throw InvalidPurchaseException if seat reservation fails', () => {
      const accountId = 1;
      mockSeatService.reserveSeat.mockImplementation(() => {
        throw new TypeError('totalSeatsToAllocate must be an integer');
      });

      expect(() =>
        ticketService.purchaseTickets(accountId, new TicketTypeRequest(ADULT, 1))
      ).toThrow('Unexpected error during ticket purchase: Seat reservation error: totalSeatsToAllocate must be an integer');
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
        expect(() => ticketService.purchaseTickets(accountID)).toThrow(Errors.INVALID_ACCOUNT_ID);
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

    describe('Ticket Types and Amounts must be valid', () => {
      test('should error if invalid ticket type', () => {
        const requests = [new TicketTypeRequest('DUCK', 5)];
        expect(() => ticketService.purchaseTickets(1, ...requests)).toThrow(
          Errors.INVALID_TICKET_TYPE(TICKET_TYPES)
        );
      });
      test('should error if non-integer ticket units', () => {
        const requests = [new TicketTypeRequest(ADULT, 'DUCK')];
        expect(() => ticketService.purchaseTickets(1, ...requests)).toThrow(Errors.INVALID_TICKET_UNITS);
      });
      test('should error if decimal ticket units', () => {
        const requests = [new TicketTypeRequest(ADULT, 2.5)];
        expect(() => ticketService.purchaseTickets(1, ...requests)).toThrow(Errors.INVALID_TICKET_UNITS);
      });
      test('should error if negative ticket units', () => {
        const requests = [new TicketTypeRequest(ADULT, -1)];
        expect(() => ticketService.purchaseTickets(1, ...requests)).toThrow(Errors.INVALID_TICKET_UNITS);
      });
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
        expect(() => ticketService.purchaseTickets(accountId, ...requests)).toThrow(Errors.TOO_MANY_TICKETS);
      });

      test('should not allow booking with no adults', () => {
        const requests = [new TicketTypeRequest(CHILD, 5), new TicketTypeRequest(INFANT, 2)];
        expect(() => ticketService.purchaseTickets(accountId, ...requests)).toThrow(Errors.ADULT_REQUIRED);
      });

      // should be 1:1 infant to adults, as an infant needs to sit on adult lap
      test('should not allow more infants than adults', () => {
        const requests = [new TicketTypeRequest(ADULT, 1), new TicketTypeRequest(INFANT, 2)];
        expect(() => ticketService.purchaseTickets(accountId, ...requests)).toThrow(Errors.TOO_MANY_INFANTS_TO_ADULTS);
      });

      test('should not allow booking with infants and no adults', () => {
        const requests = [new TicketTypeRequest(INFANT, 5)];
        expect(() => ticketService.purchaseTickets(accountId, ...requests)).toThrow(Errors.ADULT_REQUIRED);
      });

      test('should not allow booking with children and no adults', () => {
        const requests = [new TicketTypeRequest(CHILD, 5)];
        expect(() => ticketService.purchaseTickets(accountId, ...requests)).toThrow(Errors.ADULT_REQUIRED);
      });
      test('should not allow booking with zero tickets', () => {
        const requests = [];
        expect(() => ticketService.purchaseTickets(accountId, ...requests)).toThrow(Errors.EMPTY_TICKET_REQUEST);
      });
    });
  });
});