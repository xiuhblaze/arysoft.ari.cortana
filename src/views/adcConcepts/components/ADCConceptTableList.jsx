import { useState } from "react";
import enums from "../../../helpers/enums";
import envVariables from "../../../helpers/envVariables";
import { useADCConceptsStore } from "../../../hooks/useADCConceptsStore"
import { useModuleNavigation } from "../../../hooks/useModuleNavigation";
import { ViewLoading } from "../../../components/Loaders";
import AryTableSortItem from "../../../components/AryTableSortItem/AryTableSortItem";
import ADCConceptTableItem from "./ADCConceptTableItem";

const ADCConceptTableList = () => {
    const headStyle = 'text-uppercase text-secondary text-xxs font-weight-bolder';
    const {
        ADCCONCEPTS_OPTIONS
    } = envVariables();

    const {
        ADCConceptOrderType,
    } = enums();

    // CUSTOM HOOKS

    const {
        isADCConceptsLoading,
        adcConcepts,
        adcConceptsAsync,
    } = useADCConceptsStore();

    const {
        currentOrder,
        onSearch,
        onOrderChange,
    } = useModuleNavigation(adcConceptsAsync, ADCCONCEPTS_OPTIONS, ADCConceptOrderType.standard);

    return (
        <>
            {
                isADCConceptsLoading ? (
                    <ViewLoading />
                ) : !!adcConcepts ? (
                    <div className="table-responsive p-0">
                        <table className="table align-items-center mb-0">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>
                                        <div className="d-flex justify-content-start align-items-center gap-1">
                                            <AryTableSortItem
                                                activeAsc={currentOrder === ADCConceptOrderType.indexSort}
                                                activeDesc={currentOrder === ADCConceptOrderType.indexSortDesc}
                                                onOrderAsc={() => { onOrderChange(ADCConceptOrderType.indexSort) }}
                                                onOrderDesc={() => { onOrderChange(ADCConceptOrderType.indexSortDesc) }}
                                            />
                                            <div className={headStyle}>I</div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="d-flex justify-content-start align-items-center gap-1">
                                            <AryTableSortItem
                                                activeAsc={currentOrder === ADCConceptOrderType.description}
                                                activeDesc={currentOrder === ADCConceptOrderType.descriptionDesc}
                                                onOrderAsc={() => { onOrderChange(ADCConceptOrderType.description) }}
                                                onOrderDesc={() => { onOrderChange(ADCConceptOrderType.descriptionDesc) }}
                                            />
                                            <div className={headStyle}>Description</div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="d-flex justify-content-start align-items-center gap-1">
                                            <AryTableSortItem
                                                activeAsc={currentOrder === ADCConceptOrderType.standard}
                                                activeDesc={currentOrder === ADCConceptOrderType.standardDesc}
                                                onOrderAsc={() => { onOrderChange(ADCConceptOrderType.standard) }}
                                                onOrderDesc={() => { onOrderChange(ADCConceptOrderType.standardDesc) }}
                                            />
                                            <div className={headStyle}>Standard</div>
                                        </div>
                                    </th>
                                    <th className={headStyle}>Info</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                { adcConcepts.map(item => <ADCConceptTableItem 
                                    key={item.ID} 
                                    item={item} 
                                />)}
                            </tbody>
                        </table>
                    </div>
                ) : null
            }
        </>
    )
}; // ADCConceptTableList

export default ADCConceptTableList;