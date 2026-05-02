"use client";

interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  icon?: string;
}

const marketData: MarketItem[] = [
  { symbol: "BTC", name: "Bitcoin", price: 43250.0, change: 2.34 },
  { symbol: "ETH", name: "Ethereum", price: 2280.0, change: 1.56 },
  { symbol: "GBP", name: "British Pound", price: 1.27, change: -0.12 },
  { symbol: "EUR", name: "Euro", price: 1.09, change: 0.08 },
];

export function MarketWatchCard() {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">Market Watch</h3>
      <div className="space-y-4">
        {marketData.map((item) => (
          <div
            key={item.symbol}
            className="flex items-center justify-between py-2"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-600">
                  {item.symbol.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{item.symbol}</p>
                <p className="text-xs text-gray-500">{item.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">
                {item.price.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
              <p
                className={`text-xs ${
                  item.change >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.change >= 0 ? "+" : ""}
                {item.change}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
