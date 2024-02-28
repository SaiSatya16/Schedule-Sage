from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin

db = SQLAlchemy()


class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=False)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    description = db.Column(db.String(255))
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role', secondary='roles_users',
                            backref=db.backref('users', lazy='dynamic'))
    image = db.Column(db.String(100))
    courses = db.relationship('Course', backref='student', lazy='dynamic')
    tasks = db.relationship('Tasks', backref='student_tasks', lazy='dynamic')



class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False, unique=True)
    description = db.Column(db.String, nullable=False)


class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    image = db.Column(db.String)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    time_table = db.relationship('TimeTable', backref='course', lazy='dynamic')
    # assignments = db.relationship('Assignment', backref='course', lazy='dynamic')



class TimeTable(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    day = db.Column(db.String, nullable=False)
    start_time = db.Column(db.String, nullable=False)
    end_time = db.Column(db.String, nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'))


class Tasks(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    day = db.Column(db.String, nullable=False)
    start_time = db.Column(db.String, nullable=False)
    end_time = db.Column(db.String, nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    



    
    
# class Assignment(db.Model):
#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     name = db.Column(db.String, nullable=False)
#     description = db.Column(db.String, nullable=False)
#     image = db.Column(db.String, nullable=False)
#     course_id = db.Column(db.Integer, db.ForeignKey('course.id'))
#     submissions = db.relationship('Submission', backref='assignment', lazy='dynamic')

# class Submission(db.Model):






   

