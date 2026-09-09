import { useState } from "react";
import { Box } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SuperAdminSideBar, { SUPER_SIDEBAR_WIDTH } from "./superSidebar";
import "./superAdmin.css";
import AuditLogs from "./AuditLogs";
import Settings from "./Settings";

// Maps the sidebar's nav keys to what gets rendered in the content area.
// Add a real component per key as those pages get built out.
const NAV_KEY_TO_LABEL = {
	employees: "Employee Management",
	audit: "Audit Logs",
	settings: "Settings",
};

const EMPTY_EMPLOYEES = [];

export default function SuperAdmin({ user, onLogout }) {
	const [activeKey, setActiveKey] = useState("employees");
	const [search, setSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState("All Roles");
	const [statusFilter, setStatusFilter] = useState("All Status");

	const employees = EMPTY_EMPLOYEES;

	const activeLabel = NAV_KEY_TO_LABEL[activeKey] ?? "Employee Management";

	return (
		<Box className="super-admin-shell">
			<SuperAdminSideBar active={activeKey} onNavigate={setActiveKey} onLogout={onLogout} />

			<Box component="main" className="super-admin-content" style={{ marginLeft: SUPER_SIDEBAR_WIDTH }}>
				{activeKey === "employees" ? (
					<>
						<header className="super-admin-header">
							<div><h1>{activeLabel}</h1><p>Manage NVAT staff accounts, roles, and system access permissions.</p></div>
							<div className="super-admin-header-actions">
								<button type="button" aria-label="Notifications"><NotificationsNoneOutlinedIcon /></button>
								<button type="button" aria-label="Help"><HelpOutlineOutlinedIcon /></button>
								<span className="super-admin-avatar">{(user?.username || "SA").slice(0, 2).toUpperCase()}</span>
							</div>
						</header>

						<section className="super-admin-stats" aria-label="Employee statistics">
							<StatCard label="Total Employees" value="0" detail="No records available" icon={BadgeOutlinedIcon} />
							<StatCard label="Admins" value="0" detail="No records available" icon={DashboardOutlinedIcon} />
							<StatCard label="Security Guards" value="0" detail="No records available" icon={ShieldOutlinedIcon} />
							<StatCard label="Pending Approval" value="0" detail="No records available" icon={AppsOutlinedIcon} warning />
						</section>

						<section className="employee-panel">
							<div className="employee-panel-heading">
								<div><h2>Staff Accounts</h2><p>All employees with system access, sorted by role.</p></div>
								<div className="employee-panel-actions">
									<button className="primary-action" type="button" disabled title="Employees can only be added on the server"><AddOutlinedIcon fontSize="inherit" /> Add Employee</button>
									<button className="export-action" type="button" disabled>Export <span>CSV</span></button>
								</div>
							</div>

							<div className="employee-filters">
								<div className="employee-search">
									<SearchOutlinedIcon fontSize="inherit" />
									<input
										type="text"
										placeholder="Search employee name or email..."
										value={search}
										onChange={(event) => setSearch(event.target.value)}
									/>
								</div>
								<select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
									<option>All Roles</option>
									<option>Admin</option>
									<option>Security Guard</option>
								</select>
								<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
									<option>All Status</option>
									<option>Active</option>
									<option>Pending</option>
									<option>Inactive</option>
								</select>
							</div>

							<div className="employee-table-wrap">
								<table className="employee-table">
									<thead>
										<tr><th>Employee</th><th>Role</th><th>Email</th><th>Status</th><th>Actions</th></tr>
									</thead>
									<tbody />
								</table>
								{employees.length === 0 && <p className="no-results">No employee records available. Add employees on the server.</p>}
							</div>

							<div className="employee-panel-footer">
								<span>Showing 0-0 of 0 employees</span>
								<div className="pagination">
									<button type="button" disabled>Prev</button>
									<button className="current" type="button" disabled>1</button>
									<button type="button" disabled>Next</button>
								</div>
							</div>
						</section>
					</>
					) : activeKey === "audit" ? (
					<AuditLogs user={user} onLogout={onLogout} />
					) : activeKey === "settings" ? (
					<Settings user={user} />
					) : (
					<header className="super-admin-header">
						<div><h1>{activeLabel}</h1><p>This section hasn't been built yet.</p></div>
					</header>
					)}
			</Box>
		</Box>
	);
}

function StatCard({ label, value, detail, icon: Icon, warning }) {
	return <article className="stat-card"><div className={`stat-icon ${warning ? "warning" : ""}`}><Icon fontSize="small" /></div><div><p>{label}</p><strong>{value}</strong><small className={warning ? "warning-text" : ""}>{detail}</small></div></article>;
}