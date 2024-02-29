const Facultyhome = Vue.component("facultyhome", {
    template:  
    `

    <div class="container mt-4">
    <div class="row">
        <div class="col-lg-8 offset-lg-2">
            <!-- Welcome Message -->
            <div class="jumbotron">
                <h1 class="display-4">Welcome, {{username}}!</h1>
                <p>You can Add, delete, edit courses.</p>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addCourseModal">
                    Add Course
                </button>
            </div>

            <div class="alert alert-danger" v-if="error">
                {{ error }}
            </div>

            <div v-if="courses.length == 0">
                <h2>No Courses Found</h2>
            </div>

            <div v-else>
                <!-- List of Courses -->
                <h2>List of Courses</h2>
                <div v-for="course in upcomingCourses" :key="course.id">
                    <div class="list-group">
                        <div class="list-group-item">
                            <h3 class="mb-1">{{ course.name }}</h3>
                            <p class="mb-1">by <span class="badge bg-secondary">{{ course.faculty_name }}</span></p>
                            <p class="mb-1">{{ course.description }}</p>
                            <div class="btn-group" role="group">
                                <button type="button" class="btn btn-sm btn-outline-primary" data-bs-toggle="collapse" :data-bs-target="'#schedule' + course.id" aria-expanded="false" aria-controls="'schedule' + course.id">
                                    View Schedule
                                </button>
                                <button type="button" class="btn btn-sm btn-outline-primary" :data-bs-target="'#addScheduleModal' + course.id" data-bs-toggle="modal">
                                    Add Schedule
                                </button>
                                <button type="button" class="btn btn-sm btn-outline-secondary" :data-bs-target="'#editModal' + course.id" data-bs-toggle="modal">
                                    Edit
                                </button>
                                <button type="button" class="btn btn-sm btn-outline-danger" @click="deleteCourse(course.id)">
                                    Delete
                                </button>
                            </div>

                            <div class="collapse mt-2" :id="'schedule' + course.id">
    <ul class="list-group">
        <li class="list-group-item" v-for="timetable in course.time_table">
        <h5>{{ formatScheduleDate(timetable.day) }}</h5>
            <p>
                <i class="fas fa-clock fa-lg text-center" style="font-size: 1.0rem"></i>
                {{ timetable.start_time }} 
                <span class="mx-1">To</span> 
                {{ timetable.end_time }} 

                <span class="mx-1">|</span>
                
               <i class="fas fa-user fa-lg text-center" style="font-size: 1.0rem"></i>
               {{ timetable.limit }}

               <span class="mx-1">|</span>

                <i class="fas fa-users fa-lg text-center" style="font-size: 1.0rem"></i>
                50/{{ timetable.limit }}


               <div class="btn-group" role="group">
                    <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" :data-bs-target="'#editScheduleModal' + timetable.id">
                        Edit
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger" @click="deleteSchedule(timetable.id)">
                        Delete
                    </button>
                </div>
            </p>
        </li>
    </ul>
</div>



                        


                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-4">
            <h2>Today's Schedule</h2>
            <div v-if="currentDaySchedule.length === 0">
                <p>No schedule for today.</p>
            </div>
            <div v-else>
                <ul class="list-group">
                    <li class="list-group-item" v-for="schedule in currentDaySchedule" :key="schedule.id">
                        <h5>{{ schedule.course_name }}</h5>
                        <p>
                            <i class="fas fa-clock fa-lg text-center" style="font-size: 1.0rem"></i>
                            {{ schedule.start_time }} 
                            <span class="mx-1">To</span> 
                            {{ schedule.end_time }}
                            <span class="mx-1">|</span>
                            <i class="fas fa-calendar fa-lg text-center" style="font-size: 1.0rem"></i>
                            {{ formatScheduleDate(schedule.day) }}
                        </p>
                    </li>
                </ul>
            </div>
        </div>
        </div>
    </div>


    

        




            <div v-for="course in courses" :key="course.id">
                <div class="modal fade" :id="'editModal' + course.id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" :aria-labelledby="'editModalLabel' + course.id" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" :id="'editModal' + course.id">Edit Course</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="my-3">
                                    <label for="courseName">Enter Course Name</label>
                                    <input v-model="course.name" type="text" id="courseName" class="form-control" :placeholder="course.name">
                                </div>
                                <div class="my-3">
                                    <label for="courseDescription">Enter Course Description</label>
                                    <textarea v-model="course.description" class="form-control"></textarea>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" @click="editCourse(course)" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="addCourseModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addCourseModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="addCourseModalLabel">Add Course</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="my-3">
                                <label for="newCourseName">Enter Course Name</label>
                                <input v-model="Coursename" type="text" id="newCourseName" class="form-control" placeholder="Course Name">
                            </div>
                            <div class="my-3">
                                <label for="newCourseDescription">Enter Course Description</label>
                                <textarea v-model="Course_description" class="form-control"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" @click="addCourse" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                        </div>
                    </div>
                </div>
            </div>

       
    

        <div v-for="course in upcomingCourses" class="modal fade" :id="'addScheduleModal' + course.id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" :aria-labelledby="'addScheduleModalLabel' + course.id" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" :id="'addScheduleModalLabel' + course.id">Add Schedule</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="my-3">
                                    <label for="scheduleDate">Enter Date</label>
                                    <input v-model="scheduleDate" type="date" id="scheduleDate" class="form-control">
                                </div>
                                <div class="my-3">
                                    <label for="startTime">Enter Start Time</label>
                                    <input v-model="startTime" type="time" id="startTime" class="form-control">
                                </div>
                                <div class="my-3">
                                    <label for="endTime">Enter End Time</label>
                                    <input v-model="endTime" type="time" id="endTime" class="form-control">
                                </div>
                                <div class="my-3">
                                    <label for="studentLimit">Enter Student Limit</label>
                                    <input v-model="studentLimit" type="number" id="studentLimit" class="form-control">
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" @click="addSchedule(course.id)" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-for="course in upcomingCourses" :key="course.id">
                    <div v-for="timetable in course.time_table" :key="timetable.id" class="modal fade" :id="'editScheduleModal' + timetable.id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" :aria-labelledby="'editScheduleModalLabel' + timetable.id" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" :id="'editScheduleModalLabel' + timetable.id">Edit Schedule</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="my-3">
                                        <label for="editScheduleDate">Enter Date</label>
                                        <input v-model="timetable.day" type="date" id="editScheduleDate" class="form-control">
                                    </div>
                                    <div class="my-3">
                                        <label for="editStartTime">Enter Start Time</label>
                                        <input v-model="timetable.start_time" type="time" id="editStartTime" class="form-control">
                                    </div>
                                    <div class="my-3">
                                        <label for="editEndTime">Enter End Time</label>
                                        <input v-model="timetable.end_time" type="time" id="editEndTime" class="form-control">
                                    </div>
                                    <div class="my-3">
                                        <label for="editStudentLimit">Enter Student Limit</label>
                                        <input v-model="timetable.limit" type="number" id="editStudentLimit" class="form-control">
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" @click="editSchedule(timetable)" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



    </div>
    
    `,

    data(){
        return {
        courses: [],
        Coursename: null,
        Course_description: null,
        error: null,
        userRole: localStorage.getItem('role'),
        token: localStorage.getItem('auth-token'),
        username: localStorage.getItem('username'),
        scheduleDate: null,
        startTime: null,
        endTime: null,
        studentLimit: null
        };
    },

    methods: {

        async getcourses() {
            const res = await fetch("/course/"+ this.username, {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                "Authentication-Token": this.token,
                "Authentication-Role": this.userRole,
                },
            });
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                this.courses = data;
            } else {
                const data = await res.json();
                console.log(data);
                this.error = data.error_message;
            }
        },

        async addCourse() {
            const res = await fetch("/course", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "Authentication-Token": this.token,
                "Authentication-Role": this.userRole,
        
                },
                body: JSON.stringify({
                name: this.Coursename,
                description: this.Course_description,
                faculty_name: this.username,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                this.getcourses();
            } else {
                const data = await res.json();
                console.log(data);
                this.error = data.error_message;
        
            }
            },

        async editCourse(course) {
            const res = await fetch("/course/" + course.id, {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                "Authentication-Token": this.token,
                "Authentication-Role": this.userRole,
                },
                body: JSON.stringify({
                name: course.name,
                description: course.description,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                this.getcourses();
            } else {
                const data = await res.json();
                console.log(data);
                this.error = data.error_message;
            }
        },

        async deleteCourse(courseId) {
            const res = await fetch("/course/" + courseId, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                "Authentication-Token": this.token,
                "Authentication-Role": this.userRole,
                },
            });
            if (res.ok) {
                this.getcourses();
            } else {
                const data = await res.json();
                console.log(data);
                this.error = data.error_message;
            }


        },

        async addSchedule(courseId) {
            const res = await fetch("/timetable", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "Authentication-Token": this.token,
                "Authentication-Role": this.userRole,
                },
                body: JSON.stringify({
                course_id: courseId,
                day: this.scheduleDate,
                start_time: this.startTime,
                end_time: this.endTime,
                limit: this.studentLimit,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                this.getcourses();
            } else {
                const data = await res.json();
                console.log(data);
                this.error = data.error_message;
            }

        },

        async editSchedule(timetable) {
            const res = await fetch("/timetable/" + timetable.id, {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                "Authentication-Token": this.token,
                "Authentication-Role": this.userRole,
                },
                body: JSON.stringify({
                day: timetable.day,
                start_time: timetable.start_time,
                end_time: timetable.end_time,
                limit: timetable.limit,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                this.getcourses();
            } else {
                const data = await res.json();
                console.log(data);
                this.error = data.error_message;
            }
        },

        async deleteSchedule(timetableId) {
            const res = await fetch("/timetable/" + timetableId, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                "Authentication-Token": this.token,
                "Authentication-Role": this.userRole,
                },
            });
            if (res.ok) {
                this.getcourses();
            } else {
                const data = await res.json();
                console.log(data);
                this.error = data.error_message;
            }
        },

        formatScheduleDate(dateString) {
            // Convert the date string to a Date object
            const date = new Date(dateString);
    
            // Get day name
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayName = days[date.getDay()];
    
            // Format the date as "dd-mm-yyyy"
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    
            // Return the formatted date with day name
            return `${formattedDate} (${dayName})`;
        },


        },
        computed: {
            upcomingCourses() {
                // Create a copy of courses to avoid mutating the original data
                const upcomingCourses = JSON.parse(JSON.stringify(this.courses));
        
                // Filter out past schedules and sort the remaining ones
                upcomingCourses.forEach(course => {
                    course.time_table = course.time_table.filter(schedule => {
                        const currentDate = new Date();
                        const scheduleDate = new Date(schedule.day + ' ' + schedule.start_time);
        
                        // Include schedules with future dates and times
                        return currentDate < scheduleDate;
                    });
        
                    // Sort the remaining schedules by time and date
                    course.time_table.sort((a, b) => {
                        // Compare by day and then by start_time
                        if (a.day !== b.day) {
                            return a.day.localeCompare(b.day);
                        } else {
                            return a.start_time.localeCompare(b.start_time);
                        }
                    });
                });
        
                // Include courses without schedules
                return upcomingCourses;
            },
            currentDaySchedule() {
                const currentDate = new Date();
                const currentDay = currentDate.toLocaleDateString(); // Format: MM/DD/YYYY
            
                // Filter schedules for the current day
                const schedules = this.courses.flatMap(course => course.time_table.filter(schedule => {
                    const scheduleDate = new Date(schedule.day);
                    const scheduleDateString = scheduleDate.toLocaleDateString(); // Format: MM/DD/YYYY
            
                    // Compare by date
                    return currentDay === scheduleDateString;
                }));
            
                // Sort the schedules by time
                return schedules.sort((a, b) => a.start_time.localeCompare(b.start_time));
            },
            
        
        },
    mounted() {
        this.getcourses();
        document.title = "Faculty Home";
    }

});

export default Facultyhome;
