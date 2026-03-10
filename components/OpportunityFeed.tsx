import React from 'react';
import { TransferOpportunity } from '../types';
import OpportunityCard from './OpportunityCard';

interface OpportunityFeedProps {
  opportunities: TransferOpportunity[];
  onSelectOpportunity: (opportunity: TransferOpportunity) => void;
}

const OpportunityFeed: React.FC<OpportunityFeedProps> = ({ opportunities, onSelectOpportunity }) => {
  const opportunitiesToShow = opportunities.filter(op => op.status === 'pending' || op.status === 'problem');

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">ฟีดแนะนำการโอนย้าย (Transfer Opportunity Feed)</h2>
      {opportunitiesToShow.length > 0 ? (
        <div>
          {opportunitiesToShow.map(opp => (
            <OpportunityCard key={opp.id} opportunity={opp} onSelect={onSelectOpportunity} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">ไม่มีรายการแนะนำในขณะนี้</p>
        </div>
      )}
    </div>
  );
};

export default OpportunityFeed;