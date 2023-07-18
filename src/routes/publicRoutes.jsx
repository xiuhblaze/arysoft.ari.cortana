
import { faHome, faLandmark, faUsers } from "@fortawesome/free-solid-svg-icons";

import { Administraciones } from "../views/Administraciones";
import { Dashboard } from "../views/Dashboard/Dashboard";
import { Empleados } from "../views/Empleados";

const publicRoute = [
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
];

export default publicRoute;