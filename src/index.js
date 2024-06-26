import { panel, text, heading, divider, copyable } from '@metamask/snaps-sdk';
import { ethers } from 'ethers';

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address sender, address recipient, uint256 amount) returns (bool)"
];

export const onRpcRequest = async ({ origin, request }) => {
  switch (request.method) {
    case 'hello':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'Alert',
          content: panel([
            heading('Hello, World!'),
            text('This is a Metamask snap for purchasing ERC20 tokens from X posts.'),
          ]),
        },
      });

    case 'purchaseToken':
      const { tokenAddress, amount, recipient } = request.params;
      
      // Get the user's Ethereum address
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const userAddress = accounts[0];

      // Create a new ethers provider
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      // Create the ERC20 contract instance
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

      try {
        // Approve the transfer
        const approveTx = await tokenContract.approve(recipient, amount);
        await approveTx.wait();

        // Transfer the tokens
        const transferTx = await tokenContract.transferFrom(userAddress, recipient, amount);
        const receipt = await transferTx.wait();

        return snap.request({
          method: 'snap_dialog',
          params: {
            type: 'Alert',
            content: panel([
              heading('Transaction Successful'),
              text(`Transferred ${ethers.utils.formatEther(amount)} tokens to ${recipient}`),
              divider(),
              text('Transaction Hash:'),
              copyable(receipt.transactionHash),
            ]),
          },
        });
      } catch (error) {
        return snap.request({
          method: 'snap_dialog',
          params: {
            type: 'Alert',
            content: panel([
              heading('Transaction Failed'),
              text(`Error: ${error.message}`),
            ]),
          },
        });
      }

    default:
      throw new Error('Method not found.');
  }
};