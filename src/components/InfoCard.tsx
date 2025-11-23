import React, { ReactNode } from 'react';

interface InfoCardProps {
  label: string;
  value: string | number | undefined;
  icon?: ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ label, value, icon }) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  return (
    <div 
      className="rounded-xl p-4 border border-gray-100"
      style={{ backgroundColor: '#f5f5f8' }}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex-shrink-0 mt-1">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className="text-sm font-medium text-apple-text break-all">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;