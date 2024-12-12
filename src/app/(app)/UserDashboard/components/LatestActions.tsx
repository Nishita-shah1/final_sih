// src/components/LatestActions.tsx
import React from 'react';

const ActivityStats: React.FC = () => {
  return (
    <div className="activity-stats bg-[#f0f8ff] p-5 rounded-lg shadow-lg">
      <h3 className="text-[#1c3d5a] text-xl mb-4 font-semibold">Today's Activity</h3>
      <div className="stats-grid grid grid-cols-3 gap-5">
        <div className="stat-item bg-[#e0efff] text-[#1c3d5a] p-5 rounded-lg text-center shadow-inner hover:transform hover:translate-y-1 hover:shadow-lg cursor-pointer hover:bg-[#d0e6ff] transition-all">
          <div className="stat-icon text-3xl mb-2">📄</div>
          <p className="stat-number text-2xl font-bold mb-1">10</p>
          <p>Downloaded Items</p>
        </div>
        <div className="stat-item bg-[#e0efff] text-[#1c3d5a] p-5 rounded-lg text-center shadow-inner hover:transform hover:translate-y-1 hover:shadow-lg cursor-pointer hover:bg-[#d0e6ff] transition-all">
          <div className="stat-icon text-3xl mb-2">📄</div>
          <p className="stat-number text-2xl font-bold mb-1">29570</p>
          <p>Records</p>
        </div>
        <div className="stat-item bg-[#e0efff] text-[#1c3d5a] p-5 rounded-lg text-center shadow-inner hover:transform hover:translate-y-1 hover:shadow-lg cursor-pointer hover:bg-[#d0e6ff] transition-all">
          <div className="stat-icon text-3xl mb-2">✅</div>
          <p className="stat-number text-2xl font-bold mb-1">0</p>
          <p>Commits</p>
        </div>
        <div className="stat-item bg-[#e0efff] text-[#1c3d5a] p-5 rounded-lg text-center shadow-inner hover:transform hover:translate-y-1 hover:shadow-lg cursor-pointer hover:bg-[#d0e6ff] transition-all">
          <div className="stat-icon text-3xl mb-2">👤</div>
          <p className="stat-number text-2xl font-bold mb-1">10</p>
          <p>Active Community Members</p>
        </div>
        <div className="stat-item bg-[#e0efff] text-[#1c3d5a] p-5 rounded-lg text-center shadow-inner hover:transform hover:translate-y-1 hover:shadow-lg cursor-pointer hover:bg-[#d0e6ff] transition-all">
          <div className="stat-icon text-3xl mb-2">📑</div>
          <div>
            <p>Datasets</p>
          </div>
        </div>
        <div className="stat-item bg-[#e0efff] text-[#1c3d5a] p-5 rounded-lg text-center shadow-inner hover:transform hover:translate-y-1 hover:shadow-lg cursor-pointer hover:bg-[#d0e6ff] transition-all">
          <div className="stat-icon text-3xl mb-2">🗂</div>
          <div>
            <p>Actions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityStats;