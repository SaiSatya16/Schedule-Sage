from app import app
from sec import datastore
from model import db, User, Role
from flask_security import hash_password
from werkzeug.security import generate_password_hash


with app.app_context():
    db.create_all()
    datastore.find_or_create_role(name="Administration", description="user is Administration")
    datastore.find_or_create_role(name="Faculty", description="user is Faculty")
    datastore.find_or_create_role(name="Student", description="user is Student")
    db.session.commit()
    if not datastore.find_user(email="administration@gmail.com"):
        datastore.create_user(
            username="administration",
            email="administration@gmail.com",
            password= generate_password_hash("administration"),
            roles=["Administration"])
    if not datastore.find_user(email="faculty1@gmail.com"):
        datastore.create_user(
            username="faculty1",
            email="faculty1@gmail.com",
            password=generate_password_hash("faculty1"),
            roles=["Faculty"])
    if not datastore.find_user(email="student1@gmail.com"):
        datastore.create_user(
            username="student1",
            email="student1@gmail.com",
            password=generate_password_hash("student1"),
            roles=["Student"])
    
    db.session.commit()

