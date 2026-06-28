import type { Campaign, Milestone } from '../types';
import type { SubmitOutcome } from '@pollar/core';

export interface CreateCampaignParams {
  engagementId: string;
  title: string;
  description: string;
  approver: string;
  creator: string;
  platformAddress: string;
  amount: number;
  platformFee: number;
}

export interface CampaignResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

type AnyFn = (...args: any[]) => Promise<any>;

export const campaignService = {
  async createCampaignWithAdapter(
    adapter: { deployEscrow: AnyFn },
    params: CreateCampaignParams
  ): Promise<CampaignResult<string>> {
    try {
      const outcome = await adapter.deployEscrow({
        engagementId: params.engagementId,
        title: params.title,
        description: params.description,
        approver: params.approver,
        creator: params.creator,
        platformAddress: params.platformAddress,
        amount: params.amount,
        platformFee: params.platformFee,
      });
      if (outcome.status !== 'success') {
        return { success: false, error: 'Deploy failed' };
      }
      return { success: true, data: outcome.hash };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to create campaign' };
    }
  },

  async backCampaignWithAdapter(
    adapter: { fund: AnyFn },
    escrowAddress: string,
    amount: number
  ): Promise<CampaignResult<void>> {
    try {
      const outcome = await adapter.fund({ escrowAddress, amount });
      if (outcome.status !== 'success') {
        return { success: false, error: 'Fund failed' };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to back campaign' };
    }
  },

  async approveMilestoneWithAdapter(
    adapter: { approveMilestone: AnyFn },
    escrowAddress: string,
    milestoneId: string
  ): Promise<CampaignResult<void>> {
    try {
      const outcome = await adapter.approveMilestone({ escrowAddress, milestoneId });
      if (outcome.status !== 'success') {
        return { success: false, error: 'Approve failed' };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to approve milestone' };
    }
  },

  async releaseMilestoneWithAdapter(
    adapter: { releaseMilestone: AnyFn },
    escrowAddress: string,
    milestoneId: string
  ): Promise<CampaignResult<void>> {
    try {
      const outcome = await adapter.releaseMilestone({ escrowAddress, milestoneId });
      if (outcome.status !== 'success') {
        return { success: false, error: 'Release failed' };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to release milestone' };
    }
  },

  async disputeMilestoneWithAdapter(
    adapter: { disputeMilestone: AnyFn },
    escrowAddress: string,
    milestoneId: string,
    reason: string
  ): Promise<CampaignResult<void>> {
    try {
      const outcome = await adapter.disputeMilestone({ escrowAddress, milestoneId, reason });
      if (outcome.status !== 'success') {
        return { success: false, error: 'Dispute failed' };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to dispute milestone' };
    }
  },
};