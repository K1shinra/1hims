/**
 * AI-Assisted Payroll Anomaly Detection Module
 * Primary Innovation of HIMS Payroll Module
 */
const AiAnomalyModule = {
  // 1. AI Dashboard
  renderDashboard() {
    const totalAnomalies = HIMS_DATA.aiAnomalies.length;
    const newAnomalies = HIMS_DATA.aiAnomalies.filter(a => a.status === 'New').length;
    const highRisk = HIMS_DATA.aiAnomalies.filter(a => a.riskLevel === 'High').length;
    const resolved = HIMS_DATA.aiAnomalies.filter(a => a.status === 'Resolved').length;

    return `
      <div class="page-header">
        <div class="page-title">
          <div class="d-flex align-items-center gap-2">
            <h3>AI-Assisted Payroll Anomaly Detection Engine</h3>
            <span class="badge badge-ai"><i class="bi bi-cpu-fill me-1"></i> Neural Auditing Model</span>
          </div>
          <p>Machine Learning pattern recognition for biometric shift variance, ghost employee detection, and statutory calculation discrepancies.</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-hospital-primary" id="btnRunAiScan" onclick="AiAnomalyModule.triggerLiveAiScan()">
            <i class="bi bi-play-circle-fill"></i> Trigger Full AI Anomaly Scan
          </button>
        </div>
      </div>

      <!-- AI Scanning Progress Bar (hidden by default) -->
      <div id="aiScanProgressContainer" class="card mb-4 border-success d-none shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="fw-bold text-success d-flex align-items-center gap-2">
              <div class="spinner-border spinner-border-sm text-success" role="status"></div>
              <span id="aiScanStatusText">Initializing Neural Biometric & Deduction Scanner...</span>
            </div>
            <span class="badge bg-success" id="aiScanPercentBadge">0%</span>
          </div>
          <div class="progress" style="height: 10px;">
            <div id="aiScanProgressBar" class="progress-bar progress-bar-striped progress-bar-animated bg-success" style="width: 0%"></div>
          </div>
          <div class="mt-2 text-muted small" id="aiScanLogText">Cross-referencing 24 plantilla items against HIMS shift schedules and DOH guidelines...</div>
        </div>
      </div>

      <!-- AI Metrics Banner -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-sm-6 col-xl-3">
          <div class="stat-card stat-red">
            <div>
              <div class="stat-title">High Risk Flags</div>
              <div class="stat-value text-danger">${highRisk}</div>
              <div class="stat-subtext text-danger"><i class="bi bi-shield-fill-x"></i> Requires Immediate Action</div>
            </div>
            <div class="stat-icon-wrapper stat-icon-red">
              <i class="bi bi-shield-slash-fill"></i>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-xl-3">
          <div class="stat-card stat-amber">
            <div>
              <div class="stat-title">Unreviewed Anomalies</div>
              <div class="stat-value text-warning">${newAnomalies}</div>
              <div class="stat-subtext text-muted"><i class="bi bi-bell-fill"></i> Batch PP-2026-08A</div>
            </div>
            <div class="stat-icon-wrapper stat-icon-amber">
              <i class="bi bi-exclamation-triangle-fill"></i>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-xl-3">
          <div class="stat-card">
            <div>
              <div class="stat-title">Resolved & Cleared</div>
              <div class="stat-value text-success">${resolved}</div>
              <div class="stat-subtext text-success"><i class="bi bi-check2-all"></i> Audit trail verified</div>
            </div>
            <div class="stat-icon-wrapper stat-icon-green">
              <i class="bi bi-shield-check"></i>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-xl-3">
          <div class="stat-card stat-blue">
            <div>
              <div class="stat-title">Model Confidence</div>
              <div class="stat-value text-primary">96.8%</div>
              <div class="stat-subtext text-muted"><i class="bi bi-speedometer2"></i> False positive rate &lt; 1.2%</div>
            </div>
            <div class="stat-icon-wrapper stat-icon-blue">
              <i class="bi bi-stars"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Anomaly Table Section -->
      <div class="card">
        <div class="card-header bg-white d-flex justify-content-between align-items-center">
          <span class="fw-bold"><i class="bi bi-shield-alert text-danger me-2"></i>Active AI Detected Anomaly Ledger</span>
          <div class="d-flex gap-2">
            <select id="aiRiskFilter" class="form-select form-select-sm" style="width: 140px;" onchange="AiAnomalyModule.filterAnomalies()">
              <option value="">All Risk Levels</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
            <select id="aiStatusFilter" class="form-select form-select-sm" style="width: 140px;" onchange="AiAnomalyModule.filterAnomalies()">
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Under Review">Under Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Dismissed">Dismissed</option>
            </select>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table custom-table mb-0" id="aiAnomalyTable">
              <thead>
                <tr>
                  <th>Anomaly ID & Period</th>
                  <th>Flagged Employee & Department</th>
                  <th>Anomaly Type</th>
                  <th>Risk & Confidence</th>
                  <th>Description / Pattern Detected</th>
                  <th>Status</th>
                  <th class="text-center">Action</th>
                </tr>
              </thead>
              <tbody id="aiAnomalyTableBody">
                ${AiAnomalyModule.renderAnomalyRows(HIMS_DATA.aiAnomalies)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  renderAnomalyRows(anomalies) {
    if (!anomalies.length) {
      return `<tr><td colspan="7" class="text-center py-4 text-muted">No anomalies match the selected filters.</td></tr>`;
    }
    return anomalies.map(a => `
      <tr>
        <td>
          <div class="fw-bold">${a.id}</div>
          <small class="text-muted"><i class="bi bi-calendar2 me-1"></i>${a.periodId}</small>
        </td>
        <td>
          <div class="fw-bold text-dark">${a.employeeName}</div>
          <small class="text-muted">${a.department}</small>
        </td>
        <td>
          <span class="badge bg-light text-dark border fw-semibold">${a.anomalyType}</span>
        </td>
        <td>
          <div class="badge-custom ${a.riskLevel === 'High' ? 'badge-danger-soft' : (a.riskLevel === 'Medium' ? 'badge-warning-soft' : 'badge-info-soft')} mb-1">
            <i class="bi bi-shield-fill-exclamation"></i> ${a.riskLevel} Risk
          </div>
          <div class="small text-muted">${a.confidenceScore}% Conf.</div>
        </td>
        <td style="max-width: 320px;">
          <div class="small text-dark fw-semibold text-truncate" title="${a.description}">${a.description}</div>
          <small class="text-muted text-truncate d-block" title="${a.recommendation}"><i class="bi bi-lightbulb text-warning me-1"></i>${a.recommendation}</small>
        </td>
        <td>
          <span class="badge-custom ${a.status === 'Resolved' ? 'badge-success-soft' : (a.status === 'New' ? 'badge-danger-soft' : 'badge-neutral-soft')}">
            ${a.status}
          </span>
        </td>
        <td class="text-center">
          <button class="btn btn-sm btn-hospital-outline" onclick="App.showAnomalyModal('${a.id}')">
            <i class="bi bi-search"></i> Review
          </button>
        </td>
      </tr>
    `).join('');
  },

  filterAnomalies() {
    const risk = document.getElementById('aiRiskFilter')?.value || '';
    const status = document.getElementById('aiStatusFilter')?.value || '';

    const filtered = HIMS_DATA.aiAnomalies.filter(a => {
      const matchRisk = !risk || a.riskLevel === risk;
      const matchStatus = !status || a.status === status;
      return matchRisk && matchStatus;
    });

    const tbody = document.getElementById('aiAnomalyTableBody');
    if (tbody) tbody.innerHTML = AiAnomalyModule.renderAnomalyRows(filtered);
  },

  triggerLiveAiScan() {
    const container = document.getElementById('aiScanProgressContainer');
    const bar = document.getElementById('aiScanProgressBar');
    const badge = document.getElementById('aiScanPercentBadge');
    const statusText = document.getElementById('aiScanStatusText');
    const logText = document.getElementById('aiScanLogText');
    const btn = document.getElementById('btnRunAiScan');

    if (!container || !bar) return;

    container.classList.remove('d-none');
    btn.setAttribute('disabled', 'true');
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Scanning...`;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      bar.style.width = progress + '%';
      badge.innerText = progress + '%';

      if (progress === 20) {
        statusText.innerText = "Extracting biometric clock-in logs and shift rotations...";
        logText.innerText = "Analyzed 1,420 biometric RFID scans across ER, ICU, and OR wards.";
      } else if (progress === 60) {
        statusText.innerText = "Auditing statutory contribution brackets & allowance ceilings...";
        logText.innerText = "Validating SSS 2026 MSC limits, PhilHealth 5% rate, and de minimis non-taxable lines.";
      } else if (progress === 80) {
        statusText.innerText = "Executing cross-period salary variance & ghost employee algorithms...";
        logText.innerText = "Cross-referencing separation clearances and plantilla NOSA documents.";
      } else if (progress >= 100) {
        clearInterval(interval);
        statusText.innerText = "AI Scan Completed: 4 Anomalies Flagged.";
        logText.innerText = "Scan complete. Audit summary report generated.";
        btn.removeAttribute('disabled');
        btn.innerHTML = `<i class="bi bi-play-circle-fill"></i> Trigger Full AI Anomaly Scan`;
        App.showToast("AI Anomaly Scan completed: 4 discrepancies detected.", "warning");
      }
    }, 450);
  },

  showAnomalyDetailModal(anomId) {
    const a = HIMS_DATA.aiAnomalies.find(item => item.id === anomId);
    if (!a) return;

    App.showGenericModal({
      title: `AI Anomaly Investigation: ${a.id}`,
      body: `
        <div class="alert ${a.riskLevel === 'High' ? 'alert-danger' : 'alert-warning'} d-flex align-items-center gap-2 mb-3">
          <i class="bi bi-shield-exclamation fs-4"></i>
          <div>
            <strong>${a.riskLevel.toUpperCase()} RISK ANOMALY DETECTED:</strong> ${a.anomalyType}
            <div class="small">Algorithm Model Confidence Score: <strong>${a.confidenceScore}%</strong></div>
          </div>
        </div>

        <div class="p-3 bg-light rounded-3 border mb-3 small">
          <div class="row g-2">
            <div class="col-6"><strong>Employee:</strong> ${a.employeeName}</div>
            <div class="col-6"><strong>Department:</strong> ${a.department}</div>
            <div class="col-6"><strong>Period:</strong> ${a.periodId}</div>
            <div class="col-6"><strong>Estimated Financial Variance:</strong> <span class="text-danger fw-bold">₱${a.amountDiscrepancy.toLocaleString('en-US', {minimumFractionDigits: 2})}</span></div>
            <div class="col-12"><strong>Timestamp of Detection:</strong> ${a.timestamp}</div>
          </div>
        </div>

        <div class="mb-3">
          <h6 class="fw-bold text-dark mb-1">Pattern Analysis:</h6>
          <p class="small text-muted mb-0">${a.detectedPattern}</p>
        </div>

        <div class="p-3 bg-white border border-success rounded-3 mb-3">
          <h6 class="fw-bold text-success mb-1"><i class="bi bi-check2-circle me-1"></i> AI Recommended Corrective Action:</h6>
          <p class="small mb-0 text-dark">${a.recommendation}</p>
        </div>

        <div class="mb-2">
          <label class="form-label">HR Auditor Resolution Notes</label>
          <textarea id="anomAuditNotes" class="form-control" rows="2" placeholder="Record reason for resolution or dismissal..."></textarea>
        </div>
      `,
      confirmText: App.isHRAdmin && App.isHRAdmin() ? "Apply Decision & Mark as Resolved" : "Endorse Anomaly to HR Admin",
      confirmClass: App.isHRAdmin && App.isHRAdmin() ? "btn-hospital-primary" : "btn-hospital-outline",
      onConfirm: () => {
        if (App.isHRAdmin && App.isHRAdmin()) {
          a.status = "Resolved";
          App.showToast(`Anomaly ${a.id} marked as RESOLVED by HR Administrator. Audit trail updated.`, 'success');
        } else {
          a.status = "Under Review";
          App.showToast(`Audit notes added for ${a.id} and endorsed to HR Administrator for decision sign-off.`, 'info');
        }
        App.navigateTo('ai-anomalies');
      }
    });
  }
};
