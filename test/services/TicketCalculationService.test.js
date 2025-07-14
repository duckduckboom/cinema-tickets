import TicketCalculationService from '../../src/services/TicketCalculationService.js';
import { TICKET_PRICES, ADULT, CHILD, INFANT } from '../../src/pairtest/lib/Constants.js';

describe('TicketCalculationService', () => {
  describe('calculates correct cost for ticket types', () => {
    test('calculates total cost for 1 adult ticket', () => {
      expect(TicketCalculationService.getTotalCost({ ADULT: 1, CHILD: 0, INFANT: 0 })).toBe(TICKET_PRICES.ADULT);
    });
    test('calculates total cost for 1 child ticket', () => {
      expect(TicketCalculationService.getTotalCost({ ADULT: 0, CHILD: 1, INFANT: 0 })).toBe(TICKET_PRICES.CHILD);
    });
    test('calculates total cost for 1 infant ticket', () => {
      expect(TicketCalculationService.getTotalCost({ ADULT: 0, CHILD: 0, INFANT: 1 })).toBe(TICKET_PRICES.INFANT);
    });

    test('calculates total cost for 2 adults, 2 children', () => {
      let expectedCost = (TICKET_PRICES.ADULT * 2) + (TICKET_PRICES.CHILD * 2);
      expect(TicketCalculationService.getTotalCost({ ADULT: 2, CHILD: 2, INFANT:0 })).toBe(expectedCost);
    });

    test('calculates total cost for 2 adults, 2 children', () => {
      let expectedCost = (TICKET_PRICES.ADULT * 2) + (TICKET_PRICES.CHILD * 2);
      expect(TicketCalculationService.getTotalCost({ ADULT: 2, CHILD: 2, INFANT: 0 })).toBe(expectedCost);
    });

    test('calculates total cost for 2 adults, 2 infants', () => {
      let expectedCost = (TICKET_PRICES.ADULT * 2) + (TICKET_PRICES.INFANT * 2);
      expect(TicketCalculationService.getTotalCost({ ADULT: 2, CHILD: 0, INFANT: 2 })).toBe(expectedCost);
    });

    test('calculates total cost for 5 adults, 13 children, 2 infants', () => {
      let expectedCost = (TICKET_PRICES.ADULT * 5) + (TICKET_PRICES.CHILD * 13) + (TICKET_PRICES.INFANT * 2);
      expect(TicketCalculationService.getTotalCost({ ADULT: 5, CHILD: 13, INFANT: 2 })).toBe(expectedCost);
    });
  });

  describe('calculates correct costDetails', () => {
    test('returns cost breakdown by ticket type', () => {
      let expectedCosts = { adult: 0, child: 0, infant: 0 , total: 0 };
      expectedCosts.adult = TICKET_PRICES.ADULT * 2;
      expectedCosts.child = TICKET_PRICES.CHILD * 3;
      expectedCosts.infant = TICKET_PRICES.INFANT * 1;
      expectedCosts.total = expectedCosts.adult + expectedCosts.child + expectedCosts.infant;
      
      const breakdown = TicketCalculationService.calculateCostDetails({ [ADULT]: 2, [CHILD]: 3, [INFANT]: 1 });
      expect(breakdown.adultCost).toBe(expectedCosts.adult);
      expect(breakdown.childCost).toBe(expectedCosts.child);
      expect(breakdown.infantCost).toBe(expectedCosts.infant);
      expect(breakdown.totalCost).toBe(expectedCosts.total);
  });
  });
});