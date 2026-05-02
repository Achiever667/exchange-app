"use client";

interface QuickActionsProps {
  onAction?: (action: string) => void;
}

const actions = [
  { id: "deposit", label: "Deposit", icon: "M12 4v16m-8-8h16", color: "bg-green-500" },
  { id: "withdraw", label: "Withdraw", icon: "M20 12H4", color: "bg-orange-500" },
  { id: "transfer", label: "Transfer", icon: "M17 8l4 4m0 0l-4 4m4-4H3", color: "bg-blue-500" },
  { id: "pay", label: "Pay Bills", icon: "M9 14l6 6m0-6l-6 6", color: "bg-purple-500" },
];

export function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction?.(action.id)}
            className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`w-10 h-10 ${action.color} rounded-full flex items-center justify-center`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-700">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
