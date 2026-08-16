/**
 * Dashboard View Module
 */
const DashboardModule = {
  render() {
    // If logged in as Hospital Employee, render Employee Self-Service Dashboard
    if (App.isEmployee && App.isEmployee()) {
      return this.renderEmployeeDashboard();
    }

    const totalEmployees = HIMS_DATA.employees.length;
    const activePeriod = HIMS_DATA.payrollPeriods[0];
    const totalGross = activePeriod.totalGross;
    const totalNet = activePeriod.totalNet;
    const pendingClaims = HIMS_DATA.claims.filter(c => c.status.toLowerCase().includes('pending') || c.status.toLowerCase().includes('review')).length;
    const activeAnomalies = HIMS_DATA.aiAnomalies.filter(a => a.status === 'New' || a.status === 'Under Review').length;

    const isHRStaff = App.isHRStaff && App.isHRStaff();

    return `
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-title">
          <div class="d-flex align-items-center gap-2">
            <h3>Hospital Payroll & Benefits Dashboard</h3>
            <span class="role-badge-pill ${HIMS_DATA.currentUser.badgeClass}">
              <i class="bi bi-person-check-fill"></i> ${HIMS_DATA.currentUser.roleShort}
            </span>
          </div>
          <p>Real-time compensation analytics, active payroll batches, and AI-assisted anomaly detection.</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-hospital-outline" onclick="App.navigateTo('ai-dashboard')">
            <i class="bi bi-robot text-success"></i> Run AI Audit Scan
          </button>
          <button class="btn btn-hospital-primary" onclick="App.navigateTo('payroll-processing')">
            <i class="bi bi-play-circle-fill"></i> ${isHRStaff ? 'Process & Validate Batch' : 'Manage Active Batch'}
          </button>
        </div>
      </div>

      <!-- AI Alert Banner -->
      <div class="ai-hero-card mb-4">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <div class="d-flex align-items-center gap-2 mb-2">
              <span class="badge bg-warning text-dark fw-bold px-2 py-1"><i class="bi bi-exclamation-triangle-fill me-1"></i> AI AUDIT ALERT</span>
              <span class="badge bg-white text-dark fw-semibold">Model: HIMS-Biometric-Payroll v2.4</span>
            </div>
            <h4 class="fw-bold mb-2">4 Critical Payroll Anomalies Detected in Current Batch (${activePeriod.name})</h4>
            <p class="text-white-50 mb-0 small" style="max-width: 680px;">
              Neural pattern matching identified 1 excessive overtime threshold breach, 1 duplicate monthly rice allowance, and 1 base salary grade mismatch across clinical departments.
            </p>
          </div>
          <div class="col-lg-4 text-lg-end mt-3 mt-lg-0">
            <button class="btn btn-light fw-bold text-success shadow-sm" onclick="App.navigateTo('ai-anomalies')">
              <i class="bi bi-shield-check me-1"></i> Review Flagged Records (${activeAnomalies})
            </button>
          </div>
        </div>
      </div>

      <!-- 8 Key Summary Cards -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-sm-6 col-xl-3">
          <div class="stat-card">
            <div>
              <div class="stat-title">Total Employees</div>
              <div class="stat-value">${totalEmployees}</div>
              <div class="stat-subtext text-success"><i class="bi bi-people-fill"></i> 100% Plantilla Active</div>
            </div>
            <div class="stat-icon-wrapper stat-icon-green">
              <i class="bi bi-person-badge"></i>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-xl-3">
          <div class="stat-card stat-blue">
            <div>
              <div class="stat-title">Active Period</div>
              <div class="stat-value" style="font-size: 1.25rem;">Aug 1-15, '26</div>
              <div class="stat-subtext text-muted"><i class="bi bi-clock-history"></i> Cutoff: Aug 12</div>
            </div>
            <div class="stat-icon-wrapper stat-icon-blue">
              <i class="bi bi-calendar2-week"></i>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-xl-3">
          <div class="stat-card">
            <div>
              <div class="stat-title">Processed Payroll</div>
              <div class="stat-value">12 / 12</div>
              <div class="stat-subtext text-success"><i class="bi bi-check-circle-fill"></i> Initial calc ready</div>
            </div>
            <div class="stat-icon-wrapper stat-icon-green">
              <i class="bi bi-calculator"></i>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-xl-3">
          <div class="stat-card stat-amber">
            <div>
              <div class="stat-title">Pending Approval</div>
              <div class="stat-value">₱${totalNet.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
              <div class="stat-subtext text-warning"><i class="bi bi-hourglass-split"></i> Awaiting L2 Signoff</div>
            </div>
            <div class="stat-icon-wrapper stat-icon-amber">
              <i class="bi bi-stamp"></i>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-xl-3">
          <div class="stat-card">
            <div>
              <div class="stat-title">Approved Payroll</div>
              <div class="stat-value">₱${(875400).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
              <div class="stat-subtext text-muted"><i class="bi bi-check2-all"></i> Last Cycle (Jul 2nd Half)</div>
            </div>
            <div class="stat-icon-wrapper stat-icon-green">
              <i class="bi bi-cash-stack"></i>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-xl-3">
          <div class="stat-card stat-purple">
            <div>
              <div class="stat-title">Current Payroll Cost</div>
              <div class="stat-value">₱${totalGross.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
              <div class="stat-subtext text-muted"><i class="bi bi-graph-up"></i> Gross compensation</div>
            </div>
            <div class="stat-icon-wrapper stat-icon-purple">
              <i class="bi bi-pie-chart-fill"></i>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-xl-3">
          <div class="stat-card stat-amber">
            <div>
              <div class="stat-title">Pending Claims</div>
              <div class="stat-value">${pendingClaims} Claims</div>
              <div class="stat-subtext text-warning"><i class="bi bi-receipt"></i> CME & Scrub claims</div>
            </div>
            <div class="stat-icon-wrapper stat-icon-amber">
              <i class="bi bi-file-earmark-medical"></i>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-xl-3">
          <div class="stat-card stat-red">
            <div>
              <div class="stat-title">AI Anomalies</div>
              <div class="stat-value">${activeAnomalies} Flagged</div>
              <div class="stat-subtext text-danger"><i class="bi bi-shield-exclamation"></i> 2 High / 2 Medium</div>
            </div>
            <div class="stat-icon-wrapper stat-icon-red">
              <i class="bi bi-robot"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section (2 Charts Maximum) -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-lg-7">
          <div class="card h-100">
            <div class="card-header">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-bar-chart-line-fill text-success"></i>
                <span>Monthly Payroll Expenditure & Tax Breakdown (2026)</span>
              </div>
              <span class="badge badge-neutral-soft">Philippine Peso (PHP)</span>
            </div>
            <div class="card-body">
              <div style="height: 240px; position: relative;">
                <canvas id="chartMonthlyPayroll"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-5">
          <div class="card h-100">
            <div class="card-header">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-pie-chart-fill text-danger"></i>
                <span>AI Anomaly Distribution by Category</span>
              </div>
              <span class="badge badge-ai">Simulated AI</span>
            </div>
            <div class="card-body">
              <div style="height: 240px; position: relative;">
                <canvas id="chartAiAnomalies"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities & Recent Tables -->
      <div class="row g-3">
        <!-- Recent Activities -->
        <div class="col-12 col-lg-6">
          <div class="card h-100">
            <div class="card-header">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-activity text-success"></i>
                <span>Recent Payroll & HR Activities</span>
              </div>
              <button class="btn btn-sm btn-light" onclick="App.navigateTo('payroll-history')">View History</button>
            </div>
            <div class="card-body p-0">
              <div class="list-group list-group-flush small">
                <div class="list-group-item d-flex align-items-center gap-3 py-3">
                  <div class="stat-icon-wrapper stat-icon-green" style="width: 36px; height: 36px; font-size: 1rem;">
                    <i class="bi bi-cpu"></i>
                  </div>
                  <div class="flex-grow-1">
                    <div class="fw-semibold">AI Automated Payroll Scan Completed</div>
                    <div class="text-muted">Batch PP-2026-08A scanned; 4 potential variances detected.</div>
                  </div>
                  <span class="text-muted small">10 mins ago</span>
                </div>
                <div class="list-group-item d-flex align-items-center gap-3 py-3">
                  <div class="stat-icon-wrapper stat-icon-amber" style="width: 36px; height: 36px; font-size: 1rem;">
                    <i class="bi bi-receipt"></i>
                  </div>
                  <div class="flex-grow-1">
                    <div class="fw-semibold">New Claim Submitted (₱4,500.00)</div>
                    <div class="text-muted">Mark Anthony Dela Cruz, RN - ACLS Recertification Training.</div>
                  </div>
                  <span class="text-muted small">2 hours ago</span>
                </div>
                <div class="list-group-item d-flex align-items-center gap-3 py-3">
                  <div class="stat-icon-wrapper stat-icon-blue" style="width: 36px; height: 36px; font-size: 1rem;">
                    <i class="bi bi-check2-circle"></i>
                  </div>
                  <div class="flex-grow-1">
                    <div class="fw-semibold">July 2nd Half Bank Disbursement Completed</div>
                    <div class="text-muted">Direct credit advice sent to Landbank & BDO for 24 plantilla items.</div>
                  </div>
                  <span class="text-muted small">Jul 31, 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent AI Alerts & Claims Widget -->
        <div class="col-12 col-lg-6">
          <div class="card h-100">
            <div class="card-header">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-shield-alert text-danger"></i>
                <span>Active AI Anomaly Flags</span>
              </div>
              <button class="btn btn-sm btn-light text-danger fw-bold" onclick="App.navigateTo('ai-anomalies')">View All Flags</button>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table custom-table mb-0">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Anomaly Type</th>
                      <th>Risk</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${HIMS_DATA.aiAnomalies.slice(0, 4).map(anom => `
                      <tr>
                        <td>
                          <div class="fw-semibold">${anom.employeeName}</div>
                          <small class="text-muted">${anom.department}</small>
                        </td>
                        <td>
                          <span class="badge badge-neutral-soft">${anom.anomalyType}</span>
                        </td>
                        <td>
                          <span class="badge-custom ${anom.riskLevel === 'High' ? 'badge-danger-soft' : (anom.riskLevel === 'Medium' ? 'badge-warning-soft' : 'badge-info-soft')}">
                            ${anom.riskLevel} (${anom.confidenceScore}%)
                          </span>
                        </td>
                        <td>
                          <button class="btn btn-sm btn-light-action" onclick="App.showAnomalyModal('${anom.id}')">
                            <i class="bi bi-eye"></i> Review
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  initCharts() {
    // Render Chart.js
    if (typeof Chart === 'undefined') return;

    // Monthly Summary Bar Chart
    const ctxMonthly = document.getElementById('chartMonthlyPayroll');
    if (ctxMonthly) {
      new Chart(ctxMonthly, {
        type: 'bar',
        data: {
          labels: ['May 1st', 'May 2nd', 'Jun 1st', 'Jun 2nd', 'Jul 1st', 'Jul 2nd', 'Aug 1st (Est)'],
          datasets: [
            {
              label: 'Net Pay (PHP)',
              data: [812000, 819000, 825600, 831000, 837000, 875400, 842119],
              backgroundColor: '#0d6e4f',
              borderRadius: 6
            },
            {
              label: 'Govt Deductions (SSS/PhilHealth/HDMF/Tax)',
              data: [138000, 139200, 139800, 140500, 141200, 148900, 142380],
              backgroundColor: '#94a3b8',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } }
          },
          scales: {
            x: { grid: { display: false } },
            y: {
              grid: { color: '#f1f5f9' },
              ticks: {
                callback: function(val) { return '₱' + (val / 1000) + 'k'; }
              }
            }
          }
        }
      });
    }

    // AI Anomaly Donut Chart
    const ctxAi = document.getElementById('chartAiAnomalies');
    if (ctxAi) {
      new Chart(ctxAi, {
        type: 'doughnut',
        data: {
          labels: ['Excessive Overtime', 'Duplicate Allowance', 'Salary Mismatch', 'Schedule Conflict', 'Ghost Employee/Other'],
          datasets: [{
            data: [35, 25, 20, 12, 8],
            backgroundColor: ['#ef4444', '#f59e0b', '#8b5cf6', '#0284c7', '#10b981'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right', labels: { boxWidth: 10, font: { size: 10 } } }
          }
        }
      });
    }
  },

  // 2. Hospital Employee Self-Service Dashboard
  renderEmployeeDashboard() {
    const user = HIMS_DATA.currentUser;
    const employeeData = HIMS_DATA.employees.find(e => e.id === user.id) || HIMS_DATA.employees[0];
    const userClaims = HIMS_DATA.claims.filter(c => c.employeeId === user.id || c.employeeName.includes(user.name.split(' ')[0]));
    const latestPayroll = HIMS_DATA.payrollRecords.find(p => p.employeeId === user.id) || HIMS_DATA.payrollRecords[0];

    const approvedClaimsTotal = userClaims.filter(c => c.status === 'Approved').reduce((acc, c) => acc + c.amount, 0);

    return `
      <!-- Employee Welcome Header -->
      <div class="page-header">
        <div class="page-title">
          <div class="d-flex align-items-center gap-2">
            <h3>Employee Self-Service Portal</h3>
            <span class="role-badge-pill role-badge-employee">
              <i class="bi bi-person-badge-fill"></i> Hospital Staff
            </span>
          </div>
          <p>Welcome back, <strong class="text-dark">${user.name}</strong> (${user.position}) &bull; ${user.department}</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-hospital-outline" onclick="App.navigateTo('payslip')">
            <i class="bi bi-file-earmark-text"></i> View My Payslip
          </button>
          <button class="btn btn-hospital-primary" onclick="ClaimsModule.showSubmitClaimModal()">
            <i class="bi bi-plus-circle-fill"></i> Submit Reimbursement Claim
          </button>
        </div>
      </div>

      <!-- Employee Quick Stat Cards -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-sm-6 col-xl-3">
          <div class="stat-card">
            <div>
              <div class="stat-title">Latest Net Take-Home Pay</div>
              <div class="stat-value text-success">₱${latestPayroll ? latestPayroll.netPay.toLocaleString('en-US', {minimumFractionDigits: 2}) : '42,105.00'}</div>
              <div class="stat-subtext text-muted"><i class="bi bi-calendar-check"></i> Batch PP-2026-08A</div>
            </div>
            <div class="stat-icon-wrapper stat-icon-green">
              <i class="bi bi-cash-coin"></i>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-xl-3">
          <div class="stat-card stat-blue">
            <div>
              <div class="stat-title">Salary Grade & Step</div>
              <div class="stat-value text-primary">${employeeData.salaryGrade} Step ${employeeData.step}</div>
              <div class="stat-subtext text-muted"><i class="bi bi-briefcase"></i> Monthly: ₱${employeeData.monthlyRate.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
            </div>
            <div class="stat-icon-wrapper stat-icon-blue">
              <i class="bi bi-award-fill"></i>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-xl-3">
          <div class="stat-card stat-purple">
            <div>
              <div class="stat-title">Active HMO Healthcare</div>
              <div class="stat-value" style="font-size: 1.15rem;">Maxicare MBL</div>
              <div class="stat-subtext text-success"><i class="bi bi-shield-check"></i> ₱300,000 / illness coverage</div>
            </div>
            <div class="stat-icon-wrapper stat-icon-purple">
              <i class="bi bi-heart-pulse-fill"></i>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-xl-3">
          <div class="stat-card stat-amber">
            <div>
              <div class="stat-title">My Reimbursement Claims</div>
              <div class="stat-value text-warning">${userClaims.length} Total</div>
              <div class="stat-subtext text-muted"><i class="bi bi-check-circle"></i> Approved: ₱${approvedClaimsTotal.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
            </div>
            <div class="stat-icon-wrapper stat-icon-amber">
              <i class="bi bi-receipt-cutoff"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Employee Overview Grid -->
      <div class="row g-4">
        <!-- Electronic Payslip Quick Summary -->
        <div class="col-12 col-lg-7">
          <div class="card h-100">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-receipt text-success fs-5"></i>
                <span class="fw-bold">My Electronic Payslip Snapshot</span>
              </div>
              <span class="badge bg-success-subtle text-success border border-success-subtle">Period: August 1 - 15, 2026</span>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-sm-6">
                  <div class="p-3 bg-light rounded-3">
                    <div class="text-muted small fw-semibold">EARNINGS BREAKDOWN</div>
                    <div class="d-flex justify-content-between mt-2">
                      <span class="small">Semi-Monthly Basic:</span>
                      <span class="fw-bold small">₱${employeeData.semiMonthlyBase.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div class="d-flex justify-content-between mt-1">
                      <span class="small">Hazard Duty Pay:</span>
                      <span class="fw-bold small text-success">₱${employeeData.hazardRate.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div class="d-flex justify-content-between mt-1">
                      <span class="small">Hospital Subsidies:</span>
                      <span class="fw-bold small text-success">₱4,500.00</span>
                    </div>
                    <div class="border-top mt-2 pt-1 d-flex justify-content-between">
                      <span class="fw-bold small">Gross Earnings:</span>
                      <span class="fw-bold text-dark">₱${(employeeData.semiMonthlyBase + employeeData.hazardRate + 4500).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                    </div>
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="p-3 bg-light rounded-3">
                    <div class="text-muted small fw-semibold">STATUTORY & TAX DEDUCTIONS</div>
                    <div class="d-flex justify-content-between mt-2">
                      <span class="small">GSIS / SSS Premium:</span>
                      <span class="fw-bold small text-danger">-₱4,410.00</span>
                    </div>
                    <div class="d-flex justify-content-between mt-1">
                      <span class="small">PhilHealth Contribution:</span>
                      <span class="fw-bold small text-danger">-₱1,225.00</span>
                    </div>
                    <div class="d-flex justify-content-between mt-1">
                      <span class="small">Pag-IBIG / HDMF:</span>
                      <span class="fw-bold small text-danger">-₱100.00</span>
                    </div>
                    <div class="d-flex justify-content-between mt-1">
                      <span class="small">Withholding Tax (TRAIN):</span>
                      <span class="fw-bold small text-danger">-₱10,160.00</span>
                    </div>
                    <div class="border-top mt-2 pt-1 d-flex justify-content-between">
                      <span class="fw-bold small">Total Deductions:</span>
                      <span class="fw-bold text-danger">-₱15,895.00</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-3 p-3 bg-success-subtle text-success-emphasis rounded-3 d-flex justify-content-between align-items-center">
                <div>
                  <div class="small fw-semibold">NET TAKE-HOME PAY (DIRECT BANK CREDIT)</div>
                  <div class="fs-4 fw-bold text-success">₱${latestPayroll ? latestPayroll.netPay.toLocaleString('en-US', {minimumFractionDigits: 2}) : '42,105.00'}</div>
                  <small class="text-muted">${employeeData.bankAccount}</small>
                </div>
                <button class="btn btn-hospital-primary" onclick="App.navigateTo('payslip')">
                  <i class="bi bi-printer"></i> View & Print Payslip
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Healthcare HMO & Insurance Benefits -->
        <div class="col-12 col-lg-5">
          <div class="card h-100">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-heart-pulse-fill text-danger fs-5"></i>
                <span class="fw-bold">My Benefits & HMO Coverage</span>
              </div>
              <button class="btn btn-sm btn-light" onclick="App.navigateTo('benefits-hmo')">View Details</button>
            </div>
            <div class="card-body">
              <div class="p-3 border rounded-3 mb-3 bg-white">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 class="fw-bold mb-1">${employeeData.hmoProvider}</h6>
                    <p class="text-muted small mb-1">${employeeData.hmoPlan}</p>
                    <span class="badge bg-success-subtle text-success">Active Policy</span>
                  </div>
                  <i class="bi bi-shield-fill-plus text-success fs-3"></i>
                </div>
                <div class="border-top mt-3 pt-2 small text-muted">
                  <div><strong>Room & Board:</strong> Suite / Private Airconditioned Room</div>
                  <div><strong>Enrolled Dependents:</strong> ${employeeData.dependentsCount} Dependents covered</div>
                </div>
              </div>

              <div class="p-3 border rounded-3 bg-light">
                <div class="fw-semibold text-dark mb-1"><i class="bi bi-shield-check text-primary me-1"></i> Group Term Life & Disability</div>
                <div class="small text-muted">₱1,000,000.00 Coverage via GSIS / DOH Hospital Healthcare Mutual Benefit Scheme.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- My Submitted Claims Table -->
        <div class="col-12">
          <div class="card">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-receipt-cutoff text-primary fs-5"></i>
                <span class="fw-bold">My Reimbursement Claims</span>
              </div>
              <button class="btn btn-sm btn-hospital-primary" onclick="ClaimsModule.showSubmitClaimModal()">
                <i class="bi bi-plus-circle"></i> Submit New Claim
              </button>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table custom-table mb-0">
                  <thead>
                    <tr>
                      <th>Claim Reference</th>
                      <th>Date Filed</th>
                      <th>Category</th>
                      <th>Official Receipt / Invoice</th>
                      <th class="text-end">Amount</th>
                      <th>Approval Status</th>
                      <th>Reimbursement</th>
                      <th class="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${userClaims.length ? userClaims.map(c => `
                      <tr>
                        <td><strong>${c.id}</strong></td>
                        <td>${c.date}</td>
                        <td><span class="badge badge-neutral-soft">${c.claimType}</span></td>
                        <td><code>${c.receiptNo}</code></td>
                        <td class="text-end fw-bold text-success">₱${c.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                        <td>
                          <span class="badge-custom ${c.status === 'Approved' ? 'badge-success-soft' : 'badge-warning-soft'}">
                            ${c.status}
                          </span>
                        </td>
                        <td><span class="badge bg-light text-dark border">${c.reimbursementStatus}</span></td>
                        <td class="text-center">
                          <button class="btn btn-sm btn-light-action" onclick="ClaimsModule.showClaimDetailsModal('${c.id}')">
                            <i class="bi bi-eye"></i> View
                          </button>
                        </td>
                      </tr>
                    `).join('') : `
                      <tr>
                        <td colspan="8" class="text-center py-4 text-muted">
                          You have no submitted claims on record. Click "+ Submit New Claim" to file an official reimbursement request.
                        </td>
                      </tr>
                    `}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
