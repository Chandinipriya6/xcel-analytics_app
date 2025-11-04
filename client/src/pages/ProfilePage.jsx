import React, { useEffect, useState } from "react";
import "./ProfilePage.css"
function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/admin/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();   // ✅ convert to JSON
        setProfile(data);                // ✅ now it works
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
    <div className="profile-details">
      <h2>👤 Admin Profile</h2>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Role:</strong> {profile.role}</p>

      {/* <p>
        <strong>Joined:</strong>{" "}
        {profile.createdAt
          ? new Date(profile.createdAt).toLocaleString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Not available"}
      </p> */}

      <p>
        <strong>Last Login:</strong>{" "}
        {profile.lastLogin
          ? new Date(profile.lastLogin).toLocaleString()
          : "Not available"}
      </p>
    </div>
    </div>
  );
}

export default ProfilePage;

{/* <p>
  Joined: {profile.createdAt 
    ? new Date(profile.createdAt).toLocaleDateString() 
    : "Not available"}
</p> */}
