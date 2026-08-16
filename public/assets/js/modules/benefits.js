/**
 * Benefits Management View Module
 */
const BenefitsModule = {
  render(subSection = 'hmo') {
    const isEmployee = App.isEmployee && App.isEmployee();
    const isHRAdmin = App.isHRAdmin && App.isHRAdmin();
    const user = HIMS_DATA.currentUser;

    return `
      <div class="page-header">
        <div class="page-title">
          <div class="d-flex align-items-center gap-2">
            <h3>${isEmployee ? 'My Hospital Healthcare & Benefits Coverage' : 'Hospital Benefits & Healthcare Management'}</h3>
            <span class="role-badge-pill ${HIMS_DATA.currentUser.badgeClass}">
              <i class="bi bi-heart-pulse-fill"></i> ${HIMS_DATA.currentUser.roleShort}
            </span>
          </div>
          <p>${isEmployee ? 'View your active HMO corporate tier, covered dependents, hospital allowances, and group insurance benefits.' : 'HMO Corporate Plans, Executive Health Packages, Employee Dependents, and Group Term Insurance.'}</p>
        </div>
        ${!isEmployee ? `
          <div>
            <button class="btn btn-hospital-primary" onclick="BenefitsModule.showAddModal('${subSection}')">
              <i class="bi bi-plus-lg"></i> Add Plan / Record
            </button>
          </div>
        ` : ''}
      </div>

      ${isEmployee ? `
        <!-- Employee Personal HMO Summary Card -->
        <div class="card mb-4 border-success bg-white shadow-sm">
          <div class="card-body p-4">
            <div class="row align-items-center">
              <div class="col-md-8">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <span class="badge bg-success">PRIMARY POLICYHOLDER</span>
                  <span class="badge bg-light text-dark border">DJNRMHS Hospital Plantilla Tier</span>
                </div>
                <h4 class="fw-bold text-dark mb-1">Maxicare Platinum Executive Care (₱300,000 MBL)</h4>
                <div class="text-muted small">
                  Coverage ID: <strong>MAXI-DJNRMHS-${user.id}</strong> &bull; Room & Board: <strong>Suite / Private Airconditioned Room</strong> &bull; Pre-existing condition coverage: 100%
                </div>
              </div>
              <div class="col-md-4 text-md-end mt-3 mt-md-0">
                <button class="btn btn-hospital-outline" onclick="App.showToast('Digital HMO Medical Card downloaded to your device.', 'success')">
                  <i class="bi bi-credit-card-2-front"></i> Download Digital HMO Card
                </button>
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Navigation Tabs -->
      <ul class="nav nav-tabs mb-4">
        <li class="nav-item">
          <a class="nav-link ${subSection === 'hmo' ? 'active text-success fw-bold' : 'text-muted'}" href="javascript:void(0)" onclick="App.navigateTo('benefits-hmo')">
            <i class="bi bi-heart-pulse me-1"></i> ${isEmployee ? 'My HMO Plan' : 'HMO Providers'}
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${subSection === 'utilization' ? 'active text-success fw-bold' : 'text-muted'}" href="javascript:void(0)" onclick="App.navigateTo('benefits-utilization')">
            <i class="bi bi-graph-up-arrow me-1"></i> ${isEmployee ? 'My Utilization History' : 'Utilization Logs'}
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${subSection === 'dependents' ? 'active text-success fw-bold' : 'text-muted'}" href="javascript:void(0)" onclick="App.navigateTo('benefits-dependents')">
            <i class="bi bi-people me-1"></i> ${isEmployee ? 'My Covered Dependents' : 'Dependents'}
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${subSection === 'insurance' ? 'active text-success fw-bold' : 'text-muted'}" href="javascript:void(0)" onclick="App.navigateTo('benefits-insurance')">
            <i class="bi bi-shield-check me-1"></i> ${isEmployee ? 'My Life & Malpractice Cover' : 'Insurance Plans'}
          </a>
        </li>
      </ul>

      <!-- SubSection Content -->
      ${BenefitsModule.renderSubSection(subSection)}
    `;
  },

  renderSubSection(subSection) {
    if (subSection === 'hmo') {
      return `
        <div class="card">
          <div class="card-header bg-white">
            <span class="fw-bold">Active Corporate HMO Healthcare Plans</span>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table custom-table mb-0">
                <thead>
                  <tr>
                    <th>HMO Provider</th>
                    <th>Plan Name</th>
                    <th>Maximum Benefit Limit (MBL)</th>
                    <th>Room & Board Entitlement</th>
                    <th>Enrolled Members</th>
                    <th>Status</th>
                    <th class="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${HIMS_DATA.benefits.hmoProviders.map(h => `
                    <tr>
                      <td class="fw-bold text-dark">${h.name}</td>
                      <td>${h.plan}</td>
                      <td class="fw-semibold text-success">${h.maxBenefitLimit}</td>
                      <td><span class="badge badge-neutral-soft">${h.roomBoard}</span></td>
                      <td>${h.coveredMembers} Hospital Staff</td>
                      <td><span class="badge badge-success-soft">${h.status}</span></td>
                      <td class="text-center">
                        <button class="btn btn-sm btn-light-action" onclick="App.showToast('Managing ${h.name}', 'info')">
                          <i class="bi bi-gear"></i> Manage
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
    } else if (subSection === 'utilization') {
      return `
        <div class="card">
          <div class="card-header bg-white">
            <span class="fw-bold">HMO & Healthcare Benefit Utilization Ledger</span>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table custom-table mb-0">
                <thead>
                  <tr>
                    <th>Claim / Log ID</th>
                    <th>Employee Name</th>
                    <th>HMO Provider</th>
                    <th>Medical Service Rendered</th>
                    <th class="text-end">Claim Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${HIMS_DATA.benefits.utilizationLogs.map(u => `
                    <tr>
                      <td class="fw-bold">${u.id}</td>
                      <td>${u.employeeName}</td>
                      <td><small class="text-muted">${u.provider}</small></td>
                      <td>${u.benefitUsed}</td>
                      <td class="text-end fw-semibold text-success">₱${u.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                      <td>${u.date}</td>
                      <td><span class="badge badge-success-soft">${u.status}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    } else if (subSection === 'dependents') {
      return `
        <div class="card">
          <div class="card-header bg-white">
            <span class="fw-bold">Registered Employee Dependents for HMO Coverage</span>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table custom-table mb-0">
                <thead>
                  <tr>
                    <th>Principal Employee</th>
                    <th>Department</th>
                    <th>Enrolled Dependents</th>
                    <th>HMO Coverage Tier</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${HIMS_DATA.employees.filter(e => e.dependentsCount > 0).map(e => `
                    <tr>
                      <td class="fw-bold">${e.name}</td>
                      <td>${e.department}</td>
                      <td><span class="badge bg-light text-dark border">${e.dependentsCount} Dependents Registered</span></td>
                      <td>${e.hmoPlan}</td>
                      <td><span class="badge badge-success-soft">Active Coverage</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="card">
          <div class="card-header bg-white">
            <span class="fw-bold">Group Life, Accident, & Medical Malpractice Insurance</span>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table custom-table mb-0">
                <thead>
                  <tr>
                    <th>Insurance Policy Type</th>
                    <th>Underwriter / Provider</th>
                    <th>Coverage Amount</th>
                    <th>Eligible Personnel</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${HIMS_DATA.benefits.insurancePlans.map(ins => `
                    <tr>
                      <td class="fw-bold">${ins.type}</td>
                      <td>${ins.provider}</td>
                      <td class="fw-bold text-success">${ins.coverage}</td>
                      <td><small class="text-muted">${ins.eligibility}</small></td>
                      <td><span class="badge badge-success-soft">${ins.status}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }
  },

  showAddModal(subSection) {
    App.showGenericModal({
      title: "Add Healthcare / Insurance Plan",
      body: `
        <div class="mb-3">
          <label class="form-label">Provider Name</label>
          <input type="text" class="form-control" placeholder="e.g. PhilCare Executive">
        </div>
        <div class="mb-3">
          <label class="form-label">Coverage Limit (₱)</label>
          <input type="text" class="form-control" placeholder="₱200,000 / year">
        </div>
      `,
      confirmText: "Save Plan",
      onConfirm: () => {
        App.showToast("Benefits record saved successfully.", "success");
      }
    });
  }
};
