const aryMathTools = () => {

    /**
     * 
     * @param {float} value to round
     * @param {int} decimals to round
     * @param {int} rounding 
     * @returns 
     */
    const round = (value, decimals, rounding) => {
        const factor = Math.pow(10, decimals);
// console.log('round props', value, factor, rounding);
// console.log('round factor', value * factor, value * factor / factor);
        let valRounded = value * factor;
console.log('round.start -------');
console.log('round.value', value);
console.log('round.rounding', rounding);
        switch (rounding) {
            case 'up':
                valRounded = Math.ceil(value * factor);                
                // const result = Math.trunc(rounded) / factor;
                // console.log('round.ceil', Math.ceil((value * factor) / factor));
                // return Math.ceil((value * factor) / factor);
                break;
            case 'down':
                valRounded = Math.floor(value * factor);
                // console.log('round.floor', Math.floor((value * factor) / factor));
                // return Math.floor((value * factor) / factor);
                break;
            case 'half':
                valRounded = Math.round(value * factor);
                // console.log('round.round', Math.round((value * factor) / factor));
                // return Math.round((value * factor) / factor);
                break;
            default:
                // console.log('round.default', (value * factor) / factor);
                // return  (value * factor) / factor;
                break;
        };        
console.log('round.valRounded', valRounded);
console.log('round.result', Math.trunc(valRounded) / factor)
        return Math.trunc(valRounded) / factor;
    };

    return {
        round,
    };
}; // aryMathTools

export default aryMathTools;