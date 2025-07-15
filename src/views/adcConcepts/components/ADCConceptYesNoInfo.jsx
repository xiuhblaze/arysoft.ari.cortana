import enums from "../../../helpers/enums";

const ADCConceptYesNoInfo = ({ item, ...props }) => {
    const { ADCConceptUnitType } = enums();

    return (
        <div {...props}>
            {
                !!item.Increase ? (
                    <p className="text-xs font-weight-bold text-nowrap mb-1">
                        {item.WhenTrue ? (
                            <span className="me-1">
                                <span className="badge bg-gradient-success text-white">Yes</span> Increase:
                            </span>
                        ) : (
                            <span className="me-1">
                                <span className="badge bg-gradient-primary text-white">No</span> Increase:
                            </span>
                        )}
                        {item.Increase}
                        {item.IncreaseUnit == ADCConceptUnitType.days ? ' days' : ' %'}
                    </p>
                ) : null
            }
            {
                !!item.Decrease ? (
                    <p className="text-xs font-weight-bold text-nowrap mb-0">
                        {!item.WhenTrue ? (
                            <span className="me-1">
                                <span className="badge bg-gradient-success text-white">Yes</span> Decrease:
                            </span>
                        ) : (
                            <span className="me-1">
                                <span className="badge bg-gradient-primary text-white">No</span> Decrease:
                            </span>
                        )}
                        {item.Decrease} 
                        {item.DecreaseUnit == ADCConceptUnitType.days ? ' days' : ' %'}
                    </p>
                ) : null
            }
        </div>
    )
}

export default ADCConceptYesNoInfo;