game.ExperienceManager = Object.extend({
    init: function(x, y, settings) {
        // Code that alway updates the function when the player gets exp
        this.alwaysUpdate = true;
        this.gameover = false;
    },
    // Function that updates the game if I win or lose
    update: function() {
        if (game.data.win === true && !this.gameover) {
            // Function that when I win it gives me an alert the i won
            this.gameOver(true);
            alert("YOU WIN!");
        } else if (game.data.win === false && !this.gameover) {
            // Function that when I lose it gives me an alert that I lost
            this.gameOver(false);
            alert("YOU LOSE!");
        }

        return true;
    },
    
    // FFunction that controls what I recieve if I win or lose
    gameOver: function(win) {
        if (win) {
            game.data.exp += 10;
        } else {
            game.data.exp += 1;
        }
        this.gameover = true;
        me.save.exp = game.data.exp;
        game.data.win = '';


        $.ajax({
            type: "POST",
            url: "php/controller/save-user.php",
            data: {
                exp: game.data.exp,
                exp1: game.data.exp1,
                exp2: game.data.exp2,
                exp3: game.data.exp3,
                exp4: game.data.exp4,
            },
            dataType: "text"
        })
                .success(function(response) {
                    if (response === "true") {
                        me.state.change(me.state.MENU);
                    } else {
                        alert(response);
                    }
                })
                .fail(function(response) {

                });


    }

});

