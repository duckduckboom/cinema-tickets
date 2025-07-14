/**
 * Immutable Object.
 */

import { ADULT, CHILD, INFANT } from './Constants.js';
import { INVALID_TICKET_TYPE, INVALID_TICKET_UNITS } from './Errors.js';

export default class TicketTypeRequest {
  #type;

  #noOfTickets;

  constructor(type, noOfTickets) {
    if (!this.#Type.includes(type)) {
      throw new TypeError(INVALID_TICKET_TYPE);
    }

    if (!Number.isInteger(noOfTickets)) {
      throw new TypeError(INVALID_TICKET_UNITS);
    }

    this.#type = type;
    this.#noOfTickets = noOfTickets;
  }

  getNoOfTickets() {
    return this.#noOfTickets;
  }

  getTicketType() {
    return this.#type;
  }

  #Type = [ADULT, CHILD, INFANT];
}
