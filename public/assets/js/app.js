/**
 * HIMS PAYROLL & BENEFITS MANAGEMENT SYSTEM
 * Central Application Router, Authentication & RBAC Coordinator (Vanilla JS)
 */

const App = {
  currentRoute: 'dashboard',
  currentPayslipEmployeeId: 'EMP-0101',

  init() {
    this.setupEventListeners();
    this.initSession();
  },

  setupEventListeners() {
    // Hash change routing
    window.addEventListener('hashchange', () => {
      this.handleRouteFromHash();
    });

    // Mobile sidebar auto-close on link click
    document.addEventListener('click', (e) => {
      if (e.target.closest('.sidebar .nav-link, .sidebar .sub-link')) {
        if (window.innerWidth < 992) {
          document.getElementById('appSidebar')?.classList.remove('mobile-open');
        }
      }
    });
  },

  // Session & Authentication Management
  initSession() {
    const isLoggedOut = sessionStorage.getItem('hims_logged_out') === 'true';
    if (isLoggedOut) {
      this.showLoginScreen();
      return;
    }

    const savedRole = sessionStorage.getItem('hims_user_role') || 'hr_admin';
    const profile = HIMS_DATA.userProfiles[savedRole] || HIMS_DATA.userProfiles.hr_admin;
    HIMS_DATA.currentUser = profile;

    if (savedRole === 'hospital_employee') {
      this.currentPayslipEmployeeId = profile.id;
    }

    this.hideLoginScreen();
    this.renderSidebar();
    this.renderTopbar();
    this.handleRouteFromHash();
  },

  login(roleKey) {
    sessionStorage.removeItem('hims_logged_out');
    sessionStorage.setItem('hims_user_role', roleKey);
    const profile = HIMS_DATA.userProfiles[roleKey] || HIMS_DATA.userProfiles.hr_admin;
    HIMS_DATA.currentUser = profile;

    if (roleKey === 'hospital_employee') {
      this.currentPayslipEmployeeId = profile.id;
    }

    this.hideLoginScreen();
    this.renderSidebar();
    this.renderTopbar();
    this.navigateTo('dashboard');

    this.showToast(`Logged in as <strong>${profile.name}</strong> (${profile.roleTitle})`, 'success');
  },

  switchRole(roleKey) {
    sessionStorage.setItem('hims_user_role', roleKey);
    const profile = HIMS_DATA.userProfiles[roleKey] || HIMS_DATA.userProfiles.hr_admin;
    HIMS_DATA.currentUser = profile;

    if (roleKey === 'hospital_employee') {
      this.currentPayslipEmployeeId = profile.id;
    }

    this.renderSidebar();
    this.renderTopbar();
    this.navigateTo(this.currentRoute);

    this.showToast(`Switched active profile to: <strong>${profile.roleTitle}</strong>`, 'info');
  },

  logout() {
    this.showConfirmationModal({
      title: "Confirm HIMS Sign Out",
      message: "Are you sure you want to log out of the HIMS Payroll & Benefits Portal? Your active session will be securely terminated.",
      confirmText: "Sign Out",
      onConfirm: () => {
        sessionStorage.setItem('hims_logged_out', 'true');
        this.showToast("Signed out of HIMS session.", "info");
        this.showLoginScreen();
      }
    });
  },

  showLoginScreen() {
    const loginEl = document.getElementById('loginScreen');
    const appWrapperEl = document.getElementById('appWrapper');
    if (loginEl && appWrapperEl) {
      appWrapperEl.classList.add('d-none');
      loginEl.classList.remove('d-none');
      this.renderLoginScreenContent();
    }
  },

  hideLoginScreen() {
    const loginEl = document.getElementById('loginScreen');
    const appWrapperEl = document.getElementById('appWrapper');
    if (loginEl && appWrapperEl) {
      loginEl.classList.add('d-none');
      appWrapperEl.classList.remove('d-none');
    }
  },

  renderLoginScreenContent() {
    const container = document.getElementById('loginScreen');
    if (!container) return;

    container.innerHTML = `
      <div class="login-screen-wrapper">
        <div class="login-bg-decor"></div>
        <div class="login-card">
          <!-- Band Header -->
          <div class="login-header-band">
            <div class="d-flex align-items-center gap-3">
              <div class="brand-icon-box" style="background: rgba(255,255,255,0.2);">
                <i class="bi bi-hospital fs-4 text-white"></i>
              </div>
              <div>
                <h5 class="mb-0 fw-bold text-white">DJNRMHS HOSPITAL INFORMATION MANAGEMENT SYSTEM</h5>
                <span class="small text-white-50">Payroll & Benefits Management &bull; Philippine DOH Hospital</span>
              </div>
            </div>
            <span class="badge bg-white text-success fw-bold d-none d-md-inline-block">DOH Station 0142</span>
          </div>

          <div class="p-4 p-md-5">
            <div class="text-center mb-4">
              <h4 class="fw-bold text-dark mb-1">Select Access Role to Enter Portal</h4>
              <p class="text-muted small">
                Choose a verified persona below to test the role-based hierarchy, permissions, and workflow boundaries.
              </p>
            </div>

            <!-- Role Selector Cards (3 Official Roles) -->
            <div class="row g-3 mb-4">
              <!-- Role 1: HR Administrator / HR Specialist -->
              <div class="col-12 col-md-4">
                <div class="role-select-card h-100" onclick="App.login('hr_admin')">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <span class="role-badge-pill role-badge-admin">
                      <i class="bi bi-shield-check"></i> FULL ACCESS
                    </span>
                    <i class="bi bi-person-gear fs-4 text-danger"></i>
                  </div>
                  <h6 class="fw-bold text-dark mb-1">HR Administrator / Specialist</h6>
                  <div class="fw-semibold text-primary small mb-2">Maria Angelica Santos</div>
                  <p class="text-muted small mb-3" style="font-size: 0.78rem; line-height: 1.4;">
                    Full Payroll & Benefits access, AI anomaly review & decision actions, claims approval, and <strong>Finalize & Lock</strong> authority.
                  </p>
                  <button class="btn btn-sm btn-outline-danger w-100 fw-semibold">
                    <i class="bi bi-box-arrow-in-right me-1"></i> Sign In as HR Admin
                  </button>
                </div>
              </div>

              <!-- Role 2: HR Staff / Payroll Officer -->
              <div class="col-12 col-md-4">
                <div class="role-select-card h-100" onclick="App.login('hr_staff')">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <span class="role-badge-pill role-badge-staff">
                      <i class="bi bi-calculator"></i> PREPARE & PROCESS
                    </span>
                    <i class="bi bi-person-workspace fs-4 text-info"></i>
                  </div>
                  <h6 class="fw-bold text-dark mb-1">HR Staff / Payroll Officer</h6>
                  <div class="fw-semibold text-primary small mb-2">Juan Paolo Reyes</div>
                  <p class="text-muted small mb-3" style="font-size: 0.78rem; line-height: 1.4;">
                    Can prepare, validate, and compute payroll & claims. Cannot perform final payroll lock/approval or claim approval sign-off.
                  </p>
                  <button class="btn btn-sm btn-outline-primary w-100 fw-semibold">
                    <i class="bi bi-box-arrow-in-right me-1"></i> Sign In as HR Staff
                  </button>
                </div>
              </div>

              <!-- Role 3: Hospital Employee / Staff -->
              <div class="col-12 col-md-4">
                <div class="role-select-card h-100" onclick="App.login('hospital_employee')">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <span class="role-badge-pill role-badge-employee">
                      <i class="bi bi-person-badge"></i> SELF-SERVICE
                    </span>
                    <i class="bi bi-person-lines-fill fs-4 text-success"></i>
                  </div>
                  <h6 class="fw-bold text-dark mb-1">Hospital Employee / Staff</h6>
                  <div class="fw-semibold text-primary small mb-2">Dr. Rafael M. Mendoza</div>
                  <p class="text-muted small mb-3" style="font-size: 0.78rem; line-height: 1.4;">
                    Access personal electronic payslips, view active HMO & health benefits, and submit official reimbursement claims.
                  </p>
                  <button class="btn btn-sm btn-outline-success w-100 fw-semibold">
                    <i class="bi bi-box-arrow-in-right me-1"></i> Sign In as Employee
                  </button>
                </div>
              </div>
            </div>

            <!-- Finance Hand-off Protocol Note -->
            <div class="p-3 bg-light rounded-3 border text-center small text-muted">
              <i class="bi bi-info-circle-fill text-success me-1"></i>
              <strong>Finance Integration Notice:</strong> Finance is NOT an approval role. Hospital Cashier & Finance receive the finalized <em>Approved Payroll Summary & Bank Disbursement Transmittal</em> as a downstream execution hand-off once authorized by the HR Administrator.
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // Role Verification Helpers
  isHRAdmin() {
    return HIMS_DATA.currentUser?.roleKey === 'hr_admin';
  },

  isHRStaff() {
    return HIMS_DATA.currentUser?.roleKey === 'hr_staff';
  },

  isEmployee() {
    return HIMS_DATA.currentUser?.roleKey === 'hospital_employee';
  },

  hasPermission(perm) {
    return HIMS_DATA.currentUser?.permissions?.includes(perm) || false;
  },

  // Dynamic Sidebar Navigation Rendering based on Active Role
  renderSidebar() {
    const menuContainer = document.getElementById('sidebarMenuContainer');
    const footerContainer = document.getElementById('sidebarFooterContainer');
    const user = HIMS_DATA.currentUser;
    if (!menuContainer || !user) return;

    if (this.isEmployee()) {
      // 1. HOSPITAL EMPLOYEE / STAFF SIDEBAR
      menuContainer.innerHTML = `
        <div class="nav-header">Self-Service Portal</div>
        <div class="nav-item">
          <a class="nav-link active" data-route="dashboard" href="javascript:void(0)" onclick="App.navigateTo('dashboard')">
            <i class="bi bi-grid-1x2-fill"></i>
            <span class="nav-link-text">My Overview</span>
          </a>
        </div>

        <div class="nav-header">Compensation & Benefits</div>
        <div class="nav-item">
          <a class="nav-link" data-route="payslip" href="javascript:void(0)" onclick="App.navigateTo('payslip')">
            <i class="bi bi-receipt"></i>
            <span class="nav-link-text">My Electronic Payslips</span>
          </a>
        </div>
        <div class="nav-item">
          <a class="nav-link" data-route="benefits-hmo" href="javascript:void(0)" onclick="App.navigateTo('benefits-hmo')">
            <i class="bi bi-heart-pulse-fill text-danger"></i>
            <span class="nav-link-text">My HMO & Coverage</span>
          </a>
        </div>
        <div class="nav-item">
          <a class="nav-link" data-route="claims" href="javascript:void(0)" onclick="App.navigateTo('claims')">
            <i class="bi bi-receipt-cutoff text-primary"></i>
            <span class="nav-link-text">My Expense Claims</span>
          </a>
        </div>

        <div class="nav-header">Account</div>
        <div class="nav-item">
          <a class="nav-link" data-route="profile" href="javascript:void(0)" onclick="App.navigateTo('profile')">
            <i class="bi bi-person-circle"></i>
            <span class="nav-link-text">My Profile</span>
          </a>
        </div>
        <div class="nav-item">
          <a class="nav-link text-danger" href="javascript:void(0)" onclick="App.logout()">
            <i class="bi bi-box-arrow-right text-danger"></i>
            <span class="nav-link-text">Sign Out</span>
          </a>
        </div>
      `;
    } else {
      // 2. HR ADMINISTRATOR & HR STAFF SIDEBAR
      const isStaff = this.isHRStaff();

      menuContainer.innerHTML = `
        <div class="nav-header">Main Overview</div>
        <div class="nav-item">
          <a class="nav-link active" data-route="dashboard" href="javascript:void(0)" onclick="App.navigateTo('dashboard')">
            <i class="bi bi-grid-1x2-fill"></i>
            <span class="nav-link-text">Dashboard</span>
          </a>
        </div>

        <div class="nav-header">Compensation & Operations</div>
        
        <!-- Payroll Management Accordion -->
        <div class="nav-item">
          <a class="nav-link collapsed" data-bs-toggle="collapse" href="#payrollSubmenu" role="button" aria-expanded="false">
            <i class="bi bi-cash-stack"></i>
            <span class="nav-link-text">Payroll Management</span>
            <i class="bi bi-chevron-right nav-arrow"></i>
          </a>
          <div class="collapse" id="payrollSubmenu">
            <ul class="sidebar-submenu">
              <li class="sub-item"><a class="sub-link" data-route="payroll-list" href="javascript:void(0)" onclick="App.navigateTo('payroll-list')">Employee Payroll List</a></li>
              <li class="sub-item"><a class="sub-link" data-route="payroll-computation" href="javascript:void(0)" onclick="App.navigateTo('payroll-computation')">Payroll Computation</a></li>
              <li class="sub-item"><a class="sub-link" data-route="payroll-periods" href="javascript:void(0)" onclick="App.navigateTo('payroll-periods')">Period Management</a></li>
              <li class="sub-item"><a class="sub-link" data-route="payroll-processing" href="javascript:void(0)" onclick="App.navigateTo('payroll-processing')">Payroll Processing</a></li>
              <li class="sub-item"><a class="sub-link" data-route="payroll-approval" href="javascript:void(0)" onclick="App.navigateTo('payroll-approval')">${isStaff ? 'Payroll Approval (Review)' : 'Payroll Approval & Lock'}</a></li>
              <li class="sub-item"><a class="sub-link" data-route="payroll-history" href="javascript:void(0)" onclick="App.navigateTo('payroll-history')">Payroll History</a></li>
              <li class="sub-item"><a class="sub-link" data-route="payslip" href="javascript:void(0)" onclick="App.navigateTo('payslip')">Electronic Payslips</a></li>
            </ul>
          </div>
        </div>

        <!-- Compensation Planning Accordion -->
        <div class="nav-item">
          <a class="nav-link collapsed" data-bs-toggle="collapse" href="#compSubmenu" role="button" aria-expanded="false">
            <i class="bi bi-diagram-3-fill"></i>
            <span class="nav-link-text">Compensation Planning</span>
            <i class="bi bi-chevron-right nav-arrow"></i>
          </a>
          <div class="collapse" id="compSubmenu">
            <ul class="sidebar-submenu">
              <li class="sub-item"><a class="sub-link" data-route="compensation-grade" href="javascript:void(0)" onclick="App.navigateTo('compensation-grade')">Salary Grade</a></li>
              <li class="sub-item"><a class="sub-link" data-route="compensation-matrix" href="javascript:void(0)" onclick="App.navigateTo('compensation-matrix')">Position Salary Matrix</a></li>
              <li class="sub-item"><a class="sub-link" data-route="compensation-allowances" href="javascript:void(0)" onclick="App.navigateTo('compensation-allowances')">Allowances & Subsidies</a></li>
              <li class="sub-item"><a class="sub-link" data-route="compensation-incentives" href="javascript:void(0)" onclick="App.navigateTo('compensation-incentives')">Incentives & Bonuses</a></li>
            </ul>
          </div>
        </div>

        <!-- Benefits Management Accordion -->
        <div class="nav-item">
          <a class="nav-link collapsed" data-bs-toggle="collapse" href="#benefitsSubmenu" role="button" aria-expanded="false">
            <i class="bi bi-heart-pulse-fill"></i>
            <span class="nav-link-text">Benefits Management</span>
            <i class="bi bi-chevron-right nav-arrow"></i>
          </a>
          <div class="collapse" id="benefitsSubmenu">
            <ul class="sidebar-submenu">
              <li class="sub-item"><a class="sub-link" data-route="benefits-hmo" href="javascript:void(0)" onclick="App.navigateTo('benefits-hmo')">HMO Management</a></li>
              <li class="sub-item"><a class="sub-link" data-route="benefits-utilization" href="javascript:void(0)" onclick="App.navigateTo('benefits-utilization')">Benefit Utilization</a></li>
              <li class="sub-item"><a class="sub-link" data-route="benefits-dependents" href="javascript:void(0)" onclick="App.navigateTo('benefits-dependents')">Employee Dependents</a></li>
              <li class="sub-item"><a class="sub-link" data-route="benefits-insurance" href="javascript:void(0)" onclick="App.navigateTo('benefits-insurance')">Insurance Benefits</a></li>
            </ul>
          </div>
        </div>

        <!-- Claims & Reimbursement -->
        <div class="nav-item">
          <a class="nav-link" data-route="claims" href="javascript:void(0)" onclick="App.navigateTo('claims')">
            <i class="bi bi-receipt-cutoff"></i>
            <span class="nav-link-text">Claims & Reimbursement</span>
          </a>
        </div>

        <div class="nav-header">Intelligence & Audits</div>

        <!-- AI Anomaly Detection -->
        <div class="nav-item">
          <a class="nav-link" data-route="ai-dashboard" href="javascript:void(0)" onclick="App.navigateTo('ai-dashboard')">
            <i class="bi bi-robot text-success"></i>
            <span class="nav-link-text">AI Anomaly Engine</span>
            <span class="ai-sparkle-badge badge-pill-menu">AI</span>
          </a>
        </div>
        <div class="nav-item">
          <a class="nav-link" data-route="ai-anomalies" href="javascript:void(0)" onclick="App.navigateTo('ai-anomalies')">
            <i class="bi bi-shield-exclamation text-danger"></i>
            <span class="nav-link-text">Flagged Anomalies</span>
            <span class="badge bg-danger text-white rounded-pill ms-auto badge-pill-menu">4</span>
          </a>
        </div>

        <!-- Reports -->
        <div class="nav-item">
          <a class="nav-link collapsed" data-bs-toggle="collapse" href="#reportsSubmenu" role="button" aria-expanded="false">
            <i class="bi bi-file-earmark-bar-graph-fill"></i>
            <span class="nav-link-text">Reports & Compliance</span>
            <i class="bi bi-chevron-right nav-arrow"></i>
          </a>
          <div class="collapse" id="reportsSubmenu">
            <ul class="sidebar-submenu">
              <li class="sub-item"><a class="sub-link" data-route="reports-payroll" href="javascript:void(0)" onclick="App.navigateTo('reports-payroll')">Payroll Report</a></li>
              <li class="sub-item"><a class="sub-link" data-route="reports-contributions" href="javascript:void(0)" onclick="App.navigateTo('reports-contributions')">Government Contributions</a></li>
              <li class="sub-item"><a class="sub-link" data-route="reports-claims" href="javascript:void(0)" onclick="App.navigateTo('reports-claims')">Claims Report</a></li>
              <li class="sub-item"><a class="sub-link" data-route="reports-benefits" href="javascript:void(0)" onclick="App.navigateTo('reports-benefits')">Benefits Report</a></li>
              <li class="sub-item"><a class="sub-link" data-route="reports-ai" href="javascript:void(0)" onclick="App.navigateTo('reports-ai')">AI Audit Report</a></li>
            </ul>
          </div>
        </div>

        <div class="nav-header">System</div>
        <div class="nav-item">
          <a class="nav-link" data-route="profile" href="javascript:void(0)" onclick="App.navigateTo('profile')">
            <i class="bi bi-person-circle"></i>
            <span class="nav-link-text">User Profile</span>
          </a>
        </div>
        <div class="nav-item">
          <a class="nav-link" data-route="settings" href="javascript:void(0)" onclick="App.navigateTo('settings')">
            <i class="bi bi-sliders"></i>
            <span class="nav-link-text">Settings</span>
          </a>
        </div>
        <div class="nav-item">
          <a class="nav-link text-danger" href="javascript:void(0)" onclick="App.logout()">
            <i class="bi bi-box-arrow-right text-danger"></i>
            <span class="nav-link-text">Logout</span>
          </a>
        </div>
      `;
    }

    // Sidebar User Footer
    if (footerContainer) {
      footerContainer.innerHTML = `
        <div class="sidebar-user-avatar">${user.avatar}</div>
        <div class="sidebar-footer-text overflow-hidden">
          <div class="fw-bold text-white text-truncate small">${user.name}</div>
          <div class="text-truncate" style="font-size: 0.72rem; color: #728f9e;">${user.position}</div>
        </div>
        <div class="dropdown ms-auto">
          <button class="btn btn-sm btn-link text-white-50 p-0" data-bs-toggle="dropdown" title="Switch Role">
            <i class="bi bi-three-dots-vertical"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-sm">
            <li><h6 class="dropdown-header">Switch Role Profile</h6></li>
            <li><a class="dropdown-item ${this.isHRAdmin() ? 'active' : ''}" href="javascript:void(0)" onclick="App.switchRole('hr_admin')">HR Administrator</a></li>
            <li><a class="dropdown-item ${this.isHRStaff() ? 'active' : ''}" href="javascript:void(0)" onclick="App.switchRole('hr_staff')">HR Staff / Payroll Officer</a></li>
            <li><a class="dropdown-item ${this.isEmployee() ? 'active' : ''}" href="javascript:void(0)" onclick="App.switchRole('hospital_employee')">Hospital Employee</a></li>
          </ul>
        </div>
      `;
    }
  },

  // Dynamic Topbar Rendering (With Role Switcher)
  renderTopbar() {
    const topbarUserContainer = document.getElementById('topbarUserDropdownContainer');
    const user = HIMS_DATA.currentUser;
    if (!topbarUserContainer || !user) return;

    topbarUserContainer.innerHTML = `
      <!-- Role Badge Pill in Topbar -->
      <span class="role-badge-pill ${user.badgeClass} d-none d-md-inline-flex me-2">
        <i class="bi bi-shield-lock-fill"></i> ${user.roleShort}
      </span>

      <!-- User Dropdown & Role Switcher -->
      <div class="topbar-user-dropdown" data-bs-toggle="dropdown">
        <div class="sidebar-user-avatar" style="width: 32px; height: 32px; font-size: 0.75rem;">${user.avatar}</div>
        <div class="d-none d-sm-block text-start">
          <div class="fw-bold text-dark small leading-tight">${user.name.split(' ')[0]} ${user.name.split(' ').slice(-1)[0]}</div>
          <div class="text-muted" style="font-size: 0.7rem;">${user.roleShort}</div>
        </div>
        <i class="bi bi-chevron-down text-muted small ms-1"></i>
      </div>
      <ul class="dropdown-menu dropdown-menu-end shadow-sm" style="min-width: 260px;">
        <li class="p-2 border-bottom bg-light">
          <div class="fw-bold text-dark small">${user.name}</div>
          <div class="text-muted small">${user.department}</div>
          <span class="role-badge-pill ${user.badgeClass} mt-1">${user.roleTitle}</span>
        </li>
        <li><h6 class="dropdown-header mt-2">Active Roles & Hierarchy</h6></li>
        <li>
          <a class="dropdown-item d-flex align-items-center justify-content-between ${this.isHRAdmin() ? 'active fw-bold' : ''}" href="javascript:void(0)" onclick="App.switchRole('hr_admin')">
            <span><i class="bi bi-shield-check text-danger me-2"></i> HR Administrator</span>
            ${this.isHRAdmin() ? '<i class="bi bi-check2"></i>' : ''}
          </a>
        </li>
        <li>
          <a class="dropdown-item d-flex align-items-center justify-content-between ${this.isHRStaff() ? 'active fw-bold' : ''}" href="javascript:void(0)" onclick="App.switchRole('hr_staff')">
            <span><i class="bi bi-calculator text-primary me-2"></i> HR Staff / Officer</span>
            ${this.isHRStaff() ? '<i class="bi bi-check2"></i>' : ''}
          </a>
        </li>
        <li>
          <a class="dropdown-item d-flex align-items-center justify-content-between ${this.isEmployee() ? 'active fw-bold' : ''}" href="javascript:void(0)" onclick="App.switchRole('hospital_employee')">
            <span><i class="bi bi-person-badge text-success me-2"></i> Hospital Employee</span>
            ${this.isEmployee() ? '<i class="bi bi-check2"></i>' : ''}
          </a>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="javascript:void(0)" onclick="App.navigateTo('profile')"><i class="bi bi-person me-2"></i> View User Profile</a></li>
        <li><a class="dropdown-item text-danger" href="javascript:void(0)" onclick="App.logout()"><i class="bi bi-box-arrow-right me-2"></i> Sign Out</a></li>
      </ul>
    `;
  },

  toggleSidebar() {
    const sidebar = document.getElementById('appSidebar');
    const mainWrapper = document.getElementById('mainWrapper');

    if (window.innerWidth < 992) {
      sidebar?.classList.toggle('mobile-open');
    } else {
      const isCollapsing = !sidebar?.classList.contains('collapsed');
      sidebar?.classList.toggle('collapsed');
      mainWrapper?.classList.toggle('expanded');

      if (isCollapsing) {
        document.querySelectorAll('.sidebar .collapse.show').forEach(el => {
          const bsCollapse = bootstrap.Collapse.getInstance(el);
          if (bsCollapse) bsCollapse.hide();
        });
      }
    }
  },

  handleRouteFromHash() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    this.navigateTo(hash, false);
  },

  navigateTo(route, updateHash = true) {
    this.currentRoute = route;
    if (updateHash) {
      window.location.hash = route;
    }

    this.updateActiveNavLinks(route);
    this.renderCurrentView(route);
    this.updateBreadcrumbs(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  updateActiveNavLinks(route) {
    document.querySelectorAll('.nav-link, .sub-link').forEach(el => el.classList.remove('active'));

    const targetLink = document.querySelector(`[data-route="${route}"]`);
    if (targetLink) {
      targetLink.classList.add('active');

      const parentCollapse = targetLink.closest('.collapse');
      if (parentCollapse) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(parentCollapse, { toggle: false });
        bsCollapse.show();
        const trigger = document.querySelector(`[data-bs-target="#${parentCollapse.id}"]`);
        if (trigger) trigger.classList.add('active');
      }
    }
  },

  updateBreadcrumbs(route) {
    const breadcrumbEl = document.getElementById('appBreadcrumb');
    if (!breadcrumbEl) return;

    let items = [{ name: 'HIMS Portal', route: 'dashboard' }];

    if (this.isEmployee()) {
      if (route === 'payslip') items.push({ name: 'My Electronic Payslips' });
      else if (route.startsWith('benefits')) items.push({ name: 'My HMO & Benefits Coverage' });
      else if (route === 'claims') items.push({ name: 'My Expense Claims' });
      else if (route === 'profile') items.push({ name: 'My Profile' });
      else items.push({ name: 'Employee Overview' });
    } else {
      if (route.startsWith('payroll')) {
        items.push({ name: 'Payroll Management', route: 'payroll-list' });
        if (route === 'payroll-list') items.push({ name: 'Employee Payroll List' });
        else if (route === 'payroll-computation') items.push({ name: 'Payroll Computation' });
        else if (route === 'payroll-periods') items.push({ name: 'Period Management' });
        else if (route === 'payroll-processing') items.push({ name: 'Payroll Processing' });
        else if (route === 'payroll-approval') items.push({ name: 'Payroll Approval & Lock' });
        else if (route === 'payroll-history') items.push({ name: 'Payroll History' });
      } else if (route === 'payslip') {
        items.push({ name: 'Payroll Management', route: 'payroll-list' });
        items.push({ name: 'Electronic Payslips' });
      } else if (route.startsWith('compensation')) {
        items.push({ name: 'Compensation Planning', route: 'compensation-grade' });
        items.push({ name: 'Salary Structure & Allowances' });
      } else if (route.startsWith('benefits')) {
        items.push({ name: 'Benefits Management', route: 'benefits-hmo' });
        items.push({ name: 'HMO & Insurance' });
      } else if (route.startsWith('claims')) {
        items.push({ name: 'Claims & Reimbursements', route: 'claims' });
        items.push({ name: 'Claim Records' });
      } else if (route.startsWith('ai')) {
        items.push({ name: 'AI Anomaly Detection', route: 'ai-dashboard' });
        if (route === 'ai-dashboard') items.push({ name: 'AI Engine Dashboard' });
        else if (route === 'ai-anomalies') items.push({ name: 'Flagged Anomalies' });
        else items.push({ name: 'Audit Trail' });
      } else if (route.startsWith('reports')) {
        items.push({ name: 'Reports & Audits', route: 'reports-payroll' });
        items.push({ name: 'Compliance Reports' });
      } else if (route === 'profile') {
        items.push({ name: 'User Account', route: 'profile' });
        items.push({ name: 'User Profile' });
      } else if (route === 'settings') {
        items.push({ name: 'Settings', route: 'settings' });
        items.push({ name: 'System Parameters' });
      } else {
        items.push({ name: 'Dashboard' });
      }
    }

    breadcrumbEl.innerHTML = items.map((item, index) => {
      const isLast = index === items.length - 1;
      if (isLast) {
        return `<li class="active">${item.name}</li>`;
      }
      return `<li><a href="javascript:void(0)" onclick="App.navigateTo('${item.route}')">${item.name}</a></li>`;
    }).join('');
  },

  // Route authorization & view rendering
  renderCurrentView(route) {
    const container = document.getElementById('mainContentArea');
    if (!container) return;

    // RBAC Authorization Gate for Hospital Employee
    if (this.isEmployee()) {
      const allowedEmployeeRoutes = ['dashboard', 'payslip', 'benefits-hmo', 'benefits-utilization', 'benefits-dependents', 'benefits-insurance', 'claims', 'profile'];
      if (!allowedEmployeeRoutes.includes(route)) {
        container.innerHTML = this.renderAccessDeniedView("HR Administrator or HR Staff");
        return;
      }
    }

    if (route === 'dashboard') {
      container.innerHTML = DashboardModule.render();
      setTimeout(() => DashboardModule.initCharts(), 50);
    } else if (route === 'payroll-list') {
      container.innerHTML = PayrollModule.renderPayrollList();
    } else if (route === 'payroll-computation') {
      container.innerHTML = PayrollModule.renderComputation();
      setTimeout(() => PayrollModule.recalculate(), 50);
    } else if (route === 'payroll-periods') {
      container.innerHTML = PayrollModule.renderPeriods();
    } else if (route === 'payroll-processing') {
      container.innerHTML = PayrollModule.renderProcessing();
    } else if (route === 'payroll-approval') {
      container.innerHTML = PayrollModule.renderApproval();
    } else if (route === 'payroll-history') {
      container.innerHTML = PayrollModule.renderHistory();
    } else if (route === 'payslip') {
      container.innerHTML = PayrollModule.renderPayslipView(this.currentPayslipEmployeeId);
    } else if (route === 'compensation' || route === 'compensation-grade') {
      container.innerHTML = CompensationModule.render('salary-grade');
    } else if (route === 'compensation-matrix') {
      container.innerHTML = CompensationModule.render('matrix');
    } else if (route === 'compensation-allowances') {
      container.innerHTML = CompensationModule.render('allowances');
    } else if (route === 'compensation-incentives') {
      container.innerHTML = CompensationModule.render('incentives');
    } else if (route === 'benefits' || route === 'benefits-hmo') {
      container.innerHTML = BenefitsModule.render('hmo');
    } else if (route === 'benefits-utilization') {
      container.innerHTML = BenefitsModule.render('utilization');
    } else if (route === 'benefits-dependents') {
      container.innerHTML = BenefitsModule.render('dependents');
    } else if (route === 'benefits-insurance') {
      container.innerHTML = BenefitsModule.render('insurance');
    } else if (route === 'claims') {
      container.innerHTML = ClaimsModule.render();
    } else if (route === 'ai-dashboard') {
      container.innerHTML = AiAnomalyModule.renderDashboard();
    } else if (route === 'ai-anomalies') {
      container.innerHTML = AiAnomalyModule.renderDashboard();
      setTimeout(() => {
        document.getElementById('aiAnomalyTable')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (route === 'reports' || route === 'reports-payroll') {
      container.innerHTML = ReportsModule.render('payroll');
    } else if (route === 'reports-contributions') {
      container.innerHTML = ReportsModule.render('contributions');
    } else if (route === 'reports-claims') {
      container.innerHTML = ReportsModule.render('claims');
    } else if (route === 'reports-benefits') {
      container.innerHTML = ReportsModule.render('benefits');
    } else if (route === 'reports-ai') {
      container.innerHTML = ReportsModule.render('ai');
    } else if (route === 'profile') {
      container.innerHTML = SettingsModule.renderProfile();
    } else if (route === 'settings') {
      container.innerHTML = SettingsModule.renderSettings();
    } else {
      container.innerHTML = DashboardModule.render();
      setTimeout(() => DashboardModule.initCharts(), 50);
    }
  },

  renderAccessDeniedView(requiredRoles) {
    return `
      <div class="card p-5 text-center my-4 border-danger shadow-sm">
        <div class="mb-3">
          <div class="stat-icon-wrapper stat-icon-red mx-auto" style="width: 64px; height: 64px; font-size: 1.8rem;">
            <i class="bi bi-shield-lock-fill"></i>
          </div>
        </div>
        <h4 class="fw-bold text-dark mb-1">Access Restricted</h4>
        <p class="text-muted mx-auto mb-4" style="max-width: 540px;">
          This module is restricted to <strong>${requiredRoles}</strong> credentials. Hospital employees have access to self-service electronic payslips, HMO healthcare information, and reimbursement claims.
        </p>
        <div class="d-flex justify-content-center gap-2">
          <button class="btn btn-hospital-outline" onclick="App.navigateTo('payslip')">
            <i class="bi bi-receipt"></i> View My Payslip
          </button>
          <button class="btn btn-hospital-primary" onclick="App.navigateTo('dashboard')">
            <i class="bi bi-house"></i> Return to Employee Portal
          </button>
        </div>
      </div>
    `;
  },

  // Modal Helpers
  showGenericModal({ 
    title, 
    body, 
    confirmText = "Confirm", 
    cancelText = "Close", 
    confirmClass = "btn-hospital-primary",
    showCancel = true, 
    showConfirm = null,
    onConfirm = null 
  }) {
    const titleEl = document.getElementById('globalModalTitle');
    const bodyEl = document.getElementById('globalModalBody');
    const confirmBtn = document.getElementById('globalModalConfirmBtn');
    const cancelBtn = document.getElementById('globalModalCancelBtn');

    if (titleEl) titleEl.innerText = title;
    if (bodyEl) bodyEl.innerHTML = body;

    const shouldShowConfirm = showConfirm !== null
      ? showConfirm
      : (onConfirm !== null && confirmText.trim().toLowerCase() !== 'close');

    if (cancelBtn) {
      cancelBtn.innerText = cancelText;
      cancelBtn.style.display = showCancel ? 'inline-block' : 'none';
    }

    if (confirmBtn) {
      if (shouldShowConfirm) {
        confirmBtn.style.display = 'inline-block';
        confirmBtn.innerText = confirmText;
        confirmBtn.className = `btn ${confirmClass}`;
        confirmBtn.onclick = () => {
          if (onConfirm) onConfirm();
          const modalEl = document.getElementById('globalAppModal');
          const modal = bootstrap.Modal.getInstance(modalEl);
          if (modal) modal.hide();
        };
      } else {
        confirmBtn.style.display = 'none';
        confirmBtn.onclick = null;
      }
    }

    const modalEl = document.getElementById('globalAppModal');
    if (modalEl) {
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    }
  },

  showConfirmationModal({ title, message, confirmText = "Confirm Action", onConfirm = null }) {
    this.showGenericModal({
      title,
      body: `<div class="p-2"><i class="bi bi-question-circle-fill text-warning fs-3 me-2"></i><span>${message}</span></div>`,
      confirmText,
      onConfirm
    });
  },

  showAnomalyModal(anomalyId) {
    AiAnomalyModule.showAnomalyDetailModal(anomalyId);
  },

  // Toast Notification System
  showToast(message, type = 'success') {
    const container = document.getElementById('globalToastContainer');
    if (!container) return;

    const toastId = 'toast_' + Date.now();
    const iconClass = type === 'success' 
      ? 'bi-check-circle-fill text-success' 
      : (type === 'warning' ? 'bi-exclamation-triangle-fill text-warning' : (type === 'danger' ? 'bi-x-circle-fill text-danger' : 'bi-info-circle-fill text-primary'));

    const toastHtml = `
      <div id="${toastId}" class="toast custom-toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center gap-2">
            <i class="bi ${iconClass}"></i>
            <strong class="me-auto text-dark">HIMS Notification</strong>
          </div>
          <button type="button" class="btn-close btn-sm" onclick="document.getElementById('${toastId}')?.remove()"></button>
        </div>
        <div class="toast-body">
          ${message}
        </div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', toastHtml);

    setTimeout(() => {
      const el = document.getElementById(toastId);
      if (el) el.remove();
    }, 4500);
  },

  // Export to CSV Simulator
  exportTableToCSV(tableId, filename = 'hospital_export.csv') {
    const table = document.getElementById(tableId);
    if (!table) {
      this.showToast('Data exported to Excel format.', 'success');
      return;
    }

    let csv = [];
    const rows = table.querySelectorAll('tr');

    for (let i = 0; i < rows.length; i++) {
      const row = [];
      const cols = rows[i].querySelectorAll('td, th');
      for (let j = 0; j < cols.length; j++) {
        let text = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, ' ').replace(/"/g, '""');
        row.push('"' + text.trim() + '"');
      }
      csv.push(row.join(','));
    }

    const csvFile = new Blob([csv.join('\n')], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    this.showToast(`Exported ${filename} successfully.`, 'success');
  }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
