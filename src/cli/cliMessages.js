export const cliMessages = {
  welcome: '🦆  Welcome to DuckFlix! 🦆',
  goodbye: '\nThank you for using DuckFlix! 🍿',
  bookTicketsHeading: "\nLet's book your tickets!\n",
  prompts: {
    accountId: '👤 Please enter your account ID: ',
    adultAmount: 'How many ADULT tickets would you like? ',
    childAmount: 'How many CHILD tickets would you like? ',
    infantAmount: 'How many INFANT tickets would you like? ',
    retry: 'Would you like to try again? (y/n): ',
    invalidNumber: "Please enter a valid whole number that's greater than 0."
  },
  summary: {
    successHeading: '\n🥳🎬 Booking succeeded! 🎬🥳',
    divider: '------------------',
    adult: 'Adult tickets: ',
    child: 'Child tickets: ',
    infant: 'Infant tickets: ',
    totalTickets: '\n🎟️  Total tickets:',
    totalSeats: '💺 Total seats:',
    totalCost: '💰 Total cost:'
  },
  errors: {
    bookingFailed: '\n🚨 Booking failed:',
    unexpected: '\n🚨 Unexpected error:'
  }, 
  logger: {
    cliStarted: 'CLI: DuckFlix started',
    cliExited: 'CLI: DuckFlix exited',
    bookingSucceeded: 'CLI: Booking succeeded',
    bookingFailed: 'CLI: Booking failed',
    unexpectedError: 'CLI: Unexpected error',
    userRetry: 'CLI: User chose to retry booking',
    userNoRetry: 'CLI: User chose not to retry booking',
    invalidInput: 'CLI: Invalid input received'
  }
}; 