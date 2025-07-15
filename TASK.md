P
# Business Rules
- There are 3 types of tickets i.e. Infant, Child, and Adult.
- The ticket prices are based on the type of ticket (see table below).
- The ticket purchaser declares how many and what type of tickets they want to buy.
- Multiple tickets can be purchased at any given time.
- Only a maximum of 25 tickets that can be purchased at a time.
- Infants do not pay for a ticket and are not allocated a seat. They will be sitting on an Adult's lap.
- Child and Infant tickets cannot be purchased without purchasing an Adult ticket.
|   Ticket Type    |     Price   |
| ---------------- | ----------- |
|    INFANT        |    £0       |
|    CHILD         |    £15     |
|    ADULT         |    £25      |
- There is an existing `TicketPaymentService` responsible for taking payments.
- There is an existing `SeatReservationService` responsible for reserving seats.

## Constraints
- The TicketService interface CANNOT be modified. 
- The code in the thirdparty.* packages CANNOT be modified.
- The `TicketTypeRequest` SHOULD be an immutable object. 

## Assumptions
You can assume:
- All accounts with an id greater than zero are valid. They also have sufficient funds to pay for any no of tickets.
- The `TicketPaymentService` implementation is an external provider with no defects. You do not need to worry about how the actual payment happens.
- The payment will always go through once a payment request has been made to the `TicketPaymentService`.
- The `SeatReservationService` implementation is an external provider with no defects. You do not need to worry about how the seat reservation algorithm works.
- The seat will always be reserved once a reservation request has been made to the `SeatReservationService`.

## Your Task
Provide a working implementation of a `TicketService` that:
- Considers the above objective, business rules, constraints & assumptions.
- Calculates the correct amount for the requested tickets and makes a payment request to the `TicketPaymentService`.  
- Calculates the correct no of seats to reserve and makes a seat reservation request to the `SeatReservationService`.  
- Rejects any invalid ticket purchase requests. It is up to you to identify what should be deemed as an invalid purchase request.



## PROBLEM:
INPUT:
- Account ID, must be > 0
- Array of TicketTypeRequest containing:
  - number of tickets requested of each type

Input Validation to ensure always positive integers given.


OUTPUT:
- Payment request to TicketPaymentService with correct total amount.
  - Total cost​: (Adult count * £25) + (Child count * £15) 
- Seat reservation request to SeatReservationService with correct number of seats.
  - Seats needed​: Adult count + Child count (Infants don't get seats)
- Rejection of invalid purchase requests (throw exception or return error).
  - Account ID ≤ 0
  - More than 25 total tickets
  - Child or Infant tickets without Adult tickets
  - Zero tickets requested
  - Invalid ticket types

## Examples:
Test Case 1:
INPUT - AccountID 88, 5 Adult, 3 child, 1 infant
OUTPUT - £170, 8 seats. Booking successful.

Test Case 2:
INPUT - AccountID 88, 1 Adult, 3 child, 1 infant
OUTPUT - £70, 4 seats. Booking successful.

Test Case 3:
INPUT - AccountID 88, 0 Adult, 3 child, 0 infant
OUTPUT - Booking unsuccessful. At least one adult ticket is required when booking for children or infants.

Test Case 4:
INPUT - AccountID 88, 5 Adult, 0 child, 0 infant
OUTPUT - £125, 5 seats. Booking successful.

Test case 5:
INPUT - AccountID 0, 5 Adult, 0 child, 0 infant
OUTPUT - Booking unsuccessful. Please provide a valid account ID (a positive whole number).

Test case 6:
INPUT - AccountID 88, 26 Adult, 0 child, 0 infant
OUTPUT - Booking unsuccessful. Sorry, you can only purchase up to 25 tickets at a time.

Test Case 7:
INPUT - AccountID 88, 1 Adult, 3 child, 2 infant
OUTPUT - Booking unsuccessful. Each infant must be accompanied by one adult.

Input validation tests:
Test Case 8:
INPUT - AccountID 88, 0 Adult, 0 child, 0 infant
OUTPUT - Booking unsuccessful. You must book at least one ticket.

Test Case 9:
INPUT - AccountID 88, AA Adult, 0 child, 0 infant
OUTPUT - Booking unsuccessful. Invalid ticket type.

Test Case 10:
INPUT - AccountID 88, -1 Adult, 3 child, 2 infant
OUTPUT - Booking unsuccessful. Invalid ticket quantity.

Test Case 11:
INPUT - AccountID 88, -1 Adult, 0 child, 0 infant
OUTPUT - Booking unsuccessful. Invalid ticket quantity.

Test Case 12:
INPUT - AccountID 88, 1.5 Adult, 0 child, 0 infant
OUTPUT - Booking unsuccessful. Invalid ticket quantity.

Scenario 1: 0 adults, 2 children, 3 infants
Shows: ERROR (must have adults)

Scenario 2: 2 adults, 1 child, 3 infants
Shows: ERROR (infants need adults)

Scenario 3: 20 adults, 10 children, 0 infants
Shows:  ERROR (too many tickets)


D
INPUT:
Number: AccountID

Object ticketCounts = {
  ADULT: 0,
  CHILD: 0,
  INFANT: 0
}

OUTPUT:
Number: Total amount paid
Number: Total seats booked
Boolean: if booking was successful
Sring: showing if booking was successful or not

INTERMEDIARY:
Object TICKET_PRICES = {
  ADULT: 25,
  CHILD: 15,
  INFANT: 0
} 


## ALGO
Get a valid accountID

a)
Get a valid number of adult tickets wanted
- Has to be >= 1 and <= 25, or fail validation and don't continue
- Need to give specific reasons for why it fails validation
Get a valid number of child tickets wanted
Get a valid number of infant tickets wanted

Validate total ticket count ≤ 25

Calculate total seats
Send booking request to SeatReservationService.js

Calculate total price of tickets
Send payment request to TicketPaymentService.js

Was everything successful?
- yes = print success message
- no = print failure message


Ask if they would like to book more tickets
- yes = restart from a)
- no = end program

