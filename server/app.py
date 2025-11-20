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

        # Parse format: RAW: DATA:LIGHT=484,TEMP=27.94,SOUND=111,BPM=-999,SPO2=-999
        if "DATA:" in raw:
            raw = raw.split("DATA:")[1]
        
        parts = raw.split(",")
        data = {}
        for part in parts:
            if "=" in part:
                key, value = part.split("=")
                data[key] = value

        light = int(data.get("LIGHT", 0))
        temp = float(data.get("TEMP", 0))
        sound = int(data.get("SOUND", 0))
        bpm = int(data.get("BPM", -999))

        save_reading(light, temp, sound, bpm)

        return jsonify({
            "light": light,
            "temperature": temp,
            "sound": sound,
            "bpm": bpm
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/history")
def history():
    rows = get_history(50)
    formatted = [
        {"timestamp": r[0], "light": r[1], "temperature": r[2], "sound": r[3], "bpm": r[4]}
        for r in rows
    ]
    return jsonify(formatted)


if __name__ == "__main__":
    print("Flask server running at http://127.0.0.1:5000")
    app.run(host="0.0.0.0", port=5000)
