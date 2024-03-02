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
    'course_id': fields.Integer,
    'limit': fields.Integer,
    'room': fields.String,
    'current_count': fields.Integer,
    'slot_name': fields.String
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

student_time_table_fields = {
    'id': fields.Integer,
    'day': fields.String,
    'start_time': fields.String,
    'end_time': fields.String,
    'course_id': fields.Integer,
    'student_id': fields.Integer
}

ClassRoom_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String
}

ClassRoomSlots_fields = {
    'id': fields.Integer,
    'day': fields.String,
    'start_time': fields.String,
    'end_time': fields.String
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
create_timetable_parser.add_argument('student_id')
create_timetable_parser.add_argument('room')
create_timetable_parser.add_argument('current_count')
create_timetable_parser.add_argument('slot')

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
update_timetable_parser.add_argument('student_id')
update_timetable_parser.add_argument('room')
update_timetable_parser.add_argument('current_count')
update_timetable_parser.add_argument('slot')



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
                    "room": timetable.room,
                    "current_count": timetable.current_count,
                    "slot_name": timetable.slot_name
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

        #delete the student timetable if the course is deleted
        db.session.query(StudentTimeTable).filter_by(course_id=id).delete()

        db.session.delete(course)
        db.session.commit()
        return 'Course Deleted Successfully', 204

#==============================Student Course API========================================
class StudentCourseAPI(Resource):
    def get(self,id):
        data = []
        #query all courses order by id in descending order
        courses = Course.query.order_by(Course.id.desc()).all()
        if not courses:
            # Return an empty list if there are no courses
            return data
        
        

        for course in courses:
            
            Time_table = []
            for timetable in course.time_table:
                #if courese.time_table is not exist in StudentTimeTable then show the course
                student_time_table = StudentTimeTable.query.filter_by(course_id=course.id, student_id=id, day=timetable.day, start_time=timetable.start_time,end_time=timetable.end_time).first()
                if student_time_table is None:
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
                "limit": timetable.limit,
                "slot_name": timetable.slot_name,
            })

        return data
    
    @marshal_with(timetable_fields)
    def post(self):
        args = create_timetable_parser.parse_args()
        slot = args.get('slot', None)
        day = slot.split(" ")[0]
        start_time = slot.split(" ")[1]
        end_time = slot.split(" ")[3]
        course_id = args.get('course_id', None)
        limit = args.get('limit', None)
        room = args.get('room', None)
        current_count = args.get('current_count', None)

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
        return timetable, 201
    
    @marshal_with(timetable_fields)
    def put(self, id):
        args = update_timetable_parser.parse_args()
        slot = args.get('slot', None)
        day = slot.split(" ")[0]
        start_time = slot.split(" ")[1]
        end_time = slot.split(" ")[3]
        course_id = args.get('course_id', None)
        room = args.get('room', None)
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
        if slot:
            timetable.slot_name = slot
        if room:
            timetable.room = room
        
        db.session.commit()
        return timetable, 200
    
    def delete(self, id):
        timetable = TimeTable.query.get(id)
        if not timetable:
            raise NotFoundError(status_code=404)
        
        #delete the student timetable if the course timetable is deleted
        db.session.query(StudentTimeTable).filter_by(course_id=timetable.course_id, day=timetable.day, start_time=timetable.start_time, end_time=timetable.end_time).delete()
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
    

#==============================Student Time Table API========================================
class StudentTimeTableAPI(Resource):
    def get(self,id):
        data = []
        #query all student time tables filter by student id order by id in descending order
        student_time_tables = StudentTimeTable.query.filter_by(student_id=id).order_by(StudentTimeTable.id.desc()).all()
        if not student_time_tables:
            # Return an empty list if there are no student time tables
            return data

        for student_time_table in student_time_tables:
            course = Course.query.get(student_time_table.course_id)
            data.append({
                "id": student_time_table.id,
                "day": student_time_table.day,
                "start_time": student_time_table.start_time,
                "end_time": student_time_table.end_time,
                "course_id": student_time_table.course_id,
                "student_id": student_time_table.student_id,
                "course_name": course.name,
                "faculty_name": course.faculty_name
            })

        return data
    
    @marshal_with(student_time_table_fields)
    def post(self):
        args = create_timetable_parser.parse_args()
        day = args.get('day', None)
        start_time = args.get('start_time', None)
        end_time = args.get('end_time', None)
        course_id = args.get('course_id', None)
        student_id = args.get('student_id', None)

        if not day:
            raise BusinessValidationError(status_code=400,error_code="BE1001",error_message="Day is required")
        if not start_time:
            raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="Start Time is required")
        if not end_time:
            raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="End Time is required")
        if not course_id:
            raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="Course ID is required")
        if not student_id:
            raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="Student ID is required")
        
        #check if the student is already registered for the course timetable
        student_time_table = StudentTimeTable.query.filter_by(day=day, start_time=start_time, end_time=end_time, course_id=course_id, student_id=student_id).first()
        if student_time_table:
            raise BusinessValidationError(status_code=400,error_code="BE1003",error_message="You are already enrolled for this course slot. Please choose another slot.")
            
        student_time_table = StudentTimeTable(day=day, start_time=start_time, end_time=end_time, course_id=course_id, student_id=student_id)
        db.session.add(student_time_table)
        db.session.commit()
        return student_time_table, 201
    
    @marshal_with(student_time_table_fields)
    def put(self, id):
        args = update_timetable_parser.parse_args()
        day = args.get('day', None)
        start_time = args.get('start_time', None)
        end_time = args.get('end_time', None)
        course = args.get('course_id', None)
        student_id = args.get('student_id', None)

        student_time_table = StudentTimeTable.query.get(id)

        if not student_time_table:
            raise NotFoundError(status_code=404)
        
        if day:
            student_time_table.day = day
        if start_time:
            student_time_table.start_time = start_time
        if end_time:
            student_time_table.end_time = end_time
        if course:
            student_time_table.course_id = course
        if student_id:
            student_time_table.student_id = student_id

        db.session.commit()
        return student_time_table, 200
    
#==============================Clssroom API========================================
class ClassRoomAPI(Resource):
    def get(self):
        data = []
        #query all class rooms order
        class_rooms = ClassRoom.query.all()
        if not class_rooms:
            # Return an empty list if there are no class rooms
            return data
        
        for class_room in class_rooms:
            data.append({
                "id": class_room.id,
                "name": class_room.name,
                "description": class_room.description
            })
        return data
    
    @marshal_with(ClassRoom_fields)
    def post(self):
        name = request.json.get('roomname', None)
        description = request.json.get('room_description', None)

        if not name:
            raise BusinessValidationError(status_code=400,error_code="BE1001",error_message="Class Room name is required")
        if not description:
            raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="Class Room description is required")
        
        class_room = ClassRoom(name=name, description=description)
        db.session.add(class_room)
        db.session.commit()
        return class_room, 201
    
    @marshal_with(ClassRoom_fields)
    def put(self, id):
        name = request.json.get('roomname', None)
        description = request.json.get('room_description', None)

        class_room = ClassRoom.query.get(id)

        if not class_room:
            raise NotFoundError(status_code=404)
        
        if name:
            class_room.name = name
        if description:
            class_room.description = description
        
        db.session.commit()
        return class_room, 200
    
    def delete(self, id):
        class_room = ClassRoom.query.get(id)
        if not class_room:
            raise NotFoundError(status_code=404)
        
        db.session.delete(class_room)
        db.session.commit()
        return 'Class Room Deleted Successfully', 204
    
#==============================ClassRoomSlots API========================================
class ClassRoomSlotsAPI(Resource):
    def get(self):
        data = []
        #query all class room slots order by id in descending order
        class_room_slots = ClassRoomSlots.query.order_by(ClassRoomSlots.id.desc()).all()
        if not class_room_slots:
            # Return an empty list if there are no class room slots
            return data

        for class_room_slot in class_room_slots:
            data.append({
                "id": class_room_slot.id,
                "day": class_room_slot.day,
                "start_time": class_room_slot.start_time,
                "end_time": class_room_slot.end_time,
                "slot_name": class_room_slot.slot_name
            })

        return data
    
    @marshal_with(ClassRoomSlots_fields)
    def post(self):
        day = request.json.get('day', None)
        start_time = request.json.get('start_time', None)
        end_time = request.json.get('end_time', None)

        if not day:
            raise BusinessValidationError(status_code=400,error_code="BE1001",error_message="Day is required")
        if not start_time:
            raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="Start Time is required")
        if not end_time:
            raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="End Time is required")
        
        slot_name = day + " " + start_time + " - " + end_time
        
        class_room_slot = ClassRoomSlots(day=day, start_time=start_time, end_time=end_time, slot_name=slot_name)
        db.session.add(class_room_slot)
        db.session.commit()
        return class_room_slot, 201
    
    @marshal_with(ClassRoomSlots_fields)
    def put(self, id):
        day = request.json.get('day', None)
        start_time = request.json.get('start_time', None)
        end_time = request.json.get('end_time', None)

        class_room_slot = ClassRoomSlots.query.get(id)

        if not class_room_slot:
            raise NotFoundError(status_code=404)
        
        slot_name = day + " " + start_time + " - " + end_time
        
        if day:
            class_room_slot.day = day
        if start_time:
            class_room_slot.start_time = start_time
        if end_time:
            class_room_slot.end_time = end_time
        if slot_name:
            class_room_slot.slot_name = slot_name
        
        db.session.commit()
        return class_room_slot, 200
    
    def delete(self, id):
        class_room_slot = ClassRoomSlots.query.get(id)
        if not class_room_slot:
            raise NotFoundError(status_code=404)
        
        db.session.delete(class_room_slot)
        db.session.commit()
        return 'Class Room Slot Deleted Successfully', 204
    
    

    




    

#==============================API Endpoints========================================
api.add_resource(FacultyCourseAPI, '/course/<name>', '/course/<int:id>', '/course')
api.add_resource(TimeTableAPI, '/timetable', '/timetable/<int:id>')
api.add_resource(TasksAPI, '/tasks', '/tasks/<int:id>')
api.add_resource(UserProfileAPI, '/user-profile/<int:id>')
api.add_resource(StudentCourseAPI, '/courses/<int:id>')
api.add_resource(StudentTimeTableAPI, '/student-timetable', '/student-timetable/<int:id>')
api.add_resource(ClassRoomAPI, '/class-room', '/class-room/<int:id>')
api.add_resource(ClassRoomSlotsAPI, '/class-room-slots', '/class-room-slots/<int:id>')


       


        
       

        
    










