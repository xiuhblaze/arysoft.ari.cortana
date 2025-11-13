import enums from "./enums";

const { DefaultCycleYearType } = enums();

const defaultCycleYearProps = [
    { 
        //id: DefaultCycleYearType.nothing,
        label: '-', 
        abbr: '-',
        value: DefaultCycleYearType.nothing,
    },
    { 
        //id: DefaultCycleYearType.firstYear,
        label: 'First year',
        abbr: '1',
        value: DefaultCycleYearType.firstYear,
    },
    { 
        //id: DefaultCycleYearType.middleFirstYear,
        label: 'Middle first year',
        abbr: '1.5',
        value: DefaultCycleYearType.middleFirstYear,
    },
    { 
        //id: DefaultCycleYearType.secondYear,
        label: 'Second year',
        abbr: '2',
        value: DefaultCycleYearType.secondYear,
    },
    { 
        //id: DefaultCycleYearType.middleSecondYear,
        label: 'Middle second year',
        abbr: '2.5',
        value: DefaultCycleYearType.middleSecondYear,
    },
    { 
        //id: DefaultCycleYearType.thirdYear,
        label: 'Third year',
        abbr: '3',
        value: DefaultCycleYearType.thirdYear,
    },
    { 
        //id: DefaultCycleYearType.middleThirdYear,
        label: 'Middle third year',
        abbr: '3.5',
        value: DefaultCycleYearType.middleThirdYear,
    },
];

export default defaultCycleYearProps;