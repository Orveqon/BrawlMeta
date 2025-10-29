import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Profil Kartı İskeleti */}
      <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 shadow-lg border border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 rounded-full bg-gray-700"></div>
          <div className="flex-1">
            <div className="h-10 bg-gray-700 rounded w-3/4"></div>
            <div className="h-6 bg-gray-700 rounded w-1/2 mt-2"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="h-20 bg-gray-700 rounded-lg"></div>
          <div className="h-20 bg-gray-700 rounded-lg"></div>
          <div className="h-20 bg-gray-700 rounded-lg"></div>
          <div className="h-20 bg-gray-700 rounded-lg"></div>
        </div>
      </div>

      {/* Savaşçılar Başlık İskeleti */}
      <div className="h-9 bg-gray-700 rounded w-1/3 mt-8 mb-4"></div>

      {/* Savaşçılar Grid İskeleti */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="bg-gray-800 bg-opacity-50 rounded-lg p-2">
            <div className="w-20 h-20 mx-auto bg-gray-700 rounded-md"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto mt-2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2 mx-auto mt-1"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
