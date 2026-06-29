import Link from 'next/link';
import type { Campaign } from '../types';
import ProgressBar from './ProgressBar';
import StatusBadge from './StatusBadge';

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <Link href={`/campaign/${campaign.escrowAddress}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {campaign.title}
          </h3>
          <StatusBadge status={campaign.status} size="sm" />
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {campaign.description}
        </p>
        
        <div className="mb-4">
          <ProgressBar current={campaign.funded} total={campaign.goal} />
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{campaign.backers.length} backers</span>
          <span className="font-medium text-blue-600">
            {campaign.goal > 0 ? Math.round((campaign.funded / campaign.goal) * 100) : 0}% of ${campaign.goal.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}