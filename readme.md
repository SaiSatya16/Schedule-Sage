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

- **Never Miss a Beat:** **Automated reminders** ensure deadlines don't catch you off guard.
- **Prioritize Proactively:** **Clear labels** and **important/urgent tags** keep your schedule crystal-clear.
- **Unified Command Center:** **Seamless Google Calendar sync** centralizes your entire schedule.
- **Effortless Workflow:** **Break down large tasks** and **avoid information overload** with integrated to-do lists.
- **Conquer Complexity:** **Intuitive design** makes **deadline tracking a breeze**.
- **Personalized Freedom:** **Professors:** Set availability easily. **Students:** Choose classes and instructors. **Together:** Craft **personalized schedules for ultimate flexibility**.

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
