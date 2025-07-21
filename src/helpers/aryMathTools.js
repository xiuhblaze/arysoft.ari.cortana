const aryMathTools = () => {

    /**
     * 
     * @param {float} valor a redondear
     * @param {int} numero de decimales a dejar
     * @param {int} tipo de redondeo (up, down, half)
     * @returns 
     */
    const round = (value, decimals, rounding) => {
        const factor = Math.pow(10, decimals);
        let valRounded = 0;
        // console.log('---------------');
        // console.log('round.value', value);
        // console.log('round.factor', factor);

        switch (rounding) {
            case 'up':
                valRounded = Math.ceil(value * factor) / factor;
                break;
            case 'down':
                valRounded = Math.floor(value * factor) / factor;
                break;
            case 'half':
                valRounded = Math.round(value * factor) / factor;
                break;
            default:
                // console.log('round.default', (value * factor) / factor);
                // return  (value * factor) / factor;
                valRounded = value;
                break;
        };        
// console.log('round.valRounded', valRounded);
// console.log('round.return', Math.trunc(valRounded * factor) / factor);
        return Math.trunc(valRounded * factor) / factor; //Math.trunc(valRounded) / factor; 
    }; // round

    const roundDays = (value) => {
        const integer = Math.trunc(value);
        const decimal = value - integer;

        // console.log('roundDays.value', value);
        // console.log('roundDays.integer', integer);
        // console.log('roundDays.decimal', decimal);

        if (decimal == 0) {
            return integer;
        } else if (decimal <= 0.5) {
            return integer + 0.5;
        } else { // if (decimal > 5) {
            return integer + 1;
        }
    } // roundDays

    return {
        round,
        roundDays,
    };
}; // aryMathTools

export default aryMathTools;