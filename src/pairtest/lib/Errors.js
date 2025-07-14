// Domain-specific error messages for TicketService exceptions

export const INVALID_ACCOUNT_ID = 'Please provide a valid account ID (a positive whole number).';
export const INVALID_TICKET_TYPE = (validTypes) => `type must be ${validTypes.slice(0, -1).join(', ')}, or ${validTypes.slice(-1)}`;
export const INVALID_TICKET_UNITS = 'noOfTickets must be an integer';