/**
 * Claims & Reimbursement View Module
 */
const ClaimsModule = {
  render() {
    const isEmployee = App.isEmployee && App.isEmployee();
    const isHRStaff = App.isHRStaff && App.isHRStaff();
    const isHRAdmin = App.isHRAdmin && App.isHRAdmin();
    const user = HIMS_DATA.currentUser;

    const displayClaims = isEmployee 
      ? HIMS_DATA.claims.filter(c => c.employeeId === user.id || c.employeeName.includes(user.name.split(' ')[0]))
      : HIMS_DATA.claims;

    return `
      <div class="page-header">
        <div class="page-title">
          <div class="d-flex align-items-center gap-2">
            <h3>${isEmployee ? 'My Expense & Training Claims' : 'Claims & Reimbursement Management'}</h3>
            <span class="role-badge-pill ${HIMS_DATA.currentUser.badgeClass}">
              <i class="bi bi-person-badge-fill"></i> ${HIMS_DATA.currentUser.roleShort}
            </span>
          </div>
          <p>${isEmployee ? 'Submit official reimbursement requests for medical, CME training, scrubs, and travel allowances.' : 'Validate and process staff medical, CME training, scrub uniform, and hospital travel reimbursements.'}</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-hospital-primary" onclick="ClaimsModule.showSubmitClaimModal()">
            <i class="bi bi-plus-circle-fill"></i> Submit Reimbursement Claim
          </button>
        </div>
      </div>

      ${isHRStaff ? `
        <div class="alert alert-info d-flex align-items-center gap-2 mb-3">
          <i class="bi bi-info-circle-fill fs-5 text-primary"></i>
          <div>
            <strong>HR Staff Scope:</strong> You can prepare and validate receipt submissions. Claim final approval is executed by the <strong>HR Administrator / Specialist</strong>.
          </div>
        </div>
      ` : ''}

      <!-- Filters -->
      <div class="card mb-4">
        <div class="card-body p-3">
          <div class="row g-2 align-items-center">
            <div class="col-12 col-md-4">
              <input type="text" id="claimSearch" class="form-control" placeholder="Search receipt no or description..." onkeyup="ClaimsModule.filterClaims()">
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <select id="claimTypeFilter" class="form-select" onchange="ClaimsModule.filterClaims()">
                <option value="">All Claim Types</option>
                <option value="Training & CME">Training & CME</option>
                <option value="Uniform & Scrub Suits">Uniform & Scrub Suits</option>
                <option value="Travel & Transit">Travel & Transit</option>
                <option value="Meal Allowance">Meal Allowance</option>
                <option value="Medical Supplies / PPE">Medical Supplies / PPE</option>
              </select>
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <select id="claimStatusFilter" class="form-select" onchange="ClaimsModule.filterClaims()">
                <option value="">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Under Review">Under Review</option>
                <option value="Pending HR Review">Pending HR Review</option>
              </select>
            </div>
            <div class="col-12 col-md-2">
              <button class="btn btn-light-action w-100" onclick="ClaimsModule.resetFilters()">
                <i class="bi bi-arrow-counterclockwise"></i> Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Claims Table -->
      <div class="card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table custom-table mb-0" id="claimsTable">
              <thead>
                <tr>
                  <th>Claim ID & Date</th>
                  <th>Claimant / Department</th>
                  <th>Claim Category</th>
                  <th>Receipt / OR No.</th>
                  <th class="text-end">Amount</th>
                  <th>Approval Stage</th>
                  <th>Disbursement</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody id="claimsTableBody">
                ${ClaimsModule.renderClaimRows(displayClaims)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  renderClaimRows(claims) {
    if (!claims.length) {
      return `<tr><td colspan="8" class="text-center py-4 text-muted">No reimbursement claims found for this filter.</td></tr>`;
    }
    const isHRAdmin = App.isHRAdmin && App.isHRAdmin();
    const isHRStaff = App.isHRStaff && App.isHRStaff();

    return claims.map(c => `
      <tr>
        <td>
          <div class="fw-bold">${c.id}</div>
          <small class="text-muted">${c.date}</small>
        </td>
        <td>
          <div class="fw-semibold">${c.employeeName}</div>
          <small class="text-muted">${c.department}</small>
        </td>
        <td><span class="badge badge-neutral-soft">${c.claimType}</span></td>
        <td><code>${c.receiptNo}</code></td>
        <td class="text-end fw-bold text-success">₱${c.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
        <td>
          <span class="badge-custom ${c.status === 'Approved' ? 'badge-success-soft' : 'badge-warning-soft'}">
            ${c.status}
          </span>
        </td>
        <td>
          <span class="badge bg-light text-dark border">${c.reimbursementStatus}</span>
        </td>
        <td class="text-center">
          <div class="dropdown">
            <button class="btn btn-sm btn-light-action" data-bs-toggle="dropdown">
              <i class="bi bi-three-dots-vertical"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm">
              <li>
                <a class="dropdown-item" href="javascript:void(0)" onclick="ClaimsModule.showClaimDetailsModal('${c.id}')">
                  <i class="bi bi-eye text-primary me-2"></i> View Details
                </a>
              </li>
              ${isHRAdmin && c.status !== 'Approved' ? `
                <li>
                  <a class="dropdown-item text-success" href="javascript:void(0)" onclick="ClaimsModule.approveClaim('${c.id}')">
                    <i class="bi bi-check-circle text-success me-2"></i> Approve Claim
                  </a>
                </li>
                <li>
                  <a class="dropdown-item text-danger" href="javascript:void(0)" onclick="ClaimsModule.rejectClaim('${c.id}')">
                    <i class="bi bi-x-circle text-danger me-2"></i> Reject Claim
                  </a>
                </li>
              ` : ''}
              ${isHRStaff && c.status !== 'Approved' ? `
                <li>
                  <a class="dropdown-item text-info" href="javascript:void(0)" onclick="App.showToast('Claim documents validated and endorsed to HR Administrator.', 'info')">
                    <i class="bi bi-check2 text-info me-2"></i> Endorse to HR Admin
                  </a>
                </li>
              ` : ''}
            </ul>
          </div>
        </td>
      </tr>
    `).join('');
  },

  filterClaims() {
    const search = (document.getElementById('claimSearch')?.value || '').toLowerCase();
    const type = document.getElementById('claimTypeFilter')?.value || '';
    const status = document.getElementById('claimStatusFilter')?.value || '';

    const filtered = HIMS_DATA.claims.filter(c => {
      const matchSearch = !search || c.employeeName.toLowerCase().includes(search) || c.receiptNo.toLowerCase().includes(search);
      const matchType = !type || c.claimType === type;
      const matchStatus = !status || c.status === status;
      return matchSearch && matchType && matchStatus;
    });

    const tbody = document.getElementById('claimsTableBody');
    if (tbody) tbody.innerHTML = ClaimsModule.renderClaimRows(filtered);
  },

  resetFilters() {
    if (document.getElementById('claimSearch')) document.getElementById('claimSearch').value = '';
    if (document.getElementById('claimTypeFilter')) document.getElementById('claimTypeFilter').value = '';
    if (document.getElementById('claimStatusFilter')) document.getElementById('claimStatusFilter').value = '';
    ClaimsModule.filterClaims();
  },

  showSubmitClaimModal() {
    const isEmployee = App.isEmployee && App.isEmployee();
    const currentUser = HIMS_DATA.currentUser;

    App.showGenericModal({
      title: "Submit New Reimbursement Claim",
      body: `
        <div class="mb-3">
          <label class="form-label">Hospital Employee / Claimant</label>
          ${isEmployee ? `
            <input type="text" class="form-control bg-light" value="${currentUser.name} (${currentUser.department})" readonly>
            <input type="hidden" id="newClaimEmp" value="${currentUser.id}">
          ` : `
            <select id="newClaimEmp" class="form-select">
              ${HIMS_DATA.employees.map(e => `<option value="${e.id}">${e.name} (${e.department})</option>`).join('')}
            </select>
          `}
        </div>
        <div class="row g-2 mb-3">
          <div class="col-6">
            <label class="form-label">Claim Type</label>
            <select id="newClaimType" class="form-select">
              <option>Training & CME</option>
              <option>Uniform & Scrub Suits</option>
              <option>Travel & Transit</option>
              <option>Meal Allowance</option>
              <option>Medical Supplies / PPE</option>
            </select>
          </div>
          <div class="col-6">
            <label class="form-label">Amount (₱)</label>
            <input type="number" id="newClaimAmount" class="form-control" placeholder="3500.00" value="3500">
          </div>
        </div>
        <div class="row g-2 mb-3">
          <div class="col-6">
            <label class="form-label">Official Receipt (OR) / Invoice No.</label>
            <input type="text" id="newClaimOr" class="form-control" placeholder="OR-991823" value="OR-${Math.floor(Math.random() * 899999 + 100000)}">
          </div>
          <div class="col-6">
            <label class="form-label">Receipt Date</label>
            <input type="date" id="newClaimDate" class="form-control" value="2026-08-15">
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Expense Description & Justification</label>
          <textarea id="newClaimDesc" class="form-control" rows="2" placeholder="State hospital business purpose...">Hospital CME Workshop / Surgical Supply Official Reimbursement Request</textarea>
        </div>
      `,
      confirmText: "Submit Reimbursement Claim",
      onConfirm: () => {
        const empId = document.getElementById('newClaimEmp')?.value || currentUser.id;
        const emp = HIMS_DATA.employees.find(e => e.id === empId) || (isEmployee ? {
          id: currentUser.id,
          name: currentUser.name,
          department: currentUser.department
        } : HIMS_DATA.employees[0]);

        const type = document.getElementById('newClaimType')?.value || 'Training & CME';
        const amount = parseFloat(document.getElementById('newClaimAmount')?.value || 3500);
        const orNo = document.getElementById('newClaimOr')?.value || 'OR-' + Math.floor(Math.random() * 899999 + 100000);
        const desc = document.getElementById('newClaimDesc')?.value || 'Staff expense reimbursement';

        const newClaim = {
          id: `CLM-2026-09${HIMS_DATA.claims.length + 1}`,
          employeeId: emp.id,
          employeeName: emp.name,
          department: emp.department,
          claimType: type,
          amount: amount,
          receiptNo: orNo,
          date: '2026-08-15',
          description: desc,
          status: 'Pending HR Review',
          approvalStage: 'HR Initial Validation',
          reimbursementStatus: 'Queued'
        };

        HIMS_DATA.claims.unshift(newClaim);
        App.showToast(`Reimbursement claim ${newClaim.id} (₱${amount.toFixed(2)}) submitted successfully.`, 'success');
        App.navigateTo('claims');
      }
    });
  },

  showClaimDetailsModal(claimId) {
    const claim = HIMS_DATA.claims.find(c => c.id === claimId);
    if (!claim) return;
    const isHRAdmin = App.isHRAdmin && App.isHRAdmin();
    const canApprove = isHRAdmin && claim.status !== 'Approved';

    App.showGenericModal({
      title: `Reimbursement Claim: ${claim.id}`,
      body: `
        <div class="p-3 bg-light rounded-3 border mb-3">
          <div class="row g-2 small">
            <div class="col-6"><strong>Claimant:</strong> ${claim.employeeName}</div>
            <div class="col-6"><strong>Department:</strong> ${claim.department}</div>
            <div class="col-6"><strong>Category:</strong> ${claim.claimType}</div>
            <div class="col-6"><strong>OR Number:</strong> ${claim.receiptNo}</div>
            <div class="col-6"><strong>Date:</strong> ${claim.date}</div>
            <div class="col-6"><strong>Amount:</strong> <span class="text-success fw-bold">₱${claim.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</span></div>
            <div class="col-6"><strong>Status:</strong> <span class="badge ${claim.status === 'Approved' ? 'bg-success' : 'bg-warning text-dark'}">${claim.status}</span></div>
            <div class="col-6"><strong>Disbursement:</strong> <span class="badge bg-light text-dark border">${claim.reimbursementStatus}</span></div>
          </div>
        </div>
        <div class="mb-2">
          <strong>Description & Purpose:</strong>
          <p class="text-muted small mb-0">${claim.description}</p>
        </div>
      `,
      cancelText: "Close",
      confirmText: "Approve Claim",
      confirmClass: "btn-hospital-primary",
      showConfirm: canApprove,
      onConfirm: canApprove ? () => {
        ClaimsModule.approveClaim(claim.id);
      } : null
    });
  },

  approveClaim(claimId) {
    if (!App.isHRAdmin || !App.isHRAdmin()) {
      App.showToast("Permission Denied: Only HR Administrator / Specialist can approve claims.", "danger");
      return;
    }
    const claim = HIMS_DATA.claims.find(c => c.id === claimId);
    if (claim) {
      claim.status = 'Approved';
      claim.reimbursementStatus = 'Pending Next Payout';
      App.showToast(`Claim ${claimId} approved for payout of ₱${claim.amount.toFixed(2)}.`, 'success');
      App.navigateTo('claims');
    }
  },

  rejectClaim(claimId) {
    if (!App.isHRAdmin || !App.isHRAdmin()) {
      App.showToast("Permission Denied: Only HR Administrator / Specialist can reject claims.", "danger");
      return;
    }
    const claim = HIMS_DATA.claims.find(c => c.id === claimId);
    if (claim) {
      claim.status = 'Rejected';
      claim.reimbursementStatus = 'Disallowed';
      App.showToast(`Claim ${claimId} has been rejected.`, 'warning');
      App.navigateTo('claims');
    }
  }
};
