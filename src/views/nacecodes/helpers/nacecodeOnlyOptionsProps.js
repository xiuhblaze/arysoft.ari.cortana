import enums from "../../../helpers/enums";

const { NaceCodeOnlyOptionType } = enums();

const nacecodeOnlyOptionsProps = [
    { id: NaceCodeOnlyOptionType.nothing, value: '', label: '(only)' },
    { id: NaceCodeOnlyOptionType.sectors, value: 'sectors', label: 'Only sectors' },
    { id: NaceCodeOnlyOptionType.divisions, value: 'divisions', label: 'Only divisions' },
    { id: NaceCodeOnlyOptionType.groups, value: 'groups', label: 'Only groups' },
    { id: NaceCodeOnlyOptionType.classes, value: 'classes', label: 'Only classes' },
];

export default nacecodeOnlyOptionsProps