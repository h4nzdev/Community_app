from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

db_path = "community.db"

def init_db() :
    conn = sqlite3.connect(db_path)
    conn.execute("""
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY,
        full_name TEXT NOT NULL,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
    )
    """)
    
    conn.commit()
    conn.close()
    
@app.route("/api/signup", methods=["POST"])
def sign_up() :
    data = request.get_json()
    
    full_name = data.get("fullname")
    username = data.get("username")
    password = data.get("password")
    email = data.get("email")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (full_name, username, password, email) VALUES (?, ?, ?, ?)", (full_name, username, password, email))
    conn.commit()
    conn.close()
    
    return jsonify({"message" : "Registered Successfully!"}), 200
    
@app.route("/api/login", methods=["POST"])
def login() :
    data = request.get_json()
    
    email = data.get("email")
    password = data.get("password")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email=?", (email,))
    user = cursor.fetchone()
    conn.close()
    
    if user :
        db_password = user[3]
        user_details = {
        "id" : user[0],
        "full_name" : user[1],
        "username" : user[2],
        "email" : user[4]
        }
        
        if db_password == password :
            return jsonify({"message" : "Successfully loggedin", "user" : user_details}), 200
        else :
            return jsonify({"error" : "Wrong Password"}), 401
    else :
        return jsonify({"message" : "Email not found!"}), 404
    
if __name__ == "__main__" :
    init_db()
    app.run(debug=True)
    