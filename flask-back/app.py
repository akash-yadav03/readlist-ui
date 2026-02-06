import os
from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
mysql = MySQL()
mysql.init_app(app)
CORS(app)
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')

@app.route('/boopi/books', methods=['GET'])
def get_books():
    limit = request.args.get('limit', default=10, type=int)
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM book LIMIT %s;", (limit,))
    books = cursor.fetchall()
    cursor.close()
    return jsonify(books)

@app.route('/boopi/<int:user_id>/books', methods=['POST'])
def set_book_status(user_id):
    
    data = request.json
    users = user_id
    book_id = data.get('book_id')
    status = data.get('status')

    if status not in ['want to', 'ongoing', 'complete']:
        return jsonify({"error": "Invalid status"}), 400

    cur = mysql.connection.cursor()

    query = """
        INSERT INTO user_book (user_id, book_id, status)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE
            status = VALUES(status)
    """

    cur.execute(query, (users, book_id, status))
    mysql.connection.commit()
    cur.close()

    return jsonify({"message": "Book status updated successfully"}), 200

@app.route('/boopi/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "Invalid username or password"}), 401

    cur = mysql.connection.cursor()
    cur.execute("SELECT id, username, password FROM users WHERE username = %s", (username,))
    user = cur.fetchone()
    cur.close()

    if user is None or not check_password_hash(user[2], password):
        return jsonify({"message": "Invalid credentials"}), 401
    return jsonify({"message": "Login successful", "id": user[0], "username": user[1]}), 200
    
@app.route('/boopi/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    cur = mysql.connection.cursor()
    cur.execute("SELECT id FROM users WHERE username = %s", (username,))
    existing_user = cur.fetchone()

    if existing_user:
        cur.close()
        return jsonify({"message": "Username already exists"}), 409
    
    hashed_password = generate_password_hash(password) 
    cur.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, hashed_password))
    mysql.connection.commit()
    user_id = cur.lastrowid
    cur.close()

    return jsonify({"message": "User registered successfully", "user_id": user_id, "username": username}), 201

@app.route("/boopi/users/<int:user_id>/books", methods=["GET"])
def get_book_status(user_id):
    cur = mysql.connection.cursor()
    status = request.args.get("status")

    if status:
        cur.execute(
            """
            SELECT b.id, b.title, b.author, b.genre, b.year, b.description 
            FROM book b 
            JOIN user_book ub ON b.id = ub.book_id 
            WHERE ub.user_id = %s AND ub.status = %s;
            """,
        (user_id, status))
    else:
        error_msg = "Status parameter is required."
        return jsonify({"error": error_msg}), 400
    
    books = cur.fetchall()
    cur.close()

    return jsonify(books)
 

if __name__ == '__main__':
    app.run(debug=True)
 
