from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

db_path = "community.db"


def init_db():
    conn = sqlite3.connect(db_path)
    conn.execute(
        """
    CREATE TABLE IF NOT EXISTS users(
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
    CREATE TABLE IF NOT EXISTS posts(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        nickname TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp TEXT NOT NULL,
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
                jsonify({"message": "Successfully loggedin", "user": user_details}),
                200,
            )
        else:
            return jsonify({"error": "Wrong Password"}), 401
    else:
        return jsonify({"message": "Email not found!"}), 404


@app.route("/api/posts", methods=["POST"])
def create_post():
    data = request.get_json()  # Get the JSON data sent by frontend

    # Extract each value from the data
    user_id = data.get("user_id")
    nickname = data.get("nickname")
    content = data.get("content")
    timestamp = data.get("timestamp")

    # Connect to the database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Insert new post into the posts table
    cursor.execute(
        """
        INSERT INTO posts (user_id, nickname, content, timestamp)
        VALUES (?, ?, ?, ?)
    """,
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
        SELECT posts.id, users.full_name, posts.nickname, posts.content, posts.timestamp
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
            }
        )

    return jsonify(post_list)


@app.route("/api/user-posts/<int:user_id>", methods=["GET"])
def user_posts(user_id):
    # Connect to database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get all posts for this user only
    cursor.execute(
        """
        SELECT posts.id, users.full_name, posts.nickname, posts.content, posts.timestamp
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.user_id = ?
        ORDER BY posts.id DESC
    """,
        (user_id,),
    )

    user_posts = cursor.fetchall()
    conn.close()

    # Format the posts nicely
    post_list = []
    for post in user_posts:
        post_list.append(
            {
                "id": post[0],
                "author": post[1],
                "nickname": post[2],
                "content": post[3],
                "timestamp": post[4],
            }
        )

    return jsonify(post_list)


if __name__ == "__main__":
    init_db()
    app.run(debug=True)
