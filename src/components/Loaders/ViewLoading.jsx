import { Spinner } from 'react-bootstrap'

export const ViewLoading = ({ variant="info", ...props }) => {
  return (
    <div { ...props } className="text-center">
      <div className="w-100 m-auto" style={{ paddingTop: 'calc(25vh - 50px)', paddingBottom: '25vh', width: '3rem', height: '3rem' }}>
        <Spinner animation="border" variant={ variant } role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    </div>
  )
};

export default ViewLoading;
