import React from 'react';

const SkeletonCard = ({ lines = 3, height = "h-4", rounded = "rounded-md", className = "" }) => {
  return (
    <div className={`animate-pulse bg-white shadow-md p-6 rounded-2xl ${className}`}>
      <div className="h-8 bg-gray-300 rounded w-3/4 mb-6 mx-auto"></div>
      <div className="space-y-4 mb-6">
        {[...Array(lines)].map((_, index) => (
          <div key={index} className={`${height} bg-gray-300 ${rounded}`}></div>
        ))}
      </div>
      <div className="h-10 bg-gray-300 rounded w-1/2 mx-auto"></div>
    </div>
  );
};

export default SkeletonCard;
