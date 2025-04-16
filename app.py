from flask import Flask, render_template, request, jsonify
import sqlite3
import secrets

app = Flask(__name__)

# Initialize the database
def init_db():
    conn = sqlite3.connect("passwords.db")
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS passwords (
                    id INTEGER PRIMARY KEY AUTOINCREMENT, 
                    website TEXT, 
                    username TEXT, 
                    password TEXT)''')
    conn.commit()
    conn.close()

init_db()

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get_passwords", methods=["GET"])
def get_passwords():
    search_query = request.args.get("search", "")
    conn = sqlite3.connect("passwords.db")
    c = conn.cursor()
    if search_query:
        c.execute("SELECT id, website, username FROM passwords WHERE website LIKE ?", ('%' + search_query + '%',))
    else:
        c.execute("SELECT id, website, username FROM passwords")
    passwords = [{"id": row[0], "website": row[1], "username": row[2]} for row in c.fetchall()]
    conn.close()
    return jsonify(passwords)

@app.route("/get_password/<int:id>", methods=["GET"])
def get_password(id):
    conn = sqlite3.connect("passwords.db")
    c = conn.cursor()
    c.execute("SELECT password FROM passwords WHERE id = ?", (id,))
    row = c.fetchone()
    conn.close()
    return jsonify({"password": row[0]} if row else {"error": "Password not found"})

@app.route("/add_password", methods=["POST"])
def add_password():
    data = request.json
    conn = sqlite3.connect("passwords.db")
    c = conn.cursor()
    c.execute("INSERT INTO passwords (website, username, password) VALUES (?, ?, ?)", 
              (data["website"], data["username"], data["password"]))
    conn.commit()
    conn.close()
    return jsonify({"message": "Password saved!"})

@app.route("/delete_password/<int:id>", methods=["DELETE"])
def delete_password(id):
    conn = sqlite3.connect("passwords.db")
    c = conn.cursor()
    c.execute("DELETE FROM passwords WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Password deleted"})

@app.route("/clear_database", methods=["DELETE"])
def clear_database():
    conn = sqlite3.connect("passwords.db")
    c = conn.cursor()
    c.execute("DELETE FROM passwords")
    conn.commit()
    conn.close()
    return jsonify({"message": "All passwords deleted"})

@app.route("/generate_password", methods=["GET"])
def generate_password():
    new_password = secrets.token_urlsafe(8)
    return jsonify({"password": new_password})

if __name__ == "__main__":
    app.run(debug=True)
