from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

# Database setup
def init_db():
    conn = sqlite3.connect('community.db')
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            username TEXT UNIQUE NOT NULL
        )
    ''')
    
    # Create posts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            content TEXT NOT NULL,
            votes INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Insert sample data if tables are empty
    cursor.execute('SELECT COUNT(*) FROM users')
    if cursor.fetchone()[0] == 0:
        # Insert sample users
        users = [
            ('John Doe', 'johndoe'),
            ('Jane Smith', 'janesmith'),
            ('Mike Johnson', 'mikej'),
            ('Hanz', 'hanz')
        ]
        cursor.executemany('INSERT INTO users (name, username) VALUES (?, ?)', users)
        
        # Insert sample posts
        posts = [
            (1, 'Just launched my new project! Excited to share it with the community.', 15),
            (2, 'Beautiful sunset today! Sometimes we need to stop and appreciate the little things.', 8),
            (3, 'Working on some new design concepts. What do you think about minimalist UI?', 23)
        ]
        cursor.executemany('INSERT INTO posts (user_id, content, votes) VALUES (?, ?, ?)', posts)
    
    conn.commit()
    conn.close()

# Initialize database
init_db()

@app.route('/api/posts', methods=['GET'])
def get_posts():
    conn = sqlite3.connect('community.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT p.id, u.name, u.username, p.content, p.votes
        FROM posts p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.id DESC
    ''')
    
    posts = []
    for row in cursor.fetchall():
        posts.append({
            'id': row[0],
            'name': row[1],
            'username': row[2],
            'content': row[3],
            'votes': row[4]
        })
    
    conn.close()
    return jsonify(posts)

@app.route('/api/users', methods=['GET'])
def get_users():
    conn = sqlite3.connect('community.db')
    cursor = conn.cursor()
    
    cursor.execute('SELECT id, name, username FROM users')
    
    users = []
    for row in cursor.fetchall():
        users.append({
            'id': row[0],
            'name': row[1],
            'username': row[2]
        })
    
    conn.close()
    return jsonify(users)

@app.route('/api/posts', methods=['POST'])
def add_post():
    from flask import request
    
    data = request.json
    content = data.get('content')
    username = data.get('username', 'hanz')  # Default to current user
    
    conn = sqlite3.connect('community.db')
    cursor = conn.cursor()
    
    # Get user_id from username
    cursor.execute('SELECT id FROM users WHERE username = ?', (username,))
    user_result = cursor.fetchone()
    
    if user_result:
        user_id = user_result[0]
        cursor.execute('INSERT INTO posts (user_id, content, votes) VALUES (?, ?, 0)', (user_id, content))
        conn.commit()
        
        # Get the new post with user info
        post_id = cursor.lastrowid
        cursor.execute('''
            SELECT p.id, u.name, u.username, p.content, p.votes
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.id = ?
        ''', (post_id,))
        
        row = cursor.fetchone()
        new_post = {
            'id': row[0],
            'name': row[1],
            'username': row[2],
            'content': row[3],
            'votes': row[4]
        }
        
        conn.close()
        return jsonify(new_post), 201
    
    conn.close()
    return jsonify({'error': 'User not found'}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)