/**
 * Reports View Module
 */
const ReportsModule = {
  render(subReport = 'payroll') {
    return `
      <div class="page-header no-print">
        <div class="page-title">
          <h3>Hospital Compensation & Statutory Reports</h3>
          <p>Generate, filter, print, and export compliance reports for DOH, BIR, SSS, and hospital board audits.</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-hospital-outline" onclick="window.print()">
            <i class="bi bi-printer-fill"></i> Print Report
          </button>
          <button class="btn btn-hospital-primary" onclick="App.showToast('Exporting report to Excel...', 'success')">
            <i class="bi bi-file-earmark-excel-fill"></i> Export Excel
          </button>
        </div>
      </div>

      <!-- Report Selector Tabs -->
      <ul class="nav nav-tabs mb-4 no-print">
        <li class="nav-item">
          <a class="nav-link ${subReport === 'payroll' ? 'active text-success fw-bold' : 'text-muted'}" href="javascript:void(0)" onclick="App.navigateTo('reports-payroll')">
            <i class="bi bi-cash-stack me-1"></i> Payroll Report
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${subReport === 'contributions' ? 'active text-success fw-bold' : 'text-muted'}" href="javascript:void(0)" onclick="App.navigateTo('reports-contributions')">
            <i class="bi bi-bank me-1"></i> Government Contributions
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${subReport === 'claims' ? 'active text-success fw-bold' : 'text-muted'}" href="javascript:void(0)" onclick="App.navigateTo('reports-claims')">
            <i class="bi bi-receipt me-1"></i> Claims & Reimbursements
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${subReport === 'benefits' ? 'active text-success fw-bold' : 'text-muted'}" href="javascript:void(0)" onclick="App.navigateTo('reports-benefits')">
            <i class="bi bi-heart-pulse me-1"></i> HMO & Benefits Report
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${subReport === 'ai' ? 'active text-success fw-bold' : 'text-muted'}" href="javascript:void(0)" onclick="App.navigateTo('reports-ai')">
            <i class="bi bi-shield-check me-1"></i> AI Anomaly Audit Report
          </a>
        </li>
      </ul>

      <!-- Printable Report Container -->
      <div class="printable-report">
        <!-- Print Header -->
        <div class="d-none d-print-block mb-4 text-center border-bottom pb-3">
          <h4 class="fw-bold text-success mb-0">${HIMS_DATA.hospital.name}</h4>
          <p class="text-muted small mb-0">${HIMS_DATA.hospital.address}</p>
          <div class="fw-bold mt-2 text-uppercase">${subReport.toUpperCase()} AUDIT REPORT</div>
        </div>

        ${ReportsModule.renderSubReportContent(subReport)}
      </div>
    `;
  },

  renderSubReportContent(subReport) {
    if (subReport === 'contributions') {
      return `
        <div class="card">
          <div class="card-header bg-white d-flex justify-content-between align-items-center">
            <span class="fw-bold">Philippine Statutory Remittance Schedule (Period: Aug 1-15, 2026)</span>
            <span class="badge bg-light text-dark border">SSS / PhilHealth / Pag-IBIG / BIR Form 1601-C</span>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table custom-table mb-0">
                <thead>
                  <tr>
                    <th>Agency / Remittance</th>
                    <th class="text-end">Employee Share (EE)</th>
                    <th class="text-end">Employer Share (ER)</th>
                    <th class="text-end">Total Remittance</th>
                    <th>Remittance Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Social Security System (SSS)</strong></td>
                    <td class="text-end text-danger">₱32,450.00</td>
                    <td class="text-end text-muted">₱68,520.00</td>
                    <td class="text-end fw-bold text-dark">₱100,970.00</td>
                    <td>September 10, 2026</td>
                    <td><span class="badge badge-warning-soft">Pending Remittance</span></td>
                  </tr>
                  <tr>
                    <td><strong>PhilHealth (PHIC)</strong></td>
                    <td class="text-end text-danger">₱18,240.00</td>
                    <td class="text-end text-muted">₱18,240.00</td>
                    <td class="text-end fw-bold text-dark">₱36,480.00</td>
                    <td>September 15, 2026</td>
                    <td><span class="badge badge-warning-soft">Pending Remittance</span></td>
                  </tr>
                  <tr>
                    <td><strong>Pag-IBIG Fund (HDMF)</strong></td>
                    <td class="text-end text-danger">₱2,400.00</td>
                    <td class="text-end text-muted">₱2,400.00</td>
                    <td class="text-end fw-bold text-dark">₱4,800.00</td>
                    <td>September 15, 2026</td>
                    <td><span class="badge badge-warning-soft">Pending Remittance</span></td>
                  </tr>
                  <tr>
                    <td><strong>BIR Withholding Tax on Compensation</strong></td>
                    <td class="text-end text-danger">₱89,290.50</td>
                    <td class="text-end text-muted">-</td>
                    <td class="text-end fw-bold text-dark">₱89,290.50</td>
                    <td>September 10, 2026</td>
                    <td><span class="badge badge-warning-soft">Pending Remittance</span></td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="fw-bold bg-light">
                    <td>TOTAL STATUTORY REMITTANCES</td>
                    <td class="text-end text-danger">₱142,380.50</td>
                    <td class="text-end text-muted">₱89,160.00</td>
                    <td class="text-end text-success fs-6">₱231,540.50</td>
                    <td colspan="2">-</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      `;
    } else if (subReport === 'ai') {
      return `
        <div class="card">
          <div class="card-header bg-white">
            <span class="fw-bold">AI Anomaly Audit Trail & Mitigation Log</span>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table custom-table mb-0">
                <thead>
                  <tr>
                    <th>Anomaly Code</th>
                    <th>Target Period</th>
                    <th>Category</th>
                    <th>Risk</th>
                    <th>Impact / Discrepancy</th>
                    <th>Resolution Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${HIMS_DATA.aiAnomalies.map(a => `
                    <tr>
                      <td class="fw-bold">${a.id}</td>
                      <td>${a.periodId}</td>
                      <td>${a.anomalyType}</td>
                      <td><span class="badge badge-custom ${a.riskLevel === 'High' ? 'badge-danger-soft' : 'badge-warning-soft'}">${a.riskLevel}</span></td>
                      <td class="fw-semibold text-danger">₱${a.amountDiscrepancy.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                      <td><span class="badge badge-custom ${a.status === 'Resolved' ? 'badge-success-soft' : 'badge-neutral-soft'}">${a.status}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    } else {
      // Default Payroll Report
      return `
        <div class="card">
          <div class="card-header bg-white d-flex justify-content-between align-items-center">
            <span class="fw-bold">Departmental Payroll Allocation Summary</span>
            <span class="badge bg-light text-dark border">Batch: PP-2026-08A</span>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table custom-table mb-0">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Active Staff</th>
                    <th class="text-end">Basic Salary</th>
                    <th class="text-end">Hazard & Allowances</th>
                    <th class="text-end">Overtime & Night Diff</th>
                    <th class="text-end">Gross Payroll</th>
                    <th class="text-end">Net Pay</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Emergency Medicine & Trauma</strong></td>
                    <td>5</td>
                    <td class="text-end">₱172,000.00</td>
                    <td class="text-end">₱28,500.00</td>
                    <td class="text-end">₱45,100.00</td>
                    <td class="text-end fw-semibold">₱245,600.00</td>
                    <td class="text-end fw-bold text-success">₱209,480.00</td>
                  </tr>
                  <tr>
                    <td><strong>Surgery & Operating Room</strong></td>
                    <td>4</td>
                    <td class="text-end">₱158,000.00</td>
                    <td class="text-end">₱26,000.00</td>
                    <td class="text-end">₱31,200.00</td>
                    <td class="text-end fw-semibold">₱215,200.00</td>
                    <td class="text-end fw-bold text-success">₱183,960.00</td>
                  </tr>
                  <tr>
                    <td><strong>Nursing Services & ICU</strong></td>
                    <td>7</td>
                    <td class="text-end">₱152,000.00</td>
                    <td class="text-end">₱32,000.00</td>
                    <td class="text-end">₱23,500.00</td>
                    <td class="text-end fw-semibold">₱207,500.00</td>
                    <td class="text-end fw-bold text-success">₱177,979.50</td>
                  </tr>
                  <tr>
                    <td><strong>Laboratory & Pathology</strong></td>
                    <td>4</td>
                    <td class="text-end">₱124,000.00</td>
                    <td class="text-end">₱24,000.00</td>
                    <td class="text-end">₱14,000.00</td>
                    <td class="text-end fw-semibold">₱162,000.00</td>
                    <td class="text-end fw-bold text-success">₱138,600.00</td>
                  </tr>
                  <tr>
                    <td><strong>Pharmacy & Therapeutics</strong></td>
                    <td>4</td>
                    <td class="text-end">₱120,000.00</td>
                    <td class="text-end">₱22,500.00</td>
                    <td class="text-end">₱11,700.00</td>
                    <td class="text-end fw-semibold">₱154,200.00</td>
                    <td class="text-end fw-bold text-success">₱132,100.00</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="fw-bold table-light">
                    <td>TOTAL HOSPITAL PAYROLL</td>
                    <td>24</td>
                    <td class="text-end">₱726,000.00</td>
                    <td class="text-end">₱133,000.00</td>
                    <td class="text-end">₱125,500.00</td>
                    <td class="text-end">₱984,500.00</td>
                    <td class="text-end text-success fs-6">₱842,119.50</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      `;
    }
  }
};
