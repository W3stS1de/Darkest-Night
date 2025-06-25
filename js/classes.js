class Enemy {
    constructor(type) {
        this.type = type;
        this.stats = CONFIG.enemies[type];
        this.x = -this.stats.width; 
        
        // фикс сайз
        this.width = this.stats.width;
        this.height = this.stats.height;
        this.health = this.stats.health;
        this.maxHealth = this.stats.health;
        this.speed = this.stats.speed;
        this.damage = this.stats.damage;
        this.color = this.stats.color;
        this.reward = this.stats.reward;
        this.hit = false;
        this.hitTime = 0;
        
        // Выравниваем по земле
        if (type === 'flyer') {
            this.y = CONFIG.ground.y - 400 - Math.random() * 150;
        } else if (type === 'tank') {
            this.y = CONFIG.ground.y - this.stats.height + 20;
        } else if (type === 'mage') {
            this.y = CONFIG.ground.y - this.stats.height + 99;
        } else if (type === 'fast') {
            this.y = CONFIG.ground.y - this.stats.height + 15; 
        } else {
            this.y = CONFIG.ground.y - this.stats.height + 5;
        }
        
        // Анимация (общая для всех)
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.currentState = this.stats.states[0];
        this.isAttacking = false;
        this.attackTimer = 0;
        
        // настройки для мага
        if (type === 'mage') {
            this.healTimer = 0;
            this.currentFrame = 0;
            this.frameTimer = 0;
            this.attackMode = false;
            this.spritesheet = true;
        }

        // настройки для flyer
        if (type === 'flyer') {
            this.currentFrame = 0;
            this.frameTimer = 0;
            this.spritesheet = true; 
            this.currentState = 'flight'; 
        }

        // настройки для fast 
        if (type === 'fast') {
            this.currentFrame = 0;
            this.frameTimer = 0;
            this.spritesheet = false; 
        }
        
        if (type === 'tank') {
            this.currentFrame = 0;
            this.frameTimer = 0;
            this.currentState = 'walk'; 
            this.spritesheet = false; 
        }
    }

    update() {
        // Проверяем, дошел ли до башни
        const reachedTower = this.x + this.width >= tower.x - 5;
        
        if (reachedTower && !this.isAttacking) {
            
            this.isAttacking = true;
            if (this.type === 'tank') {
                this.currentState = 'idle'; 
                this.currentFrame = 0; 
            } else if (this.type === 'fast') {
                this.currentState = 'idle'; 
                this.currentFrame = 0;
            } else if (this.type === 'flyer') {
                this.currentState = 'attack'; 
                this.currentFrame = 0;
            } else {
                this.currentState = this.stats.states.includes('attack') ? 'attack' : 'idle';
            }
            this.speed = 0;
        }
        
        if (!this.isAttacking) {
            // Обычное движение
            this.x += this.speed;
            
            // Анимация ходьбы для обычных врагов
            if (!this.spritesheet && this.type !== 'tank' && this.type !== 'fast') {
                this.animationTimer++;
                if (this.animationTimer >= this.stats.animationSpeed) {
                    this.animationTimer = 0;
                    this.animationFrame = (this.animationFrame + 1) % this.stats.states.length;
                    this.currentState = this.stats.states[this.animationFrame];
                }
            }
        } else {
            // Режим атаки 
            this.attackTimer++;
            if (this.attackTimer >= 60) {
                this.attackTimer = 0;
            }
        }
        
        
        if (this.type === 'tank') {
            
            this.frameTimer++;
            if (this.frameTimer >= this.stats.animationSpeed) {
                this.frameTimer = 0;
                
            
                const frameCount = IMAGES.enemies.tank[this.currentState] ? 
                    IMAGES.enemies.tank[this.currentState].length : 10;
                    
                this.currentFrame = (this.currentFrame + 1) % frameCount;
            }
        }
        
        
        if (this.type === 'fast') {
            
            this.frameTimer++;
            if (this.frameTimer >= this.stats.animationSpeed) {
                this.frameTimer = 0;
                
                if (this.currentState === 'walk') {
                    
                    const frameCount = IMAGES.enemies.fast.walk ? 
                        IMAGES.enemies.fast.walk.length : 8;
                    this.currentFrame = (this.currentFrame + 1) % frameCount;
                }
                
            }
        }
        
        
        if (this.type === 'mage') {
            // хилка
            this.healTimer++;
            if (this.healTimer >= 180 && this.health < this.maxHealth) {
                this.health = Math.min(this.health + this.stats.healRate, this.maxHealth);
                this.healTimer = 0;
            }
            
            // спрайтшит
            this.frameTimer++;
            if (this.frameTimer >= this.stats.animationSpeed) {
                this.frameTimer = 0;
                const maxFrames = this.stats.spritesheetFrames[this.currentState] || 8;
                this.currentFrame = (this.currentFrame + 1) % maxFrames;
            }
            
            // дальность атаки
            const distanceToTower = tower.x - (this.x + this.width);
            if (distanceToTower <= this.stats.attackRange && !this.isAttacking) {
                this.isAttacking = true;
                this.currentState = 'attack';
                this.speed = 0;
                this.attackMode = true;
            }
        }
        
        //flyer 
        if (this.type === 'flyer') {
            
            this.y += Math.sin(frameCount * 0.1 + this.x * 0.01) * 0.5;
            
            
            this.frameTimer++;
            if (this.frameTimer >= this.stats.animationSpeed) {
                this.frameTimer = 0;
                const maxFrames = this.stats.spritesheetFrames[this.currentState] || 8;
                this.currentFrame = (this.currentFrame + 1) % maxFrames;
            }
        }
        
        // Hit effect
        if (this.hit) {
            this.hitTime--;
            if (this.hitTime <= 0) {
                this.hit = false;
            }
        }
    }

    draw() {
        ctx.save();
        
        
        let enemyImage = null;
        
        
        if (this.type === 'tank' || this.type === 'fast') {
            let images;
            if (this.type === 'tank') {
                images = IMAGES.enemies.tank[this.currentState];
            } else { 
                if (this.currentState === 'walk') {
                    images = IMAGES.enemies.fast.walk; 
                } else { 
                    images = [IMAGES.enemies.fast.idle]; 
                }
            }
            
            if (images && images.length > 0 && images[this.currentFrame]) {
                enemyImage = images[this.currentFrame];
            }
        }
        
        else if ((this.type === 'mage' || this.type === 'flyer') && this.spritesheet) {
            if (IMAGES.enemies[this.type] && IMAGES.enemies[this.type][this.currentState]) {
                enemyImage = IMAGES.enemies[this.type][this.currentState];
            }
        }
        // обычная отрисовка
        else {
            if (IMAGES.enemies[this.type] && IMAGES.enemies[this.type][this.currentState]) {
                enemyImage = IMAGES.enemies[this.type][this.currentState];
            }
        }
        
        
        if ((this.type === 'mage' || this.type === 'flyer') && this.spritesheet && enemyImage) {
            const frameWidth = enemyImage.width / this.stats.spritesheetFrames[this.currentState];
            const frameHeight = enemyImage.height;
            const srcX = this.currentFrame * frameWidth;
            
            if (this.hit) {
                ctx.filter = 'brightness(200%)';
            }
            
            ctx.drawImage(
                enemyImage,
                srcX, 0, frameWidth, frameHeight,
                this.x, this.y, this.width, this.height
            );
            ctx.filter = 'none';
        } 
        
        else if (enemyImage && enemyImage.complete && enemyImage.naturalHeight !== 0) {
            if (this.hit) {
                ctx.filter = 'brightness(200%)';
            }
            ctx.drawImage(enemyImage, this.x, this.y, this.width, this.height);
            ctx.filter = 'none';
        } else {
            // Fallback colored shapes
            ctx.fillStyle = this.hit ? 'white' : this.color;
            
            if (this.type === 'flyer') {
                // Draw wings
                ctx.fillStyle = this.hit ? 'white' : '#B19CD9';
                const wingFlap = Math.sin(frameCount * 0.3) * 5;
                ctx.fillRect(this.x - 10, this.y + wingFlap, 15, 8);
                ctx.fillRect(this.x + this.width - 5, this.y - wingFlap, 15, 8);
                
                // Draw body
                ctx.fillStyle = this.hit ? 'white' : this.color;
                ctx.beginPath();
                ctx.ellipse(this.x + this.width/2, this.y + this.height/2, 
                           this.width/2, this.height/2, 0, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Ground enemies
                ctx.fillRect(this.x, this.y, this.width, this.height);
                
                if (this.type === 'tank') {
                    ctx.fillStyle = this.hit ? 'white' : '#A0522D';
                    ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
                }
                
                if (this.isAttacking) {
                    ctx.fillStyle = '#ff0000';
                    ctx.fillRect(this.x - 5, this.y - 5, this.width + 10, 3);
                }
            }
        }

        // Health bar
        if (this.health < this.maxHealth) {
            const barWidth = this.width;
            const barHeight = 6;
            const barY = this.y - 10;
            
            ctx.fillStyle = '#333';
            ctx.fillRect(this.x, barY, barWidth, barHeight);
            
            ctx.fillStyle = '#ff4444';
            const healthPercent = this.health / this.maxHealth;
            ctx.fillRect(this.x, barY, barWidth * healthPercent, barHeight);
        }

        ctx.restore();
    }

    takeDamage(damage) {
        this.health -= damage;
        this.hit = true;
        this.hitTime = 10;
        
        if (this.health <= 0) {
            
            for (let i = 0; i < CONFIG.particles.deathParticles; i++) {
                particles.push(new Particle(
                    this.x + this.width/2,
                    this.y + this.height/2,
                    this.color
                ));
            }
            
            // частицы
            for (let i = 0; i < this.reward; i++) {
                irysParticles.push(new IRYSParticle(
                    this.x + this.width/2,
                    this.y + this.height/2
                ));
            }
            
            playSound('enemyHit');
            
            irysCount += this.reward;
            totalKills++;
            
            return true; 
        }
        return false;
    }
}


class Bullet {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.speed = CONFIG.bullet.speed;
        this.damage = CONFIG.bullet.damage;
        this.size = CONFIG.bullet.size;
        
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        this.vx = (dx / distance) * this.speed;
        this.vy = (dy / distance) * this.speed;
        
        this.trail = [];
    }

    update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > CONFIG.bullet.trailLength) {
            this.trail.shift();
        }
        
        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        
        for (let i = 0; i < this.trail.length; i++) {
            const alpha = i / this.trail.length;
            ctx.save();
            ctx.globalAlpha = alpha * 0.4;
            ctx.fillStyle = '#8B4513'; 
            ctx.fillRect(this.trail[i].x - 1, this.trail[i].y - 1, 2, 2);
            ctx.restore();
        }
        
        
        ctx.save();
        
        
        const angle = Math.atan2(this.vy, this.vx);
        
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);
        
        
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-6, -1, 8, 2);
        
        
        ctx.fillStyle = '#708090';
        ctx.fillRect(2, -2, 4, 4);
        
        
        ctx.fillStyle = '#D2691E';
        ctx.fillRect(-8, -2, 3, 1);
        ctx.fillRect(-8, 1, 3, 1);
        
        ctx.restore();
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8 - 2;
        this.life = CONFIG.particles.maxLife;
        this.maxLife = CONFIG.particles.maxLife;
        this.color = color;
        this.size = Math.random() * 4 + 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2;
        this.life--;
        this.size *= 0.98;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        ctx.restore();
    }
}

class IRYSParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = -Math.random() * 3 - 2;
        this.life = CONFIG.particles.irysParticleLife;
        this.maxLife = CONFIG.particles.irysParticleLife;
        this.floatOffset = Math.random() * Math.PI * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1;
        this.life--;
        this.floatOffset += 0.1;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.life / this.maxLife;
        
        const floatY = Math.sin(this.floatOffset) * 2;
        
        ctx.fillStyle = '#00ffcc';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffcc';
        ctx.fillText('IRYS', this.x, this.y + floatY);
        
        ctx.restore();
    }
}