# ERC20 Purchase MetaMask Snap

This MetaMask Snap allows users to purchase ERC20 tokens directly from X (formerly Twitter) posts.

## Project Status

This project is currently in development. Basic setup and connectivity with MetaMask Flask have been established.

## Prerequisites

- Node.js (v14 or later recommended)
- npm (usually comes with Node.js)
- MetaMask Flask (Developer version of MetaMask that supports Snaps)

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/jamesyoung/metamask-snap-erc20-purchase
   cd metamask-snap-erc20-purchase
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the project:
   ```
   npm run build
   ```

4. Start the development server:
   ```
   npm run serve
   ```

## Connecting the Snap

1. Ensure MetaMask Flask is installed in your browser.
2. Navigate to `http://localhost:8000` in your browser (assuming you're using the provided `serve.js`).
3. Click the "Connect" button on the page.
4. MetaMask Flask should prompt you to connect to the snap.

## Development

The main snap code is located in `src/index.js`. After making changes:

1. Rebuild the project:
   ```
   npm run build
   ```

2. Restart the server:
   ```
   npm run serve
   ```

3. Refresh the connection page and reconnect the snap if necessary.

## Testing

You can test the snap's functionality using the browser console:

```javascript
await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: 'local:http://localhost:8080',
    request: { method: 'hello' }
  }
});
```

Replace 'hello' with other implemented methods as needed.

## Next Steps

- Implement ERC20 token purchase functionality
- Add user interface dialogs
- Implement error handling
- Add comprehensive testing
- Prepare for publication