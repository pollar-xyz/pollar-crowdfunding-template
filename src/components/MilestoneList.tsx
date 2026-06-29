'use client';

import type { Milestone } from '../types';
import StatusBadge from './StatusBadge';

interface MilestoneListProps {
  milestones: Milestone[];
  isApprover?: boolean;
  onApprove?: (milestoneId: string) => void;
  onRelease?: (milestoneId: string) => void;
  onDispute?: (milestoneId: string, reason: string) => void;
  loading?: boolean;
}

export default function MilestoneList({
  milestones,
  isApprover = false,
  onApprove,
  onRelease,
  onDispute,
  loading = false,
}: MilestoneListProps) {
  const handleDispute = (milestone: Milestone) => {
    const reason = prompt('Enter dispute reason:');
    if (reason && onDispute) {
      onDispute(milestone.id, reason);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Milestones</h3>
      {milestones.length === 0 ? (
        <p className="text-gray-500 text-sm">No milestones defined</p>
      ) : (
        <div className="space-y-3">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500">
                    #{index + 1}
                  </span>
                  <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    ${milestone.amount.toLocaleString()}
                  </span>
                  <StatusBadge status={milestone.status} size="sm" />
                </div>
              </div>
              
              {milestone.description && (
                <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
              )}
              
              {isApprover && milestone.status === 'pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => onApprove?.(milestone.id)}
                    disabled={loading}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md font-medium transition-colors disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDispute(milestone)}
                    disabled={loading}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md font-medium transition-colors disabled:opacity-50"
                  >
                    Dispute
                  </button>
                </div>
              )}
              
              {isApprover && milestone.status === 'approved' && (
                <button
                  onClick={() => onRelease?.(milestone.id)}
                  disabled={loading}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md font-medium transition-colors disabled:opacity-50"
                >
                  Release Funds
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}