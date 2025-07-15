import TicketTypeRequest from '../../../src/pairtest/lib/TicketTypeRequest.js';
import { ADULT, CHILD, INFANT } from '../../../src/pairtest/lib/Constants.js';
describe('TicketTypeRequest', () => {
   describe('creates ticket requests with any type and count', () => {
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

    test('allows ticket type not ADULT, CHILD, or INFANT', () => {
      const request = new TicketTypeRequest('Duck', -2);
      expect(request.getTicketType()).toBe('Duck');
      expect(request.getNoOfTickets()).toBe(-2);
    });
   });  
});