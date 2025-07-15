# Welcome to DuckFlix!

My version of the cinema-tickets assignment!

This project simulates cinema ticket booking via a CLI, applying the business rules (given later in this README) and constraints. It was built with TDD, and designed to have a clear, straightforward architecture.

![DuckFlix CLI in action](/DuckFlix-Demo.png)

---

## 🦆 Setup & Usage

Before you do anything else:
```sh
nvm use
npm install
```

### Run the CLI (no logging – like a customer):
```sh
npm start
```

### Run the CLI (with logging):
```sh
npm run start:dev
```

  ### Run the manual test script (to poke the TicketService directly via `manualCall.js`):
```sh
npm run start:manual
```

### Run the tests (and see if you broke anything):
```sh
npm test
```

  ### Run the linter:
```sh
npm run lint
```

## 📝 Architecture & Design

This project has been designed so that it is simple to navigate and iterate on in the future.

- `src/` — CLI, business logic, services, and even the third-party integrations.
- `test/` — Mirrors `src/` directory structure to ensure a clear and maintainable organisation for all tests.
- `manualCall.js` — Can be manually changed to interact with the TicketService directly.


Below is a diagram of how the main services in DuckFlix quack to each other:
![Cinema Ticket Architecture Diagram](/CT-architecture2.png)

  

- **User via CLI**: That’s you! Here you can place your DuckFlix ticket order. The CLI and message handling are separate from business logic, enabling interface changes without impacting core functionality.
- **TicketService**: Central coordinator that validates requests and orchestrates all supporting services.
- **TicketTypeRequest**: Holds the details for each kind of ticket you want.
- **TicketCalculationService**: Does all the ticket-related maths.
- **TicketPaymentService**: Pretends to take your money.
- **SeatReservationService**: Pretends to save your seat.

**TLDR;**
You (the user) interact with the CLI, which hands everything off to `TicketService`. That service then wrangles all the other helpers to make your booking happen (or not, if you try to book 1000 infant tickets).

### TDD & CI Pipeline
- **Test-Driven Development (TDD):** I used a TDD approach and have a lot of unit tests to help pinpoint any issues.
- **Third-party integrations** are mocked/stubbed in most tests.
- **Logging** is only shown when in developer mode, to keep the UX nice and clean.
- **CI Pipeline:** Every push runs jobs that lint and test the code, and it generates a coverage report. See the latest at: https://duckduckboom.github.io/cinema-tickets/coverage/

---
## 📦 Dependencies (aka, What Makes This Duck Quack)

- **winston** — Logging, but not in production. Keeps everything clean but is there for when you inevitably need it.
- **jest** — Testing, because TDD. But seriously, the tests ensure everything works, and let you refactor without breaking anything (or at least, they show what you have broken...).
- **eslint** — Linting to catch bugs before they become a problem.
- **node-pty** — Lets us test the CLI, by spawning a pseudo-terminal that can simulate user interactions.

---

## 🪺 Future Work Ideas

- Dockerise the app for easy deployment
- Allow multiple bookings and an order system
- Allow amended bookings (because typos...)
- Cryptography to protect PII 
- Add a web UI (because not everyone loves the terminal 😭)
- CLI tests to be added to the GitHub pipeline

---

  ## 🧠 Business Logic
  
- There are three ticket types: **Adult (£25)**, **Child (£15)**, and **Infant (£0)**.
- You can buy up to 25 tickets at a time.
- Infants don’t pay and don’t get a seat - they sit on an adult’s lap. **Meaning that there must be a 1:1 Infant:Adult ratio.**
- You can’t buy Child or Infant tickets without at least one Adult ticket (no unsupervised kids or infants allowed).
- The total cost is: `(Adults × £25) + (Children × £15)` (because infants are free!).
- The number of seats reserved is: `Adults + Children` (because infants don’t get seats).
- You need a valid account ID, a number greater than 0, to book.
- If you try to:
  - Book more than 25 tickets
  - Book with no adults (but with kids/infants)
  - Book with more infants than adults
  - Book with an invalid ticket type or quantity
  - Book with account ID ≤ 0
  - Book zero tickets
  ...your booking will be rejected, and you’ll get a friendly error message. Don't worry, you will be asked if you want to try again.
- Payments and seat reservations are handled by external services (we trust them, but have tests just in case...).

### Error Hierarchy 

Some rules take priority over others. Here are a few scenarios:  
  
-   **Scenario 1: No Adults with Children/Infants**  
    -   **Input:** 0 adults, 2 children, 3 infants  
    -   **Result:** `ERROR (must have adults)`  
  
-   **Scenario 2: More Infants than Adults**  
    -   **Input:** 2 adults, 1 child, 3 infants  
    -   **Result:** `ERROR (infants need adults)`  
  
-   **Scenario 3: Exceeding Ticket Limit**  
    -   **Input:** 20 adults, 10 children, 0 infants  
    -   **Result:** `ERROR (too many tickets)`  
  
-   **Scenario 4: Empty Order**  
    -   **Input:** 0 adults, 0 children, 0 infants  
    -   **Result:** `ERROR (empty order)`
  

## Thanks for reading 👏

I appreciate you probably have a lot of code to look through, so a huge thank you for your time in checking out DuckFlix.

If you have questions, reach out or ask at the interview. Feedback welcome 🦆