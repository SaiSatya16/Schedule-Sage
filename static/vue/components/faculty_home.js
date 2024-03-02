const Facultyhome = Vue.component("facultyhome", {
  template: `

    <div class="main-container pb-5">
    <div class="container">
   <div class="row">
      <div class="col-lg-8 offset-lg-2">
         <!-- Welcome Message -->
         <div class="jumbotron pt-3 pb-3">
            <h1 class="display-4 greeting">Welcome, {{username}}!</h1>
            <p class="scope">You can Add, delete, edit courses.</p>
            <button type="button" class="add-course-btn" data-bs-toggle="modal" data-bs-target="#addCourseModal">
            Add Course
            <i class="fa fa-plus" aria-hidden="true"></i>
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
            <div v-for="course in upcomingCourses" :key="course.id" >
               <div class="list-group mb-2">
                  <div class="list-container p-3">
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
                           <li class="elist-group-item mb-1 p-3" v-for="timetable in course.time_table">
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
                        
                                  <i class="fas fa-door-open fa-lg text-center" style="font-size: 1.0rem"></i>
                                  {{ timetable.room }}
                                  <span class="mx-1">|</span>
                                  <i class="fas fa-users fa-lg text-center" style="font-size: 1.0rem"></i>
                                  {{ timetable.current_count }}/{{ timetable.limit }}
                                  <p>
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
                  <li class="rlist-group-item p-3 mb-1" v-for="schedule in currentDaySchedule" :key="schedule.id">
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
              <label for="Slot">Select Slot</label>
              <select v-model="Slot" class="form-select" id="Slot">
                <option v-for="slot in classroomslots" :key="slot.id" :value="slot.slot_name" v-if="isSlotAvailable(slot.slot_name)">
                  {{ slot.slot_name }}
                </option>
              </select>
            </div>
               <div class="my-3">
                  <label for="studentLimit">Enter Student Limit</label>
                  <input v-model="studentLimit" type="number" id="studentLimit" class="form-control">
               </div>
               <div class="my-3">
               <label for="room">Enter Room No.</label>
                <select v-model="room" class="form-select" id="room">
                  <option v-for="room in rooms" :key="room.id" :value="room.name">{{ room.name }}</option>
                </select>

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
                  <label for="Slot">SelectSlot</label>
                  <select v-model="timetable.slot_name" class="form-select" id="Slot">
                    <option v-for="slot in classroomslots" :key="slot.id" :value="slot.slot_name">{{ slot.slot_name }}</option>
                  </select>
                </div>
                  <div class="my-3">
                     <label for="editStudentLimit">Enter Student Limit</label>
                     <input v-model="timetable.limit" type="number" id="editStudentLimit" class="form-control">
                  </div>
                  <div class="my-3">
                  <label for="editRoom">Enter Room No.</label>
                  <select v-model="timetable.room" class="form-select" id="editRoom">
                    <option v-for="room in rooms" :key="room.id" :value="room.name">{{ room.name }}</option>
                  </select>
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
</div>
    
    `,

  data() {
    return {
      courses: [],
      Coursename: null,
      Course_description: null,
      error: null,
      userRole: localStorage.getItem("role"),
      token: localStorage.getItem("auth-token"),
      username: localStorage.getItem("username"),
      studentLimit: null,
      room: null,
      rooms : [],
      classroomslots : [],
      Slot : null,
    };
  },

  methods: {
    async getcourses() {
      const res = await fetch("/course/" + this.username, {
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
          limit: this.studentLimit,
          room: this.room,
          slot: this.Slot,
          current_count: 0,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        this.getcourses();
      } else {
        const data = await res.json();
        console.log(data);
        alert(data.error_message);
      }
    },

    async editSchedule(timetable) {
      console.log(timetable.slot_name);
      const res = await fetch("/timetable/" + timetable.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": this.token,
          "Authentication-Role": this.userRole,
        },
        body: JSON.stringify({
          room: timetable.room,
          limit: timetable.limit,
          slot: timetable.slot_name,
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
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dayName = days[date.getDay()];

      // Format the date as "dd-mm-yyyy"
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`;

      // Return the formatted date with day name
      return `${formattedDate} (${dayName})`;
    },

    async getrooms() {
      const res = await fetch("/class-room", {
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
        this.rooms = data;
      } else {
        const data = await res.json();
        console.log(data);
        this.error = data.error_message;
      }
    },

    async getclassroomslots() {
      const res = await fetch("/class-room-slots",
      {
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
          this.classroomslots = data;
      } else {
          const data = await res.json();
          console.log(data);
          this.error = data.error_message;
      }
  },

  isSlotAvailable(slotName) {
    // Iterate through courses and their time tables to check if the slot is taken
    for (const course of this.courses) {
      for (const timetable of course.time_table) {
        if (timetable.slot_name === slotName) {
          return false; // Slot is already taken
        }
      }
    }
    return true; // Slot is available
  },




  },
  computed: {
    upcomingCourses() {
      // Create a copy of courses to avoid mutating the original data
      const upcomingCourses = JSON.parse(JSON.stringify(this.courses));

      // Filter out past schedules and sort the remaining ones
      upcomingCourses.forEach((course) => {
        course.time_table = course.time_table.filter((schedule) => {
          const currentDate = new Date();
          const scheduleDate = new Date(
            schedule.day + " " + schedule.start_time
          );

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
      const schedules = this.courses.flatMap((course) =>
        course.time_table.filter((schedule) => {
          const scheduleDate = new Date(schedule.day);
          const scheduleDateString = scheduleDate.toLocaleDateString(); // Format: MM/DD/YYYY

          // Compare by date
          return currentDay === scheduleDateString;
        })
      );

      // Sort the schedules by time
      return schedules.sort((a, b) => a.start_time.localeCompare(b.start_time));
    },

    


  },
  mounted() {
    this.getcourses();
    this.getrooms();
    this.getclassroomslots();
    document.title = "Faculty Home";
  },
});

export default Facultyhome;
