from flask import request, jsonify
from functools import wraps
import jwt
import datetime
import pymysql

from app import app

SECRET_KEY = "ini_sangat_rahasia"

# Fungsi untuk membuat koneksi ke MySQL
def get_mysql_connection():
    return pymysql.connect(
        host='localhost',  
        user='root',       
        password='',        
        database='app_db',  
        cursorclass=pymysql.cursors.DictCursor
    )

# Fungsi untuk membuat token JWT
def generate_token(username):
    payload = {
        'username': username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

# Decorator untuk memverifikasi token JWT
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'message': 'Token is missing!'}), 403

        try:
            # Memverifikasi token
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_user = data['username']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 403
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 403

        return f(current_user, *args, **kwargs)

    return decorated


# Route untuk login dan mendapatkan token
@app.route('/login', methods=['POST'])
def login():
    con = get_mysql_connection()
    cursor = con.cursor()
    
    auth = request.authorization
    if not auth or not auth.username or not auth.password:
        return jsonify({'message': 'Username dan password harus diisi!'}), 401

    cursor.execute('SELECT username, password FROM user WHERE username=%s', (auth.username,))
    user = cursor.fetchone()
    con.close()

    if user and auth.password == user['password']:
        token = generate_token(auth.username)
        return jsonify({'token': token})

    return jsonify({'message': 'Password atau Username salah!'}), 401


# Route yang memerlukan token untuk diakses
@app.route('/protected', methods=['GET'])
@token_required
def protected(current_user):
    return jsonify({'message': f'Hello, {current_user}! This is a protected route.'})


# Route untuk register
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if 'username' not in data or 'password' not in data:
        return jsonify({'message': 'Data tidak valid'}), 400
    
    con = get_mysql_connection()
    cursor = con.cursor()

    # Membuat tabel jika belum ada
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        )
    """)
    con.commit()

    try:
        cursor.execute('INSERT INTO user (username, password) VALUES (%s, %s)', 
                       (data['username'], data['password']))
        con.commit()
        return jsonify({'message': 'Register berhasil!'})
    except pymysql.IntegrityError:
        return jsonify({'message': 'Username telah tersedia!'})
    except Exception as e:
        return jsonify({'message': f'Terjadi kesalahan: {e}'})
    finally:
        con.close()
