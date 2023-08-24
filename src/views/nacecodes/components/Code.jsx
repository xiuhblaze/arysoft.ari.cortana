
export const Code = ({ sector, division, group, classs, ...props }) => {
  let code = '';
  
  code += !!sector ? sector.toString().padStart(2, '0') : '';
  code += !!division ? '.' + division.toString().padStart(2, '0') : '';
  code += !!group ? '.' + group.toString().padStart(2, '0') : '';
  code += !!classs ? '.' + classs.toString().padStart(2, '0') : '';

  return (
    <span { ...props }>
      { code }
    </span>
  )
};

export default Code;