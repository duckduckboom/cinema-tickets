/**
 * Immutable Object.
 */

export default class TicketTypeRequest {
  // All input validation is done in the ticketService

  constructor(type, noOfTickets) {
    this.type = type;
    this.noOfTickets = noOfTickets;
  }
  getNoOfTickets() {
    return this.noOfTickets;
  }
  getTicketType() {
    return this.type;
  }
}
