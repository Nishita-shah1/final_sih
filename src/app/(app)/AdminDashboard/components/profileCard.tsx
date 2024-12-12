"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import the router hook

interface ProfileData {
  adminId: string;
  name: string;
  role: string;
  email: string;
  image?: string; // Optional image field
}

const ProfileCard: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    fetch("/api/profile") // Replace with the actual endpoint from your backend
      .then((response) => response.json())
      .then((data: ProfileData) => setProfileData(data))
      .catch((error) => console.error("Error fetching profile data:", error));
  }, []);

  const handleButtonClick = (action: string) => {
    if (action === "Upload new files") {
      router.replace("/fileUpload"); // Navigate to AdminDashboard
    }
    if (action === "Gallery") {
      router.replace("/gallery"); // Navigate to AdminDashboard
    }
    if (action === "Community") {
      router.replace("/community"); // Navigate to AdminDashboard
    }
    if (action === "Fetch data") {
      router.replace("/fetchdata"); // Navigate to AdminDashboard
    }
    if (action === "PFZ Module") {
      router.replace("/pfz"); // Navigate to AdminDashboard
    }
    if (action === "Village Module") {
      router.replace("/village"); // Navigate to AdminDashboard
    }
    if (action === "Landing Site Module") {
      router.replace("/landingSite"); // Navigate to AdminDashboard
    }
    // Add logic for other actions if needed
  };

  if (!profileData) {
    return (
      <div className="bg-blue-50 rounded-lg shadow-lg p-6 flex flex-col items-center gap-4">
        <div className="w-40 h-40 rounded-full bg-blue-200 flex justify-center items-center">
          <img
            src="person.png"
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="bg-blue-100 p-4 rounded-lg w-full text-blue-800">
          <p>
            <strong>Admin Id:</strong> Loading...
          </p>
          <p>
            <strong>Name:</strong> Loading...
          </p>
          <p>
            <strong>Role:</strong> Admin
          </p>
          <p>
            <strong>Email:</strong> Loading...
          </p>
        </div>
        <div className="flex flex-col w-full gap-2">
          {[
            "Upload new files",
            "Fetch data",
            "PFZ Module",
            "Village Module",
            "Landing Site Module",
            "Gallery",
            "Community","Map",
          ].map((action) => (
            <button
              key={action}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              onClick={() => handleButtonClick(action)} // Attach click handler
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 rounded-lg shadow-lg p-6 flex flex-col items-center gap-4">
      <div className="w-40 h-40 rounded-full bg-blue-200 flex justify-center items-center">
        <img
          src={profileData.image || "path-to-placeholder-profile-image"}
          alt="Profile"
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      <div className="bg-blue-100 p-4 rounded-lg w-full text-blue-800">
        <p>
          <strong>Admin Id:</strong> {profileData.adminId}
        </p>
        <p>
          <strong>Name:</strong> {profileData.name}
        </p>
        <p>
          <strong>Role:</strong> {profileData.role}
        </p>
        <p>
          <strong>Email:</strong> {profileData.email}
        </p>
      </div>
      <div className="flex flex-col w-full gap-2">
        {[
          "Upload new files",
            "Update Data",
            "Version Control",
            "Manage Access",
            "Gallery",
            "Metrices",
        ].map((action) => (
          <button
            key={action}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            onClick={() => handleButtonClick(action)} // Attach click handler
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileCard;