// utils/hashing.js
const { createHmac } = require("crypto");
const bcrypt = require("bcryptjs"); // Use bcryptjs instead of bcrypt

const doHash = async (value, saltValue = 12) => {
  try {
    const result = await bcrypt.hash(value, saltValue);
    return result;
  } catch (error) {
    console.error("Error while hashing:", error);
    throw error;
  }
};

const doHashValidation = (value, hasedValue) => {
  const result = bcrypt.compare(value, hasedValue);
  return result;
};

const hmacProcess = (value, keys) => {
  const result = createHmac("sha256", keys).update(value).digest("hex");
  return result;
};

const dohashing = { doHash, doHashValidation, hmacProcess };
module.exports = dohashing;
