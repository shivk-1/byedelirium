from flask import Flask, jsonify
from flask_cors import CORS
import serial
import json
from database import init_db, save_reading, get_history

app = Flask(__name__)
CORS(app)

init_db()

# Change COM3 to your Arduino serial port name
ser = serial.Serial("COM3", 9600, timeout=1)

@app.route("/current")
def current():
    try:
        raw = ser.readline().decode().strip()
        if not raw:
            return jsonify({"error": "no data"}), 400

        data = json.loads(raw)
        hr = int(data["heart_rate"])
        temp = int(data["temperature"])

        save_reading(hr, temp)

        return jsonify({
            "heart_rate": hr,
            "temperature": temp
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/history")
def history():
    rows = get_history(50)
    formatted = [
        {"timestamp": r[0], "heart_rate": r[1], "temperature": r[2]}
        for r in rows
    ]
    return jsonify(formatted)


if __name__ == "__main__":
    print("Flask server running at http://127.0.0.1:5000")
    app.run(host="0.0.0.0", port=5000)
