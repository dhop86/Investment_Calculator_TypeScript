// Initialize the form. Add event listeners to buttons.
const GET_ELEM_BY_ID = (id: string) => {
    return document.getElementById(id) as HTMLElement | null;
};

const GET_ELEM_BY_CLASS = (id: string) => {
    return document.getElementsByClassName(id) as HTMLCollection | null;
};

interface Is_Investment {
    initialAmount: number, 
    years: number, 
    monthlyContrib: number, 
    interestRate: number,
    calculator(): string[],
    addRow(a: number[]): void,
}

class My_Investment implements Is_Investment {
    constructor(
        public initialAmount: number, 
        public years: number, 
        public monthlyContrib: number, 
        public interestRate: number,
    ) {
        this.initialAmount = initialAmount;
        this.years = years;
        this.monthlyContrib = monthlyContrib;
        this.interestRate = interestRate;
    };

    calculator(): string[] {
        const monthsPerYear: number = 12;
        let totalInterestEarned: number = 0;
        let principle: number = this.initialAmount;
        let futureAmount: number = this.initialAmount;
        for (let i: number = 0; i < this.years;){
            for (let j: number = 0; j < monthsPerYear;){
                totalInterestEarned += principle * (this.interestRate / monthsPerYear);
                principle += this.monthlyContrib;
                j++;
            };
            futureAmount = (principle + totalInterestEarned);
            let values: number[] = [(i + 1), futureAmount, principle, totalInterestEarned,];
            this.addRow(values);
            i++;
        };
        let totals: number[] = [futureAmount, principle, totalInterestEarned,];
        let str_totals: string[] = [];
        for (let i: number = 0; i < totals.length;) {
            totals[i] = parseFloat(totals[i].toFixed(2)),
            str_totals[i] = String(totals[i]);
            i++;
        };
        return str_totals;
    };

    addRow(a: number[]) : void {
        let values: number[] = [a[0], a[1], a[2], a[3]];
        for (let i: number = 0; i < values.length;) {
            values[i] = parseFloat(values[i].toFixed(2));
            i++;
        };
        let table: HTMLElement;
        let tableID: HTMLElement | null = GET_ELEM_BY_ID('dataTable');
        if (tableID) {
            table = tableID;
            let tr = document.createElement("tr");
            tr.className = "addedRow";
            // Create a '<td>' column for the year
            let td_Year = document.createElement("td");
            td_Year.innerHTML = "Year " + values[0];
            // Create a '<td>' column for the future amount
            let td_TotalInvestment = document.createElement("td");
            td_TotalInvestment.innerHTML = "$" + values[1];
            // Create a '<td>' column for the principle amount
            let td_Principle = document.createElement("td");
            td_Principle.innerHTML = "$" + values[2];
            // Create a '<td>' column for the interest earned
            let td_Interest = document.createElement("td");
            td_Interest.innerHTML = "$" + values[3];
            tr.appendChild(td_Year);
            tr.appendChild(td_Principle);
            tr.appendChild(td_Interest);
            tr.appendChild(td_TotalInvestment);
            table.appendChild(tr);
        };
    };
};

// onclick of Submit, call captureFormData()
let submit = function() : void {
    const elements: HTMLCollection | null = GET_ELEM_BY_CLASS("addedRow");
    if (elements) {
        clearTable();
    };
    if(validate()){
        let values = captureFormData();
        const futureInvestmentAmount = GET_ELEM_BY_ID('futureInvestmentAmount') as HTMLInputElement;
        futureInvestmentAmount.value = values[0];
        const principle = GET_ELEM_BY_ID('principle') as HTMLInputElement;
        principle.value = values[1];
        const totalInterestEarned = GET_ELEM_BY_ID('totalInterestEarned') as HTMLInputElement;
        totalInterestEarned.value = values[2];
    };
};

// Collect form data, create a new investment object, call investment.calculator()
let captureFormData = () : string[] => {
    let startingInvestment: number = parseFloat((GET_ELEM_BY_ID('startingInvestment') as HTMLInputElement).value);
    let yearsToGrow: number = parseFloat((GET_ELEM_BY_ID('yearsToGrow') as HTMLInputElement).value);
    let monthlyContribution: number = parseFloat((GET_ELEM_BY_ID('monthlyContribution') as HTMLInputElement).value);
    let interestRate: number = parseFloat((GET_ELEM_BY_ID('interestRate') as HTMLInputElement).value) / 100;
    let newInvestment = new My_Investment(startingInvestment, yearsToGrow, monthlyContribution, interestRate);
    return newInvestment.calculator();
};

let validate = function() : boolean {
    const isNumber = /^\d+(\.\d{1,2})?$/;
    let isValid: boolean = false;
    let a: number | null = parseFloat((GET_ELEM_BY_ID('startingInvestment') as HTMLInputElement).value);
    let b: number | null = parseFloat((GET_ELEM_BY_ID('yearsToGrow') as HTMLInputElement).value);
    let c: number | null = parseFloat((GET_ELEM_BY_ID('monthlyContribution') as HTMLInputElement).value);
    let d: number | null = parseFloat((GET_ELEM_BY_ID('interestRate') as HTMLInputElement).value);
    
    if (a && b && c && d) {
        let a_str: string = a.toString();
        let b_str: string = b.toString();
        let c_str: string = c.toString();
        let d_str: string = d.toString();
        if (
            isNumber.test(a_str) &&
            isNumber.test(b_str) &&
            isNumber.test(c_str) &&
            isNumber.test(d_str)
        ) {
            isValid = true;
        };
    };
    return isValid;
};

// onclick of Reset, return the form to the default state
let reset = function() : void {
    const startingInvestment = GET_ELEM_BY_ID('startingInvestment') as HTMLInputElement;
    const yearsToGrow  = GET_ELEM_BY_ID('yearsToGrow') as HTMLInputElement;
    const monthlyContribution = GET_ELEM_BY_ID('monthlyContribution') as HTMLInputElement;
    const interestRate = GET_ELEM_BY_ID('interestRate') as HTMLInputElement;
    const futureInvestmentAmount = GET_ELEM_BY_ID('futureInvestmentAmount') as HTMLInputElement;
    const principle = GET_ELEM_BY_ID('principle') as HTMLInputElement;
    const totalInterestEarned = GET_ELEM_BY_ID('totalInterestEarned') as HTMLInputElement;
    startingInvestment.value = '';
    yearsToGrow.value = '';
    monthlyContribution.value = '';
    interestRate.value = '';
    futureInvestmentAmount.value = '';
    principle.value = '';
    totalInterestEarned.value = '';
    clearTable();
    startingFocus();
};

// Delete rows from the table. Called from reset() & submit()
let clearTable = function() : void {
    const elements: HTMLCollection | null = GET_ELEM_BY_CLASS("addedRow");
    if (elements && elements[0]?.parentNode) {
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        };
    };
};

// Set the starting focus
let startingFocus = function () : void {
    const initialFocus = GET_ELEM_BY_ID('startingInvestment') as HTMLInputElement;
    initialFocus.focus();
};

let init = function() : void {
    const reset_btn = GET_ELEM_BY_ID('reset') as HTMLInputElement;
    reset_btn.onclick = reset;

    const submit_btn = GET_ELEM_BY_ID('submit') as HTMLInputElement;
    submit_btn.onclick = submit;
};

// Wait for page to be ready
document.onreadystatechange = () : void => {
    if (document.readyState === "interactive" || document.readyState === "complete") {
      init();
      startingFocus();
    };
  };