
const ProposalPreviewADC = () => {
    const headerStyle = 'col-3 text-xs text-wrap font-weight-bold bg-light';
    const subHeaderStyle = 'text-xs text-dark text-center align-middle font-weight-bold text-wrap bg-light';
    const bodyStyle = 'text-xs text-center text-wrap';
    const totalStyle = 'text-xs text-dark text-center font-weight-bold text-wrap';
    const separatorStyle = { height: '.25rem' };

    return (
        <table className="table table-borderless table-hover mx-print-3">
            <thead>
                <tr>
                    <th colSpan={5} className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        Audit Days Calculation
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className={ `${headerStyle} align-middle text-center` } rowSpan={2}>Sites/Stage</td>
                    <td className={ `${subHeaderStyle} col-3` } colSpan={2}>First year</td>
                    <td className={ `${subHeaderStyle} col-3` }>Second year</td>
                    <td className={ `${subHeaderStyle} col-3` }>Third year</td>
                </tr>
                <tr>
                    <td className={ subHeaderStyle }>
                        Stage 1
                        <br />
                        <small className="text-secondary text-xxs">
                            (Evaluation of readiness for certification audit)
                        </small>
                    </td>
                    <td className={ subHeaderStyle }>
                        Stage 2
                        <br />
                        <small className="text-secondary text-xxs">
                            (Renewal of certification)
                        </small>
                    </td>
                    <td className={ subHeaderStyle }>Surveillance 1</td>
                    <td className={ subHeaderStyle }>Surveillance 2</td>
                </tr>
                <tr>
                    <td className={ headerStyle }>Main site</td>
                    <td className={ bodyStyle }>1</td>
                    <td className={ bodyStyle }>1</td>
                    <td className={ bodyStyle }>1</td>
                    <td className={ bodyStyle }>1</td>
                </tr>
                <tr>
                    <td className={ headerStyle }>Total</td>
                    <td className={ totalStyle }>$ 1,000.00</td>
                    <td className={ totalStyle }>$ 1,000.00</td>
                    <td className={ totalStyle }>$ 1,000.00</td>
                    <td className={ totalStyle }>$ 1,000.00</td>
                </tr>
            </tbody>
        </table>
    )
}; // ProposalPreviewADC

export default ProposalPreviewADC;