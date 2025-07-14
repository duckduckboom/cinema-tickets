import { TICKET_PRICES, CURRENCY_DECIMAL_PLACES } from '../pairtest/lib/Constants.js';


export default class TicketingCalculationService {
  static TICKET_PRICES = TICKET_PRICES;


  static getTotalCost(ticketCounts) {
    const costBreakdown = this.calculateCostDetails(ticketCounts);
    return costBreakdown.totalCost;
  }

  static calculateCostDetails(ticketCounts) {
    const { ADULT: adultCount, CHILD: childCount, INFANT: infantCount } = ticketCounts;
    const adultCost = this.#formatCurrency(adultCount * TICKET_PRICES.ADULT);
    const childCost = this.#formatCurrency(childCount * TICKET_PRICES.CHILD);
    const infantCost = this.#formatCurrency(infantCount * TICKET_PRICES.INFANT);
    const totalCost = this.#formatCurrency(adultCost + childCost + infantCost);
    return { adultCost, childCost, infantCost, totalCost };
  }

  static #formatCurrency(amount) {
    const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
    return Number(safeAmount.toFixed(CURRENCY_DECIMAL_PLACES));
  }
}