import { useEffect, useRef, useState } from 'react';
import { Pagination } from "react-bootstrap";

import envVariables from "../../helpers/envVariables";

export const AryPagination = ({ currentPage, totalPages, onClickGoPage, ...props }) => {
    const {
        VITE_PAGE_MAX_DISPLAY,
        VITE_PAGINATION_MIN,
        VITE_PAGINATION_MAX,
    } = envVariables();
    const PAGE_MAX_DISPLAY = Number(VITE_PAGE_MAX_DISPLAY);
    const PAGINATION_MIN = Number(VITE_PAGINATION_MIN);
    const PAGINATION_MAX = Number(VITE_PAGINATION_MAX);

    const [maxElements, setMaxElements] = useState(PAGE_MAX_DISPLAY);
    const containerRef = useRef(null);

    if (currentPage < 1 || currentPage > totalPages) return;

    useEffect(() => {
        const onMiniPagination = () => {
            const currentWidth = containerRef.current.clientWidth;
            setMaxElements(currentWidth < 576 ? PAGINATION_MIN : PAGINATION_MAX);
        };

        window.addEventListener('resize', onMiniPagination);
        onMiniPagination();
        
        return () => {
            window.removeEventListener('resize', onMiniPagination);
        }
    });

    let i = 0;
    do { i += maxElements; } while (i < currentPage);
    const iInicio = i - maxElements + 1;
    const iFin = iInicio + maxElements - 1 < totalPages
        ? iInicio + maxElements - 1
        : totalPages;
    const items = [];
    
    if (iInicio > 1) {
        items.push(
            <Pagination.First key="first" onClick={() => { onClickGoPage(1) }} title="First page" />
        )
    }

    if (currentPage > 1) {
        items.push(
            <Pagination.Prev key="prev" onClick={() => { onClickGoPage(currentPage - 1) }} title={`Previous page (${currentPage - 1})`} />
        );
    }

    if (iInicio > 1) {
        items.push(
            <Pagination.Ellipsis key="blockPrev" onClick={() => { onClickGoPage(iInicio - 1) }} title="Previous pages block" />
        );
    }

    for (let i = iInicio; i <= iFin; i++) {
        items.push(
            <Pagination.Item key={i}
                active={i === currentPage}
                onClick={() => { onClickGoPage(i) }}
                title={i === currentPage ? 'Current page' : `Go to page ${i}`}
            >
                {i}
            </Pagination.Item>,
        );
    }

    if (iFin < totalPages) {
        items.push(
            <Pagination.Ellipsis key="blocknext" onClick={() => { onClickGoPage(iFin + 1) }} title="Next pages block" />
        );
    }

    // Has next page
    if (currentPage < totalPages) {
        items.push(
            <Pagination.Next key="next" onClick={() => { onClickGoPage(currentPage + 1) }} title={`Next page (${currentPage + 1})`} />
        )
    }

    if (iFin < totalPages) {
        items.push(
            <Pagination.Last key="last" onClick={() => { onClickGoPage(totalPages) }} title="Last page" />
        )
    }

    return (
        <div {...props} ref={ containerRef }>
            <Pagination className="d-flex justify-content-center pagination-info">
                {items}
            </Pagination>
        </div>
    )
}

export default AryPagination;