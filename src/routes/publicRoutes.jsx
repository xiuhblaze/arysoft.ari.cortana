
import { faHome, faLandmark, faList, faUsers } from "@fortawesome/free-solid-svg-icons";

import { Administraciones } from "../views/Administraciones";
import { Dashboard } from "../views/Dashboard/Dashboard";
import { Empleados } from "../views/Empleados";
import { ListView } from "../views/examples/ListView";

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
  { 
    type: 'collapse',
    title: 'List example',
    key: 'list',
    path: '/examples/list',
    icon: faList,
    element: <ListView />
  },
];

export default publicRoute;