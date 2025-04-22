import enums from "../../../helpers/enums";

const { StandardBaseType } = enums();

const standardBaseProps = [
    {
        id: StandardBaseType.nothing,
        label: '-',
    },
    {
        id: StandardBaseType.iso9k,
        label: 'ISO 9001',
    },
    {
        id: StandardBaseType.iso14K,
        label: 'ISO 14001',
    },
    {
        id: StandardBaseType.iso22K,
        label: 'ISO 22000',
    },
    {
        id: StandardBaseType.iso27K,
        label: 'ISO 27001',
    },
    {
        id: StandardBaseType.iso37K,
        label: 'ISO 37001',
    },
    {
        id: StandardBaseType.iso45K,
        label: 'ISO 45001',
    },
    {
        id: StandardBaseType.fssc22K,
        label: 'FSSC 22000',
    },  
    {
        id: StandardBaseType.haccp,
        label: 'HACCP',
    },
    {
        id: StandardBaseType.gMarkets,  
        label: 'Global Markets',
    },
];

export default standardBaseProps;


