import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsSpin, faBuilding, faCalendarDay, faFile, faFileSignature, faGear, faStickyNote, faUsers, faWindowMaximize } from "@fortawesome/free-solid-svg-icons";

import adcStatusProps from "../helpers/adcStatusProps";
import isNullOrEmpty from "../../../helpers/isNullOrEmpty";
import defaultCycleYearProps from "../../../helpers/defaultCycleYearProps";

const ADCAuditCycleListItem = ({ adc, onShowModal }) => {
    const itemStyle = `d-flex justify-content-between align-items-center rounded-1 item-action gap-2 px-2 py-1`;

    return (
        <div className={itemStyle}>
            <div className="text-sm">
                <FontAwesomeIcon
                    icon={faWindowMaximize}
                    size="lg"
                    className={`text-${!!adc.Alerts && adc.Alerts.length > 0
                        ? 'danger'
                        : adcStatusProps[adc.Status].variant
                        } text-gradient`}
                    title={!!adc.Alerts && adc.Alerts.length > 0
                        ? 'The ADC have alerts, see the details'
                        : adcStatusProps[adc.Status].description
                    }
                />
            </div>
            <div>
                <h6 className="text-xs text-dark text-gradient mb-0">
                    {adc.AppFormStandardName}
                </h6>
                {
                    !isNullOrEmpty(adc.Description) && 
                    <p className="text-xs text-secondary text-wrap mb-0"> 
                        {adc.Description}
                    </p>
                }
                <div className="d-flex justify-content-start align-items-center text-xs text-secondary gap-1">
                    <span title="Audit cycle year">
                        <FontAwesomeIcon icon={faArrowsSpin} />: { defaultCycleYearProps[adc.CycleYear].abbr }
                    </span>
                    <span title={ `${adc.NotesCount} notes` } className="ari-border-end pe-1">
                        <FontAwesomeIcon icon={ faStickyNote } 
                            className={`text-${ adc.NotesCount == 0 ? 'secondary' : 'warning' }`}                            
                        />
                    </span>
                    <span title="Sites" className="ari-border-end px-1">
                        <FontAwesomeIcon icon={ faBuilding } />: { adc.ADCSitesCount ?? '0' }
                    </span>
                    <span title="Total initial (days)" className="ari-border-end px-1">
                        <FontAwesomeIcon icon={ faCalendarDay } />: {!!adc.TotalMD11 
                            ? adc.TotalMD11
                            : adc.TotalInitial ?? '0'}
                    </span>
                    <span title="Total employees" className="ari-border-end px-1">
                        <FontAwesomeIcon icon={ faUsers } />: { adc.TotalEmployees ?? '0' }
                    </span>
                    <span title={ adc.HasProposal ? 'Proposal associated' : 'No proposal associated' } className="ps-1">
                        <FontAwesomeIcon 
                            icon={ adc.HasProposal ? faFileSignature : faFile } 
                            className={ adc.HasProposal ? 'text-info' : 'text-secondary' }
                        />
                    </span>
                </div>
            </div>
            <div className="text-end">
                <button type="button" 
                    className="btn btn-link text-dark text-gradient p-0 mb-0"
                    onClick={ () => { onShowModal(adc.ID) } } 
                    title="Edit ADC"
                >
                    <FontAwesomeIcon icon={ faGear } size="lg" />
                </button>
            </div>
        </div>
    )
}; // ADCAuditCycleListItem

export default ADCAuditCycleListItem;