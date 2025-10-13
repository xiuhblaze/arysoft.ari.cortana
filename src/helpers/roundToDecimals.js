const roundToDecimals = (num, decimals = 4) => {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

export default roundToDecimals;