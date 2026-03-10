
import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, colorClass }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
      <div className={`p-3 rounded-full ${colorClass}`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default KpiCard;
