import Administrationhome from "./administration_home.js";
import Facultyhome from "./faculty_home.js";
import Studenthome from "./student_home.js";



const Home = Vue.component("home", {
    template:  
    `
    <div>
        <div v-if="role === 'Administration'">
            <Administrationhome></Administrationhome>
        </div>
        <div v-else-if="role === 'Faculty'">
            <Facultyhome></Facultyhome>
        </div>
        <div v-else-if="role === 'Student'">
            <Studenthome></Studenthome>
        </div>
    </div>

    
    
    `,
    data() {
        return {
            role: localStorage.getItem('role'),
        };
    },

    components: {
        Administrationhome,
        Facultyhome,
        Studenthome
    },

    mounted() {
        document.title = "Home";
    }


});

export default Home;
