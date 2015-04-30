game.SpearThrow = me.Entity.extend({
    init: function(x, y, settings, facing){
        this._super(me.Entity, 'init', [x, y, {
                //Code that edits how big or small the spear is how long and what image  i want to use for the spear
                image: "spear",
                width:48,
                height: 48,
                spritewidth: "48",
                spriteheight: "48",
                getShape: function() {
                    return (new me.Rect(0, 0, 48, 48)).toPolygon();
                }
            }]);
        this.alwaysUpdate = true;
        this.body.setVelocity(8, 0);
        this.attack = game.data.ability3*3;
        this.type = "spear";
        this.facing = facing
    },
    // A function that makes the spear animation face left when i face left and throw it
    update: function(delta){
        if(this.facing === "left"){
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
        }else {
            this.body.vel.x += this.body.accel.x * me.timer.tick;
        }
        me.collision.check(this, true, this.collideHandler.bind(this), true);

        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    //A collide function that tells the spear what it can destroy such as the enemy or the enemybase
    collideHandler: function(response) {

        if (response.b.type === 'EnemyBaseEntity' || response.b.type === 'EnemyCreep') {
                response.b.loseHealth(this.attack);
                me.game.world.removeChild(this);
        }
    }
});


