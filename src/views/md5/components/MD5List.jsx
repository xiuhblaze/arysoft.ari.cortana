import { useEffect, memo } from "react";
import { useMD5sStore } from "../../../hooks/useMD5sStore";
import enums from "../../../helpers/enums";
import ComponentLoading from "../../../components/Loaders/ComponentLoading";
import { ListGroup } from "react-bootstrap";

const MD5List = memo(({ daysList, rows = 4, ...props }) => {
    const h6Style = 'text-sm text-dark text-gradient text-wrap mb-0';
    const { DefaultStatusType, MD5OrderType } = enums();

    const {
        isMD5sLoading,
        md5s,

        md5sAsync,
    } = useMD5sStore();

    useEffect(() => {
        
        md5sAsync({
            Status: DefaultStatusType.active,
            Order: MD5OrderType.days,
            pageSize: 0
        });
    }, []);
    

    return (
        <div {...props} className="bg-gray-100 rounded-3 p-3" style={{ width: '400px', minWidth: '300px' }}>
            <h6 className={h6Style}>MD5</h6>
            <div className="d-flex justify-content-between align-items-center bg-transparent gap-2">
                <div className="text-wrap text-xs font-weight-bold">
                    Effective Number of Personnel
                </div>
                <div className="text-end text-wrap text-xs font-weight-bold">
                    Audit Time<br />Stage 1 + Stage 2 (days)
                </div>
            </div>
            {
                isMD5sLoading ? (
                    <ComponentLoading />
                ) : !!md5s && md5s.length > 0 ? (
                    <div style={{ maxHeight: `${ rows * 30 }px`, overflow: 'auto' }}>
                        <ListGroup variant="flush" size="sm">
                            { md5s.map(md5 => {
                                const isValidDay = !!daysList.find(day => day == md5.Days);
                                const itemStyle = `d-flex justify-content-between align-items-center bg-transparent ${ 
                                    isValidDay ? 'text-dark font-weight-bold' : 'text-secondary' }`;
                                return (
                                    <ListGroup.Item key={md5.ID} className={itemStyle} >
                                        <div className="text-xs text-wrap mb-0" title="Personnel range">
                                            {md5.StartValue} - {md5.EndValue}
                                        </div>
                                        <div className="text-xs text-wrap mb-0" title="Audit days">
                                            <span className={`badge bg-gradient-${isValidDay ? 'info' : 'secondary'} text-white`}>
                                                {md5.Days}
                                            </span>
                                        </div>
                                    </ListGroup.Item>
                                );
                            }) }
                        </ListGroup>
                    </div>
                ) : null
            }
        </div>
    )
});

export default MD5List