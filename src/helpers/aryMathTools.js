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

        switch (rounding) {
            case 'up':
                return Math.ceil(value * factor) / factor;
            case 'down':
                return Math.floor(value * factor) / factor;
            
            default:
                return Math.round(value * factor) / factor;
        };
    };

    return {
        round,
    };
}; // aryMathTools

export default aryMathTools;