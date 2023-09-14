
import { faCity, faHome, faLandmark, faList, faUserGear, faUsers } from "@fortawesome/free-solid-svg-icons";

import { lazy } from "react";

const lazyDashboard = lazy(() => import('../views/Dashboard/Dashboard'));
const lazyNacecodes = lazy(() => import('../views/nacecodes'));
const lazyStandards = lazy(() => import('../views/standards'));
const lazyList = lazy(() => import('../views/examples/ListView'));

const privateRoute = [
  { 
    type: 'collapse',
    title: 'Dashboard',
    key: 'dashboard',
    path: '/dashboard',
    icon: faHome,
    element: lazyDashboard
  },
  // { 
  //   type: 'collapse',
  //   title: 'Organizations',
  //   key: 'organizations',
  //   path: '/organizations',
  //   icon: faCity,
  //   element: <Empleados />
  // },
  {
    type: 'title',
    title: 'Catalogs',
    key: 'catalogs',
  },
  { 
    type: 'collapse',
    title: 'Standards',
    key: 'standards',
    path: '/standards/*',
    icon: faLandmark,
    element: lazyStandards
  },
  { 
    type: 'collapse',
    title: 'NACE Codes',
    key: 'nacecodes',
    path: '/nace-codes/*',
    icon: faLandmark,
    element: lazyNacecodes
  },
  { 
    type: 'collapse',
    title: 'List example',
    key: 'list',
    path: '/examples/list',
    icon: faList,
    element: lazyList
  },
  // {
  //   type: 'title',
  //   title: 'Account',
  //   key: 'account',
  // },
  // { 
  //   type: 'collapse',
  //   title: 'Profile',
  //   key: 'profile',
  //   path: '/profile',
  //   icon: faUserGear,
  //   element: <Profile />
  // },
];

export default privateRoute;