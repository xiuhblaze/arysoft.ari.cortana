
import { faHome, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

import Home from "../views/home";
import { Login } from "../views/Login/Login";

const publicRoute = [
  { 
    type: 'collapse',
    title: 'Home',
    key: 'home',
    path: '/home',
    icon: faHome,
    element: <Home />
  },
  { 
    type: 'collapse',
    title: 'Login',
    key: 'login',
    path: '/login',
    icon: faRightFromBracket,
    element: <Login />
  },
];

export default publicRoute;