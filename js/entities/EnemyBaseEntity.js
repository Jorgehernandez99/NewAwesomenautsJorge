game.EnemyBaseEntity = me.Entity.extend({
    //Code that picks what image i want to use for the enemy base and how long or small it is
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spriteheight: "100",
                getShape: function() {
                    return (new me.Rect(0, 0, 100, 70)).toPolygon();
                }
            }]);
        this.broken = false;
        this.health = game.data.enemyBaseHealth;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);

// This.type is a variable that i can use on other oages if i want to call the enemybase entity
        this.type = "EnemyBaseEntity";

//The animation of how the enemybase is and gets destroyed 
        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");

    },
// Code that updates the game like when i destroy the enemy base I win
    update: function(delta) {
        if (this.health <= 0) {
            this.broken = true;
            game.data.win = true;
            this.renderable.setCurrentAnimation("broken");
        }
        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    onCollision: function() {

    },
//Lose health function that controls how much health it has and gets taken away
    loseHealth: function() {
        console.log(this.health);
        this.health--;
    }

});


