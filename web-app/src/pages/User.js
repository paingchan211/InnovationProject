import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/User.module.css"; // Import scoped CSS module

const User = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = () => localStorage.getItem("token");

  axios.defaults.baseURL = "http://localhost:5002";

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = getToken();
      if (!token) {
        setError("Not authenticated");
        return;
      }

      const response = await axios.get("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
      setFormData((prev) => ({
        ...prev,
        email: response.data.email,
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user data");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (formData.newPassword && formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!formData.currentPassword) {
      setError("Current password is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = getToken();
      if (!token) {
        setError("Not authenticated");
        return;
      }

      const response = await axios.put(
        "/api/user/update",
        {
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Profile updated successfully");
      setIsEditing(false);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      fetchUserData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className={`container py-5 ${styles.container}`}>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className={`card ${styles.card}`}>
            <div className="card-body">
              <h2 className={`card-title ${styles.cardTitle}`}>
                User Dashboard
              </h2>

              {error && (
                <div
                  className={`alert alert-danger ${styles.alert}`}
                  role="alert"
                >
                  {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError("")}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              {success && (
                <div
                  className={`alert alert-success ${styles.alert}`}
                  role="alert"
                >
                  {success}
                </div>
              )}

              {!isEditing ? (
                <div className="mb-4">
                  <p className="mb-3">
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`btn btn-primary ${styles.btnPrimary}`}
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label
                      htmlFor="email"
                      className={`form-label ${styles.formLabel}`}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className={`form-control ${styles.formControl}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="currentPassword"
                      className={`form-label ${styles.formLabel}`}
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      className={`form-control ${styles.formControl}`}
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="newPassword"
                      className={`form-label ${styles.formLabel}`}
                    >
                      New Password (optional)
                    </label>
                    <input
                      type="password"
                      className={`form-control ${styles.formControl}`}
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="confirmPassword"
                      className={`form-label ${styles.formLabel}`}
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className={`form-control ${styles.formControl}`}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={!formData.newPassword}
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className={`btn btn-primary ${styles.btnPrimary}`}
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className={`btn btn-secondary ${styles.btnSecondary}`}
                      onClick={() => {
                        setIsEditing(false);
                        setError("");
                        setSuccess("");
                        setFormData((prev) => ({
                          ...prev,
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        }));
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
