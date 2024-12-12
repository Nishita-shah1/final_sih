// src/components/Notifications.tsx
import React from 'react';

const Notifications: React.FC = () => {
  return (
    <div className="notifications">
      <h3 className="text-xl font-semibold mb-4">Notifications</h3>
      <div className="notification bg-[#f0f8ff] text-[#1c3d5a] py-4 px-5 mb-4 rounded-lg text-base font-medium flex items-center shadow-inner shadow-lg transition-all transform hover:translate-y-[-3px] hover:shadow-2xl hover:bg-[#e0f2ff] cursor-pointer">
        1 new Community message
      </div>
      <div className="notification bg-[#f0f8ff] text-[#1c3d5a] py-4 px-5 mb-4 rounded-lg text-base font-medium flex items-center shadow-inner shadow-lg transition-all transform hover:translate-y-[-3px] hover:shadow-2xl hover:bg-[#e0f2ff] cursor-pointer">
        No new records added
      </div>
      <div className="notification bg-[#f0f8ff] text-[#1c3d5a] py-4 px-5 mb-4 rounded-lg text-base font-medium flex items-center shadow-inner shadow-lg transition-all transform hover:translate-y-[-3px] hover:shadow-2xl hover:bg-[#e0f2ff] cursor-pointer">
        1 Member request
      </div>
      <div className="notification bg-[#f0f8ff] text-[#1c3d5a] py-4 px-5 mb-4 rounded-lg text-base font-medium flex items-center shadow-inner shadow-lg transition-all transform hover:translate-y-[-3px] hover:shadow-2xl hover:bg-[#e0f2ff] cursor-pointer">
        Check latest commits
      </div>
    </div>
  );
};

export default Notifications;