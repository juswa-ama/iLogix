import { useState } from "react";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import "./addEmployee.css";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  employeeId: "",
  role: "Admin",
  password: "",
  confirmPassword: "",
};

export default function AddEmployee({ user, onCancel, onCreate }) {
  const [form, setForm] = useState(initialForm);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [loginNotifications, setLoginNotifications] = useState(true);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onCreate?.({ ...form, twoFactorEnabled, loginNotifications });
  }

  return (
    <>
      <header className="super-admin-header">
        <div>
          <button type="button" className="add-employee-back" onClick={onCancel}>
            <ArrowBackOutlinedIcon fontSize="small" />
            Employee Management
          </button>
          <h1>Add Employee</h1>
          <p>Create a staff account and configure system access permissions.</p>
        </div>
        <div className="super-admin-header-actions">
          <button type="button" aria-label="Notifications"><NotificationsNoneOutlinedIcon /></button>
          <button type="button" aria-label="Help"><HelpOutlineOutlinedIcon /></button>
          <span className="super-admin-avatar">{(user?.username || "SA").slice(0, 2).toUpperCase()}</span>
        </div>
      </header>

      <form className="add-employee-panel" onSubmit={handleSubmit}>
        <section className="add-employee-section">
          <h2>Personal Information</h2>
          <div className="add-employee-grid">
            <Field label="First Name" name="firstName" value={form.firstName} onChange={updateField} required />
            <Field label="Last Name" name="lastName" value={form.lastName} onChange={updateField} required />
            <Field label="Email Address" name="email" type="email" value={form.email} onChange={updateField} required />
            <Field label="Contact Number" name="contact" value={form.contact} onChange={updateField} required />
            <Field label="Employee ID" name="employeeId" value={form.employeeId} onChange={updateField} placeholder="EMP-2001" required />
            <label className="add-employee-field">
              <span>Role</span>
              <select name="role" value={form.role} onChange={updateField}>
                <option>Admin</option>
                <option>Security Guard</option>
                <option>IT Support</option>
              </select>
            </label>
          </div>
        </section>

        <hr />

        <section className="add-employee-section">
          <h2>Account Password</h2>
          <div className="add-employee-grid">
            <Field label="Temporary Password" name="password" type="password" value={form.password} onChange={updateField} placeholder="Enter temporary password" required fullWidth />
            <Field label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={updateField} placeholder="Re-enter temporary password" required />
          </div>
        </section>

        <hr />

        <section className="add-employee-section">
          <h2>Security</h2>
          <SecurityRow
            title="Two-Factor Authentication"
            description="Require a verification code in addition to the password when signing in"
            enabled={twoFactorEnabled}
            onChange={() => setTwoFactorEnabled((current) => !current)}
          />
          <SecurityRow
            title="Login Notifications"
            description="Send an email alert whenever this account signs in from a new device"
            enabled={loginNotifications}
            onChange={() => setLoginNotifications((current) => !current)}
          />
        </section>

        <div className="add-employee-actions">
          <button type="button" className="add-employee-cancel" onClick={onCancel}>Cancel</button>
          <button type="submit" className="add-employee-submit">Create Employee</button>
        </div>
      </form>
    </>
  );
}

function Field({ label, name, value, onChange, type = "text", placeholder, required, fullWidth }) {
  return (
    <label className={`add-employee-field ${fullWidth ? "full-width" : ""}`}>
      <span>{label}</span>
      <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} />
    </label>
  );
}

function SecurityRow({ title, description, enabled, onChange }) {
  return (
    <div className="add-employee-security-row">
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <button type="button" role="switch" aria-checked={enabled} onClick={onChange} className={`add-employee-toggle ${enabled ? "on" : ""}`}>
        <span />
      </button>
    </div>
  );
}