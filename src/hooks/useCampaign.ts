'use client';

import { useState, useCallback } from 'react';
import { usePollar } from '@pollar/react';

interface State {
  campaign: any;
  loading: boolean;
  error: string | null;
}

const initial: State = { campaign: null, loading: false, error: null };

export function useCampaign() {
  const [state, setState] = useState<State>(initial);
  const ctx = usePollar();
  const run = ctx.buildAndSignAndSubmitTx as any;
  const auth = !!ctx.isAuthenticated;

  const createCampaign = useCallback(async (params: {
    engagementId: string; title: string; description: string;
    approver: string; creator: string; platformAddress: string;
    amount: number; platformFee: number;
  }) => {
    if (!auth) { setState(p => ({ ...p, error: 'Not authenticated' })); return { success: false, error: 'Not authenticated' }; }
    setState(p => ({ ...p, loading: true, error: null }));
    try {
      const result = await run('escrow_deploy', params);
      const hash = result?.hash || 'pending';
      setState(p => ({ ...p, loading: false, campaign: { id: hash, ...params, escrowAddress: hash, milestones: [], status: 'funded', funded: 0, backers: [] } }));
      return { success: true, data: hash };
    } catch (err: any) {
      const msg = err.message || 'Failed';
      setState(p => ({ ...p, loading: false, error: msg }));
      return { success: false, error: msg };
    }
  }, [run, auth]);

  const backCampaign = useCallback(async (escrowAddress: string, amount: number) => {
    if (!auth) return { success: false, error: 'Not authenticated' };
    setState(p => ({ ...p, loading: true, error: null }));
    try {
      await run('escrow_fund', { escrowAddress, amount });
      setState(p => ({ ...p, loading: false, campaign: p.campaign ? { ...p.campaign, funded: (p.campaign.funded || 0) + amount } : null }));
      return { success: true };
    } catch (err: any) {
      const msg = err.message || 'Failed';
      setState(p => ({ ...p, loading: false, error: msg }));
      return { success: false, error: msg };
    }
  }, [run, auth]);

  const approveMilestone = useCallback(async (escrowAddress: string, milestoneId: string) => {
    if (!auth) return { success: false, error: 'Not authenticated' };
    setState(p => ({ ...p, loading: true, error: null }));
    try { await run('escrow_approve', { escrowAddress, milestoneId }); setState(p => ({ ...p, loading: false })); return { success: true }; }
    catch (err: any) { const msg = err.message || 'Failed'; setState(p => ({ ...p, loading: false, error: msg })); return { success: false, error: msg }; }
  }, [run, auth]);

  const releaseMilestone = useCallback(async (escrowAddress: string, milestoneId: string) => {
    if (!auth) return { success: false, error: 'Not authenticated' };
    setState(p => ({ ...p, loading: true, error: null }));
    try { await run('escrow_release', { escrowAddress, milestoneId }); setState(p => ({ ...p, loading: false })); return { success: true }; }
    catch (err: any) { const msg = err.message || 'Failed'; setState(p => ({ ...p, loading: false, error: msg })); return { success: false, error: msg }; }
  }, [run, auth]);

  const disputeMilestone = useCallback(async (escrowAddress: string, milestoneId: string, reason: string) => {
    if (!auth) return { success: false, error: 'Not authenticated' };
    setState(p => ({ ...p, loading: true, error: null }));
    try { await run('escrow_dispute', { escrowAddress, milestoneId, reason }); setState(p => ({ ...p, loading: false })); return { success: true }; }
    catch (err: any) { const msg = err.message || 'Failed'; setState(p => ({ ...p, loading: false, error: msg })); return { success: false, error: msg }; }
  }, [run, auth]);

  const reset = useCallback(() => setState(initial), []);
  return { ...state, createCampaign, backCampaign, approveMilestone, releaseMilestone, disputeMilestone, reset };
}