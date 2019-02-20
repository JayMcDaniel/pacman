function Wall(x, y, w, h, level_num) {
    this.type = "wall";
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = (function () {
        var colors = ["#1919A6", "#E75480", "#228B22", "#B22222", "#d3d3d3", "#fffdd0", "#FFD700"];
        return colors[Math.floor(level.level_num / 2)] || colors[colors.length - 1];
    })();

    this.show = function () {
        fill(this.color);
        rect(this.x + this.w / 2, this.y + this.h / 2, this.w, this.h);
    }

}


function Pellet(x, y, w, h) {
    this.type = "pellet";
    this.empty = false;
    this.w = w;
    this.h = h;
    this.x = x + this.w / 2;
    this.y = y + this.h / 2;
    this.d = this.w / 5;
    this.r = this.d / 2;
    this.color = "#ffb8ae";

    this.show = function () {
        fill("black");
        rect(this.x, this.y, this.w, this.h);

        if (!this.empty) {
            noStroke();
            fill(this.color);
            ellipse(this.x, this.y, this.d, this.d);
        }

    }

}


function PowerPellet(x, y, w, h) {
    Pellet.apply(this, arguments);
    this.d = (this.w / 2) + 2;
    this.type = "power_pellet";

}




function Level(level_num, players_num) {

    this.players_num = players_num;
    this.walls = [];
    this.pellets = [];
    this.power_pellets = [];
    this.cell_w = Math.ceil(width / 27); //30
    this.cell_h = Math.ceil(height / 27); //30
    this.row_total = Math.floor(height / this.cell_h);
    this.column_total = Math.floor(width / this.cell_w);
    this.current_map = [];
    this.level_num = level_num;


    this.buildNewMap = function (blueprint) {

        this.walls = [];
        this.pellets = [];
        this.power_pellets = [];
        this.current_map = [];
        ghosts = [];
        pacmans = level.level_num === 1 ? [] : pacmans;


        for (var y = 0; y < blueprint.length; y++) {
            for (var x = 0; x < blueprint[y].length; x++) {

                var cell = blueprint[y].slice(x, x + 1);

                //wall
                if (cell == "W") {
                    this.walls.push(new Wall(x * this.cell_w, y * this.cell_h, this.cell_w, this.cell_h, this.level_num));

                } else if (cell == " ") {
                    this.pellets.push(new Pellet(x * this.cell_w, y * this.cell_h, this.cell_w, this.cell_h));

                    //pacman start spot
                } else if (cell == "P" && level.level_num === 1) {

                    pacmans.push(new Pacman(pacmans.length + 1, x * this.cell_w + this.cell_w / 2, y * this.cell_h + this.cell_h / 2, this.cell_w, this.cell_h));

                    //ghost start spot
                } else if (cell == "G") {
                    var speed = [1.5, 2, 2, 2.5, 2.5, 2.5, 3][level.level_num - 1] || 3;
                    var scared_time = 5500 - (this.level_num * 500) > 500 ? 5500 - (this.level_num * 500) : 500;
                    ghosts.push(new Ghost(ghosts.length, x * this.cell_w + this.cell_w / 2, y * this.cell_h + this.cell_h / 2, this.cell_w, this.cell_h, level.level_num, speed, scared_time));

                    //Power Pellets
                } else if (cell == "0") {
                    this.power_pellets.push(new PowerPellet(x * this.cell_w, y * this.cell_h, this.cell_w, this.cell_h));
                }

            }

        }


        //if only 1 player, remove second pacman
        if (this.players_num === 1 && this.level_num === 1) {
            pacmans.pop();
        }

        this.current_map = blueprint;

    };



    this.drawMap = function (current_map) {

        //show walls
        for (var i = 0; i < this.walls.length; i++) {
            this.walls[i].show();

        }

        //show pellets
        var pellets_remaining = false;
        for (var i = 0; i < this.pellets.length; i++) {
            this.pellets[i].show();
            if (!this.pellets[i].empty) {
                pellets_remaining = true;
            }

        }

        //show power pellets
        var power_pellets_remaining = false;
        for (var i = 0; i < this.power_pellets.length; i++) {
            this.power_pellets[i].show();

            if (!this.power_pellets[i].empty) {
                power_pellets_remaining = true;
            }
        }

        if (!power_pellets_remaining && !pellets_remaining) {
            this.level_num++
                newLevel(this.level_num);
        }



    };


    //Ws are walls, blanks are halls (pellets, 1s are powerups)
    this.blueprint1 = ["WWWWWWWWWWWWWWWWWWWWWWWWWWW",
                       "W0          WWW          0W",
                       "W W WWWWWWW WWW WWWWWWW W W",
                       "W W G        0        G W W",
                       "W W WWW WWWW W WWWW WWW W W",
                       "W W          W          W W",
                       "W WWWWW WWWW W WWWW WWWWW W",
                       "W       W    W    W       W",
                       "W WWWWW W WWWWW W W WWWWW W",
                       "W       W W  0  W W       W",
                       "WWWWW W W W WWWWW W W WWWWW",
                       "WWWWW W W         W W WWWWW",
                       "WWWWW W W WWWWWWW W W WWWWW",
                       "HHHHH                 HHHHH",
                       "WWWWW W W WWWWWWW W W WWWWW",
                       "WWWWW W W  P   P  W W WWWWW",
                       "WWWWW W W WWWWWWW W W WWWWW",
                       "W       W    W    W       W",
                       "W WWWWW W WW W WW W WWWWW W",
                       "W0                       0W",
                       "W WWWWW W W W WWWWW W W W W",
                       "W W   W W W W W   W W W W W",
                       "W W W W W W W W W W W W W W",
                       "W W W W W G W W W W W G W W",
                       "W W W W WWWWW W W W WWWWW W",
                       "W            0            W",
                       "WWWWWWWWWWWWWWWWWWWWWWWWWWW"];


}