import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from feature_extractor import analyse_file

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:3002"])
app.config["MAX_CONTENT_LENGTH"] = 50 * 1024 * 1024

ALLOWED = {"wav","mp3","m4a","ogg","flac"}

def allowed(filename):
    return "." in filename and filename.rsplit(".",1)[1].lower() in ALLOWED

@app.route("/voice/health", methods=["GET"])
def health():
    return jsonify({"status":"ok","service":"voice-analysis","port":5003})

@app.route("/voice/analyze", methods=["POST"])
def analyze():
    if "audio" not in request.files:
        return jsonify({"error":"No audio file. Send as 'audio' field."}), 400
    file = request.files["audio"]
    if file.filename == "":
        return jsonify({"error":"Empty filename."}), 400
    if not allowed(file.filename):
        return jsonify({"error":"Unsupported format. Use WAV/MP3/M4A/OGG/FLAC"}), 400
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    try:
        result = analyse_file(filepath)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error":str(e)}), 500
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)

if __name__ == "__main__":
    print("[voice API] Starting on http://localhost:5003")
    app.run(port=5003, debug=False)
