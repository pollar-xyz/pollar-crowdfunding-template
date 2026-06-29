import type { CampaignStatus, MilestoneStatus } from '../types';

interface StatusBadgeProps {
  status: CampaignStatus | MilestoneStatus;
  size?: 'sm' | 'md';
}

const campaignColors: Record<CampaignStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  live: 'bg-blue-100 text-blue-800',
  funded: 'bg-green-100 text-green-800',
  releasing: 'bg-yellow-100 text-yellow-800',
  disputed: 'bg-red-100 text-red-800',
  complete: 'bg-purple-100 text-purple-800',
};

const milestoneColors: Record<MilestoneStatus, string> = {
  pending: 'bg-gray-100 text-gray-800',
  approved: 'bg-blue-100 text-blue-800',
  released: 'bg-green-100 text-green-800',
  disputed: 'bg-red-100 text-red-800',
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const colors = status in campaignColors 
    ? campaignColors[status as CampaignStatus]
    : milestoneColors[status as MilestoneStatus];
  
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-sm';
  
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeClasses} ${colors}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}