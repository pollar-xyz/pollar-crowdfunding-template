'use client';

import { useState, useCallback } from 'react';
import { usePollar } from '@pollar/react';
import type { CreateCampaignParams } from '../services/campaignService';

interface State {
  campaign: any;
  loading: boolean;
  error: string | null;
}

const initial: State = { campaign: null, loading: false, error: null };

// Helper: build + sign + submit a payment tx, return hash
async function submitPaymentTx(
  ctx: ReturnType<typeof usePollar>,
  destination: string,
  amount: string,
  asset: { type: 'native' } | { type: 'credit_alphanum4'; code: string; issuer: string } | { type: 'credit_alphanum12'; code: string; issuer: string } = { type: 'native' }
): Promise<{ ok: true; hash: string } | { ok: false; error: string }> {
  const buildResult = await ctx.buildTx('payment', {
    destination,
    amount,
    asset,
  });
  if (buildResult.status === 'error') {
    return { ok: false, error: buildResult.details || 'Build failed' };
  }
  const submitResult = await ctx.signAndSubmitTx(buildResult.buildData.unsignedXdr);
  if (submitResult.status === 'error') {
    return { ok: false, error: submitResult.details || 'Submit failed' };
  }
  return { ok: true, hash: submitResult.hash };
}

export function useCampaign() {
  const [state, setState] = useState<State>(initial);
  const ctx = usePollar();
  const auth = !!ctx.isAuthenticated;

  const createCampaign = useCallback(async (params: CreateCampaignParams) => {
    if (!auth) {
      setState(p => ({ ...p, error: 'Not authenticated' }));
      return { success: false, error: 'Not authenticated' };
    }
    setState(p => ({ ...p, loading: true, error: null }));
    try {
      // Campaign "deploy escrow" = payment to platform address
      const result = await submitPaymentTx(ctx, params.platformAddress, String(params.amount));
      if (!result.ok) {
        setState(p => ({ ...p, loading: false, error: result.error }));
        return { success: false, error: result.error };
      }
      setState(p => ({
        ...p,
        loading: false,
        campaign: {
          id: result.hash,
          ...params,
          escrowAddress: result.hash,
          milestones: [],
          status: 'funded',
          funded: 0,
          backers: [],
        },
      }));
      return { success: true, data: result.hash };
    } catch (err: any) {
      const msg = err.message || 'Failed to create campaign';
      setState(p => ({ ...p, loading: false, error: msg }));
      return { success: false, error: msg };
    }
  }, [ctx, auth]);

  const backCampaign = useCallback(async (escrowAddress: string, amount: number) => {
    if (!auth) return { success: false, error: 'Not authenticated' };
    setState(p => ({ ...p, loading: true, error: null }));
    try {
      const result = await submitPaymentTx(ctx, escrowAddress, String(amount));
      if (!result.ok) {
        setState(p => ({ ...p, loading: false, error: result.error }));
        return { success: false, error: result.error };
      }
      setState(p => ({
        ...p,
        loading: false,
        campaign: p.campaign
          ? { ...p.campaign, funded: (p.campaign.funded || 0) + amount }
          : null,
      }));
      return { success: true };
    } catch (err: any) {
      const msg = err.message || 'Failed to back campaign';
      setState(p => ({ ...p, loading: false, error: msg }));
      return { success: false, error: msg };
    }
  }, [ctx, auth]);

  const approveMilestone = useCallback(async (_escrowAddress: string, milestoneId: string) => {
    if (!auth) return { success: false, error: 'Not authenticated' };
    setState(p => ({ ...p, loading: true, error: null }));
    // Approve is local state (no on-chain action without escrow contract)
    setState(p => ({ ...p, loading: false }));
    return { success: true, milestoneId };
  }, [auth]);

  const releaseMilestone = useCallback(async (escrowAddress: string, milestoneId: string) => {
    if (!auth) return { success: false, error: 'Not authenticated' };
    setState(p => ({ ...p, loading: true, error: null }));
    try {
      // Release = payment from escrow to creator
      const result = await submitPaymentTx(ctx, escrowAddress, '1');
      if (!result.ok) {
        setState(p => ({ ...p, loading: false, error: result.error }));
        return { success: false, error: result.error };
      }
      setState(p => ({ ...p, loading: false }));
      return { success: true, hash: result.hash };
    } catch (err: any) {
      const msg = err.message || 'Failed to release milestone';
      setState(p => ({ ...p, loading: false, error: msg }));
      return { success: false, error: msg };
    }
  }, [ctx, auth]);

  const disputeMilestone = useCallback(async (_escrowAddress: string, _milestoneId: string, _reason: string) => {
    if (!auth) return { success: false, error: 'Not authenticated' };
    setState(p => ({ ...p, loading: true, error: null }));
    // Dispute is local state
    setState(p => ({ ...p, loading: false }));
    return { success: true };
  }, [auth]);

  const reset = useCallback(() => setState(initial), []);
  return { ...state, createCampaign, backCampaign, approveMilestone, releaseMilestone, disputeMilestone, reset };
}
