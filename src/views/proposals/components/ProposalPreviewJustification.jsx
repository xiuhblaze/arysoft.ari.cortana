import { useEffect, useState } from 'react';
import ShowFormatTextInput from '../../../components/General/ShowFormatTextInput'
import { useProposalController } from '../context/ProposalContext';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import enums from '../../../helpers/enums';
import { te } from 'date-fns/locale';

const ProposalPreviewJustification = ({ formik, ...props }) => {
    const headerStyle = 'col-3 text-xs text-wrap font-weight-bold bg-light';
    const bodyStyle = 'text-xs text-dark text-wrap';

    const { AuditCycleType, ADCConceptUnitType } = enums();

    const [controller, dispatch] = useProposalController();
    const { 
        proposalData,
        adcList,
    } = controller;

    const { ADCSites } = proposalData;

    // HOOKS

    const [justification, setJustification] = useState('');

    useEffect(() => {

        //console.log('ProposalPreviewJustification.useEffect: formik', formik.values);
        generateJustification();

    }, [formik.values]);

    const generateJustification = () => {
        const isMultisite = ADCSites.length > 1;        
        let textJustification = 'The calculation of days presented in this proposal was made in accordance with the requirements of IAF MD5.\n\n';
        
        textJustification += adcList.map(adcItem => {
            //console.log('adcItem', adcItem);
            const cycleType = proposalData.AuditCycle.AuditCycleStandards.find(acs => acs.StandardID == adcItem.AppFormStandardID).CycleType;

            let textItem = `Number of employees: **${adcItem.TotalEmployees}**  \n`;

            textItem += 'Range MD5: ';
            if (isMultisite) {
                ADCSites.forEach(adcSite => {
                    textItem += `[${ adcSite.SiteDescription }: ${ adcSite.NoEmployees } > ${adcSite.MD5Range}] `;
                });
            } else if (ADCSites.length == 1) {
                const adcSite = ADCSites[0];
                textItem += ` ${adcSite.MD5Range}`;
            } else {
                textItem += ` (no data)`;
            }
            textItem += `  \n`;
            textItem += `Audit time: **${adcItem.TotalInitial} ${ adcItem.TotalInitial == 1 ? 'day' : 'days' }** for initial certification.  \n`;
            textItem += `Surveillance being about 1/3 of the audit time spent on the initial certification audit.  \n`;
            textItem += `For surveillance(1/3): **${adcItem.TotalSurveillance} ${ adcItem.TotalSurveillance <= 1 ? 'day' : 'days' }**\n`;
            textItem += `\n`;

            if (cycleType == AuditCycleType.recertification) {
                textItem += `The audit time for the **recertification audit** should be calculated on the basis of the updated information of the client and is normally approximately 2/3 of the audit time that would be required for an initial certification audit (Stage 1 + Stage 2).  \n`;
                textItem += `For recertification (2/3): **${adcItem.TotalRecertification} ${ adcItem.TotalRecertification <= 1 ? 'day' : 'days' }**\n`;
                textItem += `\n`;
            }

            textItem += `Plus, it was done time adjustment as follow:\n`;

            const adcSite = ADCSites.find(adcSite => adcSite.IsMainSite);
console.log('adcSite', adcSite);
            if (!!adcSite) {
                //textItem += `\nFor ${ adcSite.SiteDescription }\n`;
                adcSite.ADCConceptValues.forEach(adcConceptValue => {
                    if (adcConceptValue.Value != null && adcConceptValue.Value != 0) { 
                        //console.log('adcConceptValue', adcConceptValue);
                        const whenTrue = (adcConceptValue.ADCConceptWhenTrue && adcConceptValue.CheckValue) 
                            || (!adcConceptValue.ADCConceptWhenTrue && !adcConceptValue.CheckValue)
                            ? '+' // Incremento
                            : '-'; // Decremento
                        const valueUnit = adcConceptValue.ValueUnit == ADCConceptUnitType.days ? 'days' : '%';
                        textItem += `- ${ adcConceptValue.ADCConceptDescription }: **${ whenTrue }${ adcConceptValue.Value }${ valueUnit }**\n`;
                    }
                });
            }
            // const adcSites = ADCSites
            //     .filter(adcSite => adcSite.ADCID == adcItem.ID)
            //     .sort((a, b) => b.IsMainSite - a.IsMainSite 
            //         || a.SiteDescription.localeCompare(b.SiteDescription));

            // adcSites.forEach(adcSite => {
            //     console.log('adcSite', adcSite);
            //     textItem += `\nFor ${ adcSite.SiteDescription }\n`;
            //     adcSite.ADCConceptValues.forEach(adcConceptValue => {
            //         if (adcConceptValue.Value != null && adcConceptValue.Value != 0) { //! Falta indicar si es porcentaje o días y si es incremento o decremento
            //             console.log('adcConceptValue', adcConceptValue);
            //             const whenTrue = (adcConceptValue.ADCConceptWhenTrue && adcConceptValue.CheckValue) 
            //                 || (!adcConceptValue.ADCConceptWhenTrue && !adcConceptValue.CheckValue)
            //                 ? '+' // Incremento
            //                 : '-'; // Decremento
            //             const valueUnit = adcConceptValue.ValueUnit == ADCConceptUnitType.days ? 'days' : '%';
            //             textItem += `- ${ adcConceptValue.ADCConceptDescription }: **${ whenTrue }${ adcConceptValue.Value }${ valueUnit }**\n`;
            //         }
            //     });
            // });

            //console.log('adcSites', adcSites);

            return textItem;
        });
        // justification += '\n';

        // `The calculation of days presented in this proposal was made in accordance with the requirements of IAF MD5.
        //     Number of employees:
        //     Range MD5: 

        //     Audit time 9k MD5: xx days for initial certification.

        //     Surveillance being about 1/3 of the audit time spent on the initial certification audit.
        //     -For surveillance(1/3) = xx days

        //     The audit time for the recertification audit should be calculated on the basis of the
        //     updated information of the client and is normally approximately 2/3 of the audit time that
        //     would be required for an initial certification audit (Stage 1 + Stage 2).
        //     -For recertification (2/3) = xx days

        //     Plus, it was done time adjustment as follow:
        //     -10% for System covers few processes / repetitive activities / small site / small scope
        //     -5% Because high degree regulation doesn´t apply / +0.25 because high degree regulation applies
        //     -10% Does not apply design
        //     -10% System maturation
        //     -10% Automation level
        //     +0.5 System covers high number of unique activities / processes / large scope / large site
        //     +0.25 Complicated logistics & Temp sites (Multisite / temporaly sites)
        //     +0.5 For complaints from interested parties
        //     +0.5 Different Language.`;

        //formik?.setFieldValue('justificationInput', justification);

        setJustification(textJustification);
    };

    return (
        <table className="table table-borderless table-hover mx-print-3">
            <tbody>
                <tr>
                    <td className={headerStyle}>Justification</td>
                    <td className={bodyStyle}>
                        <Markdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                                p: ({node, ...props}) => <p style={{ fontSize: '.75rem' }} {...props} />,
                                strong: ({node, ...props}) => <strong style={{fontWeight: 600}} {...props} />
                            }}
                        >
                            { justification }
                        </Markdown>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default ProposalPreviewJustification