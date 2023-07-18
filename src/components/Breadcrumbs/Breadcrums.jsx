import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Link } from 'react-router-dom';

export const Breadcrums = ({ icon, title, route }) => {
  const routes = route.slice(0, -1);
  // console.log(icon, title, route);

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
        <li className="breadcrumb-item text-sm">
          <Link to="/">
            <FontAwesomeIcon icon={ icon } />
          </Link>
        </li>
        {
          routes.map( item => (
            <li className="breadcrumb-item text-sm" aria-current="page">
              <Link to={ `/${ item }`} key={ item }>
                { item }
              </Link>
            </li>
          ))
        }
        <li className="breadcrumb-item text-sm text-dark active" aria-current="page">{ title }</li>
      </ol>
      <h6 className="font-weight-bolder text-capitalize mb-0">{ title.replace('-', ' ') }</h6>
    </nav>
  )
}

export default Breadcrums;