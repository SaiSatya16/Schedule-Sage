const Login = Vue.component("login", {
  template: `
  <div class="main-container d-flex flex-column justify-content-center">

  <div class="container">
  
    <div class="row justify-content-center">
      <div class="form-container col-md-6 p-5">
        <h2 class="text-center">Login</h2>
        <div class="alert alert-danger" v-if="error">
          {{ error }}
        </div>
          <div class="form-group p-1">
            <label for="email">Email:</label>
            <input class="input-field" type="text" class="form-control login-input" id="username" name="username" placeholder="Enter email"
            v-model="cred.email">
          </div>
          
          <div class="form-group p-1">
            <label for="password">Password:</label>
            <input type="password" class="form-control mb-2" id="password" name="password" placeholder="Enter password"
            v-model="cred.password">
          </div>
          <div class="d-flex flex-row">
          
          <button class="button-86" type="submit" role="button" @click='login'>Login</button>
          </div>
          <p class="mt-3">Don't have an account? <router-link to="/register">Register as Student here</router-link></p>
          <p class="mt-3">Don't have an account? <router-link to="/facultyregister">Register as Faculty here</router-link></p>
      </div>
    </div>
    <div class="card p-3 mt-5 mb-5">
    <h2> About the project</h2>
    <h5> This project is a  sophisticated multi-user web application that allows students to enroll in courses and view their schedules. The application is built using Python, Flask, and PostgresSQL for the backend and Vue.js for the frontend. The application has three roles: Student, Faculty, and Administration. Each role has different permissions and views. The application has a login and registration system. The application also has a REST API for the backend. The application is a simple representation of a course management system. </h5>
    <h2>Usage</h2>
    <h5> To use the application, you can register as a student or faculty. After registration, you can log in and view your dashboard. The student can enroll in courses and view their schedules. The faculty can create a new schedule by selecting time slots and classroom given by administration . The administration can add classrooms and class time slots. </h5>
    <h3> Sample Credentials</h3>
    <h4> Administration Credentials: </h4>
    <ul>
    <li> <strong>Email:</strong> administration@gmail.com</li>
    <li> <strong>Password:</strong> administration</li>
    </ul>
    
    <h4> Faculty Credentials: </h4>
    <ul>
    <li> <strong>Email:</strong> faculty1@gmail.com</li>
    <li> <strong>Password:</strong> faculty1</li>
    </ul>

    
    <h4> Student Credentials: </h4>
    <ul>
    <li> <strong>Email:</strong> student1@gmail.com</li>
    <li> <strong>Password:</strong> student1</li>
    </ul>

    </div>


  </div>
  </div>`,
  data() {
    return {
      cred: {
        email: null,
        password: null,
      },
      error: null,
    };
  },
  methods: {
    async login() {
      const res = await fetch("/user-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.cred),
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        localStorage.setItem("auth-token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("id", data.id);
        localStorage.setItem("username", data.username);
        this.$router.push("/");
      } else {
        const data = await res.json();
        console.log(data);
        this.error = data.message;
      }
    },
  },

  mounted: function () {
    document.title = "Login";
  },
});

export default Login;
