import React, { useState } from "react";
import "../components/Components.css";
import "../pages/Home.css";
import { useAuth0 } from "@auth0/auth0-react";

export function HomeTitleBar() {
  // State to manage the current status
  const [status, setStatus] = useState("online");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { user, isAuthenticated, loginWithRedirect, logout, isLoading } =
    useAuth0();

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Handler function to update the status
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setDropdownVisible(false); // Close dropdown after selection
  };

  const logoutFlow = () => {
    if (
      window.confirm(`Hey ${user.nickname}, Are you sure you want to log out?`)
    ) {
      logout();
    }
  };

  return (
    <>
      <div className="titlebar">
        <p className="title">BuzzLink</p>
        <div className="profile-icon-container">
          {isAuthenticated ? (
            <>
              <img src="./buzzpfp.png" alt="Profile" className="profile-icon" />
              <button
                className={`status-indicator ${status}`}
                onClick={toggleDropdown}
              ></button>
              {dropdownVisible && (
                <div className="status-dropdown">
                  <div
                    className="status-option"
                    onClick={() => handleStatusChange("online")}
                  >
                    Online
                  </div>
                  <div
                    className="status-option"
                    onClick={() => handleStatusChange("offline")}
                  >
                    Offline
                  </div>
                  <div
                    className="status-option"
                    onClick={() => handleStatusChange("dnd")}
                  >
                    Do Not Disturb
                  </div>
                  <div className="status-option" onClick={() => logoutFlow()}>
                    <span style={{ color: "red" }}>Exit Buzzlink</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            !isLoading && (
              <button className="login-button" onClick={loginWithRedirect}>
                Login
              </button>
            )
          )}
        </div>
      </div>
      <div className="divider"></div>
    </>
  );
}

export default HomeTitleBar;
