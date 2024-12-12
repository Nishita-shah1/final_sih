import React from 'react';

const Notifications: React.FC = () => {
  return (
    <div className="p-6 bg-blue-50 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">Notifications</h3>
      <div className="notification bg-blue-50 text-blue-900 px-5 py-4 mb-4 rounded-lg text-base font-medium flex items-center shadow-md transition-transform hover:translate-y-[-3px] hover:shadow-lg hover:bg-blue-100">
        <span className="mr-3 text-lg">🔔</span>
        1 new Researcher registered
      </div>
      <div className="notification bg-blue-50 text-blue-900 px-5 py-4 mb-4 rounded-lg text-base font-medium flex items-center shadow-md transition-transform hover:translate-y-[-3px] hover:shadow-lg hover:bg-blue-100">
        <span className="mr-3 text-lg">🔔</span>
        All records are up to Date
      </div>
      <div className="notification bg-blue-50 text-blue-900 px-5 py-4 mb-4 rounded-lg text-base font-medium flex items-center shadow-md transition-transform hover:translate-y-[-3px] hover:shadow-lg hover:bg-blue-100">
        <span className="mr-3 text-lg">🔔</span>
        No urgent data requests
      </div>
      <div className="notification bg-blue-50 text-blue-900 px-5 py-4 rounded-lg text-base font-medium flex items-center shadow-md transition-transform hover:translate-y-[-3px] hover:shadow-lg hover:bg-blue-100">
        <span className="mr-3 text-lg">🔔</span>
        Check latest commits
      </div>
    </div>
  );
};

export default Notifications;