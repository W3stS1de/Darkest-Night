// Drawing utility functions
function drawBackground() {
    
    if (IMAGES.background && IMAGES.background.complete && IMAGES.background.naturalHeight !== 0) {
        ctx.drawImage(IMAGES.background, 0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        // gradient background 
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#2c3e50'); 
        gradient.addColorStop(0.6, '#34495e'); 
        gradient.addColorStop(1, '#1a252f'); 
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Medieval ground 
    const groundGradient = ctx.createLinearGradient(0, CONFIG.ground.y, 0, canvas.height);
    groundGradient.addColorStop(0, '#2d1810'); 
    groundGradient.addColorStop(0.3, '#2d1810'); 
    groundGradient.addColorStop(1, '#2d1810'); 

    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, CONFIG.ground.y, canvas.width, canvas.height - CONFIG.ground.y);
    
    drawDarkFantasyGroundBorder();
    
    // Ground texture 
    ctx.fillStyle = 'rgba(139, 115, 85, 0.8)';
    for (let i = 0; i < canvas.width; i += 60) {
        const stoneSize = 8;
        const stoneY = CONFIG.ground.y + CONFIG.ground.grassHeight + 20;
        ctx.fillRect(i + 20, stoneY, stoneSize, stoneSize * 0.6);
    }
    
    // Ground line highlight
    ctx.strokeStyle = '#2d1810'; 
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, CONFIG.ground.y);
    ctx.lineTo(canvas.width, CONFIG.ground.y);
    ctx.stroke();
}

function drawDarkFantasyGroundBorder() {
    const borderHeight = 35; 
    const borderY = CONFIG.ground.y - 5; 
    
    const darkEarthGradient = ctx.createLinearGradient(0, borderY, 0, borderY + borderHeight);
    darkEarthGradient.addColorStop(0, '#2d1810'); 
    darkEarthGradient.addColorStop(0.3, '#1a0f08'); 
    darkEarthGradient.addColorStop(0.6, '#0f0804'); 
    darkEarthGradient.addColorStop(1, '#0a0402'); 
    
    ctx.fillStyle = darkEarthGradient;
    ctx.fillRect(0, borderY, canvas.width, borderHeight);
    
    ctx.fillStyle = 'rgba(20, 40, 15, 0.8)'; 
    for (let i = 0; i < canvas.width; i += 25) {
        const mossWidth = 12 + Math.sin(i * 0.08) * 6;
        const mossHeight = 8 + Math.cos(i * 0.12) * 4;
        const mossY = borderY + 2 + Math.sin(i * 0.15) * 8;
        
        // Основное пятно мха
        ctx.beginPath();
        ctx.ellipse(i + 8, mossY + 4, mossWidth/2, mossHeight/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(35, 55, 25, 0.6)';
        ctx.beginPath();
        ctx.ellipse(i + 8, mossY + 2, mossWidth/3, mossHeight/3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(20, 40, 15, 0.8)'; 
    }
    
    ctx.fillStyle = 'rgba(60, 30, 80, 0.7)'; 
    for (let i = 30; i < canvas.width; i += 80) {
        const mushroomX = i + Math.sin(i * 0.1) * 10;
        const mushroomY = borderY + 5 + Math.cos(i * 0.2) * 5;
        
    
        ctx.fillRect(mushroomX, mushroomY + 8, 2, 6);
        
        ctx.beginPath();
        ctx.ellipse(mushroomX + 1, mushroomY + 8, 4, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        
        ctx.fillStyle = 'rgba(120, 80, 150, 0.9)';
        ctx.fillRect(mushroomX - 1, mushroomY + 6, 1, 1);
        ctx.fillRect(mushroomX + 2, mushroomY + 7, 1, 1);
        
        ctx.fillStyle = 'rgba(60, 30, 80, 0.7)'; 
    }
    
    
    ctx.strokeStyle = '#0a0402'; 
    ctx.lineWidth = 2;
    
    for (let i = 0; i < canvas.width; i += 60) {
        const crackX = i + 20 + Math.sin(i * 0.05) * 10;
        const crackStartY = borderY + 8;
        const crackEndY = borderY + borderHeight - 3;
        
        ctx.beginPath();
        ctx.moveTo(crackX, crackStartY);
        
        for (let y = crackStartY; y < crackEndY; y += 6) {
            const zigzag = Math.sin(y * 0.4 + i) * 3;
            ctx.lineTo(crackX + zigzag, y);
        }
        ctx.stroke();
        
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(10, 4, 2, 0.8)';
        ctx.beginPath();
        ctx.moveTo(crackX - 5, crackStartY + 10);
        ctx.lineTo(crackX + 8, crackStartY + 18);
        ctx.stroke();
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#0a0402';
    }
    
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    
    for (let i = 0; i < canvas.width; i += 90) {
        const glowX = i + 45;
        const glowY = borderY + borderHeight - 8;
        
        const glowGradient = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 15);
        glowGradient.addColorStop(0, 'rgba(40, 80, 40, 0.3)');
        glowGradient.addColorStop(0.5, 'rgba(20, 60, 20, 0.2)');
        glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(glowX, glowY, 15, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
    
    ctx.strokeStyle = 'rgba(40, 25, 15, 0.8)'; 
    ctx.lineWidth = 3;
    
    for (let i = 0; i < canvas.width; i += 100) {
        const rootX = i + 50 + Math.sin(i * 0.07) * 15;
        const rootY = borderY;
        
        ctx.beginPath();
        ctx.moveTo(rootX, rootY);
        
        
        for (let j = 0; j < 20; j += 5) {
            const curve = Math.sin(j * 0.3 + i) * 8;
            ctx.lineTo(rootX + curve, rootY + j);
        }
        ctx.stroke();
        
        
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(rootX + 5, rootY + 10);
        ctx.lineTo(rootX + 12, rootY + 8);
        ctx.stroke();
        
        ctx.lineWidth = 3;
    }
    
    ctx.fillStyle = 'rgba(100, 120, 100, 0.6)'; 
    for (let i = 15; i < canvas.width; i += 45) {
        const dropX = i + Math.sin(i * 0.2) * 5;
        const dropY = borderY + 12 + Math.cos(i * 0.15) * 3;
        
        
        ctx.beginPath();
        ctx.ellipse(dropX, dropY, 1.5, 2, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}


async function loadAllAssets() {
    console.log('🔄 Starting background asset loading...');
    
    try {
        // Фоновая загрузка 
        loadBackgroundSilently();
        loadImageSilently(ASSETS.player.right, IMAGES.player, 'right');
        loadImageSilently(ASSETS.player.left, IMAGES.player, 'left');
        loadImageSilently(ASSETS.tower, IMAGES, 'tower');
        
        // enemy images
        for (const [enemyType, states] of Object.entries(ASSETS.enemies)) {
            IMAGES.enemies[enemyType] = {};
            
            if (enemyType === 'tank' || enemyType === 'fast') {
                for (const [state, pathData] of Object.entries(states)) {
                    if (Array.isArray(pathData)) {
                        IMAGES.enemies[enemyType][state] = [];
                        for (let i = 0; i < pathData.length; i++) {
                            const path = pathData[i];
                            const img = new Image();
                            img.onload = function() {
                                IMAGES.enemies[enemyType][state][i] = img;
                                console.log(`✅ Loaded ${enemyType} ${state} frame ${i}`);
                            };
                            img.onerror = function() {
                                console.log(`❌ Failed to load ${enemyType} ${state} frame ${i}`);
                            };
                            img.src = path;
                        }
                    } else {
                        loadImageSilently(pathData, IMAGES.enemies[enemyType], state);
                    }
                }
            } else {
                for (const [state, path] of Object.entries(states)) {
                    loadImageSilently(path, IMAGES.enemies[enemyType], state);
                }
            }
        }
        
        
        initSoundEffects();
        
        IMAGES.loaded = true;
        console.log('✅ Background asset loading initiated successfully!');
        
    } catch (error) {
        console.log('⚠️ Some assets failed to load, using fallbacks');
        IMAGES.loaded = true;
    }
}


function initSoundEffects() {
    console.log('🔊 Initializing sound effects...');
    
    try {
        
        if (!AUDIO.shootSound) {
            AUDIO.shootSound = new Audio();
            AUDIO.shootSound.volume = 0.7; 
            AUDIO.shootSound.preload = 'auto';
            AUDIO.shootSound.src = ASSETS.audio.shootSound;
            
            AUDIO.shootSound.addEventListener('canplaythrough', () => {
                console.log('✅ Shoot sound loaded and ready');
            });
            
            AUDIO.shootSound.addEventListener('error', (e) => {
                console.log('❌ Shoot sound failed to load:', e);
            });
            
            AUDIO.shootSound.load();
        }
        
        if (!AUDIO.enemyHit) {
            AUDIO.enemyHit = new Audio();
            AUDIO.enemyHit.volume = 0.6;
            AUDIO.enemyHit.preload = 'auto';
            AUDIO.enemyHit.src = ASSETS.audio.enemyHit;
            
            AUDIO.enemyHit.addEventListener('canplaythrough', () => {
                console.log('✅ Enemy hit sound loaded');
            });
            
            AUDIO.enemyHit.addEventListener('error', (e) => {
                console.log('❌ Enemy hit sound failed to load:', e);
            });
            
            AUDIO.enemyHit.load();
        }
        
        if (!AUDIO.towerHit) {
            AUDIO.towerHit = new Audio();
            AUDIO.towerHit.volume = 0.7;
            AUDIO.towerHit.preload = 'auto';
            AUDIO.towerHit.src = ASSETS.audio.towerHit;
            
            AUDIO.towerHit.addEventListener('canplaythrough', () => {
                console.log('✅ Tower hit sound loaded');
            });
            
            AUDIO.towerHit.addEventListener('error', (e) => {
                console.log('❌ Tower hit sound failed to load:', e);
            });
            
            AUDIO.towerHit.load();
        }
        
        if (!AUDIO.gameOver) {
            AUDIO.gameOver = new Audio();
            AUDIO.gameOver.volume = 0.8;
            AUDIO.gameOver.preload = 'auto';
            AUDIO.gameOver.src = ASSETS.audio.gameOver;
            
            AUDIO.gameOver.addEventListener('canplaythrough', () => {
                console.log('✅ Game over sound loaded');
            });
            
            AUDIO.gameOver.addEventListener('error', (e) => {
                console.log('❌ Game over sound failed to load:', e);
            });
            
            AUDIO.gameOver.load();
        }
        
        console.log('🎵 Sound effects initialization completed');
        
    } catch (error) {
        console.log('❌ Sound effects initialization error:', error);
    }
}

// Фоновая загрузка 
function loadImageSilently(src, targetObject, propertyName) {
    const img = new Image();
    img.onload = function() {
        targetObject[propertyName] = img;
        console.log('✅ Loaded:', propertyName, 'from', src);
    };
    img.onerror = function() {
        console.log('❌ Failed to load:', propertyName, 'from', src);
    };
    img.src = src;
}

function loadBackgroundSilently() {
    const img = new Image();
    img.onload = function() {
        IMAGES.background = img;
        console.log('✅ Background loaded silently');
        
        if (!gameRunning) {
            drawStartScreen();
        }
    };
    img.onerror = function() {
        console.log('❌ Background failed to load, using fallback');
    };
    img.src = ASSETS.background;
}

function playSound(soundName) {
    if (!AUDIO.enabled) {
        console.log('❌ Audio not enabled');
        return;
    }
    
    let soundObject = null;
    
    switch(soundName) {
        case 'shootSound':
            soundObject = AUDIO.shootSound;
            break;
        case 'enemyHit':
            soundObject = AUDIO.enemyHit;
            break;
        case 'towerHit':
            soundObject = AUDIO.towerHit;
            break;
        case 'gameOver':
            soundObject = AUDIO.gameOver;
            break;
        default:
            console.log(`❌ Unknown sound: ${soundName}`);
            return;
    }
    
    if (soundObject) {
        try {
            soundObject.currentTime = 0;
            soundObject.play().then(() => {
                console.log(`✅ ${soundName} played successfully`);
            }).catch(e => {
                console.log(`❌ ${soundName} play error:`, e);
            });
        } catch (error) {
            console.log(`❌ ${soundName} exception:`, error);
        }
    } else {
        console.log(`❌ ${soundName} not loaded`);
    }
}

// Отрисовка стартового экрана
function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBackground();
    drawTower();
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.fillStyle = '#00ffcc';
    ctx.strokeStyle = '#004d4d';
    ctx.lineWidth = 4;
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#ffd700';
    ctx.strokeStyle = '#665500';
    ctx.lineWidth = 2;
    
    ctx.strokeText('Protect the IRYS Tower!', canvas.width/2, canvas.height/2 - 50);
    ctx.fillText('Protect the IRYS Tower!', canvas.width/2, canvas.height/2 - 50);
    
    ctx.strokeText('Click to shoot enemies', canvas.width/2, canvas.height/2 - 20);
    ctx.fillText('Click to shoot enemies', canvas.width/2, canvas.height/2 - 20);

    ctx.restore();
}

function drawPlayer() {
    const playerImage = player.facing === 'right' ? 
        IMAGES.player.right : IMAGES.player.left;
    
    if (playerImage && playerImage.complete && playerImage.naturalHeight !== 0) {
        ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    } else {
        
        ctx.fillStyle = '#00ff88';
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        ctx.fillStyle = 'white';
        ctx.fillRect(player.x + 20, player.y + 20, 15, 15); 
        ctx.fillRect(player.x + 15, player.y + 40, 30, 45); 
        
        if (player.facing === 'right') {
            ctx.fillRect(player.x + 10, player.y + 60, 15, 25); 
            ctx.fillRect(player.x + 45, player.y + 60, 15, 25); 
            ctx.fillStyle = '#666';
            ctx.fillRect(player.x + 55, player.y + 70, 20, 6);
        } else {
            ctx.fillRect(player.x + 15, player.y + 60, 15, 25); 
            ctx.fillRect(player.x + 45, player.y + 60, 15, 25); 
            ctx.fillStyle = '#666';
            ctx.fillRect(player.x + 5, player.y + 70, 20, 6);
        }
    }
    
    // Muzzle flash effect when shooting
    if (player.shootCooldown > CONFIG.player.shootCooldown - 5) {
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#ffff00';
        
        const flashX = player.facing === 'right' ? 
            player.x + player.width - 5 : player.x - 10;
        const flashY = player.y + player.height / 2;
        
        ctx.beginPath();
        ctx.arc(flashX, flashY, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function drawTower() {
    if (IMAGES.tower && IMAGES.tower.complete && IMAGES.tower.naturalHeight !== 0) {
        ctx.drawImage(IMAGES.tower, tower.x, tower.y, tower.width, tower.height);
    } else {
        // Fallback - Medieval Tower
        const towerGradient = ctx.createLinearGradient(tower.x, tower.y, tower.x + tower.width, tower.y + tower.height);
        towerGradient.addColorStop(0, '#7f8c8d');
        towerGradient.addColorStop(0.5, '#95a5a6');
        towerGradient.addColorStop(1, '#6c7b7d');
        
        ctx.fillStyle = towerGradient;
        ctx.fillRect(tower.x, tower.y, tower.width, tower.height);
        
        ctx.strokeStyle = '#5d6d70';
        ctx.lineWidth = 2;
        
        // Horizontal lines (brick layers)
        for (let y = tower.y + 20; y < tower.y + tower.height; y += 25) {
            ctx.beginPath();
            ctx.moveTo(tower.x, y);
            ctx.lineTo(tower.x + tower.width, y);
            ctx.stroke();
        }
        
        // Vertical lines (brick divisions)
        for (let y = tower.y; y < tower.y + tower.height; y += 50) {
            for (let x = tower.x + 30; x < tower.x + tower.width; x += 60) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + 25);
                ctx.stroke();
            }
        }
        
        // IRYS symbol on tower
        ctx.fillStyle = '#00ffcc';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffcc';
        ctx.fillText('IRYS', tower.x + tower.width/2, tower.y + tower.height/2);
        ctx.shadowBlur = 0;
        
        // Tower top details (battlements)
        ctx.fillStyle = '#8e9aa3';
        for (let x = tower.x; x < tower.x + tower.width; x += 25) {
            ctx.fillRect(x, tower.y - 10, 15, 15);
        }
    }
    
    // УЛУЧШЕННАЯ ПОДСВЕТКА БАШНИ
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    for (let i = 3; i >= 1; i--) {
        const radius = tower.width * (0.8 + i * 0.3);
        const alpha = 0.08 / i;
        
        const glowGradient = ctx.createRadialGradient(
            tower.x + tower.width/2, tower.y + tower.height/2, 0,
            tower.x + tower.width/2, tower.y + tower.height/2, radius
        );
        glowGradient.addColorStop(0, `rgba(0, 255, 204, ${alpha})`);
        glowGradient.addColorStop(0.3, `rgba(0, 255, 204, ${alpha * 0.7})`);
        glowGradient.addColorStop(0.6, `rgba(0, 255, 204, ${alpha * 0.3})`);
        glowGradient.addColorStop(1, 'rgba(0, 255, 204, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(tower.x + tower.width/2, tower.y + tower.height/2, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    const pulseIntensity = 0.15 + Math.sin(frameCount * 0.03) * 0.08;
    const innerGlow = ctx.createRadialGradient(
        tower.x + tower.width/2, tower.y + tower.height/2, 0,
        tower.x + tower.width/2, tower.y + tower.height/2, tower.width * 0.6
    );
    innerGlow.addColorStop(0, `rgba(0, 255, 204, ${pulseIntensity})`);
    innerGlow.addColorStop(0.4, `rgba(0, 255, 204, ${pulseIntensity * 0.5})`);
    innerGlow.addColorStop(0.8, `rgba(0, 255, 204, ${pulseIntensity * 0.1})`);
    innerGlow.addColorStop(1, 'rgba(0, 255, 204, 0)');

    ctx.fillStyle = innerGlow;
    ctx.beginPath();
    ctx.arc(tower.x + tower.width/2, tower.y + tower.height/2, tower.width * 0.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Tower health bar
    const barWidth = tower.width;
    const barHeight = 12;
    const barY = tower.y - 70;
    
    ctx.fillStyle = '#333';
    ctx.fillRect(tower.x, barY, barWidth, barHeight);
    
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(tower.x, barY, barWidth, barHeight);
    
    const healthColor = tower.health > 60 ? '#4CAF50' : 
                       tower.health > 30 ? '#FFC107' : '#F44336';
    ctx.fillStyle = healthColor;
    const healthPercent = tower.health / tower.maxHealth;
    ctx.fillRect(tower.x + 2, barY + 2, (barWidth - 4) * healthPercent, barHeight - 4);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeText(`${tower.health}/${tower.maxHealth}`, 
        tower.x + tower.width/2, barY - 16);
    ctx.fillText(`${tower.health}/${tower.maxHealth}`, 
        tower.x + tower.width/2, barY - 16);
}

// Инициализация игры с фоновой загрузкой
function initGame() {
    console.log('🎮 Initializing IRYS Base Defense...');
    
    drawStartScreen();
    updateUI();
    loadAllAssets();
    
    console.log('✅ Game initialized - assets loading in background');
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
}

// Initialize assets when page loads
document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

// НОВЫЕ УТИЛИТЫ
const MathUtils = {
    random(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },
    
    lerp(start, end, factor) {
        return start + (end - start) * factor;
    },
    
    distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
};

const ImageUtils = {
    isImageLoaded(img) {
        return img && img.complete && img.naturalHeight !== 0;
    },
    
    createImage(src, onLoad, onError) {
        const img = new Image();
        img.onload = onLoad || (() => {});
        img.onerror = onError || (() => {});
        img.src = src;
        return img;
    },
    
    scaleToFit(imgWidth, imgHeight, targetWidth, targetHeight) {
        const scale = Math.min(targetWidth / imgWidth, targetHeight / imgHeight);
        return {
            width: imgWidth * scale,
            height: imgHeight * scale,
            scale: scale
        };
    }
};

const AnimationUtils = {
    sine(time, amplitude = 1, frequency = 1, offset = 0) {
        return Math.sin(time * frequency + offset) * amplitude;
    },
    
    bounce(time, amplitude = 1, frequency = 1) {
        return Math.abs(Math.sin(time * frequency)) * amplitude;
    },
    
    fade(time, duration, reverse = false) {
        const progress = MathUtils.clamp(time / duration, 0, 1);
        return reverse ? 1 - progress : progress;
    },
    
    pulse(time, minValue = 0.5, maxValue = 1, frequency = 1) {
        return MathUtils.lerp(minValue, maxValue, 
            (Math.sin(time * frequency) + 1) / 2);
    }
};

const GameUtils = {
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    },
    
    checkCollisionWithTolerance(rect1, rect2, tolerance = 5) {
        return rect1.x + tolerance < rect2.x + rect2.width &&
               rect1.x + rect1.width - tolerance > rect2.x &&
               rect1.y + tolerance < rect2.y + rect2.height &&
               rect1.y + rect1.height - tolerance > rect2.y;
    },
    
    isOnScreen(obj, canvasWidth, canvasHeight, margin = 50) {
        return obj.x > -margin && 
               obj.x < canvasWidth + margin &&
               obj.y > -margin && 
               obj.y < canvasHeight + margin;
    },
    
    shake(intensity = 5, duration = 500) {
        return {
            x: MathUtils.random(-intensity, intensity),
            y: MathUtils.random(-intensity, intensity),
            intensity: intensity,
            duration: duration,
            startTime: Date.now()
        };
    }
};

const DebugUtils = {
    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${timestamp}] [${type.toUpperCase()}]`;
        console.log(`${prefix} ${message}`);
    },
    
    drawHitbox(ctx, obj, color = 'red') {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
        ctx.restore();
    },
    
    fpsCounter: {
        frames: 0,
        lastTime: 0,
        fps: 0,
        
        update() {
            this.frames++;
            const now = performance.now();
            if (now - this.lastTime >= 1000) {
                this.fps = Math.round((this.frames * 1000) / (now - this.lastTime));
                this.frames = 0;
                this.lastTime = now;
            }
        },
        
        draw(ctx, x = 10, y = 30) {
            ctx.save();
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.fillText(`FPS: ${this.fps}`, x, y);
            ctx.restore();
        }
    }
};