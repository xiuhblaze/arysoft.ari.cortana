
import { faHome, faLandmark, faList, faUserGear, faUsers } from "@fortawesome/free-solid-svg-icons";

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
    type: 'title',
    title: 'Catálogos',
    key: 'catalogos',
  },
  { 
    type: 'collapse',
    title: 'Administraciones',
    key: 'administraciones',
    path: '/administraciones',
    icon: faLandmark,
    element: <Administraciones />
  },
  { 
    type: 'collapse',
    title: 'Empleados',
    key: 'empleados',
    path: '/empleados',
    icon: faUsers,
    element: <Empleados />
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
    title: 'Cuenta',
    key: 'cuenta',
  },
  { 
    type: 'collapse',
    title: 'Perfil',
    key: 'perfil',
    path: '/perfil',
    icon: faUserGear,
    element: <Profile />
  },
];

export default privateRoute;