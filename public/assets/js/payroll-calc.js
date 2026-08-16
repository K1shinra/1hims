/**
 * HIMS PAYROLL & BENEFITS MANAGEMENT SYSTEM
 * Philippine Payroll Computation Engine
 * Complies with DOLE, SSS, PhilHealth, Pag-IBIG (HDMF), and BIR TRAIN Law
 */

const PayrollCalculator = {
  /**
   * Calculate Philippine SSS Contribution (Semi-Monthly or Monthly)
   */
  calculateSSS(monthlyBasic) {
    const cappedSalary = Math.min(Math.max(monthlyBasic, 4000), 30000);
    const eeRate = 0.045; // 4.5% Employee
    const erRate = 0.095; // 9.5% Employer
    const ecEr = cappedSalary >= 15000 ? 30.00 : 10.00; // Employees' Compensation

    const monthlyEE = cappedSalary * eeRate;
    const monthlyER = (cappedSalary * erRate) + ecEr;

    return {
      monthlyEE: Math.round(monthlyEE * 100) / 100,
      monthlyER: Math.round(monthlyER * 100) / 100,
      semiMonthlyEE: Math.round((monthlyEE / 2) * 100) / 100,
      semiMonthlyER: Math.round((monthlyER / 2) * 100) / 100
    };
  },

  /**
   * Calculate Philippine PhilHealth Contribution (5% shared 50-50)
   */
  calculatePhilHealth(monthlyBasic) {
    const floor = 10000.00;
    const ceiling = 100000.00;
    const effectiveSalary = Math.min(Math.max(monthlyBasic, floor), ceiling);
    const premiumRate = 0.05; // 5% total

    const totalMonthlyPremium = effectiveSalary * premiumRate;
    const monthlyEE = totalMonthlyPremium / 2;
    const monthlyER = totalMonthlyPremium / 2;

    return {
      monthlyEE: Math.round(monthlyEE * 100) / 100,
      monthlyER: Math.round(monthlyER * 100) / 100,
      semiMonthlyEE: Math.round((monthlyEE / 2) * 100) / 100,
      semiMonthlyER: Math.round((monthlyER / 2) * 100) / 100
    };
  },

  /**
   * Calculate Pag-IBIG HDMF Contribution
   */
  calculatePagIBIG(monthlyBasic) {
    // Standard mandatory EE = ₱200/mo (₱100/semi-month), ER = ₱200/mo (₱100/semi-month)
    return {
      monthlyEE: 200.00,
      monthlyER: 200.00,
      semiMonthlyEE: 100.00,
      semiMonthlyER: 100.00
    };
  },

  /**
   * Calculate BIR TRAIN Law Semi-Monthly Withholding Tax
   */
  calculateWithholdingTaxSemiMonthly(taxableIncome) {
    let tax = 0.00;

    if (taxableIncome <= 10417.00) {
      tax = 0.00;
    } else if (taxableIncome <= 16667.00) {
      tax = (taxableIncome - 10417.00) * 0.15;
    } else if (taxableIncome <= 33333.00) {
      tax = 937.50 + ((taxableIncome - 16667.00) * 0.20);
    } else if (taxableIncome <= 83333.00) {
      tax = 4270.83 + ((taxableIncome - 33333.00) * 0.25);
    } else if (taxableIncome <= 333333.00) {
      tax = 16770.83 + ((taxableIncome - 83333.00) * 0.30);
    } else {
      tax = 91770.83 + ((taxableIncome - 333333.00) * 0.35);
    }

    return Math.max(0, Math.round(tax * 100) / 100);
  },

  /**
   * Complete Employee Semi-Monthly Payroll Calculation
   */
  computeSemiMonthlyPayroll(params) {
    const {
      basicPay,
      hourlyRate,
      overtimeHours = 0,
      overtimeRate = 1.25,
      nightDiffHours = 0,
      hazardPay = 0,
      holidayPay = 0,
      allowanceRice = 1250,
      allowanceMedical = 500,
      allowanceLaundry = 200,
      bonuses = 0,
      otherDeductions = 0
    } = params;

    // Computed Earnings
    const overtimePay = Math.round(overtimeHours * hourlyRate * overtimeRate * 100) / 100;
    const nightDiffPay = Math.round(nightDiffHours * hourlyRate * 0.10 * 100) / 100;
    const totalAllowances = allowanceRice + allowanceMedical + allowanceLaundry;
    
    const grossPay = basicPay + overtimePay + nightDiffPay + hazardPay + holidayPay + totalAllowances + bonuses;

    // Government Mandatories
    const monthlyRate = basicPay * 2;
    const sss = this.calculateSSS(monthlyRate);
    const philhealth = this.calculatePhilHealth(monthlyRate);
    const pagibig = this.calculatePagIBIG(monthlyRate);

    const statutoryDeductions = sss.semiMonthlyEE + philhealth.semiMonthlyEE + pagibig.semiMonthlyEE;
    
    // Taxable Income (Non-taxable: De minimis allowances like rice, and mandatory statutory contributions)
    const nonTaxableAllowances = allowanceRice + allowanceMedical + allowanceLaundry;
    const taxableIncome = Math.max(0, grossPay - nonTaxableAllowances - statutoryDeductions);
    
    const withholdingTax = this.calculateWithholdingTaxSemiMonthly(taxableIncome);
    const totalDeductions = statutoryDeductions + withholdingTax + otherDeductions;
    const netPay = Math.max(0, grossPay - totalDeductions);

    return {
      basicPay,
      overtimeHours,
      overtimePay,
      nightDiffHours,
      nightDiffPay,
      hazardPay,
      holidayPay,
      allowanceRice,
      allowanceMedical,
      allowanceLaundry,
      totalAllowances,
      bonuses,
      grossPay: Math.round(grossPay * 100) / 100,
      sssEE: sss.semiMonthlyEE,
      sssER: sss.semiMonthlyER,
      philhealthEE: philhealth.semiMonthlyEE,
      philhealthER: philhealth.semiMonthlyER,
      pagibigEE: pagibig.semiMonthlyEE,
      pagibigER: pagibig.semiMonthlyER,
      statutoryDeductions: Math.round(statutoryDeductions * 100) / 100,
      taxableIncome: Math.round(taxableIncome * 100) / 100,
      withholdingTax,
      otherDeductions,
      totalDeductions: Math.round(totalDeductions * 100) / 100,
      netPay: Math.round(netPay * 100) / 100
    };
  }
};
