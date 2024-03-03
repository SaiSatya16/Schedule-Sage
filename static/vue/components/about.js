const About = Vue.component("about", {
  template: `
  <div class="main-container p-3" style="font-family:sans-serif;">
  <h1 class="display-4 mb-4 fw-bold">Schedule Sage: Cultivating Freedom in Your Academic Journey</h1>
  <div class="card-group">
  <div class="card">
    <img src="static\\students.jpg" class="card-img-top" alt="...">
    <div class="card-body">
      <h4 class="card-title">Students</h4>
      <p class="card-text">Say goodbye to scheduling headaches! Schedule Sage empowers <strong>both students and professors</strong> to <strong>craft personalized schedules</strong> that <strong>perfectly fit their needs and preferences</strong>.</p>
      
    </div>
  </div>
  <div class="card">
    <img src="static\\professor.jpg" class="card-img-top" alt="...">
    <div class="card-body">
      <h4 class="card-title">Professors</h4>
      <p class="card-text"></strong> Set your availability with <strong>unmatched ease</strong>. Define your preferred teaching days and times, ensuring a <strong>flexible and efficient workload management</strong> experience.</p>
      
    </div>
  </div>
  <div class="card">
    <img src="static\\together.jpg" class="card-img-top" alt="...">
    <div class="card-body">
      <h4 class="card-title">Together</h4>
      <p class="card-text"><strong>Together, with Schedule Sage, you can achieve the freedom and flexibility</strong> you deserve to thrive in your educational endeavors.</p>
    </div>
  </div>
</div>  
  </div>
  `,
  mounted: function () {
    document.title = "About";
  },
});

export default About;
