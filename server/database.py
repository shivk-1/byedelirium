import sqlite3

DB_FILE = "patient_data.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS readings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            light INTEGER,
            temperature REAL,
            sound INTEGER,
            bpm INTEGER
        )
    """)
    conn.commit()
    conn.close()

def save_reading(light, temp, sound, bpm):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute(
        "INSERT INTO readings (light, temperature, sound, bpm) VALUES (?, ?, ?, ?)",
        (light, temp, sound, bpm)
    )
    conn.commit()
    conn.close()

def get_history(limit=50):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute(
        "SELECT timestamp, light, temperature, sound, bpm FROM readings ORDER BY id DESC LIMIT ?",
        (limit,)
    )
    rows = c.fetchall()
    conn.close()
    return rows
