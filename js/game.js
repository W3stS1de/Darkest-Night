// Canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state variables
let gameRunning = false;
let gameOver = false;
let currentWave = 1;
let enemiesInWave = 5;
let enemiesLeft = 5;
let irysCount = 0;
let totalKills = 0;
let frameCount = 0;
let gameStartTime = 0;
let gameDuration = 0;

let gameInitialized = false;
let audioEnabled = false;

// Game objects
let enemies = [];
let bullets = [];
let particles = [];
let irysParticles = [];

// Game entities 
const player = {
    x: CONFIG.player.x,
    y: CONFIG.player.y,
    width: CONFIG.player.width,
    height: CONFIG.player.height,
    shootCooldown: 0,
    facing: CONFIG.player.facing
};

const tower = {
    x: CONFIG.tower.x,
    y: CONFIG.tower.y,
    width: CONFIG.tower.width,
    height: CONFIG.tower.height,
    maxHealth: CONFIG.tower.maxHealth,
    health: CONFIG.tower.maxHealth
};

// Аудио
function initGameAudio() {
    try {
        console.log('🎵 Initializing game audio...');
        
        if (!window.backgroundMusic) {
            window.backgroundMusic = new Audio();
            window.backgroundMusic.loop = false;
            window.backgroundMusic.volume = 0.3;
            window.backgroundMusic.src = ASSETS.audio.backgroundMusic;
            
            window.backgroundMusic.addEventListener('ended', () => {
                playNextTrack();
            });
            
            window.backgroundMusic.addEventListener('canplaythrough', () => {
                console.log('✅ Background music 1 loaded');
                audioEnabled = true;
                AUDIO.enabled = true;
            });
            
            window.backgroundMusic.addEventListener('error', () => {
                console.log('❌ Background music 1 failed to load');
            });
        }
        
        if (!window.backgroundMusic2) {
            window.backgroundMusic2 = new Audio();
            window.backgroundMusic2.loop = false;
            window.backgroundMusic2.volume = 0.3;
            window.backgroundMusic2.src = ASSETS.audio.backgroundMusic2;
            
            window.backgroundMusic2.addEventListener('ended', () => {
                playNextTrack();
            });
            
            window.backgroundMusic2.addEventListener('canplaythrough', () => {
                console.log('✅ Background music 2 loaded');
            });
            
            window.backgroundMusic2.addEventListener('error', () => {
                console.log('❌ Background music 2 failed to load');
            });
        }
        
        
        AUDIO.musicTracks = [window.backgroundMusic, window.backgroundMusic2];
        
        console.log('🎵 Game audio initialized (music only)');
        
    } catch (error) {
        console.log('❌ Game audio initialization error:', error);
    }
}


function playBackgroundMusic() {
    if (audioEnabled && AUDIO.enabled && AUDIO.musicTracks.length > 0) {
        const currentTrack = AUDIO.musicTracks[AUDIO.currentTrackIndex];
        
        if (currentTrack) {
            if (!AUDIO.musicPaused) {
                currentTrack.currentTime = 0;
            }
            
            currentTrack.play().then(() => {
                console.log(`✅ Background music track ${AUDIO.currentTrackIndex + 1} started`);
                AUDIO.musicPlaying = true;
                AUDIO.musicPaused = false;
            }).catch(e => {
                console.log('❌ Auto-play blocked by browser');
            });
        }
    }
}

function stopBackgroundMusic() {
    AUDIO.musicTracks.forEach(track => {
        if (track) {
            track.pause();
        }
    });
    AUDIO.musicPlaying = false;
    AUDIO.musicPaused = true;
    console.log('🔇 Background music paused');
}

function playNextTrack() {
    if (!audioEnabled || !AUDIO.enabled || AUDIO.musicTracks.length === 0) return;
    
    AUDIO.currentTrackIndex = (AUDIO.currentTrackIndex + 1) % AUDIO.musicTracks.length;
    console.log(`🎵 Switching to track ${AUDIO.currentTrackIndex + 1}`);
    
    AUDIO.musicTracks.forEach(track => {
        if (track) track.pause();
    });
    
    const nextTrack = AUDIO.musicTracks[AUDIO.currentTrackIndex];
    if (nextTrack) {
        nextTrack.currentTime = 0;
        nextTrack.play().then(() => {
            console.log(`✅ Track ${AUDIO.currentTrackIndex + 1} started`);
            AUDIO.musicPlaying = true;
        }).catch(e => {
            console.log('❌ Error switching track:', e);
        });
    }
}

function playShootSound() {
    if (audioEnabled && AUDIO.enabled) {
        if (AUDIO.shootSound) {
            try {
                AUDIO.shootSound.currentTime = 0;
                AUDIO.shootSound.play().then(() => {
                    console.log('✅ Shoot sound played');
                }).catch(e => {
                    console.log('❌ Shoot sound error:', e);
                });
            } catch (error) {
                console.log('❌ Shoot sound exception:', error);
            }
        } else {
            console.log('❌ Shoot sound not loaded');
        }
    } else {
        console.log('❌ Audio not enabled - audioEnabled:', audioEnabled, 'AUDIO.enabled:', AUDIO.enabled);
    }
}

function playEnemyHitSound() {
    if (audioEnabled && AUDIO.enabled && AUDIO.enemyHit) {
        try {
            AUDIO.enemyHit.currentTime = 0;
            AUDIO.enemyHit.play().catch(e => console.log('❌ Enemy hit sound error:', e));
        } catch (error) {
            console.log('❌ Enemy hit sound exception:', error);
        }
    }
}

function playTowerHitSound() {
    if (audioEnabled && AUDIO.enabled && AUDIO.towerHit) {
        try {
            AUDIO.towerHit.currentTime = 0;
            AUDIO.towerHit.play().catch(e => console.log('❌ Tower hit sound error:', e));
        } catch (error) {
            console.log('❌ Tower hit sound exception:', error);
        }
    }
}

function playGameOverSound() {
    if (audioEnabled && AUDIO.enabled && AUDIO.gameOver) {
        try {
            AUDIO.gameOver.currentTime = 0;
            AUDIO.gameOver.play().catch(e => console.log('❌ Game over sound error:', e));
        } catch (error) {
            console.log('❌ Game over sound exception:', error);
        }
    }
}

function playSound(soundName) {
    switch(soundName) {
        case 'shootSound':
            playShootSound();
            break;
        case 'enemyHit':
            playEnemyHitSound();
            break;
        case 'towerHit':
            playTowerHitSound();
            break;
        case 'gameOver':
            playGameOverSound();
            break;
        default:
            console.log(`Unknown sound: ${soundName}`);
    }
}

// UI update functions
function updateUI() {
    const towerHealthEl = document.getElementById('towerHealth');
    const currentWaveEl = document.getElementById('currentWave');
    const enemiesLeftEl = document.getElementById('enemiesLeft');
    const irysCountEl = document.getElementById('irysCount');
    
    if (towerHealthEl) towerHealthEl.textContent = tower.health;
    if (currentWaveEl) currentWaveEl.textContent = currentWave;
    if (enemiesLeftEl) enemiesLeftEl.textContent = enemiesLeft + enemies.length;
    if (irysCountEl) irysCountEl.textContent = irysCount;
    
    // Game duration tracking
    if (gameRunning) {
        gameDuration = Date.now() - gameStartTime;
    }
}

initGameAudio();

// Collision detection
function checkCollisions() {
    
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            
            if (bullet.x > enemy.x && bullet.x < enemy.x + enemy.width &&
                bullet.y > enemy.y && bullet.y < enemy.y + enemy.height) {
                
                if (enemy.takeDamage(bullet.damage)) {
                    enemies.splice(j, 1);
                }
                bullets.splice(i, 1);
                break;
            }
        }
        
        
        if (bullet.x > canvas.width || bullet.x < 0 || 
            bullet.y > canvas.height || bullet.y < 0) {
            bullets.splice(i, 1);
        }
    }
    
    
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        
        if (enemy.isAttacking && enemy.attackTimer === 0) {
            tower.health -= enemy.damage;
            
            
            playTowerHitSound();
            
            // Tower hit effect
            for (let k = 0; k < 10; k++) {
                particles.push(new Particle(
                    tower.x + tower.width/2,
                    tower.y + tower.height/2,
                    '#ff4444'
                ));
            }
            
            if (tower.health <= 0) {
                endGame();
                return;
            }
        }
        
        if (enemy.x > canvas.width + 100) {
            enemies.splice(i, 1);
        }
    }
}

function updateGame() {
    frameCount++;
    
    if (player.shootCooldown > 0) {
        player.shootCooldown--;
    }
    
    // Spawn enemies
    if (enemies.length === 0 && enemiesLeft > 0) {
        if (frameCount % CONFIG.enemies.spawnInterval === 0) {
            spawnEnemy();
        }
    }
    
    // Check wave completion
    if (enemies.length === 0 && enemiesLeft === 0) {
        nextWave();
    }
    
    // Update game objects
    enemies.forEach(enemy => enemy.update());
    bullets.forEach(bullet => bullet.update());
    
    // Update particles
    particles = particles.filter(particle => {
        particle.update();
        return particle.life > 0;
    });
    
    irysParticles = irysParticles.filter(particle => {
        particle.update();
        return particle.life > 0;
    });
    
    checkCollisions();
    updateUI();
}

// Main drawing function
function drawGame() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background elements
    drawBackground();
    drawPlayer();
    drawTower();
    
    // Draw game objects
    enemies.forEach(enemy => enemy.draw());
    bullets.forEach(bullet => bullet.draw());
    particles.forEach(particle => particle.draw());
    irysParticles.forEach(particle => particle.draw());
}

// Game state functions
function nextWave() {
    currentWave++;
    enemiesInWave = Math.min(
        CONFIG.waves.baseEnemies + currentWave * CONFIG.waves.enemyIncrease, 
        CONFIG.waves.maxEnemies
    );
    enemiesLeft = enemiesInWave;
    
    // Heal tower slightly between waves
    tower.health = Math.min(
        tower.health + CONFIG.waves.towerHealPerWave, 
        tower.maxHealth
    );
}

async function endGame() {
    gameRunning = false;
    gameOver = true;
    
    gameDuration = Date.now() - gameStartTime;
    
    stopBackgroundMusic();
    playGameOverSound();
    
    // Update UI elements
    const finalWaveEl = document.getElementById('finalWave');
    const finalKillsEl = document.getElementById('finalKills');
    const finalIrysEl = document.getElementById('finalIrys');
    const gameOverScreenEl = document.getElementById('gameOverScreen');
    
    if (finalWaveEl) finalWaveEl.textContent = currentWave;
    if (finalKillsEl) finalKillsEl.textContent = totalKills;
    if (finalIrysEl) finalIrysEl.textContent = irysCount;
    if (gameOverScreenEl) gameOverScreenEl.style.display = 'flex';
    
    console.log('💀 Game Over - Wave:', currentWave, 'Kills:', totalKills, 'IRYS:', irysCount);
}

function restartGame() {
    const startBtnEl = document.getElementById('startBtn');
    if (startBtnEl) startBtnEl.style.display = 'inline-block';
    
    startGame();
}

// Enemy spawning utilities
function getEnemyTypeForWave(wave) {
    if (wave === 1) {
        return Math.random() < 0.6 ? 'basic' : 'fast';
    } else if (wave === 2) {
        const rand = Math.random();
        if (rand < 0.4) return 'basic';
        else if (rand < 0.7) return 'fast';
        else return 'tank';
    } else {
        const rand = Math.random();
        if (rand < 0.15) return 'basic';
        else if (rand < 0.35) return 'fast';
        else if (rand < 0.55) return 'tank';
        else if (rand < 0.75) return 'flyer';
        else return 'mage';
    }
}

function spawnEnemy() {
    const enemyType = getEnemyTypeForWave(currentWave);
    enemies.push(new Enemy(enemyType));
    
    if (Math.random() < CONFIG.waves.doubleSpawnChance && enemiesLeft > 1) {
        setTimeout(() => {
            if (enemiesLeft > 0) {
                const secondEnemyType = getEnemyTypeForWave(currentWave);
                enemies.push(new Enemy(secondEnemyType));
                enemiesLeft--;
            }
        }, CONFIG.waves.doubleSpawnDelay);
    }
    
    enemiesLeft--;
}

function startGame() {
    console.log('🎮 Starting IRYS Base Defense...');
    
    if (!audioEnabled) {
        audioEnabled = true;
        AUDIO.enabled = true;
        console.log('🔊 Audio enabled for game start');
    }
    
    playBackgroundMusic();
    
    gameRunning = true;
    gameOver = false;
    currentWave = 1;
    enemiesInWave = CONFIG.waves.baseEnemies;
    enemiesLeft = enemiesInWave;
    tower.health = tower.maxHealth;
    irysCount = 0;
    totalKills = 0;
    frameCount = 0;
    gameStartTime = Date.now();
    gameDuration = 0;
    
    enemies = [];
    bullets = [];
    particles = [];
    irysParticles = [];
    
    // Reset player
    player.shootCooldown = 0;
    player.facing = 'right';
    
    // Hide/show UI elements
    const startBtnEl = document.getElementById('startBtn');
    const gameOverScreenEl = document.getElementById('gameOverScreen');
    if (startBtnEl) startBtnEl.style.display = 'none';
    if (gameOverScreenEl) gameOverScreenEl.style.display = 'none';
    
    // Start game loop
    gameLoop();
    
    console.log('🚀 Game started successfully!');
}

// Main game loop
function gameLoop() {
    if (!gameRunning) return;
    
    updateGame();
    drawGame();
    
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', (e) => {
    if (!gameRunning || gameOver || player.shootCooldown > 0) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const centerX = player.x + player.width / 2;
    if (mouseX > centerX) {
        player.facing = 'right';
    } else {
        player.facing = 'left';
    }
    
    // Create bullet
    bullets.push(new Bullet(
        player.x + player.width/2,
        player.y + player.height/2,
        mouseX,
        mouseY
    ));
    
    console.log('🔫 Shooting - calling playShootSound()');
    playShootSound();
    
    player.shootCooldown = CONFIG.player.shootCooldown;
});

document.addEventListener('click', () => {
    if (!audioEnabled) {
        audioEnabled = true;
        AUDIO.enabled = true;
        console.log('🔊 Audio enabled by user interaction');
        
        if (gameRunning && AUDIO.musicTracks.length > 0 && !AUDIO.musicPlaying) {
            playBackgroundMusic();
        }
    }
}, { once: true });

function initGame() {
    console.log('🎮 Initializing IRYS Base Defense...');
    
    gameInitialized = true;
    
    if (!gameRunning && typeof drawStartScreen === 'function') {
        drawStartScreen();
    }
    
    updateUI();
    
    console.log('✅ Game initialized');
}

document.addEventListener('DOMContentLoaded', () => {
    initGame();
    
    if (typeof loadAllAssets === 'function') {
        loadAllAssets();
    }
});

function toggleAudio() {
    const audioBtn = document.getElementById('audioBtn');
    
    if (audioEnabled && AUDIO.enabled) {
        audioEnabled = false;
        AUDIO.enabled = false;
        stopBackgroundMusic();
        
        if (audioBtn) {
            audioBtn.textContent = '🔇 Audio: OFF';
            audioBtn.style.opacity = '0.6';
        }
        console.log('🔇 Audio disabled');
        
    } else {
        audioEnabled = true;
        AUDIO.enabled = true;
        
        if (gameRunning) {
            playBackgroundMusic();
        }
        
        if (audioBtn) {
            audioBtn.textContent = '🔊 Audio: ON';
            audioBtn.style.opacity = '1';
        }
        console.log('🔊 Audio enabled');
    }
}

window.gameController = {
    startGame,
    restartGame,
    toggleAudio
};
