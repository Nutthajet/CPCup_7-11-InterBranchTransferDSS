import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import StatisticsDashboard from './components/StatisticsDashboard';
import OpportunityFeed from './components/OpportunityFeed';
import AnalysisModal from './components/AnalysisModal';
import PerformanceSummary from './components/PerformanceSummary';
import BranchTaskView from './components/BranchTaskView';
import { TransferOpportunity } from './types';

// --- Multiple Case Studies ---

const initialOpportunities: TransferOpportunity[] = [
  // Case 1: Gochujang (Original)
  {
    id: 'OPP-GOCHUJANG-ASK-RTW-01',
    product: { id: 'PROD-GOCHUJANG', name: 'โคชูจังตราซูอิน', price: 89, gpMargin: 0.30, unit: 'กล่อง' },
    sourceBranch: { id: 5, name: '7-Eleven สาขาแยกอโศก', stock: 25, salesVelocity: 1, shelfLife: 4 },
    destinationBranch: { id: 6, name: '7-Eleven สาขา Ideo Q ราชเทวี', stock: 2, salesVelocity: 15 },
    transferUnits: 20,
    distance: 6.0,
    logisticsCost: 20,
    potentialWasteValue: 20 * 89 * 0.30,
    netSave: (20 * 89 * 0.30) - 20,
    status: 'pending',
  },
  // Case 2: Premium Sandwich (High value, high urgency)
  {
    id: 'OPP-SANDWICH-PLJ-SNA-01',
    product: { id: 'PROD-SANDWICH', name: 'แซนวิชแฮมชีสพรีเมียม', price: 65, gpMargin: 0.40, unit: 'ชิ้น' },
    sourceBranch: { id: 7, name: 'สาขาเพลินจิต เซ็นเตอร์', stock: 18, salesVelocity: 2, shelfLife: 2 },
    destinationBranch: { id: 8, name: 'สาขาสนามกีฬาแห่งชาติ', stock: 1, salesVelocity: 12 },
    transferUnits: 15,
    distance: 3.0,
    logisticsCost: 15,
    potentialWasteValue: 15 * 65 * 0.40,
    netSave: (15 * 65 * 0.40) - 15,
    status: 'pending',
  },
  // Case 3: Bottled Water (Bulk item, low margin)
  {
    id: 'OPP-WATER-S62-S48-01',
    product: { id: 'PROD-WATER', name: 'น้ำดื่มคริสตัล 600มล. (แพ็ค)', price: 10, gpMargin: 0.20, unit: 'แพ็ค' },
    sourceBranch: { id: 9, name: 'สาขาสุขุมวิท 62', stock: 150, salesVelocity: 10, shelfLife: 30 },
    destinationBranch: { id: 10, name: 'สาขาสุขุมวิท 48/3', stock: 20, salesVelocity: 80 },
    transferUnits: 120,
    distance: 2.5,
    logisticsCost: 12,
    potentialWasteValue: 120 * 10 * 0.20,
    netSave: (120 * 10 * 0.20) - 12,
    status: 'pending',
  },
  // Case 4: Ready-to-eat Meal (Mid-value)
  {
    id: 'OPP-KAPRAO-CWT-RMA4-01',
    product: { id: 'PROD-KAPRAO', name: 'ข้าวผัดกะเพราหมูสับ CP', price: 45, gpMargin: 0.25, unit: 'กล่อง' },
    sourceBranch: { id: 11, name: 'สาขาอาคารซีดับเบิลยู ทาวเวอร์', stock: 40, salesVelocity: 5, shelfLife: 5 },
    destinationBranch: { id: 12, name: 'สาขาพระราม 4 (ตลาดคลองเตย)', stock: 5, salesVelocity: 25 },
    transferUnits: 30,
    distance: 4.5,
    logisticsCost: 18,
    potentialWasteValue: 30 * 45 * 0.25,
    netSave: (30 * 45 * 0.25) - 18,
    status: 'pending',
  },
];


const App: React.FC = () => {
  const [opportunities, setOpportunities] = useState<TransferOpportunity[]>(initialOpportunities);
  const [selectedOpportunity, setSelectedOpportunity] = useState<TransferOpportunity | null>(null);
  const [activeView, setActiveView] = useState<'feed' | 'stats'>('feed');
  const [userRole, setUserRole] = useState<'central' | 'branch'>('central');


  const handleSelectOpportunity = (opportunity: TransferOpportunity) => {
    setSelectedOpportunity(opportunity);
  };

  const handleCloseModal = () => {
    setSelectedOpportunity(null);
  };

  const handleApprove = (id: string) => {
    setOpportunities(prev => 
      prev.map(op => op.id === id ? { ...op, status: 'approved' } : op)
    );
    handleCloseModal();
  };
  
  const handleReject = (id: string) => {
    setOpportunities(prev => 
      prev.map(op => op.id === id ? { ...op, status: 'rejected' } : op)
    );
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    setOpportunities(prev => prev.filter(op => op.id !== id));
    handleCloseModal();
  };
  
  const handleTaskComplete = (id: string) => {
    setOpportunities(prev =>
      prev.map(op => op.id === id ? { ...op, status: 'completed' } : op)
    );
  };

  const handleReportProblem = (id: string, details: TransferOpportunity['problemDetails']) => {
    setOpportunities(prev =>
      prev.map(op => op.id === id ? { ...op, status: 'problem', problemDetails: details } : op)
    );
     // Switch back to central view to see the problem
    setUserRole('central');
  };


  const resetDemo = () => {
      setOpportunities(initialOpportunities);
      setActiveView('feed');
      setUserRole('central');
  };

  const pendingOpportunities = useMemo(() => opportunities.filter(op => op.status === 'pending' || op.status === 'problem'), [opportunities]);
  const approvedOpportunities = useMemo(() => opportunities.filter(op => op.status === 'approved' || op.status === 'completed'), [opportunities]);
  // NOTE: This logic might need adjustment if multiple tasks can be approved for the same branch.
  // For this demo, it finds the first approved task for the specific demo branch.
  const branchTask = useMemo(() => opportunities.find(op => op.status === 'approved' && op.sourceBranch.name === '7-Eleven สาขาแยกอโศก'), [opportunities]);

  if (userRole === 'branch') {
    return <BranchTaskView 
              task={branchTask} 
              onBackToCentral={() => setUserRole('central')} 
              onResetDemo={resetDemo}
              onTaskComplete={handleTaskComplete}
              onReportProblem={handleReportProblem}
            />;
  }

  return (
    <div className="bg-slate-100 min-h-screen">
      <Header user={{ name: 'คุณสมชาย (ส่วนกลาง)', role: 'ผู้จัดการฝ่ายปฏิบัติการ', initial: 'ส' }} />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveView('feed')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeView === 'feed' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        aria-current={activeView === 'feed' ? 'page' : undefined}
                    >
                        ฟีดแนะนำ ({pendingOpportunities.length})
                    </button>
                    <button
                        onClick={() => setActiveView('stats')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeView === 'stats' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        aria-current={activeView === 'stats' ? 'page' : undefined}
                    >
                        สรุปผล ({approvedOpportunities.length})
                    </button>
                </nav>
            </div>
            <div className="flex items-center gap-4">
                <button onClick={resetDemo} className="text-xs text-gray-500 hover:underline">รีเซ็ตเคสตัวอย่าง</button>
                <button onClick={() => setUserRole('branch')} className="text-sm font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed">
                    สลับไปมุมมองสาขา
                </button>
            </div>
        </div>

        {activeView === 'feed' && (
            <div className="space-y-8">
                <StatisticsDashboard opportunities={opportunities} />
                <OpportunityFeed opportunities={opportunities} onSelectOpportunity={handleSelectOpportunity} />
            </div>
        )}
        
        {activeView === 'stats' && (
            <PerformanceSummary approvedOpportunities={approvedOpportunities} />
        )}

      </main>
      {selectedOpportunity && (
        <AnalysisModal 
          opportunity={selectedOpportunity}
          onClose={handleCloseModal}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default App;