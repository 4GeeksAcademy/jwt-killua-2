"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password required"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "User already exists"}), 400

    new_user = User(email=data["email"], is_active=True)
    new_user.set_password(data["password"])

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created"}), 201


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password required"}), 400

    user = User.query.filter_by(email=data["email"]).first()

    if not user or not user.check_password(data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token}), 200

@api.route('/private', methods=['GET'])
@jwt_required()
def private():
    current_user_id = get_jwt_identity()

    try:
        user_id = int(current_user_id)
    except ValueError:
        return jsonify({"error": "Invalid user ID format"}), 422

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify({"message": f"Hello {user.email}, you are in a private route"}), 200
