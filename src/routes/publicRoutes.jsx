import { lazy } from "react";

import { faFaceSmile } from "@fortawesome/free-solid-svg-icons";

const lazyHome = lazy(() => import('../views/Home'));
const lazyAbout = lazy(() => import('../views/www/AboutView'));
const lazyServices = lazy(() => import('../views/www/ServicesView'));
const lazySteps = lazy(() => import('../views/www/StepsView'));
const lazyNews = lazy(() => import('../views/www/NewsView'));
const lazyAccreditation = lazy(() => import('../views/www/AccreditationView'));
const lazyStatus = lazy(() => import('../views/www/CertificateStatusView'));
const lazyContact = lazy(() => import('../views/www/ContactView'));

const publicRoute = [
  { 
    type: 'collapse',
    title: 'Home',
    key: 'home',
    path: '/home',
    icon: faFaceSmile,
    element: lazyHome
  },
  { 
    type: 'collapse',
    title: 'About',
    key: 'about',
    path: '/about',
    icon: faFaceSmile,
    element: lazyAbout
  },
  { 
    type: 'collapse',
    title: 'Services',
    key: 'services',
    path: '/services',
    icon: faFaceSmile,
    element: lazyServices
  },
  { 
    type: 'collapse',
    title: 'Steps for certification',
    key: 'steps',
    path: '/steps-for-certification',
    icon: faFaceSmile,
    element: lazySteps
  },
  { 
    type: 'collapse',
    title: 'News',
    key: 'news',
    path: '/news',
    icon: faFaceSmile,
    element: lazyNews
  },
  { 
    type: 'collapse',
    title: 'Accreditation Certificate',
    key: 'accreditation',
    path: '/accreditation',
    icon: faFaceSmile,
    element: lazyAccreditation
  },
  { 
    type: 'collapse',
    title: 'Certificate Status',
    key: 'status',
    path: '/certificate-status',
    icon: faFaceSmile,
    element: lazyStatus
  },
  { 
    type: 'collapse',
    title: 'Contact',
    key: 'contact',
    path: '/contact',
    icon: faFaceSmile,
    element: lazyContact
  },
];

export default publicRoute;