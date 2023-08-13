
import { faCircleInfo, faHome, faRightFromBracket, faUserCircle } from "@fortawesome/free-solid-svg-icons";

import { AboutView } from "../views/www/AboutView";
import Home from "../views/Home";
import ContactView from "../views/www/ContactView";
import ServicesView from "../views/www/ServicesView";
import StepsView from "../views/www/StepsView";
import AccreditationView from "../views/www/AccreditationView";
import NewsView from "../views/www/NewsView";
import CertificateStatusView from "../views/www/CertificateStatusView";


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
  { 
    type: 'collapse',
    title: 'Steps for certification',
    key: 'steps',
    path: '/steps-for-certification',
    icon: faUserCircle,
    element: <StepsView />
  },
  { 
    type: 'collapse',
    title: 'Accreditation Certificate',
    key: 'accreditation',
    path: '/accreditation',
    icon: faUserCircle,
    element: <AccreditationView />
  },
  { 
    type: 'collapse',
    title: 'News',
    key: 'news',
    path: '/news',
    icon: faUserCircle,
    element: <NewsView />
  },
  { 
    type: 'collapse',
    title: 'Certificate Status',
    key: 'status',
    path: '/certificate-status',
    icon: faUserCircle,
    element: <CertificateStatusView />
  },
];

export default publicRoute;