# ERC20 Token Manager Snap

## WARNING

Do not use.

## Overview

The ERC20 Token Manager Snap is a MetaMask Snap that allows users to interact with ERC20 tokens directly from their MetaMask wallet. This snap provides functionality to view token details, approve token spending, and transfer tokens.

## Features

- Get token details (name, symbol, decimals)
- Approve token spending
- Transfer tokens
- User-friendly dialogs for confirmations and notifications

## Prerequisites

- MetaMask Flask (the developer version of MetaMask that supports Snaps)
- Node.js and npm

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/erc20-token-manager-snap.git
   cd erc20-token-manager-snap
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the snap:
   ```
   npm run build
   ```

4. Serve the snap locally:
   ```
   npm run serve
   ```

## Usage

1. Ensure MetaMask Flask is installed and running in your browser.

2. Navigate to `http://localhost:8000` in your browser.

3. Click "Connect to MetaMask" to connect the snap to your MetaMask wallet.

4. Use the provided buttons to interact with ERC20 tokens:
   - "Get Token Details": Retrieve information about a specific ERC20 token.
   - "Approve Token": Approve spending of a token by another address.
   - "Transfer Token": Transfer tokens to another address.

## Development

To make changes to the snap:

1. Modify the code in `src/index.js`.
2. Rebuild the snap:
   ```
   npm run build
   ```
3. Restart the server:
   ```
   npm run serve
   ```

## Testing

(Add information about your testing setup and how to run tests)

## Security Considerations

This snap interacts with ERC20 tokens and can initiate transactions. Always verify the token addresses and transaction details before confirming any operations.