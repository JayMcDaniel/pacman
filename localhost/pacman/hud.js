function addCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function HUD(level) {
    

    this.level = level;
    this.score_multiplier = 1;
    this.color = "yellow";

    this.show = function () {
        
        textSize(20);
        
        for(i=pacmans.length -1; i>-1; i--){
            fill(pacmans[i].color);
            text("lives: " + pacmans[i].lives, (i*700) + 24, height -5);
            text("score: " + pacmans[i].score, (i*600) + 20, 20);
            
        }
        

        text("level: " + this.level, width / 2 -27, 20);


        if (gameover) {
            
         //   this.updateHighScore();
            
            fill("#fff");
            textSize(64);
            text("Game Over", width / 2 - 180, height / 2 - 240);
            fill(this.color);
            fill("#fff");
            textSize(32);
            text("Hit '1' or '2' for new game", width / 2 - 180, height / 2 -190);
        //    text("High Score: " + high_score, width / 2 - 180, height / 2 + 60);
            
        }

    }

 

    this.updateLevel = function (level) {
        this.level = level;
    }



    this.updateHighScore = function () {
  
        if (Number(this.score.toString().replace(",", "")) > Number(high_score.toString().replace(",", ""))) {
            high_score = addCommas(this.score);
        }
    }


}