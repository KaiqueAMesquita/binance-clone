from flask import Flask, render_template
from controllers.analysis_controller import bp_analysis
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    # Allow requests from the frontend (localhost:3000). Adjust origins for production.
    CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})
    app.register_blueprint(bp_analysis)

    @app.route("/")
    def home():
        return render_template("index.html")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)