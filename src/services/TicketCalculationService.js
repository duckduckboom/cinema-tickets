import { TICKET_PRICES } from '../pairtest/lib/Constants.js';


export default class TicketingCalculationService {
  static TICKET_PRICES = TICKET_PRICES;

  static getTotalCost(ticketCounts) {
    const costDetails = this.calculateCostDetails(ticketCounts);
    return costDetails.totalCost;
  }

  static calculateCostDetails(ticketCounts) {
    const { ADULT: adultCount, CHILD: childCount, INFANT: infantCount } = ticketCounts;
    const adultCost = adultCount * TICKET_PRICES.ADULT;
    const childCost = childCount * TICKET_PRICES.CHILD;
    const infantCost = infantCount * TICKET_PRICES.INFANT;
    const totalCost = adultCost + childCost + infantCost;
    return { adultCost, childCost, infantCost, totalCost };
  }

  static calculateSeatsNeeded(ticketCounts) {
    const { ADULT = 0, CHILD = 0 } = ticketCounts;
    return ADULT + CHILD;
  }
}