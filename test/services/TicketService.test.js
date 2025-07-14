import { jest } from '@jest/globals';
let TicketService
let TicketTypeRequest
let InvalidPurchaseException;
let ADULT, CHILD, INFANT;
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
  });

  beforeEach(() => {
    ticketService = new TicketService();
    mockPaymentService = { makePayment: jest.fn() };
    mockSeatService = { reserveSeat: jest.fn() };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('valid ticket purchase requests', () => {
    test('calls mockPaymentService when booking is successful', () => {
      const accountId = 1;
      ticketService.purchaseTickets(accountId, new TicketTypeRequest(ADULT, 1));
      expect(mockPaymentService.makePayment).toHaveBeenCalledWith(accountId, 25);
    });

    test('calls mockSeatService when booking is successful', () => {
      const accountId = 2;
      ticketService.purchaseTickets(accountId, new TicketTypeRequest(ADULT, 2));
      expect(mockSeatService.reserveSeat).toHaveBeenCalledWith(accountId, 2);
    });
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

   describe('Input validation', () => {
    
  });

  describe('Business Logic', () => {

  });
});