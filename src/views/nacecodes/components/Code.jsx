
export const Code = ({ sector, division, group, classs, ...props }) => {
  
  return (
    <span { ...props }>
      { !!sector && ( <span title="Sector">{ sector.toString().padStart(2, '0') }</span> ) }
      { !!division && ( <span title="Division">.{ division.toString().padStart(2, '0') }</span> ) }
      { !!group && ( <span title="Group">.{ group.toString().padStart(2, '0') }</span> ) }
      { classs !== null && ( <span title="Class">.{ classs.toString().padStart(2, '0') }</span> ) }
    </span>
  )
};

export default Code;