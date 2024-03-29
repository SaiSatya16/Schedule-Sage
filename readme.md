# Schedule Sage

Ditch the chaos, Embrace control. Schedule like a sage! \
Tired of juggling classes, deadlines, and activities? Schedule Sage empowers you to conquer your academic schedule, transforming you from a frazzled student to a scheduling master

## Installation

1. Create a virtual environment:
   `python3 -m venv venv`

2. Activate the virtual environment:
   `source venv/bin/activate`

3. Install required dependencies:
   `pip install -r requirements.txt`

4. Set up Environment Variables:
   `export DATABASE_URL=sqlite:///database.sqlite3`

5. Create a SQLite3 database by running:
   `python upload_initial_data.py`

6. Start the Flask server:
   `python app.py`

7. Visit `localhost:5000` in your browser to access the Schedule Sage

## Functionalities

- **Personalized Scheduling:** Craft a **schedule that works for you**, not the other way around.
  - **Professors:** Set your **availability with ease** and **manage your workload like a boss**.
  - **Students:** **Choose the classes and instructors** that **spark your academic curiosity** and fit your **unique schedule**.

**Together, professors and students collaborate** through Schedule Sage to create **schedules that optimize learning and minimize conflicts**. It's a win-win for everyone!

## Architecture and Features

- **Model Definitions:** The foundation is laid in `model.py`, defining various models like `User`, `Course`, `Tasks`,`TimeTable`, and others, representing essential entities within the application.
- **API Endpoints:** In `api.py`, **well-defined API endpoints** handle user interactions and communication with the server. These endpoints are accessible through the intuitive user interface.
- **User Roles and Permissions:** A **secure and granular access control system** governs user interactions. Different user roles (e.g., Professor, Student) have designated permissions (e.g., create courses, choose classes) to ensure data integrity and role-specific functionalities.
- **Data Persistence:** Schedule Sage employs a **reliable database** (specify database type) to store and manage user data, course information, and schedule details, guaranteeing data persistence and accessibility.

## Tech Stack

**Frontend:** Vue.js - Blazing-fast UX ⚡️\
**Backend:** Flask - Agile & Efficient ⚙️\
**Cloud:** AWS - Scalability for the Future \
**Version Control:** Git - Streamlined Collaboration \
**Database:** PostgreSQL - Secure & Reliable Data Fortress

## User Roles

- **Administrator**: Oversees the entire platform, manages user permissions, and ensures smooth operation.
- **Professor**: Sets their availability, manages course information, and interacts with students.
- **Student**: Chooses classes and instructors, crafts a personalized schedule, and connects with professors.

## Access and Login

- **Existing Users**: Use your registered email and password to log in.

- **New Users**:
  _Students_: Register as a student and start browsing available courses.\
  _Professors_: Register as a professor and submit a request for approval by the administrator. Once approved, you can manage your courses.

- **Admin Login**:

Email: administration@gmail.com\
Password: administration

## Ready to Ditch Scheduling Chaos? Click Here!

Click the link below to access your academic scheduling haven:

**Schedule Sage Website**: http://schedule-sage.ap-south-1.elasticbeanstalk.com
