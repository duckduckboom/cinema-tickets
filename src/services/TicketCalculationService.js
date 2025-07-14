import { TICKET_PRICES } from '../pairtest/lib/Constants.js';


export default class TicketCalculationService {
  static TICKET_PRICES = TICKET_PRICES;


  static calculateTotals(ticketAmounts) {
    const totals = { totalCost: 0, totalSeats: 0};
    totals.totalCost = this.getTotalCost(ticketAmounts),
    totals.totalSeats = this.calculateSeatsNeeded(ticketAmounts)
    return totals;
  }

  static getTotalCost(ticketAmounts) {
    const costDetails = this.calculateCostDetails(ticketAmounts);
    return costDetails.totalCost;
  }

  static calculateCostDetails(ticketAmounts) {
    const { ADULT: adultAmount, CHILD: childAmount, INFANT: infantAmount } = ticketAmounts;
    const adultCost = adultAmount * TICKET_PRICES.ADULT;
    const childCost = childAmount * TICKET_PRICES.CHILD;
    const infantCost = infantAmount * TICKET_PRICES.INFANT;
    const totalCost = adultCost + childCost + infantCost;
    return { adultCost, childCost, infantCost, totalCost };
  }

  static calculateSeatsNeeded(ticketAmounts) {
    const { ADULT = 0, CHILD = 0 } = ticketAmounts;
    return ADULT + CHILD;
  }

  static calculateTotalTickets(ticketCounts) {
    const { ADULT = 0, CHILD = 0, INFANT = 0 } = ticketCounts;
    return ADULT + CHILD + INFANT;
  }
}