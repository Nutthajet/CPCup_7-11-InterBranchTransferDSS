import React, { useState } from 'react';
import { TransferOpportunity } from '../types';
import { LOGISTICS_CONFIG, ExclamationTriangleIcon, TrashIcon } from '../constants';
import ConfirmationModal from './ConfirmationModal';

interface AnalysisModalProps {
  opportunity: TransferOpportunity;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}

const BranchAnalysisCard: React.FC<{ title: string; branch: TransferOpportunity['sourceBranch'] | TransferOpportunity['destinationBranch']; isSource?: boolean }> = ({ title, branch, isSource = false }) => (
    <div className="bg-white p-4 rounded-lg flex-1 shadow-inner">
        <h4 className="font-bold text-lg text-gray-700">{title}</h4>
        <p className="text-sm font-semibold text-gray-500 mb-4">{branch.name}</p>
        <div className="space-y-2 text-sm text-gray-800">
            <div className="flex justify-between"><span>สต็อกปัจจุบัน:</span> <span className="font-semibold">{branch.stock} ชิ้น</span></div>
            <div className="flex justify-between"><span>ยอดขายเฉลี่ย/วัน:</span> <span className="font-semibold">{branch.salesVelocity} ชิ้น</span></div>
            {isSource && branch.shelfLife !== undefined && (
                <div className="flex justify-between text-red-600">
                    <span className="font-bold">อายุสินค้าคงเหลือ:</span> 
                    <span className="font-bold">{branch.shelfLife} วัน</span>
                </div>
            )}
        </div>
    </div>
);

const ProblemReportDisplay: React.FC<{ details: TransferOpportunity['problemDetails'] }> = ({ details }) => {
    if (!details) return null;

    const reasonText: { [key: string]: string } = {
        incomplete: 'สินค้าไม่ครบตามจำนวน',
        damaged: 'สินค้าชำรุด/เสียหาย',
        other: 'ปัญหาอื่นๆ'
    };

    return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6 shadow-sm">
            <div className="flex items-start">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3 flex-shrink-0"/>
                <div>
                    <h3 className="font-bold text-lg text-red-800">รายงานปัญหาจากสาขา</h3>
                    <div className="mt-2 text-sm text-red-700 space-y-1">
                        <p><strong>สาเหตุ:</strong> {reasonText[details.reason] || 'ไม่ระบุ'}</p>
                        <p><strong>จำนวนที่ได้รับผลกระทบ:</strong> <span>{details.affectedUnits} ชิ้น</span></p>
                        {details.comment && <p><strong>ความคิดเห็น:</strong> "{details.comment}"</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AnalysisModal: React.FC<AnalysisModalProps> = ({ opportunity, onClose, onApprove, onReject, onDelete }) => {
    const { product, sourceBranch, destinationBranch, transferUnits, potentialWasteValue, logisticsCost, netSave, id, distance, status, problemDetails } = opportunity;
    const profitPerUnit = product.price * product.gpMargin;
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleConfirmApproval = () => {
        onApprove(id);
        setShowConfirmation(false);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl transform transition-all duration-300">
                    <div className="p-6 border-b">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">วิเคราะห์รายละเอียดการโอนย้าย</h2>
                                <p className="text-gray-600">สินค้า: {product.name} (โอนย้าย {transferUnits} {product.unit})</p>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
                        </div>
                    </div>

                    <div className="p-6 space-y-6 bg-slate-50 max-h-[60vh] overflow-y-auto">
                        {/* Problem Report Display */}
                        {status === 'problem' && problemDetails && <ProblemReportDisplay details={problemDetails} />}

                        {/* Section 1: Branch Analysis */}
                        <div>
                            <h3 className="font-bold text-lg mb-2 text-gray-800">1. วิเคราะห์สาขา (Branch Analysis)</h3>
                            <div className="flex flex-col md:flex-row gap-4">
                                <BranchAnalysisCard title="สาขาต้นทาง (Source)" branch={sourceBranch} isSource={true} />
                                <div className="flex items-center justify-center text-gray-400 font-bold text-2xl p-2 md:p-0">→</div>
                                <BranchAnalysisCard title="สาขาปลายทาง (Destination)" branch={destinationBranch} />
                            </div>
                        </div>

                        {/* Section 2: Financial Calculation */}
                        <div>
                            <h3 className="font-bold text-lg mb-2 text-gray-800">2. การคำนวณด้านการเงิน (Financials)</h3>
                            <div className="bg-white p-4 rounded-lg shadow-inner grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-800">
                                <div>
                                    <p className="font-semibold text-gray-500 mb-2 border-b pb-1">รายละเอียดสินค้า</p>
                                    <div className="flex justify-between"><span>ราคาขาย:</span> <span className="font-semibold">{product.price.toLocaleString()} บาท/ชิ้น</span></div>
                                    <div className="flex justify-between"><span>ส่วนแบ่งกำไร (GP):</span> <span className="font-semibold">{profitPerUnit.toLocaleString('en-US', {minimumFractionDigits: 2})} บาท ({product.gpMargin * 100}%)</span></div>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-500 mb-2 border-b pb-1">ประมาณการค่าขนส่ง</p>
                                    <div className="flex justify-between"><span>ระยะทาง:</span> <span className="font-semibold">{distance} กม.</span></div>
                                    <div className="flex justify-between"><span>ค่าดำเนินการ:</span> <span className="font-semibold">{LOGISTICS_CONFIG.handlingFee.toLocaleString()} บาท/เที่ยว</span></div>
                                    <div className="flex justify-between font-bold text-gray-800 mt-1 border-t pt-1"><span>รวมค่าขนส่ง:</span> <span>{logisticsCost.toLocaleString()} บาท</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Net Save Summary */}
                        <div className="bg-white p-4 rounded-lg shadow-inner">
                            <h3 className="font-bold text-lg mb-3 text-center text-gray-800">3. สรุปผลประโยชน์สุทธิ (Net Save Calculation)</h3>
                            <div className="space-y-2 max-w-md mx-auto">
                            <div className="flex justify-between items-center text-green-700">
                                    <span className="font-semibold">กำไรที่รักษาไว้ (จาก {transferUnits} ชิ้น):</span>
                                    <span className="text-xl font-bold">{potentialWasteValue.toLocaleString()} บาท</span>
                                </div>
                                <div className="flex justify-between items-center text-red-600">
                                    <span className="font-semibold">หัก: ค่าขนส่ง:</span>
                                    <span className="text-xl font-bold">- {logisticsCost.toLocaleString()} บาท</span>
                                </div>
                                <hr className="my-2 border-gray-300" />
                                <div className="flex justify-between items-center text-blue-800">
                                    <span className="font-extrabold text-lg">ผลประโยชน์สุทธิ (Net Save):</span>
                                    <span className="text-2xl font-extrabold">{netSave.toLocaleString()} บาท</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-b-xl flex justify-between items-center gap-4">
                        <div>
                            {status === 'problem' && (
                                <button
                                    onClick={() => onDelete(id)}
                                    className="flex items-center gap-2 px-6 py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                    <span>ลบรายการแนะนำ</span>
                                </button>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => onReject(id)}
                                className="px-6 py-2 rounded-md font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
                                disabled={status === 'problem'}
                            >
                                ปฏิเสธ
                            </button>
                            <button 
                                onClick={() => setShowConfirmation(true)}
                                className="px-8 py-2 rounded-md font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={status === 'problem'}
                            >
                                อนุมัติการโอนย้าย
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showConfirmation && (
                <ConfirmationModal 
                    opportunity={opportunity}
                    onClose={() => setShowConfirmation(false)}
                    onConfirm={handleConfirmApproval}
                />
            )}
        </>
    );
};

export default AnalysisModal;