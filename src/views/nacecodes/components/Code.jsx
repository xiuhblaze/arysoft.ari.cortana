
export const Code = ({ sector, division, group, classs, ...props }) => {

    return (
        <div {...props} className="d-flex justify-content-between align-items-center text-sm gap-1">
            <span className="badge bg-gradient-secondary text-white" title="Sector">
                { sector !== null && sector !== undefined
                    ? sector.toString().padStart(2, '0') 
                    : <span className={ !!sector ? '' : 'opacity-4' }>00</span>
                }
            </span>
            <span className={`badge bg-gradient-${ division !== null && division !== undefined ? 'secondary' : 'light' } text-white`} title="Division">
                { division !== null && division !== undefined
                    ? division.toString().padStart(2, '0') 
                    : <span className={ !!division ? '' : 'opacity-4' }>00</span> 
                } 
            </span>
            <span className={`badge bg-gradient-${ group !== null && group !== undefined ? 'secondary' : 'light' } text-white`} title="Group">
                { group !== null && group !== undefined
                    ? group.toString().padStart(2, '0') 
                    : <span className={ !!group ? '' : 'opacity-4' }>00</span>
                }
            </span>
            <span className={`badge bg-gradient-${ classs !== null && classs !== undefined ? 'secondary' : 'light' } text-white`} title="Class">
                { classs !== null && classs !== undefined
                    ? classs.toString().padStart(2, '0') 
                    : <span className={ !!classs ? '' : 'opacity-4' }>00</span>
                }
            </span>
        </div>
    )
};

export default Code;