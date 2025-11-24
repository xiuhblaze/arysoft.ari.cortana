class StepTotals {

    constructor(totalDays = 0, subTotal = 0, taxRate = 0, certificateIssue = 0, travelExpenses = 0) {
        this.totalDays = this.validateNumber(totalDays);
        this.subTotal = this.validateNumber(subTotal);
        this.taxRate = this.validateNumber(taxRate);
        this.certificateIssue = this.validateNumber(certificateIssue);
        this.travelExpenses = this.validateNumber(travelExpenses);
    } // StepTotals
    
    validateNumber(value) {
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    }; // validateNumber

    setTotalDays(value) {
        this.totalDays = this.validateNumber(value);
    };

    setSubtotal(value) {
        this.subTotal = this.validateNumber(value);
    };

    setTaxRate(value) {
        this.taxRate = this.validateNumber(value);
    };

    setCertificateIssue(value) {
        this.certificateIssue = this.validateNumber(value);
    };

    setTravelExpenses(value) {
        this.travelExpenses = this.validateNumber(value);
    };

    getTaxes() {
        return this.subTotal * this.taxRate / 100;
    };

    getTotalCost() {
        return this.subTotal + this.getTaxes();
    };

    getTotalFinal() {

        if (this.travelExpenses > 0) {
            return this.getTotalCost() + this.travelExpenses;
        }

        return this.getTotalCost();
    };

};

export default StepTotals;