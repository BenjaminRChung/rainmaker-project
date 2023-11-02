"use client";
import { getQuote } from "@/quote";
import { USDC, ETH } from "@/tokens";
import { BigNumber } from "ethers";
import React, { useState } from 'react';

const FROM_TOKEN = USDC;
// const FROM_AMOUNT = BigNumber.from("1000000");
const TO_TOKEN = ETH;

// Styling // 
const containerClass = "flex min-h-screen flex-col items-center justify-between p-24"
const cardClass = "block text-gray-700 font-semibold mb-1"
const textClass = "mt-1 text-gray-500 text-lg"
const title = "text-black text-2xl font-bold mb-4"

const boxStyle = {
  backgroundColor: '#a9a9a9', // Light grey background color
  padding: '1rem', // Adjust padding as needed
  borderRadius: '0.25rem', // Rounded corners
  marginBottom: '1rem', // Spacing at the bottom
};

// React State Variables // 
export default function Home() {

  const [swapBalance, setSwapBalance] = useState(BigNumber.from("0"))
  const [slippagePercent, setSlippagePercentage] = useState(0);
  const [fromAmount, setFromAmount] = useState(BigNumber.from("1000000"));

  const getQuoteHandler = async () => {
    try {
      const quote = await getQuote(FROM_TOKEN, TO_TOKEN, fromAmount);
      setSwapBalance(quote.swapBalance);
      setSlippagePercentage(quote.slippagePercent);

    } catch (error) {
      console.error("Error while fetching quote:", error);
    }
  };
  
  return (
    <main className={containerClass}>

        <div className="p-6 bg-white shadow-md rounded-lg">
          
        <div className={title}>
          {/* <img src="./public/rainmakerdefi_logo.jpeg" alt="Logo" className="logo" /> */}
          <h1 className="title">Token Swap/Slippage Estimator</h1>
        </div>

        <div className="mb-4">
          <label className={cardClass}>From Token:</label>
          <p className={textClass}>{FROM_TOKEN.symbol}</p>

          <label className={cardClass}>To Token:</label>
          <p className={textClass}>{TO_TOKEN.symbol}</p>

          <label className={cardClass}>From Amount:</label>
          <input
            className={textClass}
            type="number"
            value={fromAmount.toString()}
            onChange={(e) => setFromAmount(BigNumber.from(e.target.value))}
          />
        </div>

        <button
          onClick={getQuoteHandler}
          title = "Click to get a quote"
          className="text-white bg-purple-700 hover:bg-purple-500 p-2 rounded-md mb-4"
        >
          Get Quote
        </button>

        <div style={boxStyle}>
          <p className={cardClass}>{`Swap Balance: ${swapBalance} ${TO_TOKEN.symbol}`}</p>
          <p className={cardClass}>{`Slippage: ${slippagePercent.toFixed(3)}%`}</p>
        </div>

      </div>

    </main>
  );
}
