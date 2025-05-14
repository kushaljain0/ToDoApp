# Todo App

A simple Todo application built with TypeScript, React, and webpack.

## Features

### Add Tasks Form
- Add tasks with title (required), description, date, and priority
- Form fields reset after adding a task

### Filter for Task List
- Toggle to show/hide completed tasks
- Case-insensitive text search (searches in both title and description)
- Filter by date range (minimum and maximum dates)

### Task List
- Display tasks in table form
- Sort by columns (completed, title, priority, date) in ascending or descending order
- Toggle task completion status

## Getting Started

### Prerequisites
- Node.js (v14 or later recommended)
- npm or yarn

### Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
# or
yarn install
```

### Running the App

Start the development server:

```bash
npm start
# or
yarn start
```

This will launch the app on [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

Build the app for production:

```bash
npm run build
# or
yarn build
```

This will create a `dist` folder with optimized production build. 