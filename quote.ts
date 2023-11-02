import { BigNumber, ethers } from "ethers";
import { ETH, Token, USDC, WETH } from "@/tokens";
import axios from "axios";
import { act } from "react-dom/test-utils";
import exp from "constants";
import { EXPORT_DETAIL } from "next/dist/shared/lib/constants";

// DOCUMENTATION REFERENCE //
// Uniswap V2 Docs Reference: https://docs.uniswap.org/contracts/v2/reference/smart-contracts/router-02 -- considered V3, but V2 proved a simpler understanding for this use case.
// Ethers v5 Docs Reference: https://docs.ethers.org/v5/api/

export type Quote = {
  swapBalance: BigNumber;
  slippagePercent: number;
};

export async function getQuote(
  fromToken: Token,
  toToken: Token,
  fromAmount: BigNumber
): Promise<Quote> {
  console.info(
    `Converting ${fromAmount.toString()} ${fromToken.symbol} to ${
      toToken.symbol
    }`
  );

  // Contract for DEX (Using Uniswap V2, Ethers V5) //
  const INFURA_ADDRESS = 'https://mainnet.infura.io/v3/64d289fa4c9543319d7aebfb6cbc7cd8'
  const ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D' 
  const ABI = [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)'
  ];
  const provider = new ethers.providers.JsonRpcProvider(INFURA_ADDRESS);
  const UNISWAP_contract = new ethers.Contract(ADDRESS, ABI, provider);

  // Figure out how much TO_TOKEN you can get the FROM_TOKEN -- Using Uniswap and Ethers) //
  const path = [fromToken.address, toToken.address];
  const AmountIN = ethers.utils.parseUnits(fromAmount.toString(), fromToken.decimals);
  const AmountOUT = await UNISWAP_contract.getAmountsOut(AmountIN, path); // -> Expected Value (token amount before swap). function call references getReserves() and includes swap fee in transaction

  const swapBalance = ethers.utils.formatUnits(AmountOUT[1].toString(), toToken.decimals);

  console.info(
    `Estimated swap balance: ${swapBalance.toString()} ${toToken.symbol}`
  );

  // Spots Values of Tokens in USD (Using CoinGecko API to Market Data)
  const coingecko_API = 'https://api.coingecko.com/api/v3';

  async function getMarketPrice(
    fromToken: Token,
    toToken: Token,
  ): Promise<{
    fromTokenPrice: BigNumber,
    toTokenPrice: BigNumber }> {
      try{
        const response = await axios.get(coingecko_API+`/simple/price?ids=${fromToken.coingecko},${toToken.coingecko}&vs_currencies=usd`, {
        });
        const priceData = response.data;
        return {
          fromTokenPrice: ethers.utils.parseUnits(parseFloat(priceData[fromToken.coingecko].usd).toFixed(18),18),
          toTokenPrice: ethers.utils.parseUnits(parseFloat(priceData[toToken.coingecko].usd).toFixed(18),18)
        } 
      } catch (error) {
        throw new Error(`Error fetching spot price for ${toToken.symbol} and ${fromToken.symbol}`);
      }
  }

  const { fromTokenPrice, toTokenPrice } = await getMarketPrice(fromToken, toToken);

  // Slippage Percentage -- shows how much the price for an asset has moved // 
  const expectedAmount = Number(swapBalance);
  const actualAmount = Number(ethers.utils.parseUnits(ethers.utils.formatUnits(fromAmount, 18)).mul(fromTokenPrice).div(toTokenPrice));
  const slippagePercent = ((actualAmount - expectedAmount) / expectedAmount) * 100;

  console.info(`Slippage: ${slippagePercent}%`);

  return {
    swapBalance,
    slippagePercent,
  };
}
