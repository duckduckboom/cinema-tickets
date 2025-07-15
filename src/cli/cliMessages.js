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
    cliStarted: 'DuckFlix CLI started',
    cliExited: 'DuckFlix CLI exited',
    promptBookingDetails: 'Prompting user for booking details',
    userInput: 'User entered',
    startBookingProcess: 'Starting booking flow',
    bookingSucceeded: 'Booking succeeded',
    bookingFailed: 'Booking failed',
    unexpectedError: 'Unexpected error',
    userRetry: 'User chose to retry booking',
    userNoRetry: 'User chose not to retry booking',
    invalidInput: 'Invalid input received'
  }
}; 