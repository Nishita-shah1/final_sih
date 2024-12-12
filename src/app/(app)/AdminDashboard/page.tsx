import React from 'react';
import ProfileCard from './components/profileCard';
import Notifications from './components/Notifications';
import LatestActions from './components/ActivityStats';
import './index.css'; // Make sure Tailwind is set up here

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}

      <div className="dashboard-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-8 bg-gray-100">
        {/* Profile Section */}
        <div className="profile-section bg-white rounded-lg shadow-lg p-6">
          <ProfileCard />
        </div>

        {/* Activity Section */}
        <div className="activity-section bg-white rounded-lg shadow-lg p-6 md:col-span-2 lg:col-span-1">
          <LatestActions />
        </div>

        {/* Notifications Section */}
        <div className="notifications-section bg-white rounded-lg shadow-lg p-6 md:col-span-2 lg:col-span-1">
          <Notifications />
        </div>
      </div>
    </div>
  );
}

export default App;