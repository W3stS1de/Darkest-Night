// Game configuration
const CONFIG = {
    canvas: {
        width: 900,
        height: 500
    },

    player: {
        x: 720,       
        y: 50,       
        width: 90,        
        height: 120,      
        shootCooldown: 25,
        facing: 'right'
    },

    tower: {
        x: 650,       
        y: 100,        
        width: 220,   
        height: 350,  
        maxHealth: 100
    },

    bullet: {
        speed: 10,
        damage: 25,
        size: 4,
        trailLength: 12
    },

    enemies: {
        spawnInterval: 90, 
        basic: { 
            health: 40, 
            speed: 1, 
            damage: 5, 
            color: '#ff6b6b', 
            reward: 1,
            width: 80,
            height: 100,
            animationSpeed: 20,
            states: ['idle', 'leftFoot', 'rightFoot']
        },
        fast: { 
            health: 70, 
            speed: 1,
            damage: 7, 
            color: '#ffb347', 
            reward: 2,
            width: 100,
            height: 115,
            animationSpeed: 12,
            states: ['walk', 'idle'] 
        },
        tank: { 
            health: 600, 
            speed: 0.5, 
            damage: 15, 
            color: '#8B4513', 
            reward: 3,
            width: 160,   
            height: 180,  
            animationSpeed: 15, 
            states: ['walk', 'idle', 'dead']
        },
        flyer: { 
            health: 100, 
            speed: 1.5, 
            damage: 12, 
            color: '#9370DB', 
            reward: 2,
            width: 400,
            height: 420,
            animationSpeed: 15,
            states: ['flight', 'attack'], 
            spritesheetFrames: {  
                flight: 8,
                attack: 8
            }
        },
        mage: { 
            health: 400,
            speed: 0.8, 
            damage: 20,
            color: '#8B0000', 
            reward: 5,
            width: 250,   
            height: 300,  
            animationSpeed: 8,
            states: ['idle', 'move'],
            healRate: 20,
            attackRange: 35,
            spritesheetFrames: {
                idle: 8,
                move: 8, 
                attack: 8,
                takeHit: 4,
                death: 5
            }
        }
    },

    waves: {
        baseEnemies: 5,
        enemyIncrease: 2,
        maxEnemies: 20,
        towerHealPerWave: 10,
        doubleSpawnChance: 0.3,  
        doubleSpawnDelay: 1500,   
        quadSpawnChance: 0.4,    
        quadSpawnDelay: 1500,    
        quadSpawnInterval: 300   
    },

    particles: {
        deathParticles: 8,
        maxLife: 30,
        irysParticleLife: 60
    },

    // граница земли
    ground: {
        y: 420,                    
        grassHeight: 30,           
        
        borderHeight: 80,          
        borderOffset: -30,         
        
        stoneColor: '#4a5568',     
        stoneDark: '#2d3748',      
        stoneLight: '#718096',     
        mossColor: '#2d5016',      
        crackColor: '#171923'      
    },

    // Web3 configuration
    web3: {
        required: true,                    
        network: {
            chainId: '0x4f6',             
            currency: 'IRYS',
            rpcUrl: 'https://testnet-rpc.irys.xyz/v1/execution-rpc',
            explorerUrl: 'https://storage-explorer.irys.xyz'
        },
        entryFee: '0.001',                
        contractAddresses: {
            entryFeeCollector: '0x92D696BFcA04E6241F2aaC813d0D14F8cf6c8D2b'
        },
        features: {
            entryFeeRequired: true,        
            scoreSubmission: false,        
            leaderboard: false,            
            rewards: false                 
        }
    }
};

const ASSETS = {
    player: {
        right: 'assets/player/player_right.png', 
        left: 'assets/player/player_left.png'    
    },
    tower: 'assets/buildings/tower.png', 
    enemies: {
        basic: {
            idle: 'assets/enemies/basic_idle.png',       
            leftFoot: 'assets/enemies/basic_left.png',   
            rightFoot: 'assets/enemies/basic_right.png', 
            attack: 'assets/enemies/basic_attack.png'    
        },
        fast: {
            walk: [
                'assets/enemies/fast_walk_1.png',
                'assets/enemies/fast_walk_2.png',
                'assets/enemies/fast_walk_3.png',
                'assets/enemies/fast_walk_4.png',
                'assets/enemies/fast_walk_5.png',
                'assets/enemies/fast_walk_6.png',
                'assets/enemies/fast_walk_7.png',
                'assets/enemies/fast_walk_8.png'
            ],
            idle: 'assets/enemies/fast_idle.png' 
        },
        tank: {
            walk: [
                'assets/enemies/tank_walk_0.png',
                'assets/enemies/tank_walk_1.png',
                'assets/enemies/tank_walk_2.png',
                'assets/enemies/tank_walk_3.png',
                'assets/enemies/tank_walk_4.png',
                'assets/enemies/tank_walk_5.png',
                'assets/enemies/tank_walk_6.png',
                'assets/enemies/tank_walk_7.png',
                'assets/enemies/tank_walk_8.png',
                'assets/enemies/tank_walk_9.png'
            ],
            idle: [
                'assets/enemies/tank_idle_0.png',
                'assets/enemies/tank_idle_1.png',
                'assets/enemies/tank_idle_2.png',
                'assets/enemies/tank_idle_3.png',
                'assets/enemies/tank_idle_4.png',
                'assets/enemies/tank_idle_5.png',
                'assets/enemies/tank_idle_6.png',
                'assets/enemies/tank_idle_7.png',
                'assets/enemies/tank_idle_8.png',
                'assets/enemies/tank_idle_9.png'
            ],
            hurt: [
                'assets/enemies/tank_hurt_0.png',
                'assets/enemies/tank_hurt_1.png',
                'assets/enemies/tank_hurt_2.png',
                'assets/enemies/tank_hurt_3.png',
                'assets/enemies/tank_hurt_4.png',
                'assets/enemies/tank_hurt_5.png',
                'assets/enemies/tank_hurt_6.png',
                'assets/enemies/tank_hurt_7.png',
                'assets/enemies/tank_hurt_8.png',
                'assets/enemies/tank_hurt_9.png'
            ],
            dead: [
                'assets/enemies/tank_dead_0.png',
                'assets/enemies/tank_dead_1.png',
                'assets/enemies/tank_dead_2.png',
                'assets/enemies/tank_dead_3.png',
                'assets/enemies/tank_dead_4.png',
                'assets/enemies/tank_dead_5.png',
                'assets/enemies/tank_dead_6.png',
                'assets/enemies/tank_dead_7.png',
                'assets/enemies/tank_dead_8.png',
                'assets/enemies/tank_dead_9.png'
            ]
        },
        flyer: {
            flight: 'assets/enemies/flyer_flight.png', 
            attack: 'assets/enemies/flyer_attack.png'  
        },
        mage: {
            idle: 'assets/enemies/mage_idle.png',
            move: 'assets/enemies/mage_move.png',
            attack: 'assets/enemies/mage_attack.png',
            takeHit: 'assets/enemies/mage_takehit.png',
            death: 'assets/enemies/mage_death.png'
        }
    },
    background: 'assets/backgrounds/background.png', 
    
    audio: {
        backgroundMusic: 'assets/audio/background_music.mp3',
        backgroundMusic2: 'assets/audio/background_music_2.mp3', 
        shootSound: 'assets/audio/shoot_sound.mp3',
        enemyHit: 'assets/audio/enemy_hit.mp3',
        towerHit: 'assets/audio/tower_hit.mp3',
        gameOver: 'assets/audio/game_over.mp3'
    }
};

const IMAGES = {
    player: {
        right: null,
        left: null
    },
    tower: null,
    enemies: {
        basic: {},
        fast: {},
        tank: {
            walk: [], 
            idle: [], 
            hurt: [], 
            dead: []  
        },
        flyer: {},
        mage: {}
    },
    background: null,
    loaded: false
};

const AUDIO = {
    backgroundMusic: null,
    backgroundMusic2: null, 
    shootSound: null,
    enemyHit: null,
    towerHit: null,
    gameOver: null,
    enabled: false,
    musicPlaying: false,
    currentTrackIndex: 0, 
    musicTracks: [], 
    musicPaused: false 
};

// WEB3 CONSTANTS
const WEB3_CONSTANTS = {
    IRYS_NETWORK: {
        CHAIN_ID: 1270,
        CHAIN_ID_HEX: '0x4f6',
        NAME: 'Irys Network',
        CURRENCY: 'IRYS',
        RPC_URL: 'https://testnet-rpc.irys.xyz/v1/execution-rpc',
        EXPLORER_URL: 'https://storage-explorer.irys.xyz'
    },
    
    ENTRY_FEE: {
        AMOUNT: '0.001',
        WEI: '1000000000000000', 
        DESCRIPTION: '0.001 IRYS entry fee'
    },
    
    GAS_SETTINGS: {
        MAX_FEE_PER_GAS: '20', 
        MAX_PRIORITY_FEE_PER_GAS: '2', 
        GAS_LIMIT_BUFFER: 1.2 
    },
    
    CONTRACT_ADDRESSES: {
        ENTRY_FEE_COLLECTOR: '0x92D696BFcA04E6241F2aaC813d0D14F8cf6c8D2b'
    },
    
    FEATURES: {
        REQUIRE_ENTRY_FEE: true,    
        SUBMIT_SCORES: false,       
        LOAD_LEADERBOARD: false,    
        AUTO_REWARDS: false,        
        PERSISTENT_SESSIONS: false  
    }
};

// функции утилиты 
const WEB3_UTILS = {
    
    isValidAddress(address) {
        return address && /^0x[a-fA-F0-9]{40}$/.test(address);
    },
    
    formatAddress(address) {
        if (!address) return 'N/A';
        if (!this.isValidAddress(address)) return 'Invalid';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    },
    
    ethToWei(ethAmount) {
        if (typeof ethers !== 'undefined') {
            return ethers.parseEther(ethAmount.toString());
        }
        
        return BigInt(Math.floor(parseFloat(ethAmount) * 1e18));
    },
    
    weiToEth(weiAmount) {
        if (typeof ethers !== 'undefined') {
            return ethers.formatEther(weiAmount);
        }
        
        return (parseFloat(weiAmount) / 1e18).toFixed(6);
    },
    
    isCorrectNetwork(chainId) {
        const expected = WEB3_CONSTANTS.IRYS_NETWORK.CHAIN_ID_HEX;
        return chainId === expected;
    },
    
    getNetworkConfig() {
        return {
            chainId: WEB3_CONSTANTS.IRYS_NETWORK.CHAIN_ID_HEX,
            chainName: WEB3_CONSTANTS.IRYS_NETWORK.NAME,
            nativeCurrency: {
                name: WEB3_CONSTANTS.IRYS_NETWORK.CURRENCY,
                symbol: WEB3_CONSTANTS.IRYS_NETWORK.CURRENCY,
                decimals: 18
            },
            rpcUrls: [WEB3_CONSTANTS.IRYS_NETWORK.RPC_URL],
            blockExplorerUrls: [WEB3_CONSTANTS.IRYS_NETWORK.EXPLORER_URL]
        };
    },
    
    hasMinimumBalance(balanceWei) {
        const entryFeeWei = this.ethToWei(WEB3_CONSTANTS.ENTRY_FEE.AMOUNT);
        const gasEstimateWei = this.ethToWei('0.0001'); 
        const requiredWei = entryFeeWei + gasEstimateWei;
        
        return BigInt(balanceWei) >= requiredWei;
    },
    
    createEntryFeeTransaction(fromAddress) {
        return {
            to: WEB3_CONSTANTS.CONTRACT_ADDRESSES.ENTRY_FEE_COLLECTOR,
            from: fromAddress,
            value: this.ethToWei(WEB3_CONSTANTS.ENTRY_FEE.AMOUNT),
            maxFeePerGas: this.ethToWei(WEB3_CONSTANTS.GAS_SETTINGS.MAX_FEE_PER_GAS + 'e-9'),
            maxPriorityFeePerGas: this.ethToWei(WEB3_CONSTANTS.GAS_SETTINGS.MAX_PRIORITY_FEE_PER_GAS + 'e-9')
        };
    },
    
    formatTxId(txId) {
        if (!txId) return 'N/A';
        return `${txId.substring(0, 8)}...${txId.substring(txId.length - 4)}`;
    }
};

function validateConfig() {
    const errors = [];
    
    if (CONFIG.web3.required) {
        if (!WEB3_UTILS.isValidAddress(WEB3_CONSTANTS.CONTRACT_ADDRESSES.ENTRY_FEE_COLLECTOR)) {
            errors.push('Invalid ENTRY_FEE_COLLECTOR address. Please set a valid Ethereum address.');
        }
        
        if (!WEB3_CONSTANTS.ENTRY_FEE.AMOUNT || parseFloat(WEB3_CONSTANTS.ENTRY_FEE.AMOUNT) <= 0) {
            errors.push('Invalid entry fee amount. Must be greater than 0.');
        }
        
        if (!WEB3_CONSTANTS.IRYS_NETWORK.RPC_URL || !WEB3_CONSTANTS.IRYS_NETWORK.RPC_URL.startsWith('http')) {
            errors.push('Invalid RPC URL for Irys Network.');
        }
    }
    
    if (!ASSETS.background) {
        console.warn('Background image path not set');
    }
    
    if (!ASSETS.audio.backgroundMusic || !ASSETS.audio.backgroundMusic2) {
        console.warn('Background music paths not set');
    }
    
    if (errors.length > 0) {
        console.error('❌ Configuration errors:');
        errors.forEach(error => console.error('  -', error));
        return false;
    }
    
    console.log('✅ Configuration validated successfully');
    return true;
}

function initWeb3Constants() {
    console.log('🔧 Initializing Web3 constants for Irys Network...');
    
    const criticalChecks = [
        {
            name: 'Irys Network Chain ID',
            value: WEB3_CONSTANTS.IRYS_NETWORK.CHAIN_ID_HEX,
            valid: WEB3_CONSTANTS.IRYS_NETWORK.CHAIN_ID_HEX === '0x4f6'
        },
        {
            name: 'Entry Fee Collector Address',
            value: WEB3_CONSTANTS.CONTRACT_ADDRESSES.ENTRY_FEE_COLLECTOR,
            valid: WEB3_UTILS.isValidAddress(WEB3_CONSTANTS.CONTRACT_ADDRESSES.ENTRY_FEE_COLLECTOR)
        },
        {
            name: 'Entry Fee Amount',
            value: WEB3_CONSTANTS.ENTRY_FEE.AMOUNT,
            valid: parseFloat(WEB3_CONSTANTS.ENTRY_FEE.AMOUNT) > 0
        }
    ];
    
    let allValid = true;
    console.log('🔍 Checking Web3 configuration:');
    
    criticalChecks.forEach(check => {
        if (check.valid) {
            console.log(`  ✅ ${check.name}: ${check.value}`);
        } else {
            console.error(`  ❌ ${check.name}: ${check.value} (INVALID)`);
            allValid = false;
        }
    });
    
    if (allValid) {
        console.log('✅ All Web3 constants are properly configured');
    } else {
        console.error('❌ Some Web3 constants are incorrectly configured');
    }
    
    return allValid;
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Validating game configuration...');
    
    const isConfigValid = validateConfig();
    const isWeb3Valid = initWeb3Constants();
    
    if (!isConfigValid || !isWeb3Valid) {
        console.error('❌ Configuration validation failed! Please fix the errors above.');
        
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-family: Arial, sans-serif;
            font-weight: bold;
            text-align: center;
            z-index: 10000;
            max-width: 500px;
        `;
        errorDiv.innerHTML = `
            <h3>⚠️ Configuration Error</h3>
            <p>Please check the browser console for details and fix the configuration in config.js</p>
            <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 8px 16px; background: white; color: red; border: none; border-radius: 5px; cursor: pointer;">Close</button>
        `;
        document.body.appendChild(errorDiv);
    } else {
        console.log('Game configuration loaded successfully!');
        console.log('Irys Network Integration:');
        console.log('  - Network:', WEB3_CONSTANTS.IRYS_NETWORK.NAME);
        console.log('  - Chain ID:', WEB3_CONSTANTS.IRYS_NETWORK.CHAIN_ID_HEX);
        console.log('  - Entry fee:', WEB3_CONSTANTS.ENTRY_FEE.DESCRIPTION);
        console.log('  - Collector address:', WEB3_CONSTANTS.CONTRACT_ADDRESSES.ENTRY_FEE_COLLECTOR);
        console.log('  - Entry fee required:', CONFIG.web3.features.entryFeeRequired);
        console.log('  - Score submission: DISABLED');
        console.log('  - Leaderboard: DISABLED');
    }
});

window.CONFIG = CONFIG;
window.ASSETS = ASSETS;
window.IMAGES = IMAGES;
window.AUDIO = AUDIO;
window.WEB3_CONSTANTS = WEB3_CONSTANTS;
window.WEB3_UTILS = WEB3_UTILS;

console.log('Enhanced config.js loaded with simplified Irys Network support!');
