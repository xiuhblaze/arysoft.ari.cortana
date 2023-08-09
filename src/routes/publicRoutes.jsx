
import { faCircleInfo, faHome, faRightFromBracket, faUserCircle } from "@fortawesome/free-solid-svg-icons";

import { AboutView } from "../views/www/AboutView";
import Home from "../views/Home";
import ContactView from "../views/www/ContactView";
import ServicesView from "../views/www/ServicesView";


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
  { 
    type: 'collapse',
    title: 'Contact',
    key: 'contact',
    path: '/contact',
    icon: faRightFromBracket,
    element: <ContactView />
  },
  { 
    type: 'collapse',
    title: 'Services',
    key: 'services',
    path: '/services',
    icon: faUserCircle,
    element: <ServicesView />
  },
];

export default publicRoute;