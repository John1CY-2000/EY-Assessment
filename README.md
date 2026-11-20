
# Zalex Employee Certification Application

A React web application developed as part of the
Junior React Front-End Developer assessment.

## Technologies

- React
- JavaScript
- Vite
- CSS
- REST APIs (Fetch API)

## Features

### Request Certificate
- Form with required field validation
- Inline validation error messages
- Certificate submission through the provided API
- Loading and submission feedback

### Requests List
- Retrieve certificate requests from the API
- Display requests in a table
- Sort by issue date and status
- Filter by reference number, address and status
- Handle loading, empty and error states

## Setup

### Prerequisites
- Node.js and npm

### Installation

1. Install dependencies:

   npm install

2. Create a `.env.local` file in the project root.

3. Add the API key provided for the assessment:

   VITE_ZALEX_API_KEY=YOUR_API_KEY

4. Start the application:

   npm run dev

5. Open:

   http://localhost:3000

## Additional Commands

Production build:
npm run build

Lint:
npm run lint

## Notes

- The application uses the updated API endpoint provided by EY.
- The development server is configured to use localhost:3000.
- API keys are not included in the repository.
- Authentication and backend implementation are outside
  the scope of this assessment.
- The APIs are mocked, so successful submissions may not
  appear in subsequent requests-list responses.
- The Purpose field is implemented as a CSS-styled
  plain-text textarea.
- The API key is used client-side for this assessment;
  in production, sensitive credentials should be protected
  by a backend.
