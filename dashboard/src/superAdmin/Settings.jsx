import { useState } from "react";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import "./settings.css";

export default function Settings({ user }) {
  const [firstName, setFirstName] = useState("Sofia");
  const [lastName, setLastName] = useState("Aquino");
  const [email, setEmail] = useState("s.aquino@nvat.gov.ph");
  const [contact, setContact] = useState("0917 123 4567");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled] = useState(true);
  const [loginNotifications, setLoginNotifications] = useState(true);

  function handleSave(e) {
    e.preventDefault();
    // Wire this up to a real PATCH /api/account endpoint.
  }

  return (
    <>
      <header className="super-admin-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account and profile information</p>
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

      <div className="settings-layout">
        <nav className="settings-nav">
          <button type="button" className="settings-nav-item active">
            Account &amp; Profile
          </button>
        </nav>

        <form className="settings-panel" onSubmit={handleSave}>
          <div className="settings-profile-row">
            <span className="settings-avatar">{(user?.username || "SA").slice(0, 2).toUpperCase()}</span>
            <div>
              <p className="settings-profile-name">
                {firstName} {lastName}
              </p>
              <p className="settings-profile-meta">
                Role: <strong>Super Admin</strong> · EMP-1001
              </p>
              <button type="button" className="settings-change-photo-btn">
                Change Photo
              </button>
            </div>
          </div>

          <hr className="settings-divider" />

          <section className="settings-section">
            <h3>Personal Information</h3>
            <div className="settings-field-grid">
              <div className="settings-field">
                <label>First Name</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="settings-field">
                <label>Last Name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <div className="settings-field">
                <label>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="settings-field">
                <label>Contact Number</label>
                <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} />
              </div>
              <div className="settings-field">
                <label>Employee ID</label>
                <input type="text" value="EMP-1001" disabled />
              </div>
              <div className="settings-field">
                <label>Role</label>
                <input type="text" value="Super Admin" disabled />
              </div>
            </div>
          </section>

          <hr className="settings-divider" />

          <section className="settings-section">
            <h3>Change Password</h3>
            <div className="settings-field-grid">
              <div className="settings-field full-width">
                <label>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="settings-field">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div className="settings-field">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                />
              </div>
            </div>
          </section>

          <hr className="settings-divider" />

          <section className="settings-section">
            <h3>Security</h3>

            <div className="settings-security-row">
              <div>
                <p className="settings-security-title">Two-Factor Authentication</p>
                <p className="settings-security-desc">Require a verification code in addition to your password when signing in</p>
              </div>
              <span className="settings-status-chip">{twoFactorEnabled ? "Enabled" : "Disabled"}</span>
            </div>

            <div className="settings-security-row">
              <div>
                <p className="settings-security-title">Login Notifications</p>
                <p className="settings-security-desc">Get an email alert whenever your account signs in from a new device</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={loginNotifications}
                onClick={() => setLoginNotifications((v) => !v)}
                className={`settings-toggle ${loginNotifications ? "on" : ""}`}
              >
                <span className="settings-toggle-knob" />
              </button>
            </div>
          </section>

          <div className="settings-actions">
            <button type="button" className="settings-btn-cancel">
              Cancel
            </button>
            <button type="submit" className="settings-btn-save">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
}