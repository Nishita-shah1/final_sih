'use client';

import React from 'react';
import UploadFile from '@/components/UploadedFile';
 // Import UploadFile component

const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
      <UploadFile /> {/* Add UploadFile Component */}
    </div>
  );
};

export default Dashboard;
