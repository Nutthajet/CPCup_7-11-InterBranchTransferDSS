export interface BranchData {
  id: number;
  name: string;
  stock: number;
  salesVelocity: number; // units per day
  shelfLife?: number; // days remaining, optional for destination
}

export interface ProductData {
  id: string;
  name: string;
  price: number; // Retail price
  gpMargin: number; // Gross Profit margin (e.g., 0.3 for 30%)
  unit: string; // e.g., 'กล่อง', 'ชิ้น', 'แพ็ค'
}

export interface TransferOpportunity {
  id: string;
  product: ProductData;
  sourceBranch: BranchData;
  destinationBranch: BranchData;
  transferUnits: number;
  distance: number; // Distance between branches in km
  potentialWasteValue: number;
  logisticsCost: number;
  netSave: number;
  status: 'pending' | 'approved' | 'rejected' | 'problem' | 'completed';
  problemDetails?: {
    reason: string;
    comment: string;
    affectedUnits: number;
  };
}