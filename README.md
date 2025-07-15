# Welcome to DuckFlix!

My version of the cinema-tickets assignment!

Before doing anything, be sure to do the following commands:
```sh
nvm use
npm i
```

There is a CLI-based user-interface. This can be accessed using:
```sh
npm start
```

There is a file which directly plugs in to the TicketService, for current testing purposes.
You can access it with the following commands:
```sh
npm start:manual
```

Tests can be run with:
```sh
npm test
```

![Cinema Ticket Architecture Diagram](/CT-architecture2.png)

Logging 

So far I have completed:
1) TicketService - all validation takes place here
2) TicketCalculationService - all mathematical calculations take place here
3) TicketTypeRequest - Simple data holder for ticket requests
4) All associated tests - employed a TDD approach
5) Various constants and other important misc items.
6) Setup a CI pipeline, to lint, run tests and generate a coverage report that can be found at: https://duckduckboom.github.io/cinema-tickets/coverage/ 