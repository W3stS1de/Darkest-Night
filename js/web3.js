// Web3 and Irys integration for Darkest Night
import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { ethers } from "ethers";

// Web3 Configuration
const WEB3_CONFIG = {
    entryFee: "1000000000000000", // 0.001 ETH in wei
    fundAmount: "10000000000000000", // 0.01 ETH in wei
    network: {
        chainId: "0x1", // Ethereum mainnet (change to "0xaa36a7" for Sepolia testnet)
        chainName: "Ethereum Mainnet",
        rpcUrls: ["https://mainnet.infura.io/v3/YOUR_INFURA_ID"],
        blockExplorerUrls: ["https://etherscan.io"]
    },
    irysNetwork: "mainnet" // or "devnet" for testing
};

// Game Web3 State
const gameWeb3State = {
    connected: false,
    userAddress: null,
    provider: null,
    signer: null,
    irysUploader: null,
    balance: "0",
    irysBalance: "0",
    entryPaid: false,
    gameSession: null,
    audioEnabled: false
};

// UI Elements
const web3Elements = {
    walletSection: null,
    connectButton: null,
    walletInfo: null,
    userAddress: null,
    userBalance: null,
    irysBalance: null,
    fundButton: null,
    payEntryButton: null,
    walletStatus: null,
    leaderboardList: null,
    loadLeaderboardButton: null
};

// Initialize Web3 Integration
export async function initWeb3() {
    console.log('🔗 Initializing Web3 integration...');
    
    // Get UI elements
    web3Elements.walletSection = document.getElementById('walletSection');
    web3Elements.connectButton = document.getElementById('connectWallet');
    web3Elements.walletInfo = document.getElementById('walletInfo');
    web3Elements.userAddress = document.getElementById('userAddress');
    web3Elements.userBalance = document.getElementById('userBalance');
    web3Elements.irysBalance = document.getElementById('irysBalance');
    web3Elements.fundButton = document.getElementById('fundIrys');
    web3Elements.payEntryButton = document.getElementById('payEntry');
    web3Elements.walletStatus = document.getElementById('walletStatus');
    web3Elements.leaderboardList = document.getElementById('leaderboardList');
    web3Elements.loadLeaderboardButton = document.getElementById('loadLeaderboard');
    
    // Add event listeners
    if (web3Elements.connectButton) {
        web3Elements.connectButton.addEventListener('click', connectWallet);
    }
    if (web3Elements.fundButton) {
        web3Elements.fundButton.addEventListener('click', fundIrysBalance);
    }
    if (web3Elements.payEntryButton) {
        web3Elements.payEntryButton.addEventListener('click', payGameEntry);
    }
    if (web3Elements.loadLeaderboardButton) {
        web3Elements.loadLeaderboardButton.addEventListener('click', loadLeaderboard);
    }
    
    // Check if MetaMask is available
    if (typeof window.ethereum !== 'undefined') {
        console.log('✅ MetaMask detected');
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
        
        // Try to connect if previously connected
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            console.log('🔄 Reconnecting to previously connected wallet...');
            await connectWallet();
        }
    } else {
        console.log('❌ MetaMask not detected');
        updateWalletStatus('MetaMask not installed. Please install MetaMask extension.', 'error');
    }
    
    // Load leaderboard on init
    loadLeaderboard();
}

// Connect to MetaMask wallet
export async function connectWallet() {
    try {
        if (!window.ethereum) {
            throw new Error('MetaMask not detected');
        }
        
        updateConnectButton('Connecting...', true);
        
        // Request account access
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        
        if (accounts.length === 0) {
            throw new Error('No accounts found');
        }
        
        // Create provider and signer
        gameWeb3State.provider = new ethers.BrowserProvider(window.ethereum);
        gameWeb3State.signer = await gameWeb3State.provider.getSigner();
        gameWeb3State.userAddress = accounts[0];
        gameWeb3State.connected = true;
        
        // Get balances
        const balance = await gameWeb3State.provider.getBalance(gameWeb3State.userAddress);
        gameWeb3State.balance = balance.toString();
        
        // Initialize Irys connection
        await initIrysConnection();
        
        // Update UI
        updateWalletUI();
        updateWalletStatus('Wallet connected successfully!', 'success');
        
        console.log('✅ Wallet connected:', gameWeb3State.userAddress);
        
    } catch (error) {
        console.error('❌ Wallet connection failed:', error);
        updateWalletStatus(`Connection failed: ${error.message}`, 'error');
        updateConnectButton('Connect MetaMask', false);
    }
}

// Initialize Irys connection
async function initIrysConnection() {
    try {
        console.log('🔄 Initializing Irys connection...');
        
        gameWeb3State.irysUploader = await WebUploader(WebEthereum).withProvider(gameWeb3State.provider);
        
        // Get Irys balance
        const irysBalance = await gameWeb3State.irysUploader.getBalance();
        gameWeb3State.irysBalance = irysBalance.balance;
        
        console.log('✅ Irys connection established');
        
    } catch (error) {
        console.error('❌ Irys connection failed:', error);
        throw new Error(`Irys connection failed: ${error.message}`);
    }
}

// Fund Irys balance
export async function fundIrysBalance() {
    try {
        if (!gameWeb3State.irysUploader) {
            throw new Error('Irys not connected');
        }
        
        updateFundButton('Funding...', true);
        
        console.log('💰 Funding Irys balance...');
        
        const receipt = await gameWeb3State.irysUploader.fund(WEB3_CONFIG.fundAmount);
        console.log('✅ Funding receipt:', receipt);
        
        // Update balance
        const newBalance = await gameWeb3State.irysUploader.getBalance();
        gameWeb3State.irysBalance = newBalance.balance;
        
        updateWalletUI();
        showNotification('Irys balance funded successfully!', 'success');
        
    } catch (error) {
        console.error('❌ Funding failed:', error);
        showNotification(`Funding failed: ${error.message}`, 'error');
    } finally {
        updateFundButton('Fund Irys (0.01 ETH)', false);
    }
}

// Pay game entry fee
export async function payGameEntry() {
    try {
        if (!gameWeb3State.irysUploader) {
            throw new Error('Irys not connected');
        }
        
        updatePayEntryButton('Processing Payment...', true);
        
        console.log('💳 Processing entry fee payment...');
        
        // Create entry fee transaction data
        const entryData = {
            game: 'darkest-night',
            player: gameWeb3State.userAddress,
            entryFee: WEB3_CONFIG.entryFee,
            timestamp: Date.now(),
            version: '1.0.0'
        };
        
        // Create and sign transaction
        const tx = gameWeb3State.irysUploader.createTransaction(
            JSON.stringify(entryData),
            {
                tags: [
                    { name: 'Content-Type', value: 'application/json' },
                    { name: 'Game-Type', value: 'darkest-night' },
                    { name: 'Action', value: 'entry-payment' },
                    { name: 'Player', value: gameWeb3State.userAddress },
                    { name: 'Version', value: '1.0.0' }
                ]
            }
        );
        
        await tx.sign();
        console.log('📝 Entry payment transaction signed:', tx.id);
        
        const receipt = await tx.upload();
        console.log('✅ Entry payment completed:', receipt.id);
        
        // Update game state
        gameWeb3State.entryPaid = true;
        gameWeb3State.gameSession = {
            entryTxId: receipt.id,
            startTime: Date.now(),
            player: gameWeb3State.userAddress
        };
        
        // Update UI and enable game start
        updatePayEntryButton('Entry Paid ✓', true);
        enableGameStart();
        showNotification('Entry fee paid! You can now start the game.', 'success');
        
    } catch (error) {
        console.error('❌ Entry payment failed:', error);
        showNotification(`Payment failed: ${error.message}`, 'error');
        updatePayEntryButton('Pay Entry Fee (0.001 ETH)', false);
    }
}

// Submit game score to blockchain
export async function submitGameScore(score, wave, kills, crystals, duration) {
    try {
        if (!gameWeb3State.irysUploader || !gameWeb3State.entryPaid) {
            console.log('❌ Cannot submit score: No entry payment or Irys not connected');
            return false;
        }
        
        console.log('📊 Submitting game score to blockchain...');
        
        const scoreData = {
            game: 'darkest-night',
            player: gameWeb3State.userAddress,
            score: {
                wave: wave,
                kills: kills,
                crystals: crystals,
                finalScore: score,
                duration: duration
            },
            session: {
                entryTxId: gameWeb3State.gameSession.entryTxId,
                startTime: gameWeb3State.gameSession.startTime,
                endTime: Date.now()
            },
            timestamp: Date.now(),
            version: '1.0.0'
        };
        
        // Submit score transaction
        const scoreReceipt = await gameWeb3State.irysUploader.upload(
            JSON.stringify(scoreData),
            {
                tags: [
                    { name: 'Content-Type', value: 'application/json' },
                    { name: 'Game-Type', value: 'darkest-night' },
                    { name: 'Action', value: 'score-submission' },
                    { name: 'Player', value: gameWeb3State.userAddress },
                    { name: 'Wave', value: wave.toString() },
                    { name: 'Score', value: score.toString() },
                    { name: 'Kills', value: kills.toString() },
                    { name: 'Crystals', value: crystals.toString() },
                    { name: 'Duration', value: duration.toString() },
                    { name: 'Timestamp', value: Date.now().toString() },
                    { name: 'Version', value: '1.0.0' }
                ]
            }
        );
        
        console.log('✅ Score submitted successfully:', scoreReceipt.id);
        showNotification('Score submitted to blockchain!', 'success');
        
        // Reset game session for next play
        gameWeb3State.entryPaid = false;
        gameWeb3State.gameSession = null;
        updatePayEntryButton('Pay Entry Fee (0.001 ETH)', false);
        
        // Auto-refresh leaderboard
        setTimeout(() => loadLeaderboard(), 2000);
        
        return true;
        
    } catch (error) {
        console.error('❌ Score submission failed:', error);
        showNotification(`Score submission failed: ${error.message}`, 'error');
        return false;
    }
}

// Load leaderboard from blockchain
export async function loadLeaderboard() {
    try {
        console.log('📋 Loading leaderboard from blockchain...');
        
        if (web3Elements.loadLeaderboardButton) {
            web3Elements.loadLeaderboardButton.textContent = 'Loading...';
            web3Elements.loadLeaderboardButton.disabled = true;
        }
        
        // Query Irys GraphQL endpoint
        const query = `
            query GetDarkestNightScores {
                transactions(
                    tags: [
                        { name: "Game-Type", values: ["darkest-night"] },
                        { name: "Action", values: ["score-submission"] }
                    ]
                    order: DESC
                    first: 50
                ) {
                    edges {
                        node {
                            id
                            address
                            tags {
                                name
                                value
                            }
                            timestamp
                        }
                    }
                }
            }
        `;
        
        const response = await fetch('https://uploader.irys.xyz/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });
        
        const result = await response.json();
        
        if (result.errors) {
            throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
        }
        
        // Process leaderboard data
        const scores = result.data.transactions.edges.map(edge => {
            const tags = edge.node.tags;
            const getTagValue = (name) => {
                const tag = tags.find(t => t.name === name);
                return tag ? tag.value : '0';
            };
            
            return {
                address: edge.node.address,
                wave: parseInt(getTagValue('Wave')) || 0,
                score: parseInt(getTagValue('Score')) || 0,
                kills: parseInt(getTagValue('Kills')) || 0,
                crystals: parseInt(getTagValue('Crystals')) || 0,
                duration: parseInt(getTagValue('Duration')) || 0,
                timestamp: parseInt(edge.node.timestamp) || 0,
                txId: edge.node.id
            };
        });
        
        // Sort by score (descending), then by wave, then by kills
        scores.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            if (b.wave !== a.wave) return b.wave - a.wave;
            return b.kills - a.kills;
        });
        
        // Remove duplicates (keep best score per player)
        const uniqueScores = [];
        const seenPlayers = new Set();
        
        for (const score of scores) {
            if (!seenPlayers.has(score.address)) {
                uniqueScores.push(score);
                seenPlayers.add(score.address);
            }
        }
        
        // Display leaderboard
        displayLeaderboard(uniqueScores.slice(0, 10)); // Top 10
        
        console.log('✅ Leaderboard loaded successfully');
        
    } catch (error) {
        console.error('❌ Leaderboard loading failed:', error);
        displayLeaderboardError(error.message);
    } finally {
        if (web3Elements.loadLeaderboardButton) {
            web3Elements.loadLeaderboardButton.textContent = 'Refresh Leaderboard';
            web3Elements.loadLeaderboardButton.disabled = false;
        }
    }
}

// Display leaderboard in UI
function displayLeaderboard(scores) {
    if (!web3Elements.leaderboardList) return;
    
    if (scores.length === 0) {
        web3Elements.leaderboardList.innerHTML = '<div class="leaderboard-empty">No scores yet. Be the first to play!</div>';
        return;
    }
    
    const leaderboardHTML = scores.map((score, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        const isCurrentPlayer = score.address.toLowerCase() === gameWeb3State.userAddress?.toLowerCase();
        const playerClass = isCurrentPlayer ? 'leaderboard-item current-player' : 'leaderboard-item';
        
        return `
            <div class="${playerClass}">
                <div class="leaderboard-rank">${medal}</div>
                <div class="leaderboard-player">
                    ${formatAddress(score.address)}
                    ${isCurrentPlayer ? ' (You)' : ''}
                </div>
                <div class="leaderboard-stats">
                    <div class="stat">Wave ${score.wave}</div>
                    <div class="stat">${score.kills} kills</div>
                    <div class="stat">${score.crystals} IRYS</div>
                </div>
                <div class="leaderboard-score">${score.score}</div>
            </div>
        `;
    }).join('');
    
    web3Elements.leaderboardList.innerHTML = leaderboardHTML;
}

// Display leaderboard error
function displayLeaderboardError(error) {
    if (!web3Elements.leaderboardList) return;
    
    web3Elements.leaderboardList.innerHTML = `
        <div class="leaderboard-error">
            Failed to load leaderboard: ${error}
            <button onclick="loadLeaderboard()" class="retry-btn">Retry</button>
        </div>
    `;
}

// Handle account changes
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        // User disconnected wallet
        console.log('🔌 Wallet disconnected');
        resetWeb3State();
        updateWalletUI();
        updateWalletStatus('Wallet disconnected', 'info');
    } else if (accounts[0] !== gameWeb3State.userAddress) {
        // User switched accounts
        console.log('🔄 Account switched');
        connectWallet();
    }
}

// Handle chain changes
function handleChainChanged(chainId) {
    console.log('🔗 Chain changed to:', chainId);
    // Reload the page to reset the state
    window.location.reload();
}

// Reset Web3 state
function resetWeb3State() {
    gameWeb3State.connected = false;
    gameWeb3State.userAddress = null;
    gameWeb3State.provider = null;
    gameWeb3State.signer = null;
    gameWeb3State.irysUploader = null;
    gameWeb3State.balance = "0";
    gameWeb3State.irysBalance = "0";
    gameWeb3State.entryPaid = false;
    gameWeb3State.gameSession = null;
}

// UI Update Functions
function updateWalletUI() {
    if (!gameWeb3State.connected) {
        // Hide wallet info
        if (web3Elements.walletInfo) web3Elements.walletInfo.style.display = 'none';
        if (web3Elements.connectButton) {
            web3Elements.connectButton.style.display = 'inline-block';
            web3Elements.connectButton.textContent = 'Connect MetaMask';
            web3Elements.connectButton.disabled = false;
        }
        return;
    }
    
    // Show wallet info
    if (web3Elements.walletInfo) web3Elements.walletInfo.style.display = 'block';
    if (web3Elements.connectButton) web3Elements.connectButton.style.display = 'none';
    
    // Update address and balances
    if (web3Elements.userAddress) {
        web3Elements.userAddress.textContent = formatAddress(gameWeb3State.userAddress);
    }
    if (web3Elements.userBalance) {
        web3Elements.userBalance.textContent = formatEther(gameWeb3State.balance);
    }
    if (web3Elements.irysBalance) {
        web3Elements.irysBalance.textContent = formatEther(gameWeb3State.irysBalance);
    }
    
    // Update pay entry button state
    if (web3Elements.payEntryButton) {
        if (gameWeb3State.entryPaid) {
            web3Elements.payEntryButton.textContent = 'Entry Paid ✓';
            web3Elements.payEntryButton.disabled = true;
        } else {
            web3Elements.payEntryButton.textContent = 'Pay Entry Fee (0.001 ETH)';
            web3Elements.payEntryButton.disabled = false;
        }
    }
}

function updateConnectButton(text, disabled) {
    if (web3Elements.connectButton) {
        web3Elements.connectButton.textContent = text;
        web3Elements.connectButton.disabled = disabled;
    }
}

function updateFundButton(text, disabled) {
    if (web3Elements.fundButton) {
        web3Elements.fundButton.textContent = text;
        web3Elements.fundButton.disabled = disabled;
    }
}

function updatePayEntryButton(text, disabled) {
    if (web3Elements.payEntryButton) {
        web3Elements.payEntryButton.textContent = text;
        web3Elements.payEntryButton.disabled = disabled;
    }
}

function updateWalletStatus(message, type) {
    if (web3Elements.walletStatus) {
        web3Elements.walletStatus.textContent = message;
        web3Elements.walletStatus.className = `wallet-status ${type}`;
    }
}

function showNotification(message, type) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('web3-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'web3-notification';
        notification.className = 'web3-notification';
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.className = `web3-notification show ${type}`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

function enableGameStart() {
    // Enable start button if it exists
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.disabled = false;
        startBtn.classList.remove('disabled');
        startBtn.classList.add('enabled');
    }
}

// Utility Functions
function formatAddress(address) {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

function formatEther(wei) {
    try {
        return parseFloat(ethers.formatEther(wei)).toFixed(4);
    } catch {
        return '0.0000';
    }
}

// Export game state checker
export function isWeb3Ready() {
    return gameWeb3State.connected && gameWeb3State.entryPaid;
}

export function getPlayerAddress() {
    return gameWeb3State.userAddress;
}

export function isEntryPaid() {
    return gameWeb3State.entryPaid;
}

// Export for global access
window.web3Game = {
    initWeb3,
    connectWallet,
    payGameEntry,
    submitGameScore,
    loadLeaderboard,
    isWeb3Ready,
    getPlayerAddress,
    isEntryPaid
};