'use client';

import { useState } from 'react';
import { usePollar } from '@pollar/react';
import { useCampaign } from '../hooks/useCampaign';
import type { Campaign } from '../types';

interface BackCampaignProps {
  campaign: Campaign;
}

export default function BackCampaign({ campaign }: BackCampaignProps) {
  const { isAuthenticated, walletAddress } = usePollar();
  const { backCampaign, loading, error } = useCampaign();
  const [amount, setAmount] = useState('');
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);

  const checkBalance = async () => {
    setUsdcBalance(1000);
  };

  const handleBack = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    const backAmount = parseFloat(amount);
    if (isNaN(backAmount) || backAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (usdcBalance !== null && backAmount > usdcBalance) {
      alert('Insufficient USDC balance');
      return;
    }

    const result = await backCampaign(campaign.escrowAddress, backAmount);

    if (result.success) {
      setAmount('');
      alert('Successfully backed the campaign!');
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Back this Campaign</h3>

      <form onSubmit={handleBack} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount (USDC)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            step="0.01"
            placeholder="100"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={checkBalance}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Check USDC Balance
          </button>
          {usdcBalance !== null && (
            <span className="text-sm text-gray-600">
              Balance: ${usdcBalance.toLocaleString()} USDC
            </span>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {!isAuthenticated && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
            Please connect your wallet to back this campaign
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !isAuthenticated || !amount}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Back Campaign'}
        </button>
      </form>
    </div>
  );
}