from flask import Blueprint, request, jsonify
from models import get_db
from datetime import date

routes_bp = Blueprint('routes', __name__)


# ➕ Add water
@routes_bp.route("/add_water", methods=["POST"])
def add_water():
    data = request.json

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO water (name, amount, date) VALUES (?, ?, ?)",
        (data["name"], data["amount"], data["date"])
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

    cursor.execute("SELECT * FROM water WHERE date = ?", (today,))
    rows = cursor.fetchall()

    conn.close()

    result = []
    for row in rows:
        result.append({
            "id": row["id"],
            "name": row["name"],
            "amount": row["amount"],
            "date": row["date"]
        })

    return jsonify(result)


# ❌ Delete
@routes_bp.route("/delete/<int:id>", methods=["DELETE"])
def delete_entry(id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM water WHERE id = ?", (id,))

    conn.commit()
    conn.close()

    return jsonify({"message": "Deleted"})


# ✏️ Update
@routes_bp.route("/update/<int:id>", methods=["PUT"])
def update_entry(id):
    data = request.json

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE water SET name = ?, amount = ? WHERE id = ?",
        (data["name"], data["amount"], id)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Updated"})