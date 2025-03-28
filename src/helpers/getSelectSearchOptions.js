const getSelectSearchOptions = (items, propertyValueName, propertyLabelName) => {
    let options = [];
    
    if (!!items) {
        options = items.map(item => ({ 
            value: item[propertyValueName],
            label: item[propertyLabelName]
        }));
    }

    return options;
}; // getSelectSearchOptions

export default getSelectSearchOptions;