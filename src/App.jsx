import { BrowserRouter, RouterProvider } from 'react-router-dom';

import './app.css';

import publicRoute from './routes/publicRoutes';


function App() {
  
  return (
    <RouterProvider router={ publicRoute } />
    // <BrowserRouter>
    //   <>
    //     <Container>
    //       <h1>
    //         <FontAwesomeIcon icon={ faUserCircle } className="me-4" />
    //         Zapotlán - Soft UI
    //       </h1>
    //       <Card>
    //         <Card.Body>
    //           <Card.Title>Tarjetita</Card.Title>
    //           <Card.Text>Lorem ipsum dolor sit amet</Card.Text>
    //         </Card.Body>
    //       </Card>
    //     </Container>    
    //   </>
    // </BrowserRouter>
  )
}

export default App
