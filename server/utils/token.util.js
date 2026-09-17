/**
 * Token Generation Utility
 * Generates unique, memorable token strings like B-104, SHIV-105, RAM-201
 */

function generateToken({ centerCode = 'SHIV', sequenceNumber = 101, customPrefix = null }) {
  const prefix = customPrefix || 'B';
  const num = parseInt(sequenceNumber, 10) || 101;
  return `${prefix}-${num.toString().padStart(3, '0')}`;
}

module.exports = {
  generateToken,
};
