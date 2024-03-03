const About =  Vue.component('about', {
    template: `
    <div class="container mt-5">
                    <div class="alert alert-info" role="alert">
                        <h4 class="alert-heading">Page is coming soon, stay tuned!</h4>
                        <p>We're working on something awesome. Please check back later.</p>
                    </div>
                </div>
    
    
    `,
        mounted : function(){
        document.title = "About";
    }
});

export default About;