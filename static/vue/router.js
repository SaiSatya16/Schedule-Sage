import Home from './components/home.js';
import About from './components/about.js';
import Login from './components/login.js';
import Registration from './components/registration.js';
import Studentenroll from './components/student_enroll.js';
import Facultyregistration from './components/faculty_registration.js';

const routes = [
    {
        path: "/",
        component: Home,
        name: "Home"
    },
    {
        path: "/about",
        component: About,
        name: "About"
    },
    {
        path: "/login",
        component: Login,
        name: "Login"
    },
    {
        path: "/register",
        component: Registration,
        name: "Register"
    },
    {
        path: "/facultyregister",
        component: Facultyregistration,
        name: "Facultyregister"
    },
    {
        path: "/studentenroll",
        component: Studentenroll,
        name: "Studentenroll"
    },
    {
        path: "*",
        redirect: "/"
    }
];

const router = new VueRouter({
    routes
});

export default router;