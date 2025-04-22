
const getSelectSearchOptionSelected = (items, propertyValueName, propertyLabelName, selectedID) => {

    if (!!items) {
        const selectedItem = items.find(item => item[propertyValueName] === selectedID);        
        if (!!selectedItem) {
            return {
                value: selectedItem[propertyValueName],
                label: selectedItem[propertyLabelName]
            }
        }
    }

    return null;
};

export default getSelectSearchOptionSelected;