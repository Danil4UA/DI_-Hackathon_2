# Budget Tracker Application

This is a simple budget tracking application that allows users to manage their salary and expenses across different budgets.

## Features

- Set and update salary
- Create and delete budgets
- Add expenses to budgets
- View expenses for each budget
- Visual representation of budget allocation using a chart

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your local machine
- npm (Node Package Manager) installed

## Installation

1. Clone the repository:
   git clone [<repository-url>](https://github.com/Danil4UA/DI_-Hackathon_2/)
   Copy
2. Navigate to the project directory:
   cd <project-directory>
   Copy
3. Install the dependencies:
   npm install
   Copy
4. Create a `.env` file in the project root and add your database URL:
   DATABASE_URL=your_database_url_here
   Copy

## Running the Application

To run the application, you need to start both the backend server and the frontend development server.

### Backend Server

1. Start the backend server using Nodemon:
   npm run nodemon
   CopyThis will start the server on `http://localhost:3000` and automatically restart it when changes are detected.

### Frontend Development Server

2. In a separate terminal, start the Parcel development server:
   npm run parcel
   CopyThis will start the frontend development server, typically on `http://localhost:1234`.

## Usage

1. Open your browser and navigate to `http://localhost:1234`.
2. Set your salary using the "Set Salary" form.
3. Add budgets using the "Add Budget" form.
4. For each budget, you can:

- Add expenses
- View expenses
- Delete the budget

5. The chart will update automatically to reflect your budget allocations.

## API Endpoints

- `GET /budgets`: Fetch all budgets
- `GET /budgets/:id`: Fetch a specific budget
- `POST /budgets`: Create a new budget
- `PUT /budgets/:id`: Update a budget
- `DELETE /budgets/:id`: Delete a budget
- `GET /users/:id`: Fetch user data
- `PATCH /users/:id`: Update user data

## Contributing

Contributions to this project are welcome. Please ensure you follow the existing code style and include appropriate tests for new features.
