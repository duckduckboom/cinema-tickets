import TicketTypeRequest from '../../../src/pairtest/lib/TicketTypeRequest.js';
import { ADULT, CHILD, INFANT } from '../../../src/pairtest/lib/Constants.js';
import { INVALID_TICKET_TYPE, INVALID_TICKET_UNITS } from '../../../src/pairtest/lib/Errors.js';

describe('TicketTypeRequest', () => {
   describe('creates ticket requests with valid type and count', () => {
      test('creates valid adult ticket request', () => {
      const request = new TicketTypeRequest(ADULT, 5);
      expect(request.getTicketType()).toBe(ADULT);
      expect(request.getNoOfTickets()).toBe(5);
    });

    test('creates valid child ticket request', () => {
      const request = new TicketTypeRequest(CHILD, 5);
      expect(request.getTicketType()).toBe(CHILD);
      expect(request.getNoOfTickets()).toBe(5);
    });

    test('creates valid infant ticket request', () => {
      const request = new TicketTypeRequest(INFANT, 5);
      expect(request.getTicketType()).toBe(INFANT);
      expect(request.getNoOfTickets()).toBe(5);
    });

    test('allows zero tickets', () => {
      const request = new TicketTypeRequest(ADULT, 0);
      expect(request.getTicketType()).toBe(ADULT);
      expect(request.getNoOfTickets()).toBe(0);
    });

    test('allows negative tickets', () => {
      const request = new TicketTypeRequest(ADULT, -2);
      expect(request.getTicketType()).toBe(ADULT);
      expect(request.getNoOfTickets()).toBe(-2);
    });
   });  

   describe('rejects ticket requests with invalid type', () => {
    test('error if ticket type is not ADULT, CHILD, or INFANT', () => {
      expect(() => new TicketTypeRequest('DUCK', 1)).toThrow(new TypeError(INVALID_TICKET_TYPE));
    });

    test('error if ticket type is empty string', () => {
      expect(() => new TicketTypeRequest('', 1)).toThrow(new TypeError(INVALID_TICKET_TYPE));
    });

    test('error if ticket type is null', () => {
      expect(() => new TicketTypeRequest(null, 1)).toThrow(new TypeError(INVALID_TICKET_TYPE));
    });

    test('error if ticket type is undefined', () => {
      expect(() => new TicketTypeRequest(undefined, 1)).toThrow(new TypeError(INVALID_TICKET_TYPE));
    });

    test('error if ticket type is incorrect case', () => {
      expect(() => new TicketTypeRequest('adult', 1)).toThrow(new TypeError(INVALID_TICKET_TYPE));
      expect(() => new TicketTypeRequest('Adult', 1)).toThrow(new TypeError(INVALID_TICKET_TYPE));
    });
   });  

   describe('rejects ticket requests with invalid count', () => { 
      expect(() => new TicketTypeRequest('ADULT', 5.5)).toThrow(new TypeError(INVALID_TICKET_UNITS));
      expect(() => new TicketTypeRequest('ADULT', true)).toThrow(new TypeError(INVALID_TICKET_UNITS));
      expect(() => new TicketTypeRequest('ADULT', false)).toThrow(new TypeError(INVALID_TICKET_UNITS));
      expect(() => new TicketTypeRequest('ADULT', null)).toThrow(new TypeError(INVALID_TICKET_UNITS));
      expect(() => new TicketTypeRequest('ADULT', undefined)).toThrow(new TypeError(INVALID_TICKET_UNITS));
      expect(() => new TicketTypeRequest('ADULT', "5")).toThrow(new TypeError(INVALID_TICKET_UNITS));
      expect(() => new TicketTypeRequest('ADULT', NaN)).toThrow(new TypeError(INVALID_TICKET_UNITS));
   }); 
});