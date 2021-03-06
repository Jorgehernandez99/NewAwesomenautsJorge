game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        // Code I use to call on the functions i made to refactor the code and make it shorter
        this.setSuper(x, y);
        this.setPlayerTimers();
        this.setAttributes();
        this.type = "PlayerEntity";
        this.setFlags();
        
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        this.addAnimation();

        //Animation of how the player looks when it stands still
        this.renderable.setCurrentAnimation("idle");
    },
    
    // Code that lets me choose the image of the player and the size I want it
    setSuper: function(x, y){
        this._super(me.Entity, 'init', [x, y, {
                image: "player",
                width: 64,
                height: 64,
                spritewidth: "64",
                spriteheight: "64",
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);
    },
    
    //Sets the timers and keeps track of when the Player last hit or last threw spear 
    setPlayerTimers: function(){
        this.now = new Date().getTime();
        this.lastHit = this.now;
        this.lastSpear = this.now;
        this.lastAttack = new Date().getTime();
    },
    // Sets Attributes which include the health of the player and how much it attacks
    setAttributes: function(){
        this.health = game.data.playerHealth;
        this.body.setVelocity(game.data.playerMoveSpeed, 20);
        this.attack = game.data.playerAttack;
    },
    
    setFlags: function(){
      //keeps track of which direction your character is moving
        this.facing = "right";
        this.dead = false; 
        this.attacking = false;
    },
    
    //Animations of how the player looks when it stands still, attacks, or walks
    addAnimation: function(){
        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
    },
    
    // Updates the game when I die 
    update: function(delta) {
        this.now = new Date().getTime();
        this.dead = this.checkIfDead();
        this.checkKeyPressesAndMove();
        this.checkAbilityKeys();
        this.setAnimation(); 
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    checkIfDead: function(){
        if (this.health <= 0) {
            return true;
        }
        return false;
    },
    
    checkKeyPressesAndMove: function(){
        if (me.input.isKeyPressed("right")) {
            this.moveRight();
        } else if (me.input.isKeyPressed("left")) {
           this.moveLeft();
        }
        else {
            this.body.vel.x = 0;
        }
        if (me.input.isKeyPressed("up")&& !this.body.jumping && !this.body.falling) {
            this.up();
        }
        
        this.attacking = me.input.isKeyPressed("attack");
    },
    
    // Function that controls when i move right the characters image flips
    moveRight: function(){
        //adds to the position of my x by the velocity defined above in
            //setVelocity() and multiplying it by me.timer.tick.
            //me.timer.tick makes the movement look smooth
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.flipX(true);
            this.facing = "right";
    },
    // Function that controls when I move left the characters image flips
    moveLeft: function(){
         this.facing = "left";
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            this.flipX(false);
    },
    
    // Function that controls the code to jump 
    up: function(){
        console.log("up");
                this.body.jumping = true;
                this.body.vel.y -= this.body.accel.y * me.timer.tick;
    },
    
    // Function that checks the ability keys from another page like throwspear.js
    checkAbilityKeys: function(){
        if(me.input.isKeyPressed("skill1")){
            //this.speedBurst();
        }else if(me.input.isKeyPressed("skill2")){
            //this.eatCreep();
        }else if(me.input.isKeyPressed("skill3")){
            this.throwSpear();
        }
    },
    
    // Function that controls the spear and how fast it moves and when i can use it again
    throwSpear: function(){
        if((this.now-this.lastSpear) >= game.data.spearTimer*1000 && game.data.ability3 > 0){
            this.lastSpear = this.now;
            var spear = me.pool.pull("spear", this.pos.x, this.pos.y, {}, this.facing);
            me.game.world.addChild(spear, 10);
        }
    },
    
    // Function that sets the animation
    setAnimation: function(){
        if (this.attacking) {
            if (!this.renderable.isCurrentAnimation("attack")) {
                //sets the current animation to attack and once that is over
                //goes back to the idle animation
                this.renderable.setCurrentAnimation("attack", "idle");
                this.renderable.setAnimationFrame();
            }
        }
        else if (this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        }
        else if (!this.renderable.isCurrentAnimation("attack")) {
            this.renderable.setCurrentAnimation("idle");
        }
    },
    
    // Function that controls 
    loseHealth: function(damage) {
        this.health = this.health - damage;
    },
    //Code that when the player collides with the enemy it cannot pass through
    collideHandler: function(response) {
        if (response.b.type === 'EnemyBaseEntity') {
            this.collideWithEnemyBase(response);
        } else if (response.b.type === 'EnemyCreep') {
            this.collideWithEnemyCreep(response);
        }
    },
    
    //Function that controls what happens when i attack the enemy base
    collideWithEnemyBase: function(response){
        var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;

            if (ydif < -40 && xdif < 70 && xdif > -35) {
                this.body.falling = false;
                this.body.vel.y = -1;
            }
            else if (xdif > -35 && this.facing === 'right' && (xdif < 0) && ydif > -50) {
                this.body.vel.x = 0;
            } else if (xdif < 70 && this.facing === 'left' && (xdif > 0)) {
                this.body.vel.x = 0;
            }
            if (this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer) {
                this.lastHit = this.now;
                response.b.loseHealth(game.data.playerAttack);
            }
    },
    
    // Function that controls what happens when i attack the enemycreep
    collideWithEnemyCreep: function(response){
        var xdif = this.pos.x - response.b.pos.x;
            var ydif = this.pos.y - response.b.pos.y;
            
            this.stopMovement(xdif);
            
            if(this.checkAttack(xdif, ydif)){
               this.hitCreep(response);
            };
    },
    
    // Function that controls how the player looks when it stops moving
    stopMovement: function(xdif){
        if (xdif > 0) {               
                if (this.facing === "left") {
                    this.body.vel.x = 0;
                }
            } else {
                if (this.facing === "right") {
                    this.body.vel.x = 0;
                }
            }
    },
    
    // Function that checks the attack
    checkAttack: function(xdif, ydif){
         if (this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer
                    && (Math.abs(ydif) <= 40) &&
                    (((xdif > 0) && this.facing === "left") || ((xdif < 0) && this.facing === "right"))
                    ) {
                this.lastHit = this.now;
                //If the creeps health is less than our attack, execute code in if statement
                return true;
            }
                return false;
    },
    
    //Function of what happens when i hit the creep
    hitCreep: function(response){
         if(response.b.health <= game.data.playerAttack){
                    //Adds 1 gold for a creep kill
                    game.data.gold += 1;
                }   
                
                response.b.loseHealth(game.data.playerAttack);
    }
});