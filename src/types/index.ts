export type CampaignStatus = 'draft' | 'live' | 'funded' | 'releasing' | 'disputed' | 'complete';

export type MilestoneStatus = 'pending' | 'approved' | 'released' | 'disputed';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: MilestoneStatus;
}

export interface Backer {
  address: string;
  amount: number;
  timestamp: number;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  creator: string;
  approver: string;
  platformAddress: string;
  escrowAddress: string;
  milestones: Milestone[];
  status: CampaignStatus;
  funded: number;
  backers: Backer[];
}