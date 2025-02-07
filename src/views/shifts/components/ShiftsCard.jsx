import React, { useEffect, useState } from 'react';
import { useSitesStore } from '../../../hooks/useSiteStore';
import { Card, ListGroup } from 'react-bootstrap';
import { useShiftsStore } from '../../../hooks/useShiftsStore';
import { ViewLoading } from '../../../components/Loaders';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import enums from '../../../helpers/enums';
import EditShiftModal from './EditShiftModal';

const ShiftsCard = ({ readOnly = false, ...props }) => {

    const statusStyle = [
        'bg-light opacity-6',
        '',
        'opacity-6',
        'bg-light opacity-6',
    ];
    const shiftText = [
        '',
        'Morning',
        'Evening',
        'Night',
        'Mixed'
    ];
    const { 
        DefaultStatusType,
        ShiftType 
    } = enums();

    // CUSTOM HOOKS

    const {
        site,
    } = useSitesStore();

    const {
        isShiftsLoading,
        shifts,
        shiftsAsync
    } = useShiftsStore();

    // HOOKS

    const [totalEmployees, setTotalEmployees] = useState(0);

    useEffect(() => {
        if (!!site) {
            shiftsAsync({
                siteID: site.ID,
                pageSize: 0,
            });
        }
    }, [site]);

    useEffect(() => {
        if (!!shifts) {
            const total = shifts
                .filter(item => item.Status === DefaultStatusType.active)
                .reduce((sum, item) => sum + item.NoEmployees, 0);
            setTotalEmployees(total);
        }
    }, [shifts]);
    
    

    return (
        <Card className="text-bg-light h-100 mb-3">
            <Card.Header className="text-bg-light pb-0 p-3">
                <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Shifts</h6>
                    {
                        !readOnly && <EditShiftModal />
                    }
                </div>
            </Card.Header>
            <Card.Body className="px-3 py-0">
                {
                    isShiftsLoading ? (
                        <ViewLoading />
                    ) : !!shifts 
                        && <ListGroup style={{ maxHeight: '260px', overflowY: 'auto' }}>
                            {
                                shifts.map( item => {
                                    const itemStyle= `bg-transparent border-0 d-flex justify-content-between align-items-center px-0 mb-2 ${ statusStyle[item.Status] }`;
                                    
                                    return (
                                        <ListGroup.Item key={ item.ID }
                                            className={ itemStyle }
                                        >
                                            <div className="d-flex flex-column">
                                                <p className="text-xs text-dark font-weight-bold mb-0">
                                                    { shiftText[item.Type] } | Employees: { item.NoEmployees }
                                                </p>
                                                <p className="text-secondary text-xs mb-0">
                                                    Activities: <span className="text-dark">{ item.ActivitiesDescription }</span>
                                                </p>
                                                <p className="text-xs ps-3 my-1">
                                                    From: { item.ShiftStart } - To: { item.ShiftEnd }
                                                    { item.ShiftStart2 && item.ShiftEnd2 && <span><br />{`Then from: ${ item.ShiftStart2 } - To: ${ item.ShiftEnd2 }`}</span> }
                                                </p>
                                                { item.ExtraInfo && 
                                                    <p className="text-xs text-secondary mb-0">
                                                        Aditional information: <span className="text-dark">{ item.ExtraInfo }</span>
                                                    </p> 
                                                }
                                            </div>
                                            <div>
                                                {
                                                    !readOnly && <EditShiftModal id={ item.ID } />
                                                }
                                            </div>
                                        </ListGroup.Item>
                                    )
                                })
                            }
                        </ListGroup>
                }
            </Card.Body>
            <Card.Footer className="p-3 pt-0">
                <h6 className="text-sm mb-0">Total employees: {totalEmployees}</h6>
            </Card.Footer>
        </Card>
    )
}

export default ShiftsCard