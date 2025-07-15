export const INVALID_ACCOUNT_ID = 'Please provide a valid account ID (a positive whole number).';
export const INVALID_TICKET_TYPE = (validTypes) => `type must be ${validTypes.slice(0, -1).join(', ')}, or ${validTypes.slice(-1)}`;
export const INVALID_TICKET_UNITS = 'noOfTickets must be an integer';

// Business logic
export const EMPTY_TICKET_REQUEST = 'You must book at least one ticket.';
export const TOO_MANY_TICKETS = 'Sorry, you can only purchase up to 25 tickets at a time.';
export const ADULT_REQUIRED = 'At least one adult ticket is required when booking for children or infants.';
export const TOO_MANY_INFANTS_TO_ADULTS = 'Each infant must be accompanied by one adult.';
