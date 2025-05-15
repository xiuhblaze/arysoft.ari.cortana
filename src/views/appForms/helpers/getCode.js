const getCode = (item) => {
    return `${item.Sector.toString().padStart(2, '0')}.`
        + `${item.Division != null && item.Division != undefined ? item.Division.toString().padStart(2, '0') + '.' : ''}`
        + `${item.Group != null && item.Group != undefined ? item.Group.toString().padStart(2, '0') + '.' : ''}`
        + `${item.Class != null && item.Class != undefined ? item.Class.toString().padStart(2, '0') + '.' : ''}`;
};

export default getCode;