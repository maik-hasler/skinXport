function calculateFee(targetPrice) {
  var rounded = Math.ceil(yourNumber * 100)/100;
}

function calculateMinimumSellPrice(buyPrice) {
  // Ensure buyPrice is a valid number
  if (isNaN(buyPrice) || buyPrice <= 0) {
    console.error("Invalid buy price");
    return null;
  }

  // Desired profit percentage
  const profitPercentage = 0.05;

  // Determine the fee percentage based on the sell price
  const sellPriceThreshold = 1000;
  const feePercentage = buyPrice > sellPriceThreshold ? 0.06 : 0.12;

  // Calculate the minimum sell price including the fee to achieve the desired profit
  const minimumSellPrice = (1 + profitPercentage) * (1 + feePercentage) * buyPrice;

  return minimumSellPrice;
}

// Example usage:
const buyPrice = 100; // Replace with your actual buy price
const minimumSellPrice = calculateMinimumSellPrice(buyPrice);

if (minimumSellPrice !== null) {
  console.log(`Minimum Sell Price for >5% profit: ${minimumSellPrice}`);
}

Base formula: Selling Price = Cost Price / (1 - Selling Fee Percentage)
https://www.quora.com/What-is-the-formula-to-calculate-a-selling-price-based-on-a-selling-fee-in-percentage
