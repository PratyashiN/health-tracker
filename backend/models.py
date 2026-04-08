import sqlite3

def get_db():
    conn = sqlite3.connect("health.db")
    conn.row_factory = sqlite3.Row
    return conn

def create_tables():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS water (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        amount INTEGER,
        date TEXT
    )
    """)

    conn.commit()
    conn.close()