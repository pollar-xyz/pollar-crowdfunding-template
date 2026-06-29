import type { Metadata } from 'next';
import CampaignForm from '../../../components/CampaignForm';

export const metadata: Metadata = {
  title: 'Create Campaign | Pollar Crowdfunding',
};

export default function NewCampaignPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Campaign</h1>
        <p className="text-gray-600 mt-1">Launch a decentralized crowdfunding campaign with milestone-based escrow</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <CampaignForm />
      </div>
    </div>
  );
}