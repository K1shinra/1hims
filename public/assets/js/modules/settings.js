/**
 * Settings & User Profile Module
 */
const SettingsModule = {
  // 1. User Profile
  renderProfile() {
    const u = HIMS_DATA.currentUser;
    return `
      <div class="page-header">
        <div class="page-title">
          <h3>User Profile & Account Management</h3>
          <p>Manage your hospital HR specialist credentials, contact info, and security credentials.</p>
        </div>
      </div>

      <div class="row g-4">
        <!-- Profile Card -->
        <div class="col-12 col-md-4">
          <div class="card text-center p-4">
            <div class="mx-auto mb-3" style="width: 80px; height: 80px; border-radius: 50%; background: #e8f5f0; color: #0d6e4f; font-size: 2rem; display: flex; align-items: center; justify-content: center; font-weight: 700; border: 3px solid #0d6e4f;">
              ${u.avatar}
            </div>
            <h5 class="fw-bold mb-1">${u.name}</h5>
            <p class="text-muted small mb-2">${u.role}</p>
            <span class="badge badge-success-soft mx-auto mb-3">Plantilla Plantilla Active (HIMS Verified)</span>
            <div class="border-top pt-3 text-start small">
              <div class="mb-2"><strong>Employee ID:</strong> ${u.id}</div>
              <div class="mb-2"><strong>Department:</strong> ${u.department}</div>
              <div class="mb-2"><strong>Last Terminal Login:</strong> <br><span class="text-muted">${u.lastLogin}</span></div>
            </div>
          </div>
        </div>

        <!-- Edit Profile & Change Password -->
        <div class="col-12 col-md-8">
          <div class="card mb-4">
            <div class="card-header bg-white">
              <span class="fw-bold">Profile Details</span>
            </div>
            <div class="card-body">
              <form onsubmit="event.preventDefault(); App.showToast('Profile information updated successfully.', 'success');">
                <div class="row g-3 mb-3">
                  <div class="col-6">
                    <label class="form-label">Full Legal Name</label>
                    <input type="text" class="form-control" value="${u.name}">
                  </div>
                  <div class="col-6">
                    <label class="form-label">Official Email</label>
                    <input type="email" class="form-control" value="${u.email}">
                  </div>
                </div>
                <div class="row g-3 mb-3">
                  <div class="col-6">
                    <label class="form-label">Hospital Department</label>
                    <input type="text" class="form-control" value="${u.department}" readonly>
                  </div>
                  <div class="col-6">
                    <label class="form-label">Contact Mobile</label>
                    <input type="text" class="form-control" value="${u.phone}">
                  </div>
                </div>
                <div class="text-end">
                  <button type="submit" class="btn btn-hospital-primary">Save Profile Changes</button>
                </div>
              </form>
            </div>
          </div>

          <!-- Change Password Card -->
          <div class="card">
            <div class="card-header bg-white">
              <span class="fw-bold">Change Password (Frontend Security Simulation)</span>
            </div>
            <div class="card-body">
              <form onsubmit="event.preventDefault(); App.showToast('Password changed successfully.', 'success');">
                <div class="row g-3 mb-3">
                  <div class="col-md-4">
                    <label class="form-label">Current Password</label>
                    <input type="password" class="form-control" value="********">
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">New Password</label>
                    <input type="password" class="form-control" placeholder="Min. 8 characters">
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Confirm Password</label>
                    <input type="password" class="form-control" placeholder="Re-type new password">
                  </div>
                </div>
                <div class="text-end">
                  <button type="submit" class="btn btn-hospital-outline">Update Password</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // 2. System Settings
  renderSettings() {
    const s = HIMS_DATA.settings;
    return `
      <div class="page-header">
        <div class="page-title">
          <h3>HIMS Payroll & Statutory Settings</h3>
          <p>Configure cutoff cycles, overtime calculation rules, government contribution schedules, and notifications.</p>
        </div>
        <div>
          <button class="btn btn-hospital-primary" onclick="App.showToast('System configuration saved.', 'success')">
            <i class="bi bi-save-fill"></i> Save All Settings
          </button>
        </div>
      </div>

      <div class="row g-4">
        <!-- Payroll Cycle Settings -->
        <div class="col-12 col-lg-6">
          <div class="card h-100">
            <div class="card-header bg-white">
              <span class="fw-bold"><i class="bi bi-clock-history text-success me-2"></i>Payroll Cycle & Overtime Multipliers</span>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label">Payroll Frequency</label>
                <select class="form-select">
                  <option selected>Semi-Monthly (15th / 30th Payout)</option>
                  <option>Monthly (End of Month Payout)</option>
                </select>
              </div>
              <div class="row g-2 mb-3">
                <div class="col-6">
                  <label class="form-label">1st Cutoff Biometric Date</label>
                  <input type="text" class="form-control" value="${s.payroll.cutoff1}">
                </div>
                <div class="col-6">
                  <label class="form-label">2nd Cutoff Biometric Date</label>
                  <input type="text" class="form-control" value="${s.payroll.cutoff2}">
                </div>
              </div>
              <div class="row g-2 mb-3">
                <div class="col-6">
                  <label class="form-label">Regular Overtime Rate</label>
                  <input type="text" class="form-control" value="125% of Hourly Base">
                </div>
                <div class="col-6">
                  <label class="form-label">Rest Day / Special Holiday Rate</label>
                  <input type="text" class="form-control" value="130% of Hourly Base">
                </div>
              </div>
              <div class="row g-2">
                <div class="col-6">
                  <label class="form-label">Regular Holiday Rate</label>
                  <input type="text" class="form-control" value="200% (Double Pay)">
                </div>
                <div class="col-6">
                  <label class="form-label">Night Shift Differential</label>
                  <input type="text" class="form-control" value="10% (10 PM to 6 AM)">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Government Contribution Rates -->
        <div class="col-12 col-lg-6">
          <div class="card h-100">
            <div class="card-header bg-white">
              <span class="fw-bold"><i class="bi bi-bank text-primary me-2"></i>Philippine Government Contribution Parameters</span>
            </div>
            <div class="card-body">
              <div class="row g-2 mb-3">
                <div class="col-6">
                  <label class="form-label">SSS Employee Share</label>
                  <input type="text" class="form-control" value="4.5% (Max MSC: ₱30,000)">
                </div>
                <div class="col-6">
                  <label class="form-label">SSS Employer Share</label>
                  <input type="text" class="form-control" value="9.5% + EC Fund">
                </div>
              </div>
              <div class="row g-2 mb-3">
                <div class="col-6">
                  <label class="form-label">PhilHealth Premium Rate</label>
                  <input type="text" class="form-control" value="5.0% (50/50 EE/ER Split)">
                </div>
                <div class="col-6">
                  <label class="form-label">PhilHealth Max Salary Ceiling</label>
                  <input type="text" class="form-control" value="₱100,000.00">
                </div>
              </div>
              <div class="row g-2 mb-3">
                <div class="col-6">
                  <label class="form-label">Pag-IBIG / HDMF Mandatory</label>
                  <input type="text" class="form-control" value="₱200.00 / month (₱100/cutoff)">
                </div>
                <div class="col-6">
                  <label class="form-label">Withholding Tax Algorithm</label>
                  <input type="text" class="form-control" value="BIR TRAIN Law Revised Table" readonly>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications & Preferences -->
        <div class="col-12">
          <div class="card">
            <div class="card-header bg-white">
              <span class="fw-bold"><i class="bi bi-bell text-warning me-2"></i>Notifications & System Preferences</span>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="form-check form-switch mb-2">
                    <input class="form-check-input" type="checkbox" id="notifBatch" checked>
                    <label class="form-check-label" for="notifBatch">Email HR Specialists upon Batch Finalization</label>
                  </div>
                  <div class="form-check form-switch mb-2">
                    <input class="form-check-input" type="checkbox" id="notifAnomaly" checked>
                    <label class="form-check-label" for="notifAnomaly">Send Real-time Alert for High-Risk AI Anomalies</label>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="notifClaims" checked>
                    <label class="form-check-label" for="notifClaims">Notify Employees on Reimbursement Approval</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row g-2">
                    <div class="col-6">
                      <label class="form-label">Default Table Rows</label>
                      <select class="form-select">
                        <option>10 rows per page</option>
                        <option>25 rows per page</option>
                        <option>50 rows per page</option>
                      </select>
                    </div>
                    <div class="col-6">
                      <label class="form-label">Date Format</label>
                      <select class="form-select">
                        <option>YYYY-MM-DD (ISO)</option>
                        <option>MM/DD/YYYY</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
