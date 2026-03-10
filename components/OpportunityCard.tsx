import React from 'react';
import { TransferOpportunity } from '../types';
import { ArrowRightIcon } from '../constants';

interface OpportunityCardProps {
  opportunity: TransferOpportunity;
  onSelect: (opportunity: TransferOpportunity) => void;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, onSelect }) => {
  const { product, sourceBranch, destinationBranch, netSave, status } = opportunity;

  const statusBadge = () => {
    switch (status) {
      case 'pending':
        return <span className="text-xs text-orange-500 font-semibold px-2 py-1 bg-orange-100 rounded-full">รอการอนุมัติ</span>;
      case 'problem':
        return <span className="text-xs text-red-600 font-semibold px-2 py-1 bg-red-100 rounded-full">พบปัญหา</span>;
      default:
        return null;
    }
  };

  return (
    <div 
      onClick={() => onSelect(opportunity)}
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg hover:ring-2 hover:ring-orange-400 transition-all duration-200 cursor-pointer mb-4"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{product.name} - โอนย้าย {opportunity.transferUnits} {product.unit}</h3>
          <div className="flex items-center text-sm text-gray-600 mt-2">
            <span className="font-semibold">{sourceBranch.name}</span>
            <ArrowRightIcon className="h-5 w-5 mx-2 text-gray-400" />
            <span className="font-semibold">{destinationBranch.name}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">ผลประโยชน์สุทธิ (Net Save)</p>
          <p className="text-2xl font-bold text-green-600">
            {netSave.toLocaleString()} บาท
          </p>
          {statusBadge()}
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;