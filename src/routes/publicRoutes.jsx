import { createBrowserRouter } from "react-router-dom";
import Inicio from "../views/inicio";

const publicRoute = createBrowserRouter([
  { 
    path: '/',
    element: <Inicio />
  },
  { 
    path: '/hola',
    element: <div>Hola mundo!</div>,
  },
  { 
    path: '/ceci',
    element: <div>Ceci!</div>,
  },
]);

export default publicRoute;