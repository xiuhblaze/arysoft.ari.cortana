import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const AuditCycleDocumentEditItem = ({ id, documentType, ...props }) => {
  return (
    <div {...props}>
        <button
            type="button"
            className="btn btn-link p-0 mb-0 text-lg"
            title={ !!id ? 'Edit document information' : 'Add new document' }
            onClick={ () => console.log('onShowModal', id, documentType) }
        >
            <FontAwesomeIcon icon={ !!id ? faEdit : faPlus } className="text-dark" />
        </button>
    </div>
  )
}

export default AuditCycleDocumentEditItem