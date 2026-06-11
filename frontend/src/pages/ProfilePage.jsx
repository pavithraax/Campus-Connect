import React, { useState } from "react";
import { Mail, Phone, Save, Lock, Upload, Sun, Moon, User, ImagePlus } from "lucide-react";
import { apiRequest } from "../utils/api";
import { toast } from "react-hot-toast";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export default function ProfilePage({ user, token, onUserUpdate, theme, toggleTheme }) {
  const [name, setName] = useState(user.name || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleNameUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiRequest("/api/profile/name", "PUT", { name }, token);
      onUserUpdate(data.user, data.token);
      toast.success(data.message || "Name updated!");
    } catch (err) {
      toast.error(err.message || "Failed to update name");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    // FIX: client-side validation
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const data = await apiRequest(
        "/api/profile/password",
        "PUT",
        { oldPassword, newPassword },
        token
      );
      toast.success(data.message || "Password updated!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate size client-side
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Image must be under 5MB");
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
      // Show local preview
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setFileName("No file selected");
      setPreview(null);
    }
  };

  const handlePictureSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file first");
      return;
    }
    setUploading(true);

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await fetch(`${API_BASE}/api/profile/picture`, {
        method: "POST",
        headers: { "x-auth-token": token },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      onUserUpdate(data.user);
      toast.success("Profile picture updated!");
      setFile(null);
      setFileName("No file selected");
      setPreview(null);
    } catch (err) {
      toast.error(err.message || "Failed to upload picture");
    } finally {
      setUploading(false);
    }
  };

  const profilePicUrl = preview || (user?.profilePicture
    ? `${API_BASE}${user.profilePicture}`
    : null);

  return (
    <div className="profile-page fade-in">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account settings.</p>
      </div>

      <div className="profile-grid">
        {/* === LEFT COLUMN === */}
        <div className="profile-forms">

          {/* Profile Picture */}
          <form onSubmit={handlePictureSubmit} className="profile-form-card">
            <h3><Upload size={18} /> Profile Picture</h3>
            <div className="profile-pic-preview">
              {profilePicUrl ? (
                <img src={profilePicUrl} alt="Profile" />
              ) : (
                <div className="profile-pic-placeholder">
                  <User size={40} />
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Choose Image</label>
              <div className="custom-file-input">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="btn-outline">
                  <ImagePlus size={15} /> Browse
                </label>
                <span className="file-name">{fileName}</span>
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={uploading || !file}>
              {uploading ? "Uploading..." : "Upload Picture"}
            </button>
          </form>

          {/* Update Name */}
          <form onSubmit={handleNameUpdate} className="profile-form-card">
            <h3><Save size={18} /> Update Name</h3>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Name"}
            </button>
          </form>
        </div>

        {/* === RIGHT COLUMN === */}
        <div className="profile-sidebar">

          {/* Account Info */}
          <div className="profile-form-card profile-info-card">
            <h3><User size={18} /> Account Info</h3>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Role</span>
              <span className={`role-badge role-${user.role}`}>{user.role}</span>
            </div>
          </div>

          {/* Change Password */}
          <form onSubmit={handlePasswordUpdate} className="profile-form-card">
            <h3><Lock size={18} /> Change Password</h3>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                minLength={6}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Update Password"}
            </button>
          </form>

          {/* Theme Switcher */}
          <div className="profile-form-card">
            <h3>
              {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
              Appearance
            </h3>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              Currently using <strong>{theme}</strong> mode.
            </p>
            <button
              className="btn-outline"
              style={{ width: "100%" }}
              onClick={toggleTheme}
            >
              {theme === "dark" ? "☀️ Switch to Light" : "🌙 Switch to Dark"} Mode
            </button>
          </div>

          {/* Contact */}
          <div className="profile-form-card">
            <h3>📬 Contact Us</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              For support, reach out to:
            </p>
            <div className="contact-info">
              <Mail size={15} />
              <div className="contact-links">
                {/* BUG FIX: Removed empty 3rd email */}
                <a href="mailto:aaryatedla@gmail.com">aaryatedla@gmail.com</a>
                <a href="mailto:pavithraa2007@gmail.com">pavithraa2007@gmail.com</a>
              </div>
            </div>
            <div className="contact-info" style={{ marginTop: "0.5rem" }}>
              <Phone size={15} />
              <div className="contact-links">
                <span>7794859836</span>
                <span>7204105657</span>
                <span>9019969870</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
