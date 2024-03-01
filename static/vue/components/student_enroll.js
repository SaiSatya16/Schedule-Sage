const Studentenroll = Vue.component("studentenroll", {
    template:  
    `

    <div class="container mt-4">
    <div class="row">
      <div class="col-lg-8 offset-lg-2">
        <!-- List of Courses -->
        <h2>Available Courses</h2>
        <div v-if="courses.length === 0">
          <p>No courses available for enrollment.</p>
        </div>
        <div v-else>
          <div v-for="course in courses" :key="course.id">
            <div class="list-group">
              <div class="list-group-item">
                <h3 class="mb-1">{{ course.name }}</h3>
                <p class="mb-1">by <span class="badge bg-secondary">{{ course.faculty_name }}</span></p>
                <p class="mb-1">{{ course.description }}</p>
                <div class="btn-group" role="group">
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-primary"
                    data-bs-toggle="collapse"
                    :data-bs-target="'#timetable' + course.id"
                    aria-expanded="false"
                    :aria-controls="'timetable' + course.id"
                  >
                    View Timetable
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-primary" >
                    Enroll
                  </button>
                </div>

                <!-- Timetable Collapse -->
                <div class="collapse mt-2" :id="'timetable' + course.id">
                  <ul class="list-group">
                    <li class="list-group-item" v-for="timetable in course.time_table" :key="timetable.id">
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
                      </p>
                    </li>
                  </ul>
                </div>
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
            userRole: localStorage.getItem('role'),
            token: localStorage.getItem('auth-token'),
            username: localStorage.getItem('username'),
            courses: [],
        };
    },

    methods : {
        async getcourses() {
            const res = await fetch("/courses", {
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

   


    mounted() {
        this.getcourses();
        document.title = "Enroll";
    }



});

export default Studentenroll;
