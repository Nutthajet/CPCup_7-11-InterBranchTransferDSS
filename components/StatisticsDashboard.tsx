import React from 'react';
import KpiCard from './KpiCard';
import { TransferOpportunity } from '../types';
import { DollarSignIcon, ClockIcon, CheckCircleIcon } from '../constants';

interface StatisticsDashboardProps {
  opportunities: TransferOpportunity[];
}

// FIX: Create the StatisticsDashboard component to display KPIs
const StatisticsDashboard: React.FC<StatisticsDashboardProps> = ({ opportunities }) => {
  const pendingOpportunities = opportunities.filter(op => op.status === 'pending');
  const approvedOpportunities = opportunities.filter(op => op.status === 'approved');

  const totalNetSave = approvedOpportunities.reduce((sum, op) => sum + op.netSave, 0);
  const pendingCount = pendingOpportunities.length;
  const potentialNetSave = pendingOpportunities.reduce((sum, op) => sum + op.netSave, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <KpiCard
        title="ผลประโยชน์สุทธิที่เกิดขึ้น (Approved)"
        value={`${totalNetSave.toLocaleString()} บาท`}
        icon={<DollarSignIcon className="h-8 w-8 text-green-600" />}
        colorClass="bg-green-100"
      />
      <KpiCard
        title="รายการรออนุมัติ (Pending)"
        value={`${pendingCount} รายการ`}
        icon={<ClockIcon className="h-8 w-8 text-orange-600" />}
        colorClass="bg-orange-100"
      />
      <KpiCard
        title="ผลประโยชน์สุทธิที่รอตัดสินใจ"
        value={`${potentialNetSave.toLocaleString()} บาท`}
        icon={<CheckCircleIcon className="h-8 w-8 text-blue-600" />}
        colorClass="bg-blue-100"
      />
    </div>
  );
};

export default StatisticsDashboard;