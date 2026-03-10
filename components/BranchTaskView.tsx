import React, { useState, useEffect } from 'react';
import { TransferOpportunity } from '../types';
import Header from './Header';
import { BellIcon, BoxIcon, CheckIcon, ClockIcon, ExclamationTriangleIcon, FlagIcon } from '../constants';
import ProblemReportModal from './ProblemReportModal';

interface BranchTaskViewProps {
  task?: TransferOpportunity; // Task is now optional
  onBackToCentral: () => void;
  onResetDemo: () => void;
  onTaskComplete: (id: string) => void;
  onReportProblem: (id: string, details: TransferOpportunity['problemDetails']) => void;
}

type TaskStep = 'idle' | 'scanning' | 'completed' | 'reporting' | 'problem_reported';

const DetailRow: React.FC<{icon: React.ReactNode, iconBg: string, label: string, value: string}> = ({ icon, iconBg, label, value }) => (
    <div className="flex items-start">
        <div className={`p-3 rounded-full mr-4 ${iconBg}`}>{icon}</div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-lg font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const BranchTaskView: React.FC<BranchTaskViewProps> = ({ task, onBackToCentral, onResetDemo, onTaskComplete, onReportProblem }) => {
  const [taskStep, setTaskStep] = useState<TaskStep>('idle');
  const [scannedCount, setScannedCount] = useState(0);

  useEffect(() => {
    if (task && scannedCount === task.transferUnits) {
      setTaskStep('completed');
      onTaskComplete(task.id);
    }
  }, [scannedCount, task, onTaskComplete]);

  // Reset state if the task disappears (e.g., after completion or problem report)
  useEffect(() => {
      if (!task) {
          setTaskStep('idle');
          setScannedCount(0);
      }
  }, [task]);

  if (!task) {
    return (
      <div className="bg-slate-100 min-h-screen antialiased">
        <Header user={{ name: 'คุณสมศรี (7-Eleven สาขาแยกอโศก)', role: 'ผู้จัดการสาขา', initial: 'ศ' }} />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">หน้าจอการจัดการงาน</h1>
                 <div className="flex items-center gap-4">
                    <button onClick={onBackToCentral} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                        ← กลับไปมุมมองส่วนกลาง
                    </button>
                    <button onClick={onResetDemo} className="text-xs text-gray-500 hover:underline">รีเซ็ตเคสตัวอย่าง</button>
                </div>
            </div>
            <div className="text-center bg-white rounded-lg shadow-md p-12">
                <BoxIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">ไม่มีงานที่ต้องดำเนินการ</h2>
                <p className="text-gray-500 mt-2">เมื่อมีคำสั่งอนุมัติจากส่วนกลาง งานของคุณจะปรากฏที่นี่</p>
            </div>
        </main>
      </div>
    );
  }

  const { id, product, sourceBranch, destinationBranch, transferUnits } = task;

  const handleScanItem = () => {
    setScannedCount(prev => Math.min(prev + 1, transferUnits));
  };
  
  const handleReportSubmit = (details: TransferOpportunity['problemDetails']) => {
      onReportProblem(id, details);
      setTaskStep('problem_reported'); // Visually confirm on branch side before switching
  };

  const renderContent = () => {
    switch (taskStep) {
      case 'scanning':
        const progress = (scannedCount / transferUnits) * 100;
        return (
          <div className="p-8 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">กำลังสแกนสินค้า</h3>
            <p className="text-gray-600 mb-6">กรุณาสแกนสินค้าทีละชิ้นเพื่อยืนยันจำนวน</p>
            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-2xl font-bold mb-2">
                  <span className="text-orange-500">{scannedCount}</span>
                  <span className="text-gray-400">/ {transferUnits}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                <div className="bg-orange-500 h-4 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
              <button 
                onClick={handleScanItem}
                className="w-full bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 transition-transform active:scale-95 disabled:bg-gray-400"
              >
                สแกนสินค้า 1 ชิ้น
              </button>
            </div>
          </div>
        );
      case 'completed':
        return (
          <div className="p-8 text-center bg-green-50">
            <CheckIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-800">ดำเนินการเรียบร้อย!</h3>
            <p className="text-green-700 mt-2">เตรียมสินค้าเพื่อรอรถขนส่งมารับ ({transferUnits} {product.unit})</p>
          </div>
        );
      default: // 'idle'
        return (
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-1 text-center bg-slate-50 p-8 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-gray-200">
                <p className="text-base text-gray-500">สินค้า</p>
                <p className="text-2xl font-bold text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-400 mb-4">SKU: 88512345</p>
                <p className="text-8xl font-extrabold text-orange-500 leading-none">{transferUnits}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{product.unit}</p>
            </div>
            <div className="md:col-span-2 p-8 space-y-6">
               <DetailRow icon={<BoxIcon className="h-6 w-6 text-blue-600"/>} iconBg="bg-blue-100" label="แพ็คจาก:" value={`สต็อกสาขาคุณ (${sourceBranch.name})`} />
               <DetailRow icon={<FlagIcon className="h-6 w-6 text-green-600"/>} iconBg="bg-green-100" label="ส่งไปที่:" value={destinationBranch.name} />
               <DetailRow icon={<ClockIcon className="h-6 w-6 text-purple-600"/>} iconBg="bg-purple-100" label="กำหนดเวลารับ (Pickup):" value="15:30 น. (วันนี้)" />
            </div>
          </div>
        );
    }
  };

  const renderFooter = () => {
      if (taskStep === 'idle') {
          return (
             <div className="bg-gray-50 p-6 flex flex-col sm:flex-row justify-end items-center gap-4 rounded-b-xl border-t border-gray-200">
                <button onClick={() => setTaskStep('reporting')} className="w-full sm:w-auto bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors">
                  รายงานปัญหา (สินค้าไม่ครบ / ชำรุด)
                </button>
                <button onClick={() => setTaskStep('scanning')} className="w-full sm:w-auto flex items-center justify-center gap-3 bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-green-700 transition-transform active:scale-95">
                  <CheckIcon className="h-6 w-6" />
                  <span>ยืนยันและสแกนสินค้าเพื่อส่ง</span>
                </button>
            </div>
          )
      }
      if(taskStep === 'problem_reported') {
           return (
            <div className="bg-red-50 text-center p-4 border-t border-red-200">
                <p className="font-semibold text-red-700">แจ้งปัญหาแล้ว, กำลังส่งข้อมูลกลับไปที่ส่วนกลางเพื่อตรวจสอบ</p>
            </div>
           )
      }
      return null; // No footer for scanning or completed states
  }

  return (
    <div className="bg-slate-100 min-h-screen antialiased">
      <Header user={{ name: 'คุณสมศรี (7-Eleven สาขาแยกอโศก)', role: 'ผู้จัดการสาขา', initial: 'ศ' }} />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">รายละเอียดงานโอนย้าย</h1>
            <div className="flex items-center gap-4">
                <button onClick={onBackToCentral} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    ← กลับไปมุมมองส่วนกลาง
                </button>
                 <button onClick={onResetDemo} className="text-xs text-gray-500 hover:underline">รีเซ็ตเคสตัวอย่าง</button>
            </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-4 mb-8 rounded-lg shadow-md flex items-start gap-4 border border-gray-200">
          <BellIcon className="h-8 w-8 text-orange-500 flex-shrink-0 mt-1" />
          <div>
            <p className="font-bold text-lg text-gray-800">คุณมี Task ใหม่ 1 รายการ</p>
            <p className="text-sm text-gray-600">
              คำสั่งโอนย้ายสินค้า: <strong>{product.name} ({transferUnits} {product.unit})</strong> ไปยัง <strong>{destinationBranch.name}</strong> ได้รับการอนุมัติจากส่วนกลางแล้ว
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 text-center">
            <h2 className="text-2xl font-bold text-gray-800">งานโอนย้ายสินค้า</h2>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-red-100 text-red-700 font-bold text-sm px-4 py-2 rounded-full">
              <ExclamationTriangleIcon className="h-5 w-5" />
              <span>ด่วน - สินค้าใกล้หมดอายุใน {sourceBranch.shelfLife} วัน</span>
            </div>
          </div>
          
          {renderContent()}
          {renderFooter()}

        </div>
      </main>

      {taskStep === 'reporting' && (
        <ProblemReportModal 
            onClose={() => setTaskStep('idle')}
            onSubmit={handleReportSubmit}
            unit={product.unit}
        />
      )}
    </div>
  );
};

export default BranchTaskView;