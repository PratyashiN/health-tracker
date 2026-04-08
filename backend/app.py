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

print("APP STARTED SUCCESSFULLY")