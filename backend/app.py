from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

db_path = "community.db"


# Initialize the database and tables
def init_db():
    conn = sqlite3.connect(db_path)

    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            full_name TEXT NOT NULL,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
        )
    """
    )

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

    conn.commit()
    conn.close()


@app.route("/api/signup", methods=["POST"])
def sign_up():
    data = request.get_json()
    full_name = data.get("fullname")
    username = data.get("username")
    password = data.get("password")
    email = data.get("email")

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO users (full_name, username, password, email) VALUES (?, ?, ?, ?)",
        (full_name, username, password, email),
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Registered Successfully!"}), 200


@app.route("/api/login", methods=["POST"])
def login():
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


@app.route("/api/posts", methods=["POST"])
def create_post():
    data = request.get_json()
    user_id = data.get("user_id")
    nickname = data.get("nickname")
    content = data.get("content")
    timestamp = data.get("timestamp")

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
    conn = sqlite3.connect(db_path)
    conn.execute("DELETE FROM posts WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Post deleted successfully"}), 201


# ✅ LIKE a post
@app.route("/api/posts/<int:post_id>/like", methods=["POST"])
def like_post(post_id):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("UPDATE posts SET likes = likes + 1 WHERE id = ?", (post_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Post liked!"}), 200


# ✅ COMMENT on a post
@app.route("/api/posts/<int:post_id>/comment", methods=["POST"])
def comment_post(post_id):
    data = request.get_json()
    user_id = data.get("user_id")
    content = data.get("content")
    timestamp = data.get("timestamp")

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO comments (post_id, user_id, content, timestamp) VALUES (?, ?, ?, ?)",
        (post_id, user_id, content, timestamp),
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Comment added!"}), 201


# ✅ GET comments for a post
@app.route("/api/posts/<int:post_id>/comments", methods=["GET"])
def get_comments(post_id):
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


if __name__ == "__main__":
    init_db()
    app.run(debug=True)
