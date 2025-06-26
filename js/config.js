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

// УТИЛИТЫ
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

window.CONFIG = CONFIG;
window.ASSETS = ASSETS;
window.IMAGES = IMAGES;
window.AUDIO = AUDIO;

console.log('Game config.js loaded successfully!');
