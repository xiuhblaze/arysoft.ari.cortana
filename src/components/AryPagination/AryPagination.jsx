import { Pagination } from "react-bootstrap";
import envVariables from "../../helpers/envVariables";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faList } from "@fortawesome/free-solid-svg-icons";

const { VITE_PAGE_MAX_DISPLAY } = envVariables();

export const AryPagination = ({ currentPage, totalPages, totalCount = 0, showStatistics = false, onClickGoPage, ...props }) => {
  const PAGE_MAX_DISPLAY = Number(VITE_PAGE_MAX_DISPLAY);

  if (currentPage < 1 || currentPage > totalPages) return;

  const items = [];
  const inicio = (currentPage * 0.1) - Math.floor(currentPage * 0.1);
  const iInicio = inicio === 0 ? currentPage - PAGE_MAX_DISPLAY + 1 : Math.floor(currentPage * 0.1) * 10 + 1;
  const iFin = iInicio + PAGE_MAX_DISPLAY - 1 < totalPages ? iInicio + PAGE_MAX_DISPLAY - 1 : totalPages;

  // console.log({
  //   inicio, iInicio, iFin, currentPage, PAGE_MAX_DISPLAY, totalPages
  // });

  // console.log(iInicio + PAGE_MAX_DISPLAY - 1)


  if (iInicio > 1) {
    items.push(
      <Pagination.First key="first" onClick={ () => { onClickGoPage(1) }} title="First page" />
    )
  }

  if (currentPage > 1) {
    items.push(
      <Pagination.Prev key="prev" onClick={ () => { onClickGoPage(currentPage - 1) }} title={`Previous page (${ currentPage - 1 })`} />
    );
  }

  if (iInicio > 1) {
    items.push(
      <Pagination.Ellipsis key="10prev" onClick={ () => { onClickGoPage(iInicio - 1) }} title="Previous pages block" />
    );
  }

  for (let i = iInicio; i <= iFin; i++) {
    items.push(
      <Pagination.Item key={i} 
        active={i === currentPage}
        onClick={ () => { onClickGoPage(i) }}
        title={i === currentPage ? 'Current page' : `Go to page ${ i }`}
      >
        { i }
      </Pagination.Item>,
    );
  }

  if (iFin < totalPages) {
    items.push(
      <Pagination.Ellipsis key="10next" onClick={ () => { onClickGoPage(iFin + 1) }} title="Next pages block" />
    );
  }

  // Has next page
  if (currentPage < totalPages) {
    items.push(
      <Pagination.Next key="next" onClick={ () => { onClickGoPage(currentPage + 1) }} title={`Next page (${currentPage + 1})`} />
    )
  }
  
  if (iFin < totalPages) {
    items.push(
      <Pagination.Last key="last" onClick={ () => { onClickGoPage(totalPages) }} title="Last page" />
    )
  }
  
  return (
    <div { ...props } >
      <Pagination className="d-flex justify-content-center pagination-info mb-1">
        { items }
      </Pagination>
      { showStatistics && (
        <div className="text-sm d-flex justify-content-center gap-4 mb-3">
          <span>
            <FontAwesomeIcon icon={ faList } className="me-1 opacity-7" />
            Total: { totalCount }
          </span>
          <span>
            <FontAwesomeIcon icon={ faFile } className="me-1 opacity-7" />
            Per page: { totalPages }
          </span>
        </div>
      )}
    </div>
  )
}

export default AryPagination;