import React from 'react';
import { TransferOpportunity } from '../types';
import KpiCard from './KpiCard';
import { DollarSignIcon, CashIcon, ChartBarIcon } from '../constants';

interface PerformanceSummaryProps {
  approvedOpportunities: TransferOpportunity[];
}

const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({ approvedOpportunities }) => {
    const totalNetSave = approvedOpportunities.reduce((sum, op) => sum + op.netSave, 0);
    const totalSalesValueGained = approvedOpportunities.reduce((sum, op) => sum + op.potentialWasteValue, 0);
    const approvedCount = approvedOpportunities.length;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">สรุปผลการดำเนินงาน</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <KpiCard
                        title="ผลประโยชน์สุทธิสะสม (Net Save)"
                        value={`${totalNetSave.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} บาท`}
                        icon={<DollarSignIcon className="h-8 w-8 text-green-600" />}
                        colorClass="bg-green-100"
                    />
                     <KpiCard
                        title="มูลค่าขายเพิ่มสะสม (Profit)"
                        value={`${totalSalesValueGained.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} บาท`}
                        icon={<CashIcon className="h-8 w-8 text-blue-600" />}
                        colorClass="bg-blue-100"
                    />
                    <KpiCard
                        title="จำนวนรายการที่อนุมัติ"
                        value={`${approvedCount} รายการ`}
                        icon={<ChartBarIcon className="h-8 w-8 text-indigo-600" />}
                        colorClass="bg-indigo-100"
                    />
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">ประวัติการอนุมัติ</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สินค้า</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จาก</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ไป</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวน</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Save (บาท)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {approvedOpportunities.length > 0 ? (
                                approvedOpportunities.map(op => (
                                    <tr key={op.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{op.product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{op.sourceBranch.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{op.destinationBranch.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{op.transferUnits}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-right font-semibold">{op.netSave.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">ยังไม่มีรายการที่อนุมัติ</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PerformanceSummary;