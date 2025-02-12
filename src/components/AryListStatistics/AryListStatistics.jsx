import { faFile, faList, faTableCells, faTableList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

const AryListStatistics = ({ meta, className, ...props }) => {
    const style = 'text-sm d-flex justify-content-center gap-4' + (!!className ? ' ' + className : '');

    return (        
        <div className={ style } {...props}>
            { !!meta ? (
                <>
                    <span title={ `Page ${ meta.CurrentPage} of ${ meta.TotalPages }` }>
                        <FontAwesomeIcon icon={faFile} className="text-dark me-1 opacity-7" />
                        {meta.CurrentPage} / {meta.TotalPages}
                    </span>
                    <span>
                        <FontAwesomeIcon icon={faTableCells} className="text-dark me-1 opacity-7" />
                        Total items: {meta.TotalCount}
                    </span>
                    <span>
                        <FontAwesomeIcon icon={faTableList} className="text-dark me-1 opacity-7" />
                        Per page: {meta.PageSize}
                    </span>
                </>    
            ) : null }
        </div>
    )
}

export default AryListStatistics