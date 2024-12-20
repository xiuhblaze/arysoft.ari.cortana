
const ApplicationFormBadgeStatus = ({ status, size, ...props }) => {
    const statusProps = [
        { bg: 'secondary', label: 'undefined' },
        { bg: 'secondary', label: 'New' },
        { bg: 'warning', label: 'Send' },
        { bg: 'warning', label: 'Sales Review' },
        { bg: 'warning', label: 'Applicant Review' },
        { bg: 'warning', label: 'Sales Evaluation' },
        { bg: 'success', label: 'Accepted Client' },
        { bg: 'damger', label: 'Rejected Client' },
        { bg: 'success', label: 'Acredited Auditor' },
        { bg: 'info', label: 'Active' },
        { bg: 'info', label: 'Cancel' },
        { bg: 'danger', label: 'Deleted' },
    ];
    
    return (
        <div { ...props } className={`badge badge-${ size ?? 'sm'} bg-gradient-${statusProps[status].bg }` } >
            { statusProps[status].label }
        </div>
    )
}

export default ApplicationFormBadgeStatus