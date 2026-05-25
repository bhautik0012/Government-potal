from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os
from werkzeug.utils import secure_filename

# static_folder=None: CRA build uses /static/js and /static/css under static/static/
# Flask's default /static route would 404 those files.
app = Flask(__name__, static_folder=None)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)


def _resolve_static_folder():
    """Use backend/static after build; fallback to frontend/build on Render/local."""
    candidates = [
        os.path.join(BASE_DIR, "static"),
        os.path.join(BASE_DIR, "..", "frontend", "build"),
    ]
    for folder in candidates:
        index = os.path.join(folder, "index.html")
        if os.path.isfile(index):
            return os.path.abspath(folder)
    return os.path.join(BASE_DIR, "static")


STATIC_FOLDER = _resolve_static_folder()

# --- CONFIGURATION ---
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///gov_portal_2026.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads', 'documents')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

db = SQLAlchemy(app)

# --- MODELS ---

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    role = db.Column(db.String(50), default="citizen")
    mobile = db.Column(db.String(20), nullable=True, default="Not Provided")
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)

class Scheme(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    ministry = db.Column(db.String(200))
    category = db.Column(db.String(100))
    description = db.Column(db.Text)
    eligibility = db.Column(db.Text)
    documents = db.Column(db.Text, default="Aadhaar Card, Income Certificate")
    deadline = db.Column(db.String(100), default="2026-12-31")
    how_to_apply = db.Column(db.Text, default="Apply via portal.")

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(120), nullable=False)
    scheme_name = db.Column(db.String(200), nullable=False)
    applicant_name = db.Column(db.String(200))
    income = db.Column(db.Float)
    phone = db.Column(db.String(20))
    aadhaar_no = db.Column(db.String(20))
    status = db.Column(db.String(50), default="Pending")
    remarks = db.Column(db.Text, default="") 
    aadhaar_path = db.Column(db.String(300))
    income_proof_path = db.Column(db.String(300))
    applied_on = db.Column(db.DateTime, default=datetime.utcnow)

class DocumentVault(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(120), nullable=False)
    doc_name = db.Column(db.String(200), nullable=False)
    file_path = db.Column(db.String(300), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

# --- ROUTES ---

@app.route('/uploads/documents/<filename>')
def serve_document(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# --- AUTH ---
@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({"message": "Email already exists"}), 400
    new_user = User(name=data.get('name'), email=data.get('email'), password=data.get('password'))
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Registration Successful"}), 201

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(email=data.get('email'), password=data.get('password')).first()
    if user:
        return jsonify({
            "name": user.name, "role": user.role, "email": user.email,
            "mobile": user.mobile, "joined": user.joined_at.strftime("%B %Y")
        }), 200
    return jsonify({"message": "Invalid credentials"}), 401

@app.route("/api/user/my-applications/<email>", methods=["GET"])
def get_user_applications(email):
    # Clean the email to prevent "ghost" mismatches
    clean_email = email.strip().lower()
    apps = Application.query.filter_by(user_email=clean_email).all()
    
    return jsonify([{
        "id": a.id,
        "scheme": a.scheme_name,
        "applicant": a.applicant_name,
        "income": a.income,
        "status": a.status, 
        "remarks": a.remarks,
        "date": a.applied_on.strftime("%Y-%m-%d")
    } for a in apps])


# --- ADMIN: ADD SCHEME (FIXED) ---
@app.route("/api/admin/add-scheme", methods=["POST"])
def add_scheme():
    try:
        data = request.json
        new_s = Scheme(
            name=data.get('name'),
            ministry=data.get('ministry'),
            category=data.get('category'),
            description=data.get('description'),
            eligibility=data.get('eligibility'),
            documents=data.get('documents'),
            deadline=data.get('deadline'),
            how_to_apply=data.get('how_to_apply')
        )
        db.session.add(new_s)
        db.session.commit()
        return jsonify({"message": "Scheme Added Successfully"}), 201
    except Exception as e:
        print(f"ADMIN ERROR: {str(e)}")
        return jsonify({"error": "Missing columns in database. Resetting recommended."}), 500

# --- ADMIN: DELETE SCHEME ---
@app.route("/api/admin/delete-scheme/<int:id>", methods=["DELETE"])
def delete_scheme(id):
    s = Scheme.query.get(id)
    if s:
        db.session.delete(s)
        db.session.commit()
        return jsonify({"message": "Scheme deleted"}), 200
    return jsonify({"message": "Not found"}), 404

# --- SCHEME APPLICATION ---
@app.route("/api/apply", methods=["POST"])
def apply_scheme():
    try:
        email = request.form.get('email')
        new_app = Application(
            user_email=email,
            scheme_name=request.form.get('scheme_name'),
            applicant_name=request.form.get('applicant_name'),
            income=float(request.form.get('income', 0)),
            phone=request.form.get('phone'),
            aadhaar_no=request.form.get('aadhaar_no')
        )
        
        a_file = request.files.get('aadhaar')
        i_file = request.files.get('income_proof')
        
        if a_file:
            a_path = secure_filename(f"app_{email}_a_{a_file.filename}")
            a_file.save(os.path.join(app.config['UPLOAD_FOLDER'], a_path))
            new_app.aadhaar_path = a_path
        if i_file:
            i_path = secure_filename(f"app_{email}_i_{i_file.filename}")
            i_file.save(os.path.join(app.config['UPLOAD_FOLDER'], i_path))

        db.session.add(new_app)
        db.session.commit()
        return jsonify({"message": "Submitted"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- PUBLIC LISTINGS ---
@app.route("/api/schemes", methods=["GET"])
def list_schemes():
    schemes = Scheme.query.all()
    return jsonify([{
        "id": s.id, "name": s.name, "category": s.category, "ministry": s.ministry,
        "description": s.description, "eligibility": s.eligibility,
        "deadline": s.deadline
    } for s in schemes])

@app.route("/api/schemes/<int:id>", methods=["GET"])
def get_single_scheme(id):
    s = Scheme.query.get(id)
    if s:
        return jsonify({
            "id": s.id, "name": s.name, "ministry": s.ministry, "category": s.category,
            "description": s.description, "eligibility": s.eligibility,
            "documents": s.documents, "deadline": s.deadline, "how_to_apply": s.how_to_apply
        }), 200
    return jsonify({"message": "Not found"}), 404

@app.route("/api/seed-all")
def seed():
    if not User.query.filter_by(role="admin").first():
        db.session.add(User(name="Admin", email="admin@gov.in", password="adminpassword", role="admin"))
        db.session.commit()
    return "Seeded"

# --- ENHANCED AUTO-DB INITIALIZER ---
with app.app_context():
    try:
        # Pings all tables to check for column health
        User.query.first()
        Scheme.query.first()
        Application.query.first()
        DocumentVault.query.first()
    except Exception as e:
        print(f"⚠️ DATABASE OUT OF SYNC: {str(e)}")
        print("🔄 Performing total schema reset...")
        db.drop_all()
        db.create_all()
        print("✅ Database successfully modernized.")

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    """Serve React build (phone/browser). API routes registered above take priority."""
    if path:
        file_path = os.path.join(STATIC_FOLDER, path)
        if os.path.isfile(file_path):
            return send_from_directory(STATIC_FOLDER, path)
    index = os.path.join(STATIC_FOLDER, "index.html")
    if os.path.isfile(index):
        return send_from_directory(STATIC_FOLDER, "index.html")
    return jsonify({
        "status": "Online",
        "message": "Frontend not built. Run build.sh or check Render build logs.",
        "static_folder": STATIC_FOLDER,
        "index_exists": os.path.isfile(index),
    }), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "1") == "1"
    app.run(host="0.0.0.0", port=port, debug=debug)