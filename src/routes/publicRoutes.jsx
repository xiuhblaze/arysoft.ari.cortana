
import { faCircleInfo, faHome, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";


import { Login } from "../views/Login/Login";
import { AboutView } from "../views/www/AboutView";
import Home from "../views/Home";


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
    title: 'About',
    key: 'about',
    path: '/about',
    icon: faCircleInfo,
    element: <AboutView />
  },
  // { 
  //   type: 'collapse',
  //   title: 'Login',
  //   key: 'login',
  //   path: '/login',
  //   icon: faRightFromBracket,
  //   element: <Login />
  // },
];

export default publicRoute;