from flask import Flask, render_template ,request,redirect, url_for, jsonify
from model import *
import os
from api import *
from flask_cors import CORS
from config import DevelopmentConfig
from flask_security import Security, SQLAlchemyUserDatastore, UserMixin, RoleMixin, login_required
from flask_security import auth_required, roles_required, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from flask_restful import marshal, fields
from sec import datastore
from PIL import Image
from sqlalchemy.orm.exc import NoResultFound
from flask_socketio import SocketIO, emit


#==============================configuration===============================
app = Flask(__name__)
socketio = SocketIO(app)
app.config.from_object(DevelopmentConfig)
api.init_app(app)
db.init_app(app)
CORS(app, resources={r"/socket.io/*": {"origins": "*"}})
app.security = Security(app, datastore)
app.app_context().push()



@app.route('/')
def index():
    return render_template('index.html')

@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message": "email not provided"}), 400

    user = datastore.find_user(email=email)

    if not user:
        return jsonify({"message": "User Not Found"}), 404
    
    if not user.active:
        return jsonify({"message": "User Not Activated"}), 400
    

    if check_password_hash(user.password, data.get("password")):
        return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name, "username": user.username, "id": user.id})
    else:
        return jsonify({"message": "Wrong Password"}), 400
    
@app.post('/user-registration')
def user_registration():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    if not email:
        return jsonify({"message": "email not provided"}), 400
    if not password:
        return jsonify({"message": "password not provided"}), 400
    if not username:
        return jsonify({"message": "username not provided"}), 400
    if datastore.find_user(email=email):
        return jsonify({"message": "User Already Exists"}), 400
    else:
        datastore.create_user(
            username=username,
            email=email,
            password=generate_password_hash(password),
            roles=["Student"])
        db.session.commit()
        return jsonify({"message": "Student Created"}), 201
    
@app.post('/faculty-registration')
def manager_registration():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    if not email:
        return jsonify({"message": "email not provided"}), 400
    if not password:
        return jsonify({"message": "password not provided"}), 400
    if not username:
        return jsonify({"message": "username not provided"}), 400
    if datastore.find_user(email=email):
        return jsonify({"message": "User Already Exists"}), 400
    else:
        datastore.create_user(
            username=username,
            email=email,
            password=generate_password_hash(password),
            roles=["Faculty"])
        db.session.commit()
        return jsonify({"message": "Faculty Created"}), 201

timetable_fields = {
    'id': fields.Integer,
    'day': fields.String,
    'start_time': fields.String,
    'end_time': fields.String,
    'course_id': fields.Integer,
    'limit': fields.Integer,
    'room': fields.String,
    'current_count': fields.Integer,
    'slot_name': fields.String
}


@app.post('/timetable')
@marshal_with(timetable_fields)
@auth_required('token')
@roles_required('Faculty')
def create_timetable():
    data = request.get_json()
    slot = data.get('slot', None)
    slot = data.get('slot', None)
    day = slot.split(" ")[0]
    start_time = slot.split(" ")[1]
    end_time = slot.split(" ")[3]
    course_id = data.get('course_id', None)
    limit = data.get('limit', None)
    room = data.get('room', None)
    current_count = data.get('current_count', None)

    check = TimeTable.query.filter_by(day=day, start_time=start_time, end_time=end_time, room=room).first()
    if check:
        raise BusinessValidationError(status_code=400,error_code="BE1003",error_message="This slot is already taken. Please choose another slot.")
    if not day:
        raise BusinessValidationError(status_code=400,error_code="BE1001",error_message="Day is required")
    if not start_time:
        raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="Start Time is required")
    if not end_time:
        raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="End Time is required")
    if not course_id:
        raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="Course ID is required")
    if not limit:
        raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="Limit is required")
    if not room:
        raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="Room is required")
    
    timetable = TimeTable(day=day, start_time=start_time, end_time=end_time, course_id=course_id, limit=limit, room=room, current_count=current_count, slot_name=slot)
    db.session.add(timetable)
    db.session.commit()
    socketio.emit('newPostEntry', namespace='/Slots')
    return timetable, 201



@socketio.on('connect', namespace='/Slots')
def test_connect():
    print('Client connected')

@socketio.on('disconnect', namespace='/Slots')
def test_disconnect():
    print('Client disconnected')

if __name__ == "__main__":
    socketio.run(app, debug=True)
    

