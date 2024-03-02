const Studentenroll = Vue.component("studentenroll", {
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-lg-8 offset-lg-2">
          <!-- Search Input -->
          <div class="mb-3">
            <label for="searchInput" class="form-label">Search by Course or Faculty</label>
            <input type="text" v-model="searchInput" class="form-control" id="searchInput">
          </div>
          
          <!-- List of Courses -->
          <h2>Available Courses</h2>
          <div v-if="filteredUpcomingCourses.length === 0">
            <p>No courses available for enrollment.</p>
          </div>
          <div v-else>
            <div v-for="course in filteredUpcomingCourses" :key="course.id">
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
                  </div>

                  <!-- Timetable Collapse -->
                  <div class="collapse mt-2" :id="'timetable' + course.id">
                    <ul class="list-group">
                      <li class="rlist-group-item mt-2 p-3" v-for="timetable in course.time_table" :key="timetable.id">
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

                          <span class="mx-1">|</span>

                          <button @click="enroll(timetable)" type="button" class="btn btn-sm btn-outline-primary">
                            Enroll
                          </button>
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
      userRole: localStorage.getItem("role"),
      token: localStorage.getItem("auth-token"),
      username: localStorage.getItem("username"),
      student_id: localStorage.getItem("id"),
      courses: [],
      error: null,
      searchInput: "",
    };
  },

  methods: {
    async getcourses() {
      const res = await fetch("/courses/" + this.student_id, {
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

    async enroll(timetable) {
      const res = await fetch("/student-timetable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": this.token,
          "Authentication-Role": this.userRole,
        },
        body: JSON.stringify({
          day: timetable.day,
          start_time: timetable.start_time,
          end_time: timetable.end_time,
          course_id: timetable.course_id,
          student_id: this.student_id,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        alert("Enrolled successfully");
        this.getcourses();
      } else {
        const data = await res.json();
        console.log(data);
        this.error = data.error_message;
        alert(data.error_message);
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
  },

  computed: {
    filteredCourses() {
      // Filter courses based on the search input
      const searchTerm = this.searchInput.toLowerCase();

      return this.courses.filter((course) => {
        return (
          course.name.toLowerCase().includes(searchTerm) ||
          course.faculty_name.toLowerCase().includes(searchTerm)
        );
      });
    },

    filteredUpcomingCourses() {
      // Filter upcoming courses based on the search input
      const searchTerm = this.searchInput.toLowerCase();

      return this.upcomingCourses.filter((course) => {
        return (
          course.name.toLowerCase().includes(searchTerm) ||
          course.faculty_name.toLowerCase().includes(searchTerm)
        );
      });
    },

    upcomingCourses() {
      // Create a copy of filteredCourses to avoid mutating the original data
      const upcomingCourses = JSON.parse(JSON.stringify(this.filteredCourses));

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

      // Remove courses with no upcoming schedules
      return upcomingCourses.filter((course) => course.time_table.length > 0);
    },
  },

  mounted() {
    this.getcourses();
    document.title = "Enroll";
  },
});

export default Studentenroll;
