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
console.log('round', value, factor, rounding);
console.log('round', value * factor, value * factor / factor);


        switch (rounding) {
            case 'up':
                console.log('round.ceil', Math.ceil((value * factor) / factor));
                return Math.ceil((value * factor) / factor);
            case 'down':
                console.log('round.floor', Math.floor((value * factor) / factor));
                return Math.floor((value * factor) / factor);
            case 'half':
                console.log('round.round', Math.round((value * factor) / factor));
                return Math.round((value * factor) / factor);
            
            default:
                console.log('round.round', (value * factor) / factor);
                return  (value * factor) / factor;
        };
    };

    return {
        round,
    };
}; // aryMathTools

export default aryMathTools;