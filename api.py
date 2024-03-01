from flask_restful import Resource, Api, fields, marshal_with, reqparse
from model import *
from werkzeug.exceptions import HTTPException
from flask_cors import CORS
import json
from flask import make_response
from flask_security import auth_required, roles_required
import os
from functools import wraps
from flask import abort, request
from flask_security import roles_accepted
from sqlalchemy.exc import IntegrityError
from PIL import Image
import io

api = Api()

def any_role_required(*roles):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            if not roles_accepted(*roles):
                abort(403, description="Insufficient permissions")
            return fn(*args, **kwargs)
        return decorator
    return wrapper

def resize_image(input_path, output_path, scale_percent=20, quality=90, dpi=72):
    # Open the image
    original_image = Image.open(input_path)

    # Calculate new dimensions
    width, height = original_image.size
    new_width = int(width * scale_percent / 100)
    new_height = int(height * scale_percent / 100)

    # Resize the image
    resized_image = original_image.resize((new_width, new_height), Image.ANTIALIAS)

    # Set the DPI
    resized_image.info['dpi'] = (dpi, dpi)

    # Save the resized image with the specified quality
    resized_image.save(output_path, quality=quality)


#==========================Validation========================================================
class NotFoundError(HTTPException):
    def __init__(self,status_code):
        message = {"error_code":"BE1009","error_message":"Not Found"}
        self.response = make_response(json.dumps(message), status_code)

class BusinessValidationError(HTTPException):
    def __init__(self, status_code, error_code, error_message):
        message = {"error_code":error_code,"error_message":error_message}
        self.response = make_response(json.dumps(message), status_code)


#==============================output fields========================================
course_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'image': fields.String,
    'student_id': fields.Integer,
    'faculty_name': fields.String
}

timetable_fields = {
    'id': fields.Integer,
    'day': fields.String,
    'start_time': fields.String,
    'end_time': fields.String,
    'course_id': fields.Integer
}

tasks_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'day': fields.String,
    'start_time': fields.String,
    'end_time': fields.String,
    'student_id': fields.Integer
}



#====================Create request pares=======================================

create_course_parser = reqparse.RequestParser()
create_course_parser.add_argument('name')
create_course_parser.add_argument('description')
create_course_parser.add_argument('image')
create_course_parser.add_argument('student_id')
create_course_parser.add_argument('faculty_name')

create_timetable_parser = reqparse.RequestParser()
create_timetable_parser.add_argument('day')
create_timetable_parser.add_argument('start_time')
create_timetable_parser.add_argument('end_time')
create_timetable_parser.add_argument('course_id')
create_timetable_parser.add_argument('limit')

create_tasks_parser = reqparse.RequestParser()
create_tasks_parser.add_argument('name')
create_tasks_parser.add_argument('description')
create_tasks_parser.add_argument('day')
create_tasks_parser.add_argument('start_time')
create_tasks_parser.add_argument('end_time')
create_tasks_parser.add_argument('student_id')

#====================Update request pares=======================================

update_course_parser = reqparse.RequestParser()
update_course_parser.add_argument('name')
update_course_parser.add_argument('description')
update_course_parser.add_argument('image')
update_course_parser.add_argument('student_id')
update_course_parser.add_argument('faculty_name')

update_timetable_parser = reqparse.RequestParser()
update_timetable_parser.add_argument('day')
update_timetable_parser.add_argument('start_time')
update_timetable_parser.add_argument('end_time')
update_timetable_parser.add_argument('course_id')
update_timetable_parser.add_argument('limit')


update_tasks_parser = reqparse.RequestParser()
update_tasks_parser.add_argument('name')
update_tasks_parser.add_argument('description')
update_tasks_parser.add_argument('day')
update_tasks_parser.add_argument('start_time')
update_tasks_parser.add_argument('end_time')
update_tasks_parser.add_argument('student_id')


#==============================Faculty Course API========================================

class FacultyCourseAPI(Resource):
    def get(self,name):
        data = []

        #query all courses of faculty name order by id in descending order
        courses = Course.query.filter_by(faculty_name=name).order_by(Course.id.desc()).all()
        if not courses:
            # Return an empty list if there are no courses
            return data

        for course in courses:
            Time_table = []
            for timetable in course.time_table:
                Time_table.append({
                    "id": timetable.id,
                    "day": timetable.day,
                    "start_time": timetable.start_time,
                    "end_time": timetable.end_time,
                    "course_id": timetable.course_id,
                    "limit": timetable.limit,
                    "course_name": course.name,
                })
            
            
            

            data.append({
                "id": course.id,
                "name": course.name,
                "description": course.description,
                "image": course.image,
                "student_id": course.student_id,
                "faculty_name": course.faculty_name,
                "time_table": Time_table
            })

        return data
    
    @marshal_with(course_fields)
    def post(self):
        args = create_course_parser.parse_args()
        name = args.get('name', None)
        description = args.get('description', None)
        student_id = args.get('student_id', None)
        faculty_name = args.get('faculty_name', None)

        if not name:
            raise BusinessValidationError(status_code=400,error_code="BE1001",error_message="Course name is required")
        if not description:
            raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="Course description is required")
        
        course = Course(name=name, description=description, student_id=student_id, faculty_name=faculty_name)
        db.session.add(course)
        db.session.commit()
        return course, 201
    
    @marshal_with(course_fields)
    def put(self, id):
        args = update_course_parser.parse_args()
        name = args.get('name', None)
        description = args.get('description', None)
        # student_id = args.get('student_id', None)
        # faculty_name = args.get('faculty_name', None)

        course = Course.query.get(id)

        if not course:
            raise NotFoundError(status_code=404)
        
        if name:
            course.name = name
        if description:
            course.description = description
        # if student_id:
        #     course.student_id = student_id
        # if faculty_name:
        #     course.faculty_name = faculty_name
        
        db.session.commit()
        return course, 200
    
    def delete(self, id):
        course = Course.query.get(id)
        if not course:
            raise NotFoundError(status_code=404)
        
        db.session.query(TimeTable).filter_by(course_id=id).delete()
        db.session.delete(course)
        db.session.commit()
        return 'Course Deleted Successfully', 204

#==============================Student Course API========================================
class StudentCourseAPI(Resource):
    def get(self):
        data = []
        #query all courses order by id in descending order
        courses = Course.query.order_by(Course.id.desc()).all()
        if not courses:
            # Return an empty list if there are no courses
            return data

        for course in courses:
            Time_table = []
            for timetable in course.time_table:
                Time_table.append({
                    "id": timetable.id,
                    "day": timetable.day,
                    "start_time": timetable.start_time,
                    "end_time": timetable.end_time,
                    "course_id": timetable.course_id,
                    "limit": timetable.limit
                })
            data.append({
                "id": course.id,
                "name": course.name,
                "description": course.description,
                "image": course.image,
                "student_id": course.student_id,
                "faculty_name": course.faculty_name,
                "time_table": Time_table
            })
        return data

#==============================TimeTable API========================================
class TimeTableAPI(Resource):
    def get(self):
        data = []
        #query all timetables order by id in descending order
        timetables = TimeTable.query.order_by(TimeTable.id.desc()).all()
        if not timetables:
            # Return an empty list if there are no timetables
            return data

        for timetable in timetables:
            data.append({
                "id": timetable.id,
                "day": timetable.day,
                "start_time": timetable.start_time,
                "end_time": timetable.end_time,
                "course_id": timetable.course_id,
                "limit": timetable.limit
            })

        return data
    
    @marshal_with(timetable_fields)
    def post(self):
        args = create_timetable_parser.parse_args()
        day = args.get('day', None)
        start_time = args.get('start_time', None)
        end_time = args.get('end_time', None)
        course_id = args.get('course_id', None)
        limit = args.get('limit', None)

        if not day:
            raise BusinessValidationError(status_code=400,error_code="BE1001",error_message="Day is required")
        if not start_time:
            raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="Start Time is required")
        if not end_time:
            raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="End Time is required")
        if not course_id:
            raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="Course ID is required")
        
        timetable = TimeTable(day=day, start_time=start_time, end_time=end_time, course_id=course_id, limit=limit)
        db.session.add(timetable)
        db.session.commit()
        return timetable, 201
    
    @marshal_with(timetable_fields)
    def put(self, id):
        args = update_timetable_parser.parse_args()
        day = args.get('day', None)
        start_time = args.get('start_time', None)
        end_time = args.get('end_time', None)
        course_id = args.get('course_id', None)
        limit = args.get('limit', None)

        timetable = TimeTable.query.get(id)

        if not timetable:
            raise NotFoundError(status_code=404)
        
        if day:
            timetable.day = day
        if start_time:
            timetable.start_time = start_time
        if end_time:
            timetable.end_time = end_time
        if course_id:
            timetable.course_id = course_id
        if limit:
            timetable.limit = limit
        
        db.session.commit()
        return timetable, 200
    
    def delete(self, id):
        timetable = TimeTable.query.get(id)
        if not timetable:
            raise NotFoundError(status_code=404)
        
        db.session.delete(timetable)
        db.session.commit()
        return 'TimeTable Deleted Successfully', 204
    

#==============================Tasks API========================================
class TasksAPI(Resource):
    def get(self):
        data = []
        #query all tasks order by id in descending order
        tasks = Tasks.query.order_by(Tasks.id.desc()).all()
        if not tasks:
            # Return an empty list if there are no tasks
            return data

        for task in tasks:
            data.append({
                "id": task.id,
                "name": task.name,
                "description": task.description,
                "day": task.day,
                "start_time": task.start_time,
                "end_time": task.end_time,
                "student_id": task.student_id
            })

        return data
    
    @marshal_with(tasks_fields)
    def post(self):
        args = create_tasks_parser.parse_args()
        name = args.get('name', None)
        description = args.get('description', None)
        day = args.get('day', None)
        start_time = args.get('start_time', None)
        end_time = args.get('end_time', None)
        student_id = args.get('student_id', None)

        if not name:
            raise BusinessValidationError(status_code=400,error_code="BE1001",error_message="Task name is required")
        if not description:
            raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="Task description is required")
        if not day:
            raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="Day is required")
        if not start_time:
            raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="Start Time is required")
        if not end_time:
            raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="End Time is required")
        
        task = Tasks(name=name, description=description, day=day, start_time=start_time, end_time=end_time, student_id=student_id)
        db.session.add(task)
        db.session.commit()
        return task, 201
    
    @marshal_with(tasks_fields)
    def put(self, id):
        args = update_tasks_parser.parse_args()
        name = args.get('name', None)
        description = args.get('description', None)
        day = args.get('day', None)
        start_time = args.get('start_time', None)
        end_time = args.get('end_time', None)
        student_id = args.get('student_id', None)


        task = Tasks.query.get(id)

        if not task:
            raise NotFoundError(status_code=404)
        
        if name:
            task.name = name
        if description:
            task.description = description
        if day:
            task.day = day
        if start_time:
            task.start_time = start_time
        if end_time:
            task.end_time = end_time
        if student_id:
            task.student_id = student_id

        db.session.commit()
        return task, 200
    
    def delete(self, id):
        task = Tasks.query.get(id)
        if not task:
            raise NotFoundError(status_code=404)
        
        db.session.delete(task)
        db.session.commit()
        return 'Task Deleted Successfully', 204
    

#==============================User Profile API========================================
class UserProfileAPI(Resource):
    def get(self, id):
        data = []
        user = User.query.filter_by(id=id).first()
        if user is None:
            raise NotFoundError(status_code=404)
        courses = Course.query.filter_by(student_id=id).order_by(Course.id.desc()).all()
        if not courses:
            # Return an empty list if there are no courses
            return data
        for course in courses:
            Time_table = []
            for timetable in course.time_table:
                Time_table.append({
                    "id": timetable.id,
                    "day": timetable.day,
                    "start_time": timetable.start_time,
                    "end_time": timetable.end_time,
                    "course_id": timetable.course_id,
                    "limit": timetable.limit
                })
            data.append({
                "id": course.id,
                "name": course.name,
                "description": course.description,
                "image": course.image,
                "student_id": course.student_id,
                "faculty_name": course.faculty_name,
                "time_table": Time_table
            })
        return data
    

    

#==============================API Endpoints========================================
api.add_resource(FacultyCourseAPI, '/course/<name>', '/course/<int:id>', '/course')
api.add_resource(TimeTableAPI, '/timetable', '/timetable/<int:id>')
api.add_resource(TasksAPI, '/tasks', '/tasks/<int:id>')
api.add_resource(UserProfileAPI, '/user-profile/<int:id>')
api.add_resource(StudentCourseAPI, '/courses')


       


        
       

        
    










