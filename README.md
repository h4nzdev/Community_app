# Social Media App with React & Flask

A simple social media application built with React frontend and Flask backend, featuring posts, likes, and comments functionality.

## 🚀 Features

- **User Authentication**: Sign up and login system
- **Create Posts**: Users can create and share posts
- **Like System**: Professional like/unlike functionality (one like per user)
- **Comment System**: Add comments to posts with a modal interface
- **Real-time Updates**: Like counts and comment counts update instantly
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Beautiful dark/light theme

## 🏗️ System Architecture

### Frontend (React)
- **React 19** with modern hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Lucide React** for icons

### Backend (Flask)
- **Flask** web framework
- **SQLite** database
- **Flask-CORS** for cross-origin requests
- **RESTful API** design

## 📁 Project Structure

```
React-4/
├── backend/
│   ├── app.py              # Flask backend server
│   └── community.db        # SQLite database
├── src/
│   ├── components/
│   │   ├── Posts/
│   │   │   ├── PostCard.jsx           # Individual post display
│   │   │   ├── PostActionButton.jsx   # Like/comment/share buttons
│   │   │   ├── PostsFeed.jsx          # Main posts feed
│   │   │   └── CommentModal.jsx       # Comment modal popup
│   │   ├── Auth/
│   │   │   ├── Login.jsx              # Login form
│   │   │   └── Signup.jsx             # Signup form
│   │   └── ...
│   ├── pages/
│   │   ├── HomePage.jsx               # Main home page
│   │   ├── LoginPage.jsx              # Login page
│   │   ├── SignupPage.jsx             # Signup page
│   │   └── ...
│   ├── context/
│   │   └── AuthContext.jsx            # User authentication context
│   └── ...
└── README.md
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    full_name TEXT NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL
);
```

### Posts Table
```sql
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    nickname TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
```

### Comments Table
```sql
CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    FOREIGN KEY(post_id) REFERENCES posts(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);
```

### User Likes Table
```sql
CREATE TABLE user_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(post_id) REFERENCES posts(id),
    UNIQUE(user_id, post_id)
);
```

## 🔌 API Endpoints

### Authentication
- `POST /api/signup` - Register new user
- `POST /api/login` - User login

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `DELETE /api/delete-posts/<id>` - Delete a post
- `GET /api/user-posts/<user_id>` - Get posts by specific user

### Likes
- `POST /api/posts/<post_id>/like` - Like/unlike a post
- `GET /api/posts/<post_id>/check-like/<user_id>` - Check if user liked a post

### Comments
- `GET /api/posts/<post_id>/comments` - Get comments for a post
- `POST /api/posts/<post_id>/comment` - Add a comment to a post

## 🚀 How to Run the Application

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install flask flask-cors
   ```

3. Run the Flask server:
   ```bash
   python app.py
   ```

   The backend will start on `http://127.0.0.1:5000`

### Frontend Setup
1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

## 🎯 How the System Works

### 1. User Authentication Flow
1. User visits the app and sees the home page
2. User clicks "Login" or "Signup" in the navigation
3. User fills out the form (email, password, etc.)
4. Backend validates credentials and returns user data
5. Frontend stores user data in session storage and AuthContext
6. User is redirected to the main feed

### 2. Post Creation Flow
1. User clicks "Add Post" button
2. User fills out the post form (content, nickname)
3. Frontend sends POST request to `/api/posts`
4. Backend saves post to database
5. Frontend refreshes the posts feed to show new post

### 3. Like System Flow
1. User clicks the like button on a post
2. Frontend checks if user is logged in
3. If logged in, sends POST request to `/api/posts/<id>/like`
4. Backend checks if user already liked the post:
   - If not liked: adds like to database, increments count
   - If already liked: removes like from database, decrements count
5. Backend returns updated like count and status
6. Frontend updates the UI to show new like count and button state

### 4. Comment System Flow
1. User clicks the comment button on a post
2. Frontend checks if user is logged in
3. If logged in, opens comment modal
4. Modal fetches existing comments from `/api/posts/<id>/comments`
5. User types a comment and clicks send
6. Frontend sends POST request to `/api/posts/<id>/comment`
7. Backend saves comment to database
8. Modal refreshes to show new comment
9. Comment count updates in the main feed

## 🔧 Key Components Explained

### AuthContext
- Manages user authentication state across the app
- Stores user data in session storage for persistence
- Provides login/logout functions to all components

### PostActionButton
- Handles like and comment functionality for each post
- Shows like count and comment count
- Manages loading states and user authentication checks

### CommentModal
- Popup window for viewing and adding comments
- Fetches comments when opened
- Provides form for adding new comments
- Updates comment count in parent component

## 🎨 UI/UX Features

- **Responsive Design**: Works on all screen sizes
- **Dark Mode**: Automatic theme switching
- **Loading States**: Shows when actions are processing
- **Error Handling**: User-friendly error messages
- **Smooth Animations**: Hover effects and transitions
- **Professional Styling**: Clean, modern interface

## 🔒 Security Features

- **User Authentication**: Required for likes and comments
- **Input Validation**: Backend validates all user inputs
- **SQL Injection Protection**: Uses parameterized queries
- **CORS Configuration**: Proper cross-origin request handling

## 🚀 Future Enhancements

- User profiles and avatars
- Post images and media
- Real-time notifications
- Search functionality
- Post sharing
- User following system
- Advanced comment features (replies, likes)

## 🐛 Troubleshooting

### Common Issues

1. **Backend not starting**: Make sure Flask and flask-cors are installed
2. **Database errors**: Delete `community.db` and restart the backend
3. **CORS errors**: Ensure backend is running on the correct port
4. **Frontend not loading**: Check if all npm dependencies are installed

### Getting Help

If you encounter any issues:
1. Check the browser console for error messages
2. Check the Flask server logs for backend errors
3. Ensure both frontend and backend are running
4. Verify all dependencies are installed correctly

## 📝 License

This project is for educational purposes. Feel free to use and modify as needed.

---

**Happy Coding! 🎉**

