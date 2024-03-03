const Studenthome = Vue.component("studenthome", {
  template: `
  <div class="main-container pb-5">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 offset-lg-2">
                <div class="jumbotron pt-3 pb-3">
                    <h1 class="display-4 greeting">Welcome, {{username}}!</h1>
                </div>
                    <div class="mt-4">
                    <div class="d-flex flex-row align-items-center">
                        <div>
                            <h2>Today's Schedule</h2>
                        </div>
                        <div class="pulser"></div>
                    </div>
                        <div v-if="todayTimetable.length === 0">
                            <p>No schedule for today.</p>
                        </div>
                        <div v-else>
                            <ul class="list-group">
                                <li class="rlist-group-item p-3 mb-1" v-for="schedule in todayTimetable" :key="schedule.id">
                                    <h5 class="schedule-heading">{{ schedule.course_name }}</h5>
                                    <p class="mb-1">by <span class="badge bg-secondary">{{ schedule.faculty_name }}</span></p>
                                    <p class="schedule-time">
                                        <i class="fas fa-clock fa-lg text-center" style="font-size: 1.0rem; "></i>
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
                        <h2 class="mt-4">Upcoming Schedule</h2>
                        <div v-if="upcomingTimetable.length === 0">
                            <p>No upcoming schedules.</p>
                        </div>
                        <div v-else>
                            <ul class="list-group ">
                                <li class="list-group-item mt-2" v-for="schedule in upcomingTimetable" :key="schedule.id">
                                    <h5>{{ schedule.course_name }}</h5>
                                    <p class="mb-1">by <span class="badge bg-secondary">{{ schedule.faculty_name }}</span></p>
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
        </div>
    <div class="main-container pb-5">
    `,
  data() {
    return {
      userRole: localStorage.getItem("role"),
      token: localStorage.getItem("auth-token"),
      username: localStorage.getItem("username"),
      student_id: localStorage.getItem("id"),
      error: null,
      timetable: [],
    };
  },
  computed: {
    todayTimetable() {
      // Get the current day
      const currentDay = new Date().getDay();
    
      // Filter the timetable for today
      return this.timetable.filter((schedule) => {
        const scheduleDay = new Date(schedule.day).getDay();
        return scheduleDay === currentDay;
      });
    },
    upcomingTimetable() {
      // Get the current date
      const currentDate = new Date();
    
      // Filter the timetable for upcoming schedules that are not today
      return this.timetable.filter((schedule) => {
        const scheduleDate = new Date(schedule.day);
        return scheduleDate > currentDate && !this.isTodaySchedule(schedule);
      });
    },
  },
  methods: {

        isTodaySchedule(schedule) {
            // Check if the schedule is for today
            const currentDay = new Date().getDay();
            const scheduleDay = new Date(schedule.day).getDay();
            return scheduleDay === currentDay;
        },
    async getstudenttimetable() {
      const res = await fetch("/student-timetable/" + this.student_id, {
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
        this.timetable = data;
      } else {
        const data = await res.json();
        console.log(data);
        this.error = data.error_message;
        alert(data.error_message);
      }
    },
    formatScheduleDate(dateString) {
      const date = new Date(dateString);
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
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`;
      return `${formattedDate} (${dayName})`;
    },
  },
  mounted() {
    this.getstudenttimetable();
    document.title = "Home";
  },
});

export default Studenthome;
