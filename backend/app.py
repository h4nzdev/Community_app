from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Database configuration
db_path = "community.db"

# =============================================================================
# DATABASE INITIALIZATION
# =============================================================================


def init_db():
    """Initialize the database and create all necessary tables"""
    conn = sqlite3.connect(db_path)

    # Users table - stores user account information
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            full_name TEXT NOT NULL,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            email TEXT NOT NULL
        )
    """
    )

    # Posts table - stores all user posts
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            nickname TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            likes INTEGER DEFAULT 0,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """
    )

    # Comments table - stores comments on posts
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            FOREIGN KEY(post_id) REFERENCES posts(id),
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """
    )

    # User likes table - tracks which users liked which posts
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS user_likes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            post_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(post_id) REFERENCES posts(id),
            UNIQUE(user_id, post_id)
        )
    """
    )

    # Messages table - stores chat messages between users
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id INTEGER NOT NULL,
            receiver_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            FOREIGN KEY(sender_id) REFERENCES users(id),
            FOREIGN KEY(receiver_id) REFERENCES users(id)
        )
    """
    )

    conn.commit()
    conn.close()


# =============================================================================
# AUTHENTICATION ENDPOINTS
# =============================================================================


@app.route("/api/signup", methods=["POST"])
def sign_up():
    """Register a new user account"""
    data = request.get_json()
    full_name = data.get("fullname")
    username = data.get("username")
    password = data.get("password")
    email = data.get("email")

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO users (full_name, username, password, email) VALUES (?, ?, ?, ?)",
            (full_name, username, password, email),
        )
        conn.commit()
        return jsonify({"message": "Registered Successfully!"}), 200
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already exists!"}), 400
    finally:
        conn.close()


@app.route("/api/login", methods=["POST"])
def login():
    """Authenticate user login"""
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email=?", (email,))
    user = cursor.fetchone()
    conn.close()

    if user:
        db_password = user[3]
        user_details = {
            "id": user[0],
            "full_name": user[1],
            "username": user[2],
            "email": user[4],
        }

        if db_password == password:
            return (
                jsonify(
                    {
                        "message": "Successfully logged in",
                        "user": user_details,
                        "success": True,
                    }
                ),
                200,
            )
        else:
            return jsonify({"message": "Wrong Password", "success": False}), 401
    else:
        return jsonify({"message": "Email not found!", "success": False}), 404


# =============================================================================
# POSTS ENDPOINTS
# =============================================================================


@app.route("/api/posts", methods=["POST"])
def create_post():
    """Create a new post"""
    data = request.get_json()
    user_id = data.get("user_id")
    nickname = data.get("nickname")
    content = data.get("content")

    # Use current timestamp
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO posts (user_id, nickname, content, timestamp) VALUES (?, ?, ?, ?)",
        (user_id, nickname, content, timestamp),
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Post added successfully!"}), 201


@app.route("/api/posts", methods=["GET"])
def get_all_posts():
    """Get all posts with author information"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT posts.id, users.full_name, posts.nickname, posts.content, posts.timestamp, posts.likes
        FROM posts
        JOIN users ON posts.user_id = users.id
        ORDER BY posts.id DESC
    """
    )

    all_posts = cursor.fetchall()
    conn.close()

    post_list = []
    for post in all_posts:
        post_list.append(
            {
                "id": post[0],
                "author": post[1],
                "nickname": post[2],
                "content": post[3],
                "timestamp": post[4],
                "likes": post[5],
            }
        )

    return jsonify(post_list)


@app.route("/api/user-posts/<int:user_id>", methods=["GET"])
def user_posts(user_id):
    """Get all posts by a specific user"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT posts.id, users.full_name, posts.nickname, posts.content, posts.timestamp, posts.likes
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.user_id = ?
        ORDER BY posts.id DESC
    """,
        (user_id,),
    )

    user_posts = cursor.fetchall()
    conn.close()

    post_list = []
    for post in user_posts:
        post_list.append(
            {
                "id": post[0],
                "author": post[1],
                "nickname": post[2],
                "content": post[3],
                "timestamp": post[4],
                "likes": post[5],
            }
        )

    return jsonify(post_list)


@app.route("/api/delete-posts/<int:id>", methods=["DELETE"])
def delete_posts(id):
    """Delete a specific post"""
    conn = sqlite3.connect(db_path)
    conn.execute("DELETE FROM posts WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Post deleted successfully"}), 201


@app.route("/api/posts/<int:post_id>", methods=["PUT"])
def update_post(post_id):
    """Update a specific post"""
    data = request.get_json()
    content = data.get("content")
    nickname = data.get("nickname")

    if not content or not nickname:
        return jsonify({"error": "Content and nickname are required"}), 400

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        cursor.execute(
            "UPDATE posts SET content = ?, nickname = ? WHERE id = ?",
            (content, nickname, post_id),
        )
        conn.commit()

        # Get updated post data
        cursor.execute(
            "SELECT posts.id, users.full_name, posts.nickname, posts.content, posts.timestamp, posts.likes FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = ?",
            (post_id,),
        )
        updated_post = cursor.fetchone()

        if updated_post:
            post_data = {
                "id": updated_post[0],
                "author": updated_post[1],
                "nickname": updated_post[2],
                "content": updated_post[3],
                "timestamp": updated_post[4],
                "likes": updated_post[5],
            }
            return (
                jsonify({"message": "Post updated successfully", "post": post_data}),
                200,
            )
        else:
            return jsonify({"error": "Post not found"}), 404

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


# =============================================================================
# LIKES ENDPOINTS
# =============================================================================


@app.route("/api/posts/<int:post_id>/like", methods=["POST"])
def like_post(post_id):
    """Like or unlike a post (toggle functionality)"""
    data = request.get_json()
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        # Check if user already liked this post
        cursor.execute(
            "SELECT id FROM user_likes WHERE user_id = ? AND post_id = ?",
            (user_id, post_id),
        )
        existing_like = cursor.fetchone()

        if existing_like:
            # User already liked, so unlike
            cursor.execute(
                "DELETE FROM user_likes WHERE user_id = ? AND post_id = ?",
                (user_id, post_id),
            )
            cursor.execute(
                "UPDATE posts SET likes = likes - 1 WHERE id = ?", (post_id,)
            )
            message = "Post unliked!"
            liked = False
        else:
            # User hasn't liked, so like
            cursor.execute(
                "INSERT INTO user_likes (user_id, post_id) VALUES (?, ?)",
                (user_id, post_id),
            )
            cursor.execute(
                "UPDATE posts SET likes = likes + 1 WHERE id = ?", (post_id,)
            )
            message = "Post liked!"
            liked = True

        conn.commit()

        # Get updated like count
        cursor.execute("SELECT likes FROM posts WHERE id = ?", (post_id,))
        updated_likes = cursor.fetchone()[0]

        return (
            jsonify({"message": message, "liked": liked, "likes_count": updated_likes}),
            200,
        )

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route("/api/posts/<int:post_id>/check-like/<int:user_id>", methods=["GET"])
def check_user_like(post_id, user_id):
    """Check if a specific user has liked a specific post"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id FROM user_likes WHERE user_id = ? AND post_id = ?",
        (user_id, post_id),
    )
    existing_like = cursor.fetchone()
    conn.close()

    return jsonify({"liked": existing_like is not None}), 200


# =============================================================================
# COMMENTS ENDPOINTS
# =============================================================================


@app.route("/api/posts/<int:post_id>/comment", methods=["POST"])
def comment_post(post_id):
    """Add a comment to a specific post"""
    data = request.get_json()
    user_id = data.get("user_id")
    content = data.get("content")

    # Use current timestamp
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO comments (post_id, user_id, content, timestamp) VALUES (?, ?, ?, ?)",
        (post_id, user_id, content, timestamp),
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Comment added!"}), 201


@app.route("/api/posts/<int:post_id>/comments", methods=["GET"])
def get_comments(post_id):
    """Get all comments for a specific post"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT comments.id, users.full_name, comments.content, comments.timestamp
        FROM comments
        JOIN users ON comments.user_id = users.id
        WHERE comments.post_id = ?
        ORDER BY comments.id ASC
    """,
        (post_id,),
    )

    comments = cursor.fetchall()
    conn.close()

    comment_list = []
    for comment in comments:
        comment_list.append(
            {
                "id": comment[0],
                "author": comment[1],
                "content": comment[2],
                "timestamp": comment[3],
            }
        )

    return jsonify(comment_list)


# =============================================================================
# MESSAGING ENDPOINTS
# =============================================================================


@app.route("/api/messages/<int:user_id>/conversations", methods=["GET"])
def get_user_conversations(user_id):
    """Get all conversations for a user"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        # Get all unique conversations (people user has chatted with)
        cursor.execute(
            """
            SELECT DISTINCT 
                CASE 
                    WHEN m.sender_id = ? THEN m.receiver_id 
                    ELSE m.sender_id 
                END as other_user_id,
                u.full_name,
                u.username,
                (SELECT MAX(timestamp) FROM messages 
                 WHERE (sender_id = ? AND receiver_id = other_user_id) 
                    OR (sender_id = other_user_id AND receiver_id = ?)) as last_message_time,
                (SELECT content FROM messages 
                 WHERE ((sender_id = ? AND receiver_id = other_user_id) 
                    OR (sender_id = other_user_id AND receiver_id = ?))
                 ORDER BY timestamp DESC LIMIT 1) as last_message,
                (SELECT COUNT(*) FROM messages 
                 WHERE sender_id = other_user_id AND receiver_id = ? AND is_read = FALSE) as unread_count
            FROM messages m
            JOIN users u ON (CASE 
                WHEN m.sender_id = ? THEN m.receiver_id 
                ELSE m.sender_id 
            END) = u.id
            WHERE m.sender_id = ? OR m.receiver_id = ?
            ORDER BY last_message_time DESC
        """,
            (
                user_id,
                user_id,
                user_id,
                user_id,
                user_id,
                user_id,
                user_id,
                user_id,
                user_id,
            ),
        )

        conversations = cursor.fetchall()

        conversation_list = []
        for conv in conversations:
            conversation_list.append(
                {
                    "id": conv[0],
                    "name": conv[1],
                    "username": conv[2],
                    "lastMessage": conv[4] or "No messages yet",
                    "time": conv[3] or "",
                    "unread": conv[5] or 0,
                    "online": False,  # Simple implementation - always offline
                }
            )

        return jsonify(conversation_list)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route("/api/messages/<int:user_id>/<int:other_user_id>", methods=["GET"])
def get_messages(user_id, other_user_id):
    """Get all messages between two users"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT m.id, m.sender_id, m.content, m.timestamp, m.is_read,
                   u.full_name as sender_name
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE (m.sender_id = ? AND m.receiver_id = ?) 
               OR (m.sender_id = ? AND m.receiver_id = ?)
            ORDER BY m.timestamp ASC
        """,
            (user_id, other_user_id, other_user_id, user_id),
        )

        messages = cursor.fetchall()

        message_list = []
        for msg in messages:
            message_list.append(
                {
                    "id": msg[0],
                    "sender": "me" if msg[1] == user_id else "other",
                    "text": msg[2],
                    "time": msg[3],
                    "sender_name": msg[5],
                }
            )

        # Mark messages as read
        cursor.execute(
            """
            UPDATE messages 
            SET is_read = TRUE 
            WHERE sender_id = ? AND receiver_id = ? AND is_read = FALSE
        """,
            (other_user_id, user_id),
        )
        conn.commit()

        return jsonify(message_list)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route("/api/messages", methods=["POST"])
def send_message():
    """Send a new message"""
    data = request.get_json()
    sender_id = data.get("sender_id")
    receiver_id = data.get("receiver_id")
    content = data.get("content")

    if not all([sender_id, receiver_id, content]):
        return (
            jsonify({"error": "sender_id, receiver_id, and content are required"}),
            400,
        )

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        # Use current timestamp
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        cursor.execute(
            """
            INSERT INTO messages (sender_id, receiver_id, content, timestamp)
            VALUES (?, ?, ?, ?)
        """,
            (sender_id, receiver_id, content, timestamp),
        )

        conn.commit()

        # Get the inserted message
        message_id = cursor.lastrowid
        cursor.execute(
            """
            SELECT m.id, m.sender_id, m.content, m.timestamp, u.full_name
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.id = ?
        """,
            (message_id,),
        )

        new_message = cursor.fetchone()

        return (
            jsonify(
                {
                    "message": "Message sent successfully",
                    "data": {
                        "id": new_message[0],
                        "sender": "me",
                        "text": new_message[2],
                        "time": new_message[3],
                        "sender_name": new_message[4],
                    },
                }
            ),
            201,
        )

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route("/api/users", methods=["GET"])
def get_all_users():
    """Get all users for starting new conversations"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT id, full_name, username, email
            FROM users
            ORDER BY full_name ASC
        """
        )

        users = cursor.fetchall()

        user_list = []
        for user in users:
            user_list.append(
                {"id": user[0], "name": user[1], "username": user[2], "email": user[3]}
            )

        return jsonify(user_list)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


# =============================================================================
# APPLICATION ENTRY POINT
# =============================================================================

if __name__ == "__main__":
    init_db()
    app.run(debug=True)
