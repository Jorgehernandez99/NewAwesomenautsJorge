game.PlayerBaseEntity = me.Entity.extend({
//Code that lets me  choose the image of the Playerbase and the size i want it
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
        //This lets us know  if the base is broken
        this.broken = false;
        //this.health is a global variable where i can access the Playerbase's health from game.js
        this.health = game.data.playerBaseHealth;
        // always updates the game when the player base gets destroyed
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        //Lets the page kno that the type will be called playerbase so i can use
        //it on other pages when i want to call it
        this.type = "PlayerBase";

        //Animmation for when the Base gets destroyed
        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");

    },
// Function that updates the game if the base gets destroyed i lose
    update: function(delta) {
        if (this.health <= 0) {
            this.broken = true;
            game.data.win = false;
            this.renderable.setCurrentAnimation("broken");
        }
        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
// Controls the health of theee playerbase    
    loseHealth: function(damage) {
        this.health = this.health - damage;
    },
    onCollision: function() {

    }

});


