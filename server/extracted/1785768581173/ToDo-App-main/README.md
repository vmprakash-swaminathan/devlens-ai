# React Todo App with Firebase

This is a simple Todo application built using React, Tailwind CSS, HTML, and Firebase. It allows users to create, read, update, and delete Todo items. The application uses Firebase Firestore as the database to store and retrieve the Todo data.

## Tech Stack

- React
- Javascript
- Firebase
- HTML
- Tailwind CSS

## Features

- Create new Todo items.
- Read and display the list of existing Todo items.
- Update the status or content of a Todo item.
- Delete a Todo item.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/n0IQ/ToDo-App.git
```

2. Navigate to the project directory:

```bash
cd todo-app
```

3. Install the dependencies:

```bash
npm install
```

## Configuration

1. Create a Firebase project and set up Firestore database.
2. Rename the env.js file and update the following Firebase configuration values:

```bash
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
REACT_APP_FIREBASE_DATABASE_URL=your-firebase-database-url
REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
```

## Usage

1. Start the development server:

```bash
npm start
```

2. Open your browser and navigate to http://localhost:3000 to access the Todo application.
3. Use the interface to create, update, or delete Todo items.
