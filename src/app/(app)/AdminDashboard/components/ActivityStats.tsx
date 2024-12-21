
/* eslint-disable react/no-unescaped-entities */
import React from 'react';

const ActivityStats: React.FC = () => {
  return (
    <div className="bg-[#f0f8ff] p-5 rounded-lg shadow-md">
      <h3 className="text-[#1c3d5a] text-lg font-semibold mb-4">Today's Activity</h3>
      <div className="grid grid-cols-3 gap-5">
        <div className="bg-[#e0efff] text-[#1c3d5a] p-5 rounded-lg text-center shadow-inner shadow-md transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:bg-[#d0e6ff] cursor-pointer">
          <div className="text-3xl mb-2">👥</div>
          <p className="text-2xl font-bold mb-1">415</p>
          <p>Active Users</p>
        </div>
        <div className="bg-[#e0efff] text-[#1c3d5a] p-5 rounded-lg text-center shadow-inner shadow-md transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:bg-[#d0e6ff] cursor-pointer">
          <div className="text-3xl mb-2">📄</div>
          <p className="text-2xl font-bold mb-1">29570</p>
          <p>Records</p>
        </div>
        <div className="bg-[#e0efff] text-[#1c3d5a] p-5 rounded-lg text-center shadow-inner shadow-md transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:bg-[#d0e6ff] cursor-pointer">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-2xl font-bold mb-1">0</p>
          <p>Commits</p>
        </div>
        <div className="bg-[#e0efff] text-[#1c3d5a] p-5 rounded-lg text-center shadow-inner shadow-md transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:bg-[#d0e6ff] cursor-pointer">
          <div className="text-3xl mb-2">👤</div>
          <p className="text-2xl font-bold mb-1">10</p>
          <p>Active Admins</p>
        </div>
        <div className="bg-[#e0efff] text-[#1c3d5a] p-5 rounded-lg text-center shadow-inner shadow-md transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:bg-[#d0e6ff] cursor-pointer">
          <div className="text-3xl mb-2">📑</div>
          <p>Datasets</p>
        </div>
        <div className="bg-[#e0efff] text-[#1c3d5a] p-5 rounded-lg text-center shadow-inner shadow-md transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:bg-[#d0e6ff] cursor-pointer">
          <div className="text-3xl mb-2">🗂</div>
          <p>Actions</p>
        </div>
      </div>
    </div>
  );
};

export default ActivityStats;