'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePollar } from '@pollar/react';
import { useCampaign } from '../hooks/useCampaign';

interface MilestoneInput {
  title: string;
  description: string;
  amount: string;
}

export default function CampaignForm() {
  const router = useRouter();
  const { isAuthenticated, walletAddress } = usePollar();
  const { createCampaign, loading, error } = useCampaign();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [milestones, setMilestones] = useState<MilestoneInput[]>([
    { title: '', description: '', amount: '' },
  ]);

  const addMilestone = () => {
    setMilestones([...milestones, { title: '', description: '', amount: '' }]);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((_, i) => i !== index));
    }
  };

  const updateMilestone = (index: number, field: keyof MilestoneInput, value: string) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    const totalMilestoneAmount = milestones.reduce(
      (sum, m) => sum + parseFloat(m.amount || '0'),
      0
    );

    if (totalMilestoneAmount !== parseFloat(goal)) {
      alert('Total milestone amounts must equal the campaign goal');
      return;
    }

    const result = await createCampaign({
      engagementId: crypto.randomUUID(),
      title,
      description,
      approver: walletAddress,
      creator: walletAddress,
      platformAddress: process.env.NEXT_PUBLIC_POLLAR_PLATFORM_ADDRESS || walletAddress,
      amount: parseFloat(goal),
      platformFee: 0.025,
    });

    if (result.success) {
      router.push(`/campaign/${result.data}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Campaign Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter campaign title"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe your campaign"
        />
      </div>

      <div>
        <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
          Goal Amount (USDC)
        </label>
        <input
          type="number"
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          required
          min="1"
          step="0.01"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="10000"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-gray-700">Milestones</label>
          <button
            type="button"
            onClick={addMilestone}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Add Milestone
          </button>
        </div>
        
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Milestone {index + 1}</span>
                {milestones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMilestone(index)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <input
                type="text"
                value={milestone.title}
                onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                placeholder="Milestone title"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <textarea
                value={milestone.description}
                onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                placeholder="Description"
                rows={2}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <input
                type="number"
                value={milestone.amount}
                onChange={(e) => updateMilestone(index, 'amount', e.target.value)}
                placeholder="Amount (USDC)"
                min="0.01"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {!isAuthenticated && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          Please connect your wallet to create a campaign
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !isAuthenticated}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating Campaign...' : 'Create Campaign'}
      </button>
    </form>
  );
}