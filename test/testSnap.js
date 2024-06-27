const ethers = require('ethers');
const { 
  getTokenDetails, 
  purchaseToken,
  showConfirmationDialog,
  showSuccessDialog,
  showErrorDialog,
  showTokenInfoDialog
} = require('../src/index.js');

class MockProvider extends ethers.providers.BaseProvider {
  constructor() {
    super('mainnet'); // Specify the network when calling the parent constructor
    this.mockWallet = new ethers.Wallet('0x0123456789012345678901234567890123456789012345678901234567890123', this);
    this.balances = {};
  }

  async call(transaction) {
    console.log('Mock call:', transaction);
    if (transaction.data.startsWith('0x06fdde03')) return ethers.utils.defaultAbiCoder.encode(['string'], ['Mock Token']);
    if (transaction.data.startsWith('0x95d89b41')) return ethers.utils.defaultAbiCoder.encode(['string'], ['MCK']);
    if (transaction.data.startsWith('0x313ce567')) return ethers.utils.defaultAbiCoder.encode(['uint8'], [18]);
    if (transaction.data.startsWith('0x70a08231')) {
      const balance = this.balances[transaction.to] || ethers.utils.parseEther('1000');
      return ethers.utils.defaultAbiCoder.encode(['uint256'], [balance]);
    }
    if (transaction.data.startsWith('0xdd62ed3e')) return ethers.utils.defaultAbiCoder.encode(['uint256'], [ethers.utils.parseEther('500')]);
    return '0x';
  }

  getSigner() {
    return this.mockWallet;
  }

  async resolveName(name) {
    return name;
  }

  setBalance(address, balance) {
    this.balances[address] = balance;
  }

  // Implement the detectNetwork method
  async detectNetwork() {
    return { chainId: 1, name: 'mainnet' };
  }
}

// Mock ethereum object
global.ethereum = {
  request: async ({ method }) => {
    if (method === 'eth_requestAccounts') {
      return ['0x1234567890123456789012345678901234567890'];
    }
    throw new Error(`Unhandled method: ${method}`);
  }
};

// Mock snap object
global.snap = {
  request: async ({ method, params }) => {
    console.log(`Mocking snap.request with method: ${method}`);
    if (method === 'snap_dialog') {
      console.log('Dialog content:', JSON.stringify(params.content, null, 2));
      return true; // Simulate user confirming all dialogs
    }
    throw new Error(`Unhandled snap method: ${method}`);
  }
};

// Create mock provider
const mockProvider = new MockProvider();

async function runTests() {
  const validTokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';

  try {
    // Test getTokenDetails
    console.log('Testing getTokenDetails...');
    const tokenDetails = await getTokenDetails({ tokenAddress: validTokenAddress }, mockProvider);
    console.log('Token Details:', tokenDetails);

    // Test purchaseToken
    console.log('\nTesting purchaseToken...');
    const purchaseResult = await purchaseToken({
      tokenAddress: validTokenAddress,
      amount: ethers.utils.parseEther('1').toString(),
      recipient: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    }, mockProvider);
    console.log('Purchase Result:', purchaseResult);

    // Test purchaseToken with insufficient balance
    console.log('\nTesting purchaseToken with insufficient balance...');
    mockProvider.setBalance(validTokenAddress, ethers.utils.parseEther('0.5'));
    const insufficientBalanceResult = await purchaseToken({
      tokenAddress: validTokenAddress,
      amount: ethers.utils.parseEther('1').toString(),
      recipient: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    }, mockProvider);
    console.log('Insufficient Balance Result:', insufficientBalanceResult);

    console.log('All tests passed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTests();