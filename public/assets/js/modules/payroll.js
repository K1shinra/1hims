/**
 * Payroll Management View Module
 */
const PayrollModule = {
  // 1. Employee Payroll List
  renderPayrollList() {
    return `
      <div class="page-header">
        <div class="page-title">
          <h3>Employee Payroll List</h3>
          <p>Active Payroll Batch: <span class="fw-bold text-success">PP-2026-08A (August 1 - 15, 2026)</span></p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-hospital-outline" onclick="App.exportTableToCSV('payrollListTable', 'payroll_batch_2026_08A.csv')">
            <i class="bi bi-file-earmark-excel"></i> Export Excel
          </button>
          <button class="btn btn-hospital-primary" onclick="App.navigateTo('payroll-computation')">
            <i class="bi bi-calculator"></i> New Computation
          </button>
        </div>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="card mb-4">
        <div class="card-body p-3">
          <div class="row g-2 align-items-center">
            <div class="col-12 col-md-4">
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-search"></i></span>
                <input type="text" id="payrollSearchInput" class="form-control border-start-0" placeholder="Search employee name, ID, or position..." onkeyup="PayrollModule.filterPayrollTable()">
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <select id="payrollDeptFilter" class="form-select" onchange="PayrollModule.filterPayrollTable()">
                <option value="">All Hospital Departments</option>
                ${HIMS_DATA.departments.map(d => `<option value="${d}">${d}</option>`).join('')}
              </select>
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <select id="payrollStatusFilter" class="form-select" onchange="PayrollModule.filterPayrollTable()">
                <option value="">All Statuses</option>
                <option value="Ready for Approval">Ready for Approval</option>
                <option value="AI Flagged Anomaly">AI Flagged Anomaly</option>
                <option value="Approved">Approved</option>
              </select>
            </div>
            <div class="col-12 col-md-2 text-md-end">
              <button class="btn btn-light-action w-100" onclick="PayrollModule.resetPayrollFilter()">
                <i class="bi bi-arrow-counterclockwise"></i> Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Payroll Table -->
      <div class="card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table custom-table mb-0" id="payrollListTable">
              <thead>
                <tr>
                  <th>Employee ID & Name</th>
                  <th>Department & Position</th>
                  <th>Period</th>
                  <th class="text-end">Basic Pay</th>
                  <th class="text-end">Total Earnings</th>
                  <th class="text-end">Total Deductions</th>
                  <th class="text-end">Net Pay</th>
                  <th>Status</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody id="payrollTableBody">
                ${PayrollModule.renderPayrollRows(HIMS_DATA.payrollRecords)}
              </tbody>
            </table>
          </div>
        </div>
        <div class="card-footer d-flex align-items-center justify-content-between">
          <small class="text-muted" id="payrollRowCountText">Showing ${HIMS_DATA.payrollRecords.length} records</small>
          <div class="d-flex gap-1">
            <button class="btn btn-sm btn-light border" disabled><i class="bi bi-chevron-left"></i></button>
            <button class="btn btn-sm btn-hospital-primary">1</button>
            <button class="btn btn-sm btn-light border" disabled><i class="bi bi-chevron-right"></i></button>
          </div>
        </div>
      </div>
    `;
  },

  renderPayrollRows(records) {
    if (!records.length) {
      return `<tr><td colspan="9" class="text-center py-4 text-muted">No payroll records match your search criteria.</td></tr>`;
    }
    return records.map(rec => `
      <tr>
        <td>
          <div class="fw-bold text-dark">${rec.employeeName}</div>
          <small class="text-muted"><i class="bi bi-person-badge me-1"></i>${rec.employeeId}</small>
        </td>
        <td>
          <div>${rec.position}</div>
          <small class="text-muted">${rec.department}</small>
        </td>
        <td><span class="badge bg-light text-dark border">Aug 1-15</span></td>
        <td class="text-end fw-semibold">₱${rec.basicPay.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
        <td class="text-end text-success fw-semibold">₱${rec.totalEarnings.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
        <td class="text-end text-danger fw-semibold">₱${rec.totalDeductions.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
        <td class="text-end text-dark fw-bold" style="font-size: 0.95rem;">₱${rec.netPay.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
        <td>
          ${rec.status === 'AI Flagged Anomaly'
            ? `<span class="badge-custom badge-danger-soft"><i class="bi bi-exclamation-octagon-fill"></i> AI Flagged</span>`
            : `<span class="badge-custom badge-success-soft"><i class="bi bi-check-circle-fill"></i> ${rec.status}</span>`
          }
        </td>
        <td class="text-center">
          <div class="dropdown">
            <button class="btn btn-sm btn-light-action" data-bs-toggle="dropdown">
              <i class="bi bi-three-dots-vertical"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm">
              <li>
                <a class="dropdown-item" href="javascript:void(0)" onclick="PayrollModule.showPayrollDetailsModal('${rec.id}')">
                  <i class="bi bi-eye text-primary me-2"></i> View Details
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="javascript:void(0)" onclick="PayrollModule.viewPayslip('${rec.employeeId}')">
                  <i class="bi bi-file-earmark-text text-success me-2"></i> View Payslip
                </a>
              </li>
              ${rec.status === 'AI Flagged Anomaly' ? `
                <li>
                  <a class="dropdown-item text-danger" href="javascript:void(0)" onclick="App.navigateTo('ai-anomalies')">
                    <i class="bi bi-shield-exclamation me-2"></i> Audit Anomaly
                  </a>
                </li>
              ` : ''}
            </ul>
          </div>
        </td>
      </tr>
    `).join('');
  },

  filterPayrollTable() {
    const searchVal = (document.getElementById('payrollSearchInput')?.value || '').toLowerCase();
    const deptVal = document.getElementById('payrollDeptFilter')?.value || '';
    const statusVal = document.getElementById('payrollStatusFilter')?.value || '';

    const filtered = HIMS_DATA.payrollRecords.filter(rec => {
      const matchSearch = !searchVal || 
        rec.employeeName.toLowerCase().includes(searchVal) || 
        rec.employeeId.toLowerCase().includes(searchVal) || 
        rec.position.toLowerCase().includes(searchVal);
      const matchDept = !deptVal || rec.department === deptVal;
      const matchStatus = !statusVal || rec.status.toLowerCase().includes(statusVal.toLowerCase());
      return matchSearch && matchDept && matchStatus;
    });

    const tbody = document.getElementById('payrollTableBody');
    if (tbody) {
      tbody.innerHTML = PayrollModule.renderPayrollRows(filtered);
    }
    const countEl = document.getElementById('payrollRowCountText');
    if (countEl) {
      countEl.innerText = `Showing ${filtered.length} of ${HIMS_DATA.payrollRecords.length} records`;
    }
  },

  resetPayrollFilter() {
    if (document.getElementById('payrollSearchInput')) document.getElementById('payrollSearchInput').value = '';
    if (document.getElementById('payrollDeptFilter')) document.getElementById('payrollDeptFilter').value = '';
    if (document.getElementById('payrollStatusFilter')) document.getElementById('payrollStatusFilter').value = '';
    PayrollModule.filterPayrollTable();
  },

  // 2. Interactive Payroll Computation Calculator
  renderComputation() {
    const firstEmp = HIMS_DATA.employees[0];
    return `
      <div class="page-header">
        <div class="page-title">
          <h3>Interactive Payroll Computation</h3>
          <p>Compute real-time Philippine statutory contributions (SSS, PhilHealth, Pag-IBIG) and BIR TRAIN Law withholding tax.</p>
        </div>
        <div>
          <button class="btn btn-hospital-outline" onclick="PayrollModule.resetComputationForm()">
            <i class="bi bi-arrow-counterclockwise"></i> Reset Values
          </button>
        </div>
      </div>

      <div class="row g-4">
        <!-- Computation Form -->
        <div class="col-12 col-lg-7">
          <div class="card">
            <div class="card-header bg-white">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-person-fill-gear text-success"></i>
                <span>Employee & Duty Hours Parameters</span>
              </div>
            </div>
            <div class="card-body">
              <form id="payrollComputeForm" onsubmit="event.preventDefault(); PayrollModule.saveComputedRecord();">
                <div class="row g-3 mb-3">
                  <div class="col-12 col-md-6">
                    <label class="form-label">Select Employee</label>
                    <select id="calcEmployeeSelect" class="form-select" onchange="PayrollModule.onEmployeeSelected(this.value)">
                      ${HIMS_DATA.employees.map(e => `<option value="${e.id}">${e.name} (${e.position})</option>`).join('')}
                    </select>
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label">Payroll Period</label>
                    <select id="calcPeriodSelect" class="form-select">
                      <option value="PP-2026-08A">August 1 - 15, 2026 (Semi-Monthly)</option>
                      <option value="PP-2026-08B">August 16 - 31, 2026 (Semi-Monthly)</option>
                    </select>
                  </div>
                </div>

                <div class="row g-3 mb-3">
                  <div class="col-12 col-md-4">
                    <label class="form-label">Semi-Monthly Base Pay (₱)</label>
                    <input type="number" id="calcBasePay" class="form-control" value="${firstEmp.semiMonthlyBase}" oninput="PayrollModule.recalculate()">
                  </div>
                  <div class="col-12 col-md-4">
                    <label class="form-label">Hourly Rate (₱)</label>
                    <input type="number" step="0.01" id="calcHourlyRate" class="form-control" value="${firstEmp.hourlyRate}" oninput="PayrollModule.recalculate()">
                  </div>
                  <div class="col-12 col-md-4">
                    <label class="form-label">Hazard Pay (₱)</label>
                    <input type="number" id="calcHazardPay" class="form-control" value="${firstEmp.hazardRate / 2}" oninput="PayrollModule.recalculate()">
                  </div>
                </div>

                <div class="row g-3 mb-3">
                  <div class="col-12 col-md-4">
                    <label class="form-label">Overtime Hours (125%)</label>
                    <input type="number" step="0.5" id="calcOtHours" class="form-control" value="8" oninput="PayrollModule.recalculate()">
                  </div>
                  <div class="col-12 col-md-4">
                    <label class="form-label">Night Shift Diff Hours (10%)</label>
                    <input type="number" step="1" id="calcNightDiffHours" class="form-control" value="16" oninput="PayrollModule.recalculate()">
                  </div>
                  <div class="col-12 col-md-4">
                    <label class="form-label">Holiday Pay (₱)</label>
                    <input type="number" id="calcHolidayPay" class="form-control" value="0" oninput="PayrollModule.recalculate()">
                  </div>
                </div>

                <div class="p-3 bg-light rounded-3 mb-3 border">
                  <div class="fw-bold mb-2 text-dark small text-uppercase">De Minimis & Non-Taxable Allowances</div>
                  <div class="row g-2">
                    <div class="col-4">
                      <label class="form-label small">Rice Subsidy (₱)</label>
                      <input type="number" id="calcRiceAllowance" class="form-control form-control-sm" value="1250" oninput="PayrollModule.recalculate()">
                    </div>
                    <div class="col-4">
                      <label class="form-label small">Medical/Uniform (₱)</label>
                      <input type="number" id="calcMedicalAllowance" class="form-control form-control-sm" value="500" oninput="PayrollModule.recalculate()">
                    </div>
                    <div class="col-4">
                      <label class="form-label small">Laundry (₱)</label>
                      <input type="number" id="calcLaundryAllowance" class="form-control form-control-sm" value="200" oninput="PayrollModule.recalculate()">
                    </div>
                  </div>
                </div>

                <div class="row g-3 mb-3">
                  <div class="col-6">
                    <label class="form-label">Bonuses & Incentives (₱)</label>
                    <input type="number" id="calcBonuses" class="form-control" value="0" oninput="PayrollModule.recalculate()">
                  </div>
                  <div class="col-6">
                    <label class="form-label">Other Deductions / Hospital Loans (₱)</label>
                    <input type="number" id="calcOtherDeductions" class="form-control" value="0" oninput="PayrollModule.recalculate()">
                  </div>
                </div>

                <div class="d-flex justify-content-end gap-2 pt-2">
                  <button type="submit" class="btn btn-hospital-primary">
                    <i class="bi bi-save-fill"></i> Save to Active Payroll Batch
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Real-time Live Calculation Breakdown -->
        <div class="col-12 col-lg-5">
          <div class="card border-success shadow-sm">
            <div class="card-header bg-success text-white">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-calculator-fill"></i>
                <span class="fw-bold">Computed Payroll Breakdown</span>
              </div>
              <span class="badge bg-white text-success fw-bold">Live DOLE/BIR Engine</span>
            </div>
            <div class="card-body">
              <!-- Gross Earnings -->
              <h6 class="fw-bold text-success border-bottom pb-2 mb-2">1. GROSS EARNINGS</h6>
              <div class="d-flex justify-content-between small py-1">
                <span class="text-muted">Basic Salary:</span>
                <span class="fw-semibold" id="outBasicPay">₱49,000.00</span>
              </div>
              <div class="d-flex justify-content-between small py-1">
                <span class="text-muted">Overtime Pay:</span>
                <span class="fw-semibold" id="outOvertimePay">₱5,568.20</span>
              </div>
              <div class="d-flex justify-content-between small py-1">
                <span class="text-muted">Night Shift Differential:</span>
                <span class="fw-semibold" id="outNightDiffPay">₱890.91</span>
              </div>
              <div class="d-flex justify-content-between small py-1">
                <span class="text-muted">Magna Carta Hazard Pay:</span>
                <span class="fw-semibold" id="outHazardPay">₱2,250.00</span>
              </div>
              <div class="d-flex justify-content-between small py-1">
                <span class="text-muted">Total Allowances:</span>
                <span class="fw-semibold" id="outAllowances">₱1,950.00</span>
              </div>
              <div class="d-flex justify-content-between border-top pt-2 mt-1 fw-bold text-dark">
                <span>TOTAL GROSS PAY:</span>
                <span class="text-success" id="outGrossPay" style="font-size: 1.1rem;">₱59,659.11</span>
              </div>

              <!-- Deductions -->
              <h6 class="fw-bold text-danger border-bottom pb-2 mb-2 mt-4">2. STATUTORY & TAX DEDUCTIONS</h6>
              <div class="d-flex justify-content-between small py-1">
                <span class="text-muted">SSS Contribution (EE Share):</span>
                <span class="fw-semibold text-danger" id="outSssEE">-₱1,350.00</span>
              </div>
              <div class="d-flex justify-content-between small py-1">
                <span class="text-muted">PhilHealth Premium (EE Share):</span>
                <span class="fw-semibold text-danger" id="outPhilhealthEE">-₱1,225.00</span>
              </div>
              <div class="d-flex justify-content-between small py-1">
                <span class="text-muted">Pag-IBIG / HDMF (EE Share):</span>
                <span class="fw-semibold text-danger" id="outPagibigEE">-₱100.00</span>
              </div>
              <div class="d-flex justify-content-between small py-1">
                <span class="text-muted">BIR Withholding Tax (TRAIN Law):</span>
                <span class="fw-semibold text-danger" id="outWithholdingTax">-₱7,215.40</span>
              </div>
              <div class="d-flex justify-content-between border-top pt-2 mt-1 fw-bold text-dark">
                <span>TOTAL DEDUCTIONS:</span>
                <span class="text-danger" id="outTotalDeductions" style="font-size: 1.1rem;">-₱9,890.40</span>
              </div>

              <!-- Net Pay Card -->
              <div class="p-3 bg-light rounded-3 border border-success mt-4 text-center">
                <div class="text-uppercase small fw-bold text-muted">Net Take-Home Pay</div>
                <div class="display-6 fw-bold text-success my-1" id="outNetPay">₱49,768.71</div>
                <small class="text-muted">Disbursement Method: Automated Hospital Bank Transfer</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  onEmployeeSelected(empId) {
    const emp = HIMS_DATA.employees.find(e => e.id === empId);
    if (!emp) return;

    if (document.getElementById('calcBasePay')) document.getElementById('calcBasePay').value = emp.semiMonthlyBase;
    if (document.getElementById('calcHourlyRate')) document.getElementById('calcHourlyRate').value = emp.hourlyRate;
    if (document.getElementById('calcHazardPay')) document.getElementById('calcHazardPay').value = emp.hazardRate / 2;
    if (document.getElementById('calcRiceAllowance')) document.getElementById('calcRiceAllowance').value = emp.allowanceRice / 2;
    if (document.getElementById('calcMedicalAllowance')) document.getElementById('calcMedicalAllowance').value = emp.allowanceMedical / 2;
    if (document.getElementById('calcLaundryAllowance')) document.getElementById('calcLaundryAllowance').value = emp.allowanceLaundry / 2;

    PayrollModule.recalculate();
  },

  recalculate() {
    const basicPay = parseFloat(document.getElementById('calcBasePay')?.value || 0);
    const hourlyRate = parseFloat(document.getElementById('calcHourlyRate')?.value || 0);
    const overtimeHours = parseFloat(document.getElementById('calcOtHours')?.value || 0);
    const nightDiffHours = parseFloat(document.getElementById('calcNightDiffHours')?.value || 0);
    const hazardPay = parseFloat(document.getElementById('calcHazardPay')?.value || 0);
    const holidayPay = parseFloat(document.getElementById('calcHolidayPay')?.value || 0);
    const allowanceRice = parseFloat(document.getElementById('calcRiceAllowance')?.value || 0);
    const allowanceMedical = parseFloat(document.getElementById('calcMedicalAllowance')?.value || 0);
    const allowanceLaundry = parseFloat(document.getElementById('calcLaundryAllowance')?.value || 0);
    const bonuses = parseFloat(document.getElementById('calcBonuses')?.value || 0);
    const otherDeductions = parseFloat(document.getElementById('calcOtherDeductions')?.value || 0);

    const result = PayrollCalculator.computeSemiMonthlyPayroll({
      basicPay,
      hourlyRate,
      overtimeHours,
      nightDiffHours,
      hazardPay,
      holidayPay,
      allowanceRice,
      allowanceMedical,
      allowanceLaundry,
      bonuses,
      otherDeductions
    });

    if (document.getElementById('outBasicPay')) document.getElementById('outBasicPay').innerText = `₱${result.basicPay.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    if (document.getElementById('outOvertimePay')) document.getElementById('outOvertimePay').innerText = `₱${result.overtimePay.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    if (document.getElementById('outNightDiffPay')) document.getElementById('outNightDiffPay').innerText = `₱${result.nightDiffPay.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    if (document.getElementById('outHazardPay')) document.getElementById('outHazardPay').innerText = `₱${result.hazardPay.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    if (document.getElementById('outAllowances')) document.getElementById('outAllowances').innerText = `₱${result.totalAllowances.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    if (document.getElementById('outGrossPay')) document.getElementById('outGrossPay').innerText = `₱${result.grossPay.toLocaleString('en-US', {minimumFractionDigits: 2})}`;

    if (document.getElementById('outSssEE')) document.getElementById('outSssEE').innerText = `-₱${result.sssEE.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    if (document.getElementById('outPhilhealthEE')) document.getElementById('outPhilhealthEE').innerText = `-₱${result.philhealthEE.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    if (document.getElementById('outPagibigEE')) document.getElementById('outPagibigEE').innerText = `-₱${result.pagibigEE.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    if (document.getElementById('outWithholdingTax')) document.getElementById('outWithholdingTax').innerText = `-₱${result.withholdingTax.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    if (document.getElementById('outTotalDeductions')) document.getElementById('outTotalDeductions').innerText = `-₱${result.totalDeductions.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    if (document.getElementById('outNetPay')) document.getElementById('outNetPay').innerText = `₱${result.netPay.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
  },

  resetComputationForm() {
    PayrollModule.onEmployeeSelected(HIMS_DATA.employees[0].id);
    App.showToast('Computation form reset to default template.', 'info');
  },

  saveComputedRecord() {
    App.showToast('Payroll computation saved successfully to Active Batch PP-2026-08A.', 'success');
  },

  // 3. Payroll Period Management
  renderPeriods() {
    return `
      <div class="page-header">
        <div class="page-title">
          <h3>Payroll Period Management</h3>
          <p>Schedule, manage cut-off dates, and control disbursement cycles for hospital personnel.</p>
        </div>
        <div>
          <button class="btn btn-hospital-primary" onclick="PayrollModule.showNewPeriodModal()">
            <i class="bi bi-plus-lg"></i> Create Payroll Period
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table custom-table mb-0">
              <thead>
                <tr>
                  <th>Period ID & Name</th>
                  <th>Coverage Dates</th>
                  <th>Biometric Cutoff</th>
                  <th>Payout Date</th>
                  <th>Headcount</th>
                  <th class="text-end">Batch Net Pay</th>
                  <th>Status</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${HIMS_DATA.payrollPeriods.map(p => `
                  <tr>
                    <td>
                      <div class="fw-bold">${p.name}</div>
                      <small class="text-muted">${p.id}</small>
                    </td>
                    <td>${p.startDate} to ${p.endDate}</td>
                    <td><span class="badge bg-light text-dark border">${p.cutoffDate}</span></td>
                    <td class="fw-semibold text-primary">${p.payoutDate}</td>
                    <td>${p.totalEmployees} Employees</td>
                    <td class="text-end fw-bold">₱${p.totalNet.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                    <td>
                      <span class="badge-custom ${p.status === 'In Processing' ? 'badge-warning-soft' : 'badge-success-soft'}">
                        ${p.status}
                      </span>
                    </td>
                    <td class="text-center">
                      <button class="btn btn-sm btn-light-action" onclick="App.navigateTo('payroll-list')">
                        <i class="bi bi-folder2-open"></i> Manage
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  showNewPeriodModal() {
    App.showGenericModal({
      title: "Create New Hospital Payroll Period",
      body: `
        <div class="mb-3">
          <label class="form-label">Period Name</label>
          <input type="text" class="form-control" value="September 1 - 15, 2026 (1st Half)">
        </div>
        <div class="row g-2 mb-3">
          <div class="col-6">
            <label class="form-label">Start Date</label>
            <input type="date" class="form-control" value="2026-09-01">
          </div>
          <div class="col-6">
            <label class="form-label">End Date</label>
            <input type="date" class="form-control" value="2026-09-15">
          </div>
        </div>
        <div class="row g-2 mb-3">
          <div class="col-6">
            <label class="form-label">Biometric Cutoff Date</label>
            <input type="date" class="form-control" value="2026-09-12">
          </div>
          <div class="col-6">
            <label class="form-label">Bank Payout Date</label>
            <input type="date" class="form-control" value="2026-09-15">
          </div>
        </div>
      `,
      confirmText: "Create Period",
      onConfirm: () => {
        App.showToast("New payroll period created successfully.", "success");
      }
    });
  },

  // 4. Payroll Processing
  renderProcessing() {
    return `
      <div class="page-header">
        <div class="page-title">
          <h3>Payroll Processing & Validation</h3>
          <p>Execute batch calculations, trigger cross-module validation checks, and review payroll summaries.</p>
        </div>
      </div>

      <!-- Stepper / Stage Indicator -->
      <div class="card mb-4">
        <div class="card-body py-3">
          <div class="row text-center g-2">
            <div class="col-3">
              <div class="p-2 rounded-3 bg-success text-white">
                <i class="bi bi-check-circle-fill me-1"></i> 1. Attendance Sync
              </div>
            </div>
            <div class="col-3">
              <div class="p-2 rounded-3 bg-success text-white">
                <i class="bi bi-check-circle-fill me-1"></i> 2. Auto-Computation
              </div>
            </div>
            <div class="col-3">
              <div class="p-2 rounded-3 bg-warning text-dark fw-bold">
                <i class="bi bi-exclamation-triangle-fill me-1"></i> 3. AI Anomaly Scan (4 Flags)
              </div>
            </div>
            <div class="col-3">
              <div class="p-2 rounded-3 bg-light text-muted">
                4. Final Sign-off
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Batch Summary Card -->
      <div class="card mb-4">
        <div class="card-header bg-white">
          <span class="fw-bold">Active Batch Summary: PP-2026-08A</span>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <div class="text-muted small">Total Employees in Batch</div>
              <div class="fs-4 fw-bold">24 Plantilla Items</div>
            </div>
            <div class="col-md-3">
              <div class="text-muted small">Total Gross Compensation</div>
              <div class="fs-4 fw-bold text-dark">₱984,500.00</div>
            </div>
            <div class="col-md-3">
              <div class="text-muted small">Statutory & Tax Deductions</div>
              <div class="fs-4 fw-bold text-danger">₱142,380.50</div>
            </div>
            <div class="col-md-3">
              <div class="text-muted small">Total Net Bank Payout</div>
              <div class="fs-4 fw-bold text-success">₱842,119.50</div>
            </div>
          </div>
        </div>
        <div class="card-footer d-flex justify-content-between align-items-center">
          <span class="text-danger small"><i class="bi bi-info-circle-fill me-1"></i> Resolve or acknowledge 4 AI anomalies before final disbursement approval.</span>
          <div class="d-flex gap-2">
            <button class="btn btn-hospital-outline" onclick="App.navigateTo('ai-anomalies')">
              <i class="bi bi-shield-exclamation text-danger"></i> Review AI Flags
            </button>
            <button class="btn btn-hospital-primary" onclick="App.navigateTo('payroll-approval')">
              <i class="bi bi-check2-square"></i> Proceed to Approval
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // 5. Payroll Approval
  renderApproval() {
    const isHRAdmin = App.isHRAdmin && App.isHRAdmin();
    const isHRStaff = App.isHRStaff && App.isHRStaff();
    const isBatchApproved = HIMS_DATA.payrollPeriods[0].status.includes("Approved");

    return `
      <div class="page-header">
        <div class="page-title">
          <div class="d-flex align-items-center gap-2">
            <h3>Payroll Batch Finalization & Approval</h3>
            <span class="role-badge-pill ${HIMS_DATA.currentUser.badgeClass}">
              <i class="bi bi-shield-check"></i> ${HIMS_DATA.currentUser.roleShort}
            </span>
          </div>
          <p>Final sign-off, biometric audit locking, and Approved Payroll Register hand-off to Hospital Finance & Cashiering.</p>
        </div>
      </div>

      ${isHRStaff ? `
        <div class="alert alert-info d-flex align-items-center gap-3 mb-4">
          <i class="bi bi-info-circle-fill fs-4 text-primary"></i>
          <div>
            <strong>HR Staff / Payroll Officer Scope:</strong> You are authorized to prepare, audit, and validate this batch. However, the final <strong>Batch Lock & Approval Authorization</strong> strictly requires <strong>HR Administrator / Specialist</strong> credentials before hand-off to Finance.
          </div>
        </div>
      ` : ''}

      ${isBatchApproved ? `
        <!-- Finance Hand-off Banner -->
        <div class="finance-handoff-banner mb-4">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <div class="d-flex align-items-center gap-2 mb-1">
                <span class="badge bg-success"><i class="bi bi-lock-fill me-1"></i> BATCH FINALIZED & LOCKED</span>
                <span class="badge bg-white text-dark border">Transmittal Ref: HIMS-FIN-2026-08A-ADV</span>
              </div>
              <h5 class="fw-bold text-success mb-1">Approved Payroll Register Handed Off to Hospital Finance & Cashiering</h5>
              <div class="text-muted small">
                Authorized by <strong>Maria Angelica Santos (HR Administrator)</strong> &bull; Finance Division received disbursement transmittal for Landbank (₱520,380.00) & BDO (₱321,739.50).
              </div>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-hospital-outline" onclick="App.exportTableToCSV('approvalDeptTable', 'finance_approved_payroll_register.csv')">
                <i class="bi bi-file-earmark-spreadsheet"></i> Export Register for Finance
              </button>
            </div>
          </div>
        </div>
      ` : ''}

      <div class="card">
        <div class="card-header bg-white d-flex justify-content-between align-items-center">
          <div>
            <span class="fw-bold">Active Batch: PP-2026-08A (August 1 - 15, 2026)</span>
            <span class="badge ${isBatchApproved ? 'bg-success text-white' : 'bg-warning text-dark'} ms-2">
              ${isBatchApproved ? 'Approved & Locked' : 'Awaiting HR Administrator Final Sign-off'}
            </span>
          </div>
          <span class="text-muted small">Bank Credit Target: August 15, 2026</span>
        </div>
        <div class="card-body">
          <div class="alert alert-warning d-flex align-items-center gap-2 mb-3">
            <i class="bi bi-shield-exclamation fs-5"></i>
            <div>
              <strong>Audit Notice:</strong> 4 AI anomaly flags were detected during pre-processing. Finalizing and locking this batch will generate the official <strong>Approved Payroll Summary Register</strong> for Finance hand-off.
            </div>
          </div>

          <div class="table-responsive">
            <table class="table custom-table" id="approvalDeptTable">
              <thead>
                <tr>
                  <th>Department / Clinical Ward</th>
                  <th>Plantilla Items</th>
                  <th class="text-end">Gross Compensation</th>
                  <th class="text-end">Total Deductions</th>
                  <th class="text-end">Net Bank Payout</th>
                  <th>Audit Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Surgery & Operating Room</strong></td>
                  <td>4</td>
                  <td class="text-end">₱215,200.00</td>
                  <td class="text-end">₱31,240.00</td>
                  <td class="text-end fw-bold text-dark">₱183,960.00</td>
                  <td><span class="badge-custom badge-success-soft">Verified</span></td>
                </tr>
                <tr>
                  <td><strong>Emergency Medicine & Trauma</strong></td>
                  <td>5</td>
                  <td class="text-end">₱245,600.00</td>
                  <td class="text-end">₱36,120.00</td>
                  <td class="text-end fw-bold text-dark">₱209,480.00</td>
                  <td><span class="badge-custom badge-warning-soft">Flagged Anomaly</span></td>
                </tr>
                <tr>
                  <td><strong>Laboratory & Pathology</strong></td>
                  <td>4</td>
                  <td class="text-end">₱162,000.00</td>
                  <td class="text-end">₱23,400.00</td>
                  <td class="text-end fw-bold text-dark">₱138,600.00</td>
                  <td><span class="badge-custom badge-warning-soft">Flagged Anomaly</span></td>
                </tr>
                <tr>
                  <td><strong>Pharmacy & Therapeutics</strong></td>
                  <td>4</td>
                  <td class="text-end">₱154,200.00</td>
                  <td class="text-end">₱22,100.00</td>
                  <td class="text-end fw-bold text-dark">₱132,100.00</td>
                  <td><span class="badge-custom badge-success-soft">Verified</span></td>
                </tr>
                <tr>
                  <td><strong>Nursing Services & ICU</strong></td>
                  <td>7</td>
                  <td class="text-end">₱207,500.00</td>
                  <td class="text-end">₱29,520.50</td>
                  <td class="text-end fw-bold text-dark">₱177,979.50</td>
                  <td><span class="badge-custom badge-success-soft">Verified</span></td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="fw-bold table-light">
                  <td>GRAND TOTAL</td>
                  <td>24</td>
                  <td class="text-end">₱984,500.00</td>
                  <td class="text-end text-danger">₱142,380.50</td>
                  <td class="text-end text-success">₱842,119.50</td>
                  <td>-</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Hand-off Explanation Note -->
          <div class="mt-3 p-3 bg-light rounded-3 text-muted small">
            <i class="bi bi-info-circle me-1"></i>
            <strong>Workflow Hand-off Protocol:</strong> Once finalized and locked by the HR Administrator, the Approved Payroll Register is directly transmitted to the <strong>Hospital Cashier / Finance Division</strong> for bank fund disbursement. Finance acts as the execution recipient and does not possess approval authority over HR payroll computations.
          </div>
        </div>
        <div class="card-footer d-flex justify-content-between align-items-center">
          <div class="text-muted small">
            Batch Total: <strong class="text-success">₱842,119.50</strong> (24 Employees)
          </div>
          <div class="d-flex gap-2">
            ${isHRAdmin ? `
              ${!isBatchApproved ? `
                <button class="btn btn-outline-danger" onclick="PayrollModule.rejectBatch()">
                  <i class="bi bi-x-circle"></i> Request Batch Corrections
                </button>
                <button class="btn btn-hospital-primary" onclick="PayrollModule.approveBatch()">
                  <i class="bi bi-lock-fill"></i> Finalize & Lock Payroll (₱842,119.50)
                </button>
              ` : `
                <button class="btn btn-hospital-outline" onclick="App.showToast('Official COA Payroll Register sent to printer queue.', 'info')">
                  <i class="bi bi-printer"></i> Print Approved Payroll Register
                </button>
                <button class="btn btn-success" disabled>
                  <i class="bi bi-check2-all"></i> Batch Finalized & Handed off to Finance
                </button>
              `}
            ` : `
              <!-- HR Staff View: Cannot Finalize & Lock -->
              <button class="btn btn-hospital-outline" onclick="App.showToast('Batch validation summary submitted to HR Administrator for final approval sign-off.', 'success')">
                <i class="bi bi-send-check"></i> Endorse Batch to HR Administrator
              </button>
              <button class="btn btn-secondary" disabled title="Requires HR Administrator / Specialist Role">
                <i class="bi bi-lock-fill"></i> Finalize & Lock (HR Admin Role Required)
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  },

  approveBatch() {
    if (!App.isHRAdmin || !App.isHRAdmin()) {
      App.showToast("Permission Denied: Only HR Administrator / HR Specialist can finalize and lock payroll batches.", "danger");
      return;
    }

    App.showConfirmationModal({
      title: "Finalize & Lock Hospital Payroll Batch",
      message: "Are you sure you want to finalize and lock Batch PP-2026-08A (Total Net: ₱842,119.50)? This will lock attendance records and generate the official Approved Payroll Summary/Register for hand-off to the Finance & Cashiering Division.",
      confirmText: "Finalize & Hand off to Finance",
      onConfirm: () => {
        HIMS_DATA.payrollPeriods[0].status = "Approved & Disbursed";
        App.showToast("Batch PP-2026-08A finalized and locked! Approved Payroll Register handed off to Finance.", "success");
        App.navigateTo("payroll-approval");
      }
    });
  },

  rejectBatch() {
    if (!App.isHRAdmin || !App.isHRAdmin()) {
      App.showToast("Permission Denied: Only HR Administrator / HR Specialist can reject batches.", "danger");
      return;
    }

    App.showGenericModal({
      title: "Return Payroll Batch for Corrections",
      body: `
        <div class="mb-3">
          <label class="form-label">Audit Remarks / Correction Instructions</label>
          <textarea id="batchRejectNotes" class="form-control" rows="3" placeholder="Specify required corrections for HR Payroll Officer..."></textarea>
        </div>
      `,
      confirmText: "Submit Return Remarks",
      onConfirm: () => {
        App.showToast("Batch returned to HR Payroll Staff for computation adjustments.", "warning");
      }
    });
  },

  // 6. Payroll History
  renderHistory() {
    return `
      <div class="page-header">
        <div class="page-title">
          <h3>Payroll History & Audit Archive</h3>
          <p>Historical record of finalized payroll batches, bank remittances, and statutory summaries.</p>
        </div>
      </div>

      <div class="card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table custom-table mb-0">
              <thead>
                <tr>
                  <th>Period Code</th>
                  <th>Coverage</th>
                  <th>Payout Date</th>
                  <th>Employees</th>
                  <th class="text-end">Gross Total</th>
                  <th class="text-end">Deductions</th>
                  <th class="text-end">Net Disbursed</th>
                  <th>Status</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${HIMS_DATA.payrollPeriods.map(p => `
                  <tr>
                    <td class="fw-bold">${p.id}</td>
                    <td>${p.name}</td>
                    <td>${p.payoutDate}</td>
                    <td>${p.totalEmployees}</td>
                    <td class="text-end">₱${p.totalGross.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                    <td class="text-end text-danger">₱${p.totalDeductions.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                    <td class="text-end text-success fw-bold">₱${p.totalNet.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                    <td><span class="badge-custom badge-success-soft">${p.status}</span></td>
                    <td class="text-center">
                      <button class="btn btn-sm btn-light-action" onclick="PayrollModule.viewPayslip('EMP-0101')">
                        <i class="bi bi-receipt"></i> Payslips
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  // 7. Electronic Payslip Viewer
  renderPayslipView(employeeId = "EMP-0101") {
    const emp = HIMS_DATA.employees.find(e => e.id === employeeId) || HIMS_DATA.employees[0];
    const rec = HIMS_DATA.payrollRecords.find(r => r.employeeId === emp.id) || HIMS_DATA.payrollRecords[0];

    return `
      <div class="page-header no-print">
        <div class="page-title">
          <h3>Employee Electronic Payslip</h3>
          <p>Official Philippine Hospital Compensation Statement</p>
        </div>
        <div class="d-flex gap-2">
          <select class="form-select" style="width: 260px;" onchange="PayrollModule.viewPayslip(this.value)">
            ${HIMS_DATA.employees.map(e => `<option value="${e.id}" ${e.id === emp.id ? 'selected' : ''}>${e.name}</option>`).join('')}
          </select>
          <button class="btn btn-hospital-outline" onclick="window.print()">
            <i class="bi bi-printer-fill"></i> Print Payslip
          </button>
          <button class="btn btn-hospital-primary" onclick="App.showToast('Payslip PDF exported successfully.', 'success')">
            <i class="bi bi-file-earmark-pdf-fill"></i> Export PDF
          </button>
        </div>
      </div>

      <!-- Printable Payslip Paper -->
      <div class="payslip-paper">
        <div class="payslip-header">
          <div>
            <div class="d-flex align-items-center gap-2 mb-1">
              <div class="brand-icon-box" style="width: 32px; height: 32px; font-size: 1rem;">
                <i class="bi bi-hospital"></i>
              </div>
              <h5 class="fw-bold text-success mb-0">${HIMS_DATA.hospital.name}</h5>
            </div>
            <div class="text-muted small">${HIMS_DATA.hospital.address}</div>
            <div class="text-muted small">TIN: ${HIMS_DATA.hospital.tin} | PhilHealth Accrd: ${HIMS_DATA.hospital.philhealthAccreditation}</div>
          </div>
          <div class="text-end">
            <h6 class="fw-bold text-dark mb-0">OFFICIAL PAYSLIP</h6>
            <div class="badge bg-light text-dark border my-1">Period: August 1 - 15, 2026</div>
            <div class="text-muted small">Payout Date: August 15, 2026</div>
          </div>
        </div>

        <!-- Employee Info Bar -->
        <div class="row g-2 mb-3 p-3 bg-light rounded-3 border small">
          <div class="col-6 col-md-3">
            <span class="text-muted d-block">Employee ID:</span>
            <strong>${emp.id}</strong>
          </div>
          <div class="col-6 col-md-3">
            <span class="text-muted d-block">Employee Name:</span>
            <strong>${emp.name}</strong>
          </div>
          <div class="col-6 col-md-3">
            <span class="text-muted d-block">Department:</span>
            <strong>${emp.department}</strong>
          </div>
          <div class="col-6 col-md-3">
            <span class="text-muted d-block">Position & Grade:</span>
            <strong>${emp.position} (${emp.salaryGrade})</strong>
          </div>
          <div class="col-6 col-md-3">
            <span class="text-muted d-block">TIN:</span>
            <span>${emp.tin}</span>
          </div>
          <div class="col-6 col-md-3">
            <span class="text-muted d-block">SSS No:</span>
            <span>${emp.sssNo}</span>
          </div>
          <div class="col-6 col-md-3">
            <span class="text-muted d-block">PhilHealth No:</span>
            <span>${emp.philhealthNo}</span>
          </div>
          <div class="col-6 col-md-3">
            <span class="text-muted d-block">Pag-IBIG No:</span>
            <span>${emp.pagibigNo}</span>
          </div>
        </div>

        <!-- Earnings and Deductions Table -->
        <div class="row g-3">
          <div class="col-6">
            <table class="payslip-table">
              <thead>
                <tr>
                  <th>EARNINGS / CREDITS</th>
                  <th class="text-end">AMOUNT (PHP)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Basic Salary (Semi-Monthly)</td>
                  <td class="text-end">₱${rec.basicPay.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                </tr>
                <tr>
                  <td>Overtime Pay (${rec.overtimeHours} hrs)</td>
                  <td class="text-end">₱${rec.overtimePay.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                </tr>
                <tr>
                  <td>Night Shift Diff (${rec.nightDiffHours} hrs)</td>
                  <td class="text-end">₱${rec.nightDiffPay.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                </tr>
                <tr>
                  <td>Magna Carta Hazard Pay</td>
                  <td class="text-end">₱${rec.hazardPay.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                </tr>
                <tr>
                  <td>Rice Subsidy Allowance</td>
                  <td class="text-end">₱${rec.allowanceRice.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                </tr>
                <tr>
                  <td>Medical / Uniform Subsidy</td>
                  <td class="text-end">₱${rec.allowanceMedical.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                </tr>
                <tr>
                  <td>Laundry & Sterilization Allowance</td>
                  <td class="text-end">₱${rec.allowanceLaundry.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                </tr>
                <tr class="fw-bold bg-light">
                  <td>TOTAL GROSS EARNINGS</td>
                  <td class="text-end text-success">₱${rec.totalEarnings.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="col-6">
            <table class="payslip-table">
              <thead>
                <tr>
                  <th>DEDUCTIONS / WITHHOLDINGS</th>
                  <th class="text-end">AMOUNT (PHP)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>SSS Contribution (Employee Share)</td>
                  <td class="text-end text-danger">₱${rec.sssEE.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                </tr>
                <tr>
                  <td>PhilHealth Premium (Employee Share)</td>
                  <td class="text-end text-danger">₱${rec.philhealthEE.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                </tr>
                <tr>
                  <td>Pag-IBIG / HDMF (Employee Share)</td>
                  <td class="text-end text-danger">₱${rec.pagibigEE.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                </tr>
                <tr>
                  <td>BIR Withholding Tax (TRAIN Law)</td>
                  <td class="text-end text-danger">₱${rec.withholdingTax.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                </tr>
                <tr>
                  <td>Other Deductions / Hospital Co-op</td>
                  <td class="text-end text-danger">₱${(rec.otherDeductions || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                  <td class="text-end">&nbsp;</td>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                  <td class="text-end">&nbsp;</td>
                </tr>
                <tr class="fw-bold bg-light">
                  <td>TOTAL DEDUCTIONS</td>
                  <td class="text-end text-danger">₱${rec.totalDeductions.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Net Pay Summary Box -->
        <div class="p-3 bg-light rounded-3 border border-success mt-4 d-flex justify-content-between align-items-center">
          <div>
            <div class="text-muted small">NET TAKE-HOME PAY (PHP)</div>
            <div class="fs-3 fw-bold text-success">₱${rec.netPay.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
          </div>
          <div class="text-end small">
            <div>Bank Credit: <strong>${emp.bankAccount}</strong></div>
            <div class="text-muted">Generated by HIMS Payroll & Benefits v2.4</div>
          </div>
        </div>

        <div class="row mt-4 pt-3 border-top text-center small text-muted">
          <div class="col-4">
            <div class="border-bottom pb-4 mb-1"></div>
            <span>Prepared By: Maria Angelica Santos</span><br>
            <small>HR Payroll Officer</small>
          </div>
          <div class="col-4">
            <div class="border-bottom pb-4 mb-1"></div>
            <span>Certified By: Dr. Rafael M. Mendoza</span><br>
            <small>Chief Medical Officer</small>
          </div>
          <div class="col-4">
            <div class="border-bottom pb-4 mb-1"></div>
            <span>Employee Acknowledgment</span><br>
            <small>Electronic Signature on Record</small>
          </div>
        </div>
      </div>
    `;
  },

  viewPayslip(empId) {
    App.currentPayslipEmployeeId = empId;
    App.navigateTo('payslip');
  },

  showPayrollDetailsModal(recId) {
    const rec = HIMS_DATA.payrollRecords.find(r => r.id === recId);
    if (!rec) return;
    App.showGenericModal({
      title: `Payroll Record Details: ${rec.employeeName}`,
      body: `
        <div class="row g-2 mb-3 small">
          <div class="col-6"><strong>Position:</strong> ${rec.position}</div>
          <div class="col-6"><strong>Department:</strong> ${rec.department}</div>
          <div class="col-6"><strong>Gross Pay:</strong> ₱${rec.totalEarnings.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
          <div class="col-6"><strong>Net Pay:</strong> ₱${rec.netPay.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
          <div class="col-6"><strong>Status:</strong> <span class="badge ${rec.status === 'Approved' ? 'bg-success' : 'bg-warning text-dark'}">${rec.status}</span></div>
          <div class="col-6"><strong>OT Hours:</strong> ${rec.overtimeHours} hrs (₱${rec.overtimePay.toFixed(2)})</div>
        </div>
      `,
      cancelText: "Close",
      confirmText: "View Full Payslip",
      showConfirm: true,
      confirmClass: "btn-hospital-primary",
      onConfirm: () => {
        App.currentPayslipEmployeeId = rec.employeeId;
        App.navigateTo('payslip');
      }
    });
  }
};
