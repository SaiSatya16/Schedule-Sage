const About = Vue.component('about', {
  template: `
    <div class="container-fluid vh-100 d-flex justify-content-center align-items-center" style="background-color: #e9ecef; color: #212529;">
      <div class="row align-items-center text-center">
        <div class="col-md-12">
          <h1 class="display-4 mb-4 fw-bold">Schedule Sage: Cultivating Freedom in Your Academic Journey</h1>
          <p class="lead">
            Say goodbye to scheduling headaches! Schedule Sage empowers <strong>both students and professors</strong> to <strong>craft personalized schedules</strong> that <strong>perfectly fit their needs and preferences</strong>.
          </p>
          <p class="mt-4">
            <strong>Professors:</strong> Set your availability with <strong>unmatched ease</strong>. Define your preferred teaching days and times, ensuring a <strong>flexible and efficient workload management</strong> experience.
          </p>
          <p class="mt-4">
            <strong>Students:</strong> Take control of your academic journey! <strong>Choose the classes and instructors that resonate with you</strong>, and effortlessly <strong>craft a personalized schedule</strong> that maximizes your learning potential and fits your unique lifestyle.
          </p>
          <p class="mt-4">
            <strong>Together, with Schedule Sage, you can achieve the freedom and flexibility</strong> you deserve to thrive in your educational endeavors.
          </p>
        </div>
        <div class="col-md-12 mt-4 ml-3">
          <p>
            <strong>Team Members:</strong>
            <br>
            - Sai Satya: [jj1039@srmist.edu.in](mailto:jj1039@srmist.edu.in)
            <br>
            - Vishnu: [kk4563@srmist.edu.in](mailto:kk4563@srmist.edu.in)
            <br>
            - Vinti: [vd3809@srmist.edu.in](mailto:vd3809@srmist.edu.in)
            <br>
            - Umar: [ss2197@srmist.edu.in](mailto:ss2197@srmist.edu.in)
            <br>
            - Sahiti: [sp9740@srmist.edu.in](mailto:sp9740@srmist.edu.in)
          </p>
        </div>
      </div>
    </div>
  `,
  mounted: function () {
    document.title = "About";
  }
});

export default About;
