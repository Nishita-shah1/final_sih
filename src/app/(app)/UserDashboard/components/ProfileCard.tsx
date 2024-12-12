// profileCard.tsx

'use client'; // Add this line to mark this as a client component

import React, { useState, useEffect } from 'react';

interface ProfileData {
  adminId: string;
  name: string;
  role: string;
  email: string;
  image?: string;
}

const ProfileCard: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    fetch('/api/profile')  // Replace with the actual endpoint from your backend
      .then((response) => response.json())
      .then((data) => setProfileData(data))
      .catch((error) => console.error('Error fetching profile data:', error));
  }, []);

  if (!profileData) {
    return (
      <div className="bg-[#f1f7fc] rounded-lg p-6 w-full h-full shadow-lg flex flex-col box-border">
        <div className="flex justify-center mb-4 p-2">
          <img src="path-to-placeholder-profile-image" alt="Profile" className="w-40 h-40 rounded-full bg-[#a0b8da]" />
        </div>
        <div className="bg-[#dbe7f2] p-4 rounded-lg mb-5 flex-shrink-0">
          <p className="text-[#3a4f6e] text-base mb-2"><strong>User Id:</strong> Loading...</p>
          <p className="text-[#3a4f6e] text-base mb-2"><strong>Name:</strong> Loading...</p>
          <p className="text-[#3a4f6e] text-base mb-2"><strong>Role:</strong> Loading...</p>
          <p className="text-[#3a4f6e] text-base mb-2"><strong>Email:</strong> Loading...</p>
        </div>
        <div className="flex flex-col gap-3">
          <button className="bg-[#7b91b9] text-white p-3 rounded-md text-left text-base hover:bg-[#6882a6] transition-all">View Records</button>
          <button className="bg-[#7b91b9] text-white p-3 rounded-md text-left text-base hover:bg-[#6882a6] transition-all">Maps</button>
          <button className="bg-[#7b91b9] text-white p-3 rounded-md text-left text-base hover:bg-[#6882a6] transition-all">Version Control</button>
          <button className="bg-[#7b91b9] text-white p-3 rounded-md text-left text-base hover:bg-[#6882a6] transition-all">Community</button>
          <button className="bg-[#7b91b9] text-white p-3 rounded-md text-left text-base hover:bg-[#6882a6] transition-all">History</button>
          <button className="bg-[#7b91b9] text-white p-3 rounded-md text-left text-base hover:bg-[#6882a6] transition-all">Settings</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f1f7fc] rounded-lg p-6 w-full h-full shadow-lg flex flex-col box-border">
      <div className="flex justify-center mb-4 p-2">
        <img src={profileData.image || 'path-to-placeholder-profile-image'} alt="Profile" className="w-40 h-40 rounded-full bg-[#a0b8da]" />
      </div>
      <div className="bg-[#dbe7f2] p-4 rounded-lg mb-5 flex-shrink-0">
        <p className="text-[#3a4f6e] text-base mb-2"><strong>Admin Id:</strong> {profileData.adminId}</p>
        <p className="text-[#3a4f6e] text-base mb-2"><strong>Name:</strong> {profileData.name}</p>
        <p className="text-[#3a4f6e] text-base mb-2"><strong>Role:</strong> {profileData.role}</p>
        <p className="text-[#3a4f6e] text-base mb-2"><strong>Email:</strong> {profileData.email}</p>
      </div>
      <div className="flex flex-col gap-3">
        <button className="bg-[#7b91b9] text-white p-3 rounded-md text-left text-base hover:bg-[#6882a6] transition-all">Upload new files</button>
        <button className="bg-[#7b91b9] text-white p-3 rounded-md text-left text-base hover:bg-[#6882a6] transition-all">Update Data</button>
        <button className="bg-[#7b91b9] text-white p-3 rounded-md text-left text-base hover:bg-[#6882a6] transition-all">Version Control</button>
        <button className="bg-[#7b91b9] text-white p-3 rounded-md text-left text-base hover:bg-[#6882a6] transition-all">Manage Access</button>
        <button className="bg-[#7b91b9] text-white p-3 rounded-md text-left text-base hover:bg-[#6882a6] transition-all">History</button>
        <button className="bg-[#7b91b9] text-white p-3 rounded-md text-left text-base hover:bg-[#6882a6] transition-all">Settings</button>
      </div>
    </div>
  );
};

export default ProfileCard;