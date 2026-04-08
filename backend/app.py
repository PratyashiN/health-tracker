from flask import Flask
from flask_cors import CORS
from models import create_tables
from routes import routes_bp

app = Flask(__name__)
CORS(app)

create_tables()

app.register_blueprint(routes_bp)

@app.route("/")
def home():
    return "Backend running!"

if __name__ == "__main__":
    import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)