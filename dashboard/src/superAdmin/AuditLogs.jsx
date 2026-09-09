import { useMemo, useState } from "react";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import "./auditLogs.css";

const AUDIT_LOGS = [];

const ROLE_OPTIONS = ["All Roles", "Super Admin", "Admin", "Security Guard", "IT Support"];
const ACTION_OPTIONS = ["All Actions", "Login", "Account Change", "RFID Scan"];
const DATE_OPTIONS = ["Today", "This Week", "This Month"];

function roleClass(role) {
  return role.toLowerCase().replace(/\s+/g, "-");
}

export default function AuditLogs({ user, onLogout }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [actionFilter, setActionFilter] = useState("All Actions");
  const [dateFilter, setDateFilter] = useState("Today");

  const filtered = useMemo(() => {
    return AUDIT_LOGS.filter((log) => {
      const matchesSearch =
        log.user.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.ip.includes(search);
      const matchesRole = roleFilter === "All Roles" || log.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [search, roleFilter]);

  return (
    <>
      <header className="super-admin-header">
        <div>
          <h1>Audit Logs</h1>
          <p>System-wide activity across all staff accounts — Admins, Security Guards, and IT Support</p>
        </div>
        <div className="super-admin-header-actions">
          <button type="button" aria-label="Notifications">
            <NotificationsNoneOutlinedIcon />
          </button>
          <button type="button" aria-label="Help">
            <HelpOutlineOutlinedIcon />
          </button>
          <span className="super-admin-avatar">{(user?.username || "SA").slice(0, 2).toUpperCase()}</span>
        </div>
      </header>

      <section className="super-admin-stats" aria-label="Audit statistics">
        <article className="stat-card">
          <div className="stat-icon">
            <ExitToAppOutlinedIcon fontSize="small" />
          </div>
          <div>
            <p>Total Events Today</p>
            <strong>0</strong>
            <small>No records available</small>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-icon warning">
            <ExitToAppOutlinedIcon fontSize="small" />
          </div>
          <div>
            <p>Failed Logins</p>
            <strong>0</strong>
            <small className="danger-text">No records available</small>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-icon">
            <ExitToAppOutlinedIcon fontSize="small" />
          </div>
          <div>
            <p>Account Changes</p>
            <strong>0</strong>
            <small className="info-text">No records available</small>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-icon">
            <ExitToAppOutlinedIcon fontSize="small" />
          </div>
          <div>
            <p>Active Sessions</p>
            <strong>0</strong>
            <small>No records available</small>
          </div>
        </article>
      </section>

      <section className="audit-panel">
        <div className="audit-panel-heading">
          <div>
            <h2>System Activity Trail</h2>
            <p>Every account action, login, and change across the platform</p>
          </div>
          <button className="export-action" type="button" disabled>
            Export <span>CSV</span>
          </button>
        </div>

        <div className="audit-filters">
          <div className="audit-search">
            <SearchOutlinedIcon fontSize="inherit" />
            <input
              type="text"
              placeholder="Search user, action, or IP address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
            {ACTION_OPTIONS.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            {DATE_OPTIONS.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="audit-table-wrap">
          <table className="audit-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Action Performed</th>
                <th>Date &amp; Time</th>
                <th>IP Address</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id}>
                  <td>
                    <div className="audit-user-cell">
                      <span className="audit-avatar" style={{ backgroundColor: log.color }}>
                        {log.initials}
                      </span>
                      <div>
                        <p className="audit-user-name">{log.user}</p>
                        <p className="audit-user-id">{log.empId}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`role-chip ${roleClass(log.role)}`}>{log.role}</span>
                  </td>
                  <td className="audit-action-cell">{log.action}</td>
                  <td className="audit-muted-cell">{log.time}</td>
                  <td className="audit-muted-cell">{log.ip}</td>
                  <td>
                    <span className={`status-chip ${log.status.toLowerCase()}`}>{log.status}</span>
                  </td>
                  <td>
                    <button className="view-action" type="button">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="no-results">No audit records available. Activity will appear here once staff actions are recorded.</p>}
        </div>

        <div className="employee-panel-footer">
          <span>Showing 0-0 of 0 audit records</span>
          <div className="pagination">
            <button type="button" disabled>Previous</button>
            <button className="current" type="button" disabled>1</button>
            <button type="button" disabled>Next</button>
          </div>
        </div>
      </section>
    </>
  );
}