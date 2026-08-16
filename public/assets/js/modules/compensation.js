/**
 * Compensation Planning View Module
 */
const CompensationModule = {
  render(subSection = 'salary-grade') {
    return `
      <div class="page-header">
        <div class="page-title">
          <h3>Compensation Planning & Salary Structure</h3>
          <p>Philippine Hospital Salary Grades, Plantilla Salary Matrix, Allowances, and Statutory Bonuses.</p>
        </div>
        <div>
          <button class="btn btn-hospital-primary" onclick="CompensationModule.showAddModal('${subSection}')">
            <i class="bi bi-plus-lg"></i> Add New Item
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <ul class="nav nav-tabs mb-4">
        <li class="nav-item">
          <a class="nav-link ${subSection === 'salary-grade' ? 'active text-success fw-bold' : 'text-muted'}" href="javascript:void(0)" onclick="App.navigateTo('compensation-grade')">
            <i class="bi bi-ladder me-1"></i> Salary Grades
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${subSection === 'matrix' ? 'active text-success fw-bold' : 'text-muted'}" href="javascript:void(0)" onclick="App.navigateTo('compensation-matrix')">
            <i class="bi bi-grid-3x3-gap me-1"></i> Position Matrix
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${subSection === 'allowances' ? 'active text-success fw-bold' : 'text-muted'}" href="javascript:void(0)" onclick="App.navigateTo('compensation-allowances')">
            <i class="bi bi-cash-coin me-1"></i> Allowances
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${subSection === 'incentives' ? 'active text-success fw-bold' : 'text-muted'}" href="javascript:void(0)" onclick="App.navigateTo('compensation-incentives')">
            <i class="bi bi-award me-1"></i> Incentives & Bonuses
          </a>
        </li>
      </ul>

      <!-- Tab Content Area -->
      ${CompensationModule.renderSubSection(subSection)}
    `;
  },

  renderSubSection(subSection) {
    if (subSection === 'salary-grade' || subSection === 'salary-structure') {
      return `
        <div class="card">
          <div class="card-header bg-white d-flex justify-content-between align-items-center">
            <span class="fw-bold">Hospital Plantilla Salary Grades (DOH / Civil Service Aligned)</span>
            <span class="badge badge-neutral-soft">FY 2026 Table</span>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table custom-table mb-0">
                <thead>
                  <tr>
                    <th>Salary Grade</th>
                    <th>Representative Positions</th>
                    <th class="text-end">Step 1 (Min)</th>
                    <th class="text-end">Step 3</th>
                    <th class="text-end">Step 5 (Max)</th>
                    <th>Magna Carta Hazard Tier</th>
                    <th class="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${HIMS_DATA.compensation.salaryGrades.map(sg => `
                    <tr>
                      <td class="fw-bold text-success">${sg.grade}</td>
                      <td>${sg.positionTitle}</td>
                      <td class="text-end">₱${sg.minSalary.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                      <td class="text-end">₱${sg.stepIncrements[2].toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                      <td class="text-end fw-semibold">₱${sg.maxSalary.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                      <td><span class="badge badge-neutral-soft">${sg.hazardTier}</span></td>
                      <td class="text-center">
                        <button class="btn btn-sm btn-light-action" onclick="App.showToast('Editing ${sg.grade}', 'info')">
                          <i class="bi bi-pencil-square"></i> Edit
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
    } else if (subSection === 'matrix') {
      return `
        <div class="card">
          <div class="card-header bg-white">
            <span class="fw-bold">Hospital Position-to-Salary Grade Mapping</span>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table custom-table mb-0">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Position Title</th>
                    <th>Salary Grade</th>
                    <th>Monthly Base Range</th>
                    <th>Hazard Pay Tier</th>
                  </tr>
                </thead>
                <tbody>
                  ${HIMS_DATA.employees.map(e => `
                    <tr>
                      <td>${e.department}</td>
                      <td class="fw-bold">${e.position}</td>
                      <td><span class="badge bg-light text-dark border">${e.salaryGrade} Step ${e.step}</span></td>
                      <td class="fw-semibold">₱${e.monthlyRate.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                      <td>
                        ${e.hazardPayEligible 
                          ? `<span class="badge badge-success-soft"><i class="bi bi-shield-check me-1"></i>Eligible (₱${e.hazardRate}/mo)</span>` 
                          : `<span class="badge badge-neutral-soft">Non-clinical</span>`}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    } else if (subSection === 'allowances') {
      return `
        <div class="card">
          <div class="card-header bg-white">
            <span class="fw-bold">Standard Hospital Allowances & Subsidies</span>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table custom-table mb-0">
                <thead>
                  <tr>
                    <th>Allowance Name</th>
                    <th>Amount</th>
                    <th>Frequency</th>
                    <th>Tax Exemption Status</th>
                    <th>Eligible Personnel</th>
                    <th class="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${HIMS_DATA.compensation.allowances.map(a => `
                    <tr>
                      <td class="fw-bold">${a.name}</td>
                      <td class="fw-bold text-success">₱${a.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                      <td>${a.frequency}</td>
                      <td>
                        ${a.taxExempt 
                          ? `<span class="badge badge-success-soft"><i class="bi bi-check2"></i> Tax-Exempt De Minimis</span>` 
                          : `<span class="badge badge-warning-soft">Taxable Allowance</span>`}
                      </td>
                      <td><small class="text-muted">${a.eligibility}</small></td>
                      <td class="text-center">
                        <button class="btn btn-sm btn-light-action" onclick="App.showToast('Updated ${a.name}', 'info')">
                          <i class="bi bi-pencil-square"></i> Edit
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
    } else {
      return `
        <div class="card">
          <div class="card-header bg-white">
            <span class="fw-bold">Incentives & Performance Bonus Schedules</span>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table custom-table mb-0">
                <thead>
                  <tr>
                    <th>Incentive Program</th>
                    <th>Computation Rate</th>
                    <th>Qualifying Condition</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${HIMS_DATA.compensation.incentives.map(inc => `
                    <tr>
                      <td class="fw-bold">${inc.name}</td>
                      <td class="fw-bold text-primary">${inc.rate}</td>
                      <td><small class="text-muted">${inc.condition}</small></td>
                      <td><span class="badge badge-success-soft">${inc.status}</span></td>
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
      title: `Add New Compensation Item (${subSection})`,
      body: `
        <div class="mb-3">
          <label class="form-label">Item / Position / Grade Name</label>
          <input type="text" class="form-control" placeholder="e.g. Specialty Area Subsidy">
        </div>
        <div class="row g-2 mb-3">
          <div class="col-6">
            <label class="form-label">Base Rate / Amount (₱)</label>
            <input type="number" class="form-control" placeholder="5000">
          </div>
          <div class="col-6">
            <label class="form-label">Category</label>
            <select class="form-select">
              <option>Clinical Allowance</option>
              <option>Magna Carta Hazard</option>
              <option>Annual Bonus</option>
            </select>
          </div>
        </div>
      `,
      confirmText: "Save Item",
      onConfirm: () => {
        App.showToast("New compensation item saved successfully.", "success");
      }
    });
  }
};
