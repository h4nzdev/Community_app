# Community App with Flask Backend

A simple community app with React frontend and Flask backend with SQLite database.

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Run the Flask server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Install React dependencies (including axios):
```bash
npm install axios
```

2. Start the React development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Features

- **Backend**: Simple Flask API with SQLite database
  - GET `/api/posts` - Get all posts
  - POST `/api/posts` - Add new post
  - GET `/api/users` - Get all users

- **Frontend**: React app with Context API
  - Uses axios for API calls
  - Simple data management with Context API
  - Real-time post creation

## Database Structure

- **users table**: id, name, username
- **posts table**: id, user_id, content, votes

The database is automatically created with sample data when you first run the backend.
