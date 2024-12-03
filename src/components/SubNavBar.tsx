import React from 'react';
import Link from 'next/link';

const SubNavBar: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white p-4">
      <nav className="flex justify-between">
        <Link href="/fileUpload">
          <a className="text-xl px-4 py-2">Table</a>
        </Link>
        <Link href="/maps">
          <a className="text-xl px-4 py-2">Maps</a>
        </Link>
        <Link href="/gallery">
          <a className="text-xl px-4 py-2">Gallery</a>
        </Link>
        <Link href="/community">
          <a className="text-xl px-4 py-2">Community</a>
        </Link>
      </nav>
    </div>
  );
};

export default SubNavBar;
