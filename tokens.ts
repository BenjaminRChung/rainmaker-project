export type Token = {
  name: string;
  address: string;
  symbol: string;
  decimals: number;
  coingecko: string;
  coinmarketcap: string;
};

export const USDC = {
  name: "USD Coin",
  address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // https://v2.info.uniswap.org/token/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48
  symbol: "USDC",
  decimals: 6,
  coingecko: "usd-coin",
  coinmarketcap: "usd-coin",
};

export const ETH = {
  name: "Ethereum",
  address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // https://v2.info.uniswap.org/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
  symbol: "ETH",
  decimals: 18,
  coingecko: "ethereum",
  coinmarketcap: "ethereum",
};

export const WETH = {
  name: "Wrapped ETH",
  address: "0x00965af6ddfd9171961e53f9f955c47521067ccc", //https://v2.info.uniswap.org/token/0x00965af6ddfd9171961e53f9f955c47521067ccc
  symbol: "WETH",
  decimals: 18,
  coingecko: "weth",
  coinmarketcap: "weth",
};
