import React from 'react';
import { TransferOpportunity } from '../types';
import { CheckCircleIcon } from '../constants';

interface ConfirmationModalProps {
    opportunity: TransferOpportunity;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ opportunity, onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[60] p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
                <div className="p-6 text-center">
                    <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800">ยืนยันการอนุมัติ</h2>
                    <p className="text-gray-600 mt-2">โปรดตรวจสอบและยืนยันรายละเอียดการโอนย้าย</p>
                    
                    <div className="bg-slate-50 rounded-lg p-4 mt-6 text-left space-y-2 border border-slate-200">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-500">สินค้า:</span>
                            <span className="font-bold text-gray-800">{opportunity.product.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-500">จำนวน:</span>
                            <span className="font-bold text-gray-800">{opportunity.transferUnits} {opportunity.product.unit}</span>
                        </div>
                        <hr className="my-1"/>
                        <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-500">จาก:</span>
                            <span className="font-semibold text-gray-700">{opportunity.sourceBranch.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-500">ไปที่:</span>
                            <span className="font-semibold text-gray-700">{opportunity.destinationBranch.name}</span>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-b-xl flex justify-center gap-4">
                    <button onClick={onClose} className="px-8 py-2 rounded-md font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors w-full sm:w-auto">
                        ยกเลิก
                    </button>
                    <button onClick={onConfirm} className="px-8 py-2 rounded-md font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm w-full sm:w-auto">
                        ยืนยันการอนุมัติ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;