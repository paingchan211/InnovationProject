import React, { useEffect, useState } from "react";
// import "../styles/Admin.css";
import styles from "../styles/Admin.module.css";

const Admin = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]); // Store original unfiltered data

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortKey, setSortKey] = useState("Date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [activeCollection, setActiveCollection] = useState("WildLife");

  const [searchTerm, setSearchTerm] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("Species");

  // Add these new state variables
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'wildlife' or 'user'

  // Modify handleEditUser method
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setNewEmail(user.email);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setEditModalOpen(true);
  };

  // Add submitUserEdit method
  const submitUserEdit = () => {
    // Validate inputs
    if (!newEmail) {
      alert("Email cannot be empty");
      return;
    }

    // If password is being changed, validate password fields
    if (newPassword) {
      if (newPassword !== confirmNewPassword) {
        alert("New passwords do not match");
        return;
      }
      if (!currentPassword) {
        alert("Current password is required to change password");
        return;
      }
    }

    // Prepare update payload
    const updatePayload = {
      email: newEmail,
    };

    // Add password fields if changing password
    if (newPassword) {
      updatePayload.currentPassword = currentPassword;
      updatePayload.newPassword = newPassword;
    }

    // Send update request
    fetch(`http://localhost:5002/api/users/${selectedUser._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatePayload),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.message || "Failed to update user");
          });
        }
        return res.json();
      })
      .then((data) => {
        alert(data.message);
        setEditModalOpen(false);
        fetchUsers(); // Refresh user list
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        alert(error.message);
      });
  };

  const handleDeleteUser = (userId) => {
    setItemToDelete(userId);
    setDeleteType("user");
    setDeleteModalOpen(true);
  };

  const handleDeleteWildlifeEntry = (entryId) => {
    setItemToDelete(entryId);
    setDeleteType("wildlife");
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteType === "user") {
      // Get the token from localStorage
      const token = localStorage.getItem("token");

      fetch(`http://localhost:5002/api/users/${itemToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((err) => {
              throw new Error(err.error || "Failed to delete user");
            });
          }
          return res.json();
        })
        .then((data) => {
          alert(data.message);
          fetchUsers(); // Refresh user list
          setDeleteModalOpen(false);
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          alert(error.message);
        });
    } else if (deleteType === "wildlife") {
      // Get the token from localStorage
      const token = localStorage.getItem("token");

      fetch(`http://localhost:5002/api/wildlife/${itemToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((err) => {
              throw new Error(err.error || "Failed to delete wildlife entry");
            });
          }
          return res.json();
        })
        .then((data) => {
          alert(data.message);
          fetchData(); // Refresh wildlife data
          setDeleteModalOpen(false);
        })
        .catch((error) => {
          console.error("Error deleting wildlife entry:", error);
          alert(error.message);
        });
    }
  };

  // Helper function to parse CSV string into an array of objects
  const parseCsv = (csvString) => {
    const rows = csvString.split("\n").filter((row) => row.trim() !== "");
    const headers = rows[0].split(",");
    return rows.slice(1).map((row) => {
      const values = row.split(",");
      const rowObject = headers.reduce(
        (acc, header, index) => ({
          ...acc,
          [header.trim()]: values[index]?.trim() || "",
        }),
        {}
      );

      if (rowObject.DateTimeTemperature) {
        const [date, time, temperature] =
          rowObject.DateTimeTemperature.split(" ");
        rowObject.Date = date || "";
        rowObject.Time = time || "";
        rowObject.Temperature = parseFloat(temperature) || 0;
        delete rowObject.DateTimeTemperature;
      }

      rowObject.Temperature = parseFloat(rowObject.Temperature) || 0;
      rowObject.Confidence = parseFloat(rowObject.Confidence) || 0;

      return rowObject;
    });
  };

  // Fetch WildLife data
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5002/api/data");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      const parsedData = result.map((item) => ({
        ...item,
        parsedCsv: item.csv_data ? parseCsv(atob(item.csv_data)) : null,
      }));

      setData(Array.isArray(parsedData) ? parsedData : []);
      setOriginalData(Array.isArray(parsedData) ? parsedData : []); // Store original data
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // New method to handle search
  const handleSearch = (term) => {
    setSearchTerm(term);

    if (!term) {
      // If search term is empty, restore original data
      setData(originalData);
      return;
    }

    // Perform search based on selected criteria
    const filteredData = originalData.filter((item) => {
      const firstRow = item.parsedCsv?.[0];

      if (!firstRow) return false;

      // Convert search term and target value to lowercase for case-insensitive search
      const searchTermLower = term.toLowerCase();

      switch (searchCriteria) {
        case "Species":
          return firstRow.Species?.toLowerCase().includes(searchTermLower);
        case "Date":
          return firstRow.Date?.toLowerCase().includes(searchTermLower);
        case "Temperature":
          // Allow searching for temperature as a string or number
          return firstRow.Temperature?.toString().includes(searchTermLower);
        case "Time":
          return firstRow.Time?.toLowerCase().includes(searchTermLower);
        default:
          return false;
      }
    });

    setData(filteredData);
  };

  // Fetch Users data
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5002/api/users");
      if (!response.ok) {
        const errorText = await response.text(); // Get the error details
        console.error("Full error response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }
      const users = await response.json();
      setData(users);
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  // Sort data function
  const sortData = () => {
    const sortedData = [...data].sort((a, b) => {
      let aValue, bValue;

      if (
        sortKey === "Date" ||
        sortKey === "Time" ||
        sortKey === "Temperature" ||
        sortKey === "Species"
      ) {
        const aRow = a.parsedCsv ? a.parsedCsv[0] : null;
        const bRow = b.parsedCsv ? b.parsedCsv[0] : null;

        if (sortKey === "Date") {
          aValue = aRow ? new Date(aRow.Date).getTime() : 0;
          bValue = bRow ? new Date(bRow.Date).getTime() : 0;
        } else if (sortKey === "Time") {
          aValue = aRow ? Date.parse(`1970-01-01T${aRow.Time}Z`) : 0;
          bValue = bRow ? Date.parse(`1970-01-01T${bRow.Time}Z`) : 0;
        } else if (sortKey === "Temperature") {
          aValue = aRow ? parseFloat(aRow.Temperature) : 0;
          bValue = bRow ? parseFloat(bRow.Temperature) : 0;
        } else if (sortKey === "Species") {
          aValue = aRow ? aRow.Species.toLowerCase() : "";
          bValue = bRow ? bRow.Species.toLowerCase() : "";
        }
      } else if (sortKey === "uploadedDate") {
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setData(sortedData);
  };

  useEffect(() => {
    if (activeCollection === "WildLife") {
      fetchData();
    } else if (activeCollection === "Users") {
      fetchUsers();
    }
  }, [activeCollection]);

  useEffect(() => {
    if (data.length > 0) {
      sortData();
    }
  }, [sortKey, sortOrder]);

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <strong>Error Loading Data! </strong>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`container mt-5 ${styles.container}`}>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div>
          <button
            className={`btn ${styles.btnPrimary} me-2`}
            onClick={() => setActiveCollection("WildLife")}
            disabled={activeCollection === "WildLife"}
          >
            WildLife
          </button>
          <button
            className={`btn ${styles.btnDark}`}
            onClick={() => setActiveCollection("Users")}
            disabled={activeCollection === "Users"}
          >
            Users
          </button>
        </div>
        {activeCollection === "WildLife" && (
          <div className="d-flex align-items-center">
            <div className="input-group me-2">
              <select
                className="form-select"
                style={{ width: "auto" }}
                value={searchCriteria}
                onChange={(e) => setSearchCriteria(e.target.value)}
              >
                <option value="Species">Species</option>
                <option value="Date">Date</option>
                <option value="Temperature">Temperature</option>
                <option value="Time">Time</option>
              </select>
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <span className="mx-4">Sort:</span>
            <select
              className="form-select form-select-sm me-2"
              style={{ width: "auto" }}
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
            >
              <option value="Date">Date</option>
              <option value="Time">Time</option>
              <option value="Temperature">Temperature</option>
              <option value="Species">Species</option>
              <option value="uploadedDate">Uploaded Date</option>
            </select>
            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        )}
      </div>
      <div className={`card shadow-sm ${styles.card}`}>
        <div className={`card-header ${styles.cardHeader}`}>
          <h2 className="mb-0">
            {activeCollection === "WildLife" ? "WildLife" : "Users"} Dashboard
          </h2>
        </div>
        <div className="card-body">
          {data.length === 0 ? (
            <p className={`text-muted text-center py-4`}>No data available.</p>
          ) : (
            <div className="table-responsive">
              {activeCollection === "WildLife" ? (
                <table className="table table-hover table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>No</th>
                      <th>Image</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Temperature</th>
                      <th>Species</th>
                      <th>Uploaded Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={item._id || index}>
                        <td>{index + 1}</td>
                        <td>
                          {item.image_data && (
                            <img
                              src={`data:image/jpeg;base64,${item.image_data}`}
                              alt={item.image_filename}
                              className="img-thumbnail"
                              style={{
                                width: "230px",
                                height: "150px",
                                objectFit: "cover",
                              }}
                            />
                          )}
                        </td>
                        <td>{item.parsedCsv?.[0]?.Date || "N/A"}</td>
                        <td>{item.parsedCsv?.[0]?.Time || "N/A"}</td>
                        <td>{item.parsedCsv?.[0]?.Temperature || "N/A"}</td>
                        <td>{item.parsedCsv?.[0]?.Species || "N/A"}</td>
                        <td>
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleString()
                            : "N/A"}
                        </td>
                        <td>
                          <button
                            className={`btn btn-sm ${styles.btnDanger}`}
                            onClick={() => handleDeleteWildlifeEntry(item._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="table table-hover table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>No</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <button
                            className={`btn btn-sm btn-warning me-2`}
                            onClick={() => handleEditUser(user)}
                          >
                            Edit
                          </button>
                          <button
                            className={`btn btn-sm ${styles.btnDanger}`}
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
      {editModalOpen && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className={`modal-header ${styles.modalHeader}`}>
                <h5 className="modal-title">Edit User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (optional)"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmNewPassword" className="form-label">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className={`btn ${styles.btnSecondary}`}
                  onClick={() => setEditModalOpen(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className={`btn ${styles.btnPrimary}`}
                  onClick={submitUserEdit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {deleteModalOpen && (
        <div
          className="modal d-flex align-items-center justify-content-center"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className={`modal-header ${styles.modalHeader}`}>
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this{" "}
                {deleteType === "user" ? "user" : "wildlife entry"}?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className={`btn ${styles.btnSecondary}`}
                  onClick={() => setDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`btn ${styles.btnDanger}`}
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
