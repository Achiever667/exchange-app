"use client";

import { Transaction } from "@/types";

interface RecentTransactionsCardProps {
  transactions: Transaction[];
}

const statusColors: Record<string, string> = {
  COMPLETED: "text-green-600 bg-green-100",
  PENDING: "text-yellow-600 bg-yellow-100",
  FAILED: "text-red-600 bg-red-100",
  CANCELLED: "text-gray-600 bg-gray-100",
};

const typeIcons: Record<string, string> = {
  DEPOSIT: "M12 4v16m-8-8h16",
  WITHDRAWAL: "M20 12H4",
  TRANSFER: "M17 8l4 4m0 0l-4 4m4-4H3",
  REVERSAL: "M4 4l4 4m0 0l-4 4m4-4l4 4",
};

export function RecentTransactionsCard({ transactions }: RecentTransactionsCardProps) {
  const formatAmount = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No transactions yet</p>
        ) : (
          transactions.slice(0, 5).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === "DEPOSIT"
                      ? "bg-green-100"
                      : tx.type === "WITHDRAWAL"
                      ? "bg-orange-100"
                      : "bg-blue-100"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      tx.type === "DEPOSIT"
                        ? "text-green-600"
                        : tx.type === "WITHDRAWAL"
                        ? "text-orange-600"
                        : "text-blue-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        typeIcons[tx.type] || typeIcons.TRANSFER
                      }
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {tx.description || tx.type}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(tx.createdAt)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${
                    tx.type === "DEPOSIT" || tx.type === "REVERSAL"
                      ? "text-green-600"
                      : "text-gray-900"
                  }`}
                >
                  {tx.type === "DEPOSIT" || tx.type === "REVERSAL"
                    ? "+"
                    : "-"}
                  {formatAmount(tx.amount)}
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    statusColors[tx.status] || statusColors.PENDING
                  }`}
                >
                  {tx.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
