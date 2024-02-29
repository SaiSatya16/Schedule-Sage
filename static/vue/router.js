import Home from './components/home.js';
import About from './components/about.js';
import Login from './components/login.js';
import Registration from './components/registration.js';

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
];

const router = new VueRouter({
    routes
});

export default router;