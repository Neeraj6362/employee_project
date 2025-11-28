from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os
from dateutil import parser

app = Flask(__name__)
CORS(app)

# Environment variables for DB connection
DB_HOST = os.getenv("DB_HOST", "mysql")
DB_USER = os.getenv("DB_USER", "appuser")
DB_PASS = os.getenv("DB_PASSWORD", "apppass")
DB_NAME = os.getenv("DB_NAME", "employees_db")

def get_db():
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        database=DB_NAME,
        autocommit=True
    )

@app.route('/')
def index():
    return "Employee API is running"

@app.route("/employees/<int:emp_id>", methods=["GET"])
def get_employees(emp_id):
    db = get_db()
    cur = db.cursor(dictionary=True)
    cur.execute("SELECT * FROM employees WHERE emp_id=%s", (emp_id,))
    row = cur.fetchone()
    cur.close()
    db.close()
    if not row:
        return jsonify({"message": "Employee not found"}), 404
    for k in ("joining_date", "relieving_date"):
        if row.get(k):
            row[k] = row[k].isoformat()
    return jsonify(row)

@app.route("/employees", methods=["POST"])
def add_employees():
    data = request.json or {}
    required = ["emp_id", "name", "email", "joining_date", "role"]
    missing = [x for x in required if x not in data]
    if missing:
        return jsonify({"message": "Missing fields", "missing": missing}), 400

    try:
        joining = parser.isoparse(data["joining_date"]).date()
        relieving = parser.isoparse(data["relieving_date"]).date() if data.get("relieving_date") else None
    except Exception:
        return jsonify({"message": "Invalid date format"}), 400

    db = get_db()
    cur = db.cursor()
    try:
        cur.execute("""
            INSERT INTO employees (emp_id, name, email, joining_date, relieving_date, role)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            data["emp_id"],
            data["name"],
            data["email"],
            joining,
            relieving,
            data["role"]
        ))
        db.commit()
    except Exception as e:
        db.rollback()
        print("DB error:", e)  # Log the actual error to container logs
        return jsonify({"message": "DB error", "error": str(e)}), 500
    finally:
        cur.close()
        db.close()

    return jsonify({"message": "Employee added"}), 201

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)