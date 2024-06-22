# IP to Country

## Overview

This API gateway server is designed to provide the country name associated with a given IP address.

## Getting Started

To set up and run the server, follow these steps:

### 1. Install Dependencies

Execute the following command to install the required dependencies:

```
npm install
```

### 2. Configure Access Keys

Rename the `.env.dev` file to `.env` and populate it with your access keys.

### 3. Start the Server

Start the server by running:

```
npm start
```

### 4. Run Tests (Optional)

To execute the test suite, run:

```
npm test
```

## API Testing

To test the API, use the following command:

```bash
curl --location 'localhost:3000/geolocation?ip=8.8.8.8'
```

This will retrieve the country name associated with the specified IP address.

## Design Decisions and Considerations

### Provider Availability

For the sake of simplicity, I chose to integrate the responsibility of determining provider availability into the provider itself, rather than adhering strictly to the Single Responsibility Principle (SRP). This decision was made in the interest of ease of implementation and maintainability.

### Rate Limiter Implementation

I opted to implement the rate limiter as a field rather than injecting it, as I do not foresee the rate limit changing dynamically and unit testing was still feasible with this approach.

### Provider Selection Strategy

In the event of an error unrelated to rate limiting, I chose to propagate the error to the user rather than attempting to fall back to alternative providers. This decision was made in favor of simplicity and ease of implementation.

### Dependency Injection

Given the scope of this project, I deemed the implementation of an Inversion of Control (IoC) container to be unnecessary overhead.
