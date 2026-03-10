import React, { useState } from 'react';
import { TransferOpportunity } from '../types';

interface ProblemReportModalProps {
    onClose: () => void;
    onSubmit: (details: TransferOpportunity['problemDetails']) => void;
    unit: string;
}

const ProblemReportModal: React.FC<ProblemReportModalProps> = ({ onClose, onSubmit, unit }) => {
    const [reason, setReason] = useState('incomplete');
    const [affectedUnits, setAffectedUnits] = useState(1);
    const [comment, setComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            reason: reason,
            comment: comment,
            affectedUnits: Number(affectedUnits)
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-800">รายงานปัญหาการโอนย้าย</h2>
                        <p className="text-gray-600">กรุณาให้ข้อมูลเกี่ยวกับปัญหาที่พบ</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">สาเหตุ</label>
                            <select
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                            >
                                <option value="incomplete">สินค้าไม่ครบตามจำนวน</option>
                                <option value="damaged">สินค้าชำรุด/เสียหาย</option>
                                <option value="other">อื่นๆ</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="affectedUnits" className="block text-sm font-medium text-gray-700">
                                {reason === 'incomplete' ? 'จำนวนสินค้าที่พบ' : 'จำนวนสินค้าที่เสียหาย'} ({unit})
                            </label>
                            <input
                                type="number"
                                id="affectedUnits"
                                value={affectedUnits}
                                onChange={(e) => setAffectedUnits(Number(e.target.value))}
                                min="1"
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                                ความคิดเห็นเพิ่มเติม (ถ้ามี)
                            </label>
                            <textarea
                                id="comment"
                                rows={3}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-b-xl flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-md font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300">
                            ยกเลิก
                        </button>
                        <button type="submit" className="px-8 py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700">
                            ส่งรายงาน
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProblemReportModal;