const { panel, text, heading, copyable } = require('@metamask/snaps-sdk');
const { ethers } = require('ethers');

const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint amount) returns (bool)"
];

async function getTokenDetails(params) {
  const { tokenAddress } = params;
  if (!tokenAddress) {
    throw new Error('Missing token address');
  }

  try {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

    const [name, symbol, decimals] = await Promise.all([
      tokenContract.name(),
      tokenContract.symbol(),
      tokenContract.decimals()
    ]);

    return { name, symbol, decimals: decimals.toString() };
  } catch (error) {
    throw new Error(`Failed to get token details: ${error.message}`);
  }
}

async function approveToken(params) {
  const { tokenAddress, amount, spender } = params;
  if (!tokenAddress || !amount || !spender) {
    throw new Error('Missing required parameters for approval');
  }

  try {
    const { name, symbol, decimals } = await getTokenDetails({ tokenAddress });
    const formattedAmount = ethers.utils.formatUnits(amount, decimals);

    const confirmed = await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'confirmation',
        content: panel([
          heading('Confirm Token Approval'),
          text(`Do you want to approve ${formattedAmount} ${symbol} (${name}) for ${spender}?`),
        ]),
      },
    });

    if (!confirmed) {
      return 'Approval cancelled by user.';
    }

    // Instead of sending the transaction directly, we'll return instructions
    return snap.request({
      method: 'snap_dialog',
      params: {
        type: 'alert',
        content: panel([
          heading('Approval Instructions'),
          text(`To approve ${formattedAmount} ${symbol} for ${spender}:`),
          text('1. Open MetaMask'),
          text(`2. Send a transaction to ${tokenAddress}`),
          text('3. Use this data:'),
          copyable(new ethers.utils.Interface(ERC20_ABI).encodeFunctionData('approve', [spender, amount])),
          text('4. Confirm the transaction in MetaMask'),
        ]),
      },
    });
  } catch (error) {
    throw new Error(`Approval preparation failed: ${error.message}`);
  }
}

async function transferToken(params) {
  const { tokenAddress, amount, recipient } = params;
  if (!tokenAddress || !amount || !recipient) {
    throw new Error('Missing required parameters for transfer');
  }

  try {
    const { name, symbol, decimals } = await getTokenDetails({ tokenAddress });
    const formattedAmount = ethers.utils.formatUnits(amount, decimals);

    const confirmed = await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'confirmation',
        content: panel([
          heading('Confirm Token Transfer'),
          text(`Do you want to transfer ${formattedAmount} ${symbol} (${name}) to ${recipient}?`),
        ]),
      },
    });

    if (!confirmed) {
      return 'Transfer cancelled by user.';
    }

    // Instead of sending the transaction directly, we'll return instructions
    return snap.request({
      method: 'snap_dialog',
      params: {
        type: 'alert',
        content: panel([
          heading('Transfer Instructions'),
          text(`To transfer ${formattedAmount} ${symbol} to ${recipient}:`),
          text('1. Open MetaMask'),
          text(`2. Send a transaction to ${tokenAddress}`),
          text('3. Use this data:'),
          copyable(new ethers.utils.Interface(ERC20_ABI).encodeFunctionData('transfer', [recipient, amount])),
          text('4. Confirm the transaction in MetaMask'),
        ]),
      },
    });
  } catch (error) {
    throw new Error(`Transfer preparation failed: ${error.message}`);
  }
}

async function hello() {
  return snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: panel([
        heading('Hello from ERC20 Token Manager Snap!'),
        text('Your snap is connected and working.'),
      ]),
    },
  });
}

async function getSnapInfo() {
  return {
    name: 'ERC20 Token Manager',
    version: '1.0.0',
  };
}

module.exports.onRpcRequest = async ({ origin, request }) => {
  switch (request.method) {
    case 'hello':
      return hello();
    case 'getTokenDetails':
      return getTokenDetails(request.params);
    case 'approveToken':
      return approveToken(request.params);
    case 'transferToken':
      return transferToken(request.params);
    case 'getSnapInfo':
      return getSnapInfo();
    default:
      throw new Error('Method not found.');
  }
};