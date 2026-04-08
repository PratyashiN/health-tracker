from flask import Blueprint, request, jsonify
from datetime import date
from models import get_db

routes_bp = Blueprint("routes", __name__)

# ➕ Add water
@routes_bp.route("/add_water", methods=["POST"])
def add_water():
    data = request.json
    today = date.today().isoformat()

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO water (name, amount, date) VALUES (?, ?, ?)",
        (data["name"], data["amount"], today)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Added successfully"})


# 📊 Get today's data
@routes_bp.route("/get_water", methods=["GET"])
def get_water():
    today = date.today().isoformat()

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM water WHERE date=?", (today,))
    rows = cursor.fetchall()

    conn.close()

    return jsonify([dict(row) for row in rows])


# ❌ Delete
@routes_bp.route("/delete/<int:id>", methods=["DELETE"])
def delete(id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM water WHERE id=?", (id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Deleted"})


# ✏️ Edit
@routes_bp.route("/update/<int:id>", methods=["PUT"])
def update(id):
    data = request.json

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE water SET name=?, amount=? WHERE id=?",
        (data["name"], data["amount"], id)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Updated"})


# 🎯 Set goal
@routes_bp.route("/set_goal", methods=["POST"])
def set_goal():
    data = request.json

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT OR REPLACE INTO goals (name, goal) VALUES (?, ?)",
        (data["name"], data["goal"])
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Goal set"})


# 🎯 Get goals
@routes_bp.route("/get_goals", methods=["GET"])
def get_goals():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM goals")
    rows = cursor.fetchall()

    conn.close()

    return jsonify([dict(row) for row in rows])