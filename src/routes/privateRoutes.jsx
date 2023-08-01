
import { faCity, faHome, faLandmark, faList, faUserGear, faUsers } from "@fortawesome/free-solid-svg-icons";

import { Administraciones } from "../views/examples/Administraciones";
import { Dashboard } from "../views/Dashboard/Dashboard";
import { Empleados } from "../views/examples/Empleados";
import { ListView } from "../views/examples/ListView";
import Profile from "../views/profile/Profile";

const privateRoute = [
  { 
    type: 'collapse',
    title: 'Dashboard',
    key: 'dashboard',
    path: '/dashboard',
    icon: faHome,
    element: <Dashboard />
  },
  { 
    type: 'collapse',
    title: 'Organizations',
    key: 'organizations',
    path: '/organizations',
    icon: faCity,
    element: <Empleados />
  },
  {
    type: 'title',
    title: 'Catalogs',
    key: 'catalogs',
  },
  { 
    type: 'collapse',
    title: 'NACE Codes',
    key: 'nacecodes',
    path: '/nace-codes',
    icon: faLandmark,
    element: <Administraciones />
  },
  { 
    type: 'collapse',
    title: 'List example',
    key: 'list',
    path: '/examples/list',
    icon: faList,
    element: <ListView />
  },
  {
    type: 'title',
    title: 'Account',
    key: 'account',
  },
  { 
    type: 'collapse',
    title: 'Profile',
    key: 'profile',
    path: '/profile',
    icon: faUserGear,
    element: <Profile />
  },
];

export default privateRoute;