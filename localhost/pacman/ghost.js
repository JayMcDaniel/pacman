function Ghost(ghost_index, x, y, w, h, level_num, speed, scared_time) {

    Pacman.apply(this, arguments);

    this.ghost_index = ghost_index;
    this.corner = (function () {
        return [[30, 30], [30, height], [width, 30], [width, height]][ghost_index];
    })(); //used when ghosts run to their corner instead of pacman

    this.color = ["red", "pink", "blue", "orange"][ghost_index];
    this.type = "ghost";
    this.speed = speed;
    this.previous_speed = this.speed;
    this.move_count = 30 / this.speed;
    this.dir = [0, 0];
    this.next_dir = [0, 0];
    this.d = 33;
    this.is_scared = false;
    this.is_blinking = false;
    this.scared_time = scared_time;
    this.active_power_pellets = 0;

    this.current_cell = [Math.floor(x / 30), Math.floor(y / 30)];
    this.previous_cell = this.current_cell.slice();
    this.img_indx = (ghost_index + 1) % 2 === 0 ? 0 : 1; //the horizontal image 


    this.show = function () {

        if (this.is_dying) {
            this.d > 0 ? this.d -= .8 : this.d = .5; //dying shrink
        }

        push();

        var ghost_index = this.is_scared ? 4 : this.ghost_index; // the vert ghost image
        var img_index = this.is_blinking ? 2 : this.img_indx; // horiz image


        image(ghost_img, this.x, this.y, this.d, this.d, (42 * img_index), 43 * ghost_index, 45, 45);
        pop();
    }



    this.move = function (cellX, cellY) {

        if (!this.is_dying) {
            if (this.move_count > 0) {
                this.x += this.dir[0] * this.speed; // * 1.3;
                this.y += this.dir[1] * this.speed;

                this.move_count--;
            } else {
                this.previous_cell = this.current_cell.slice();
                this.current_cell = [this.current_cell[0] + this.dir[0], this.current_cell[1] + this.dir[1]];
                this.switchImage();
                this.dir = this.chooseNextDirection();
                this.move_count = 30 / this.speed;
            }
        }
    }



    this.chooseNextDirection = function () {

        var cc = this.current_cell;
        var next_cell_options = [[cc[0], cc[1] - 1], [cc[0] + 1, cc[1]], [cc[0], cc[1] + 1], [cc[0] - 1, cc[1]]]; //up, right, down, left    
        var possible_cells = next_cell_options.filter(function (possible, i) {
            var cell = level.current_map[possible[1]].slice(possible[0], possible[0] + 1); //map symbol

            //look if that cell in the map contains a wall or is the Hall ("H") is a reversal of current direction; return true if not
            return cell != "W" && cell != "H" && this.previous_cell.join(",") != possible.join(",");

        }, this);


        //among possible, choose one depending on ghost

        //if only one option
        if (possible_cells.length === 1) {
            return possible_cells[0].map(function (cell_index, i) {
                return cell_index - this.current_cell[i];
            }, this);
        }


        if (this.ghost_index === 0) { //ghost 1 is random
            if (level.level_num < 4) {
                return this.chooseRandom(possible_cells);
            } else {
                return this.followTarget(0, possible_cells);
            }

        }

        if (this.ghost_index == 1) { //ghost 2 follows pacman 1
            if (level.level_num < 2) {
                return this.chooseRandom(possible_cells);
            } else {
                return this.followTarget(0, possible_cells);
            }
        }

        if (this.ghost_index == 2) { //ghost 3 follows pacman 2


            if (level.level_num < 2) {
                return this.chooseRandom(possible_cells);
            } else {
                var pacman_index = pacmans.length > 1 ? 1 : 0;
                return this.followTarget(pacman_index, possible_cells);
            }


        }

        if (this.ghost_index == 3) { //ghost 4 follows closest pacman

            var closest_pacman_index = 0;

            if (pacmans.length > 1) {
                var pacman_distances = pacmans.map(function (pacman, i) {
                    return dist(this.x, this.y, pacmans[i].x, pacmans[i].y);
                }, this);

                closest_pacman_index = pacman_distances.indexOf(Math.min.apply(null, pacman_distances));
            }

            return this.followTarget(closest_pacman_index, possible_cells);
        }


    }


    this.followTarget = function (pacman_index, possible_cells) {

        var target = this.is_scared ? this.corner : [pacmans[pacman_index].x, pacmans[pacman_index].y];

        //measure distances
        var distances_from_target = possible_cells.map(function (possible, i) {
            return dist(possible[0] * 30, possible[1] * 30, target[0], target[1]);
        }, this);

        var shortest_choice_indx = distances_from_target.indexOf(Math.min.apply(null, distances_from_target));

        return possible_cells[shortest_choice_indx].map(function (cell_index, i) {

            return cell_index - this.current_cell[i];

        }, this);
    }


    this.chooseRandom = function (possible_cells) {
        return random(possible_cells).map(function (cell_index, i) {
            return cell_index - this.current_cell[i];
        }, this);
    }


    this.switchImage = function () {

        this.img_indx = this.img_indx === 1 ? 0 : 1;

    }



    this.getScared = function () {

        this.is_scared = true;
        this.active_power_pellets++;
        //this.speed = 1;

        var ghost = this;
        setTimeout(function () {
            ghost.active_power_pellets--;

            if (ghost.active_power_pellets === 0) {

                ghost.img_indx = 2;
                ghost.is_blinking = true;

                setTimeout(function () {

                    ghost.is_scared = false;
                    ghost.is_blinking = false;
                    //ghost.speed = ghost.previous_speed;

                    pacmans.forEach(function (pacman) {
                        pacman.d = 30;
                    });

                }, 1000);

            }

        }, ghost.scared_time);

    };




    this.die = function () {
        pacman_eatghost_sound.play();

        this.is_dying = true;

        var ghost = this;
        setTimeout(function () {
            ghost.restart();
        }, 2000);


    }



    this.restart = function () {

        this.d = 33;
        this.x = x;
        this.y = y;
        this.current_cell = [Math.floor(x / 30), Math.floor(y / 30)];
        this.dir = [0, 0];
        this.next_dir = [0, 0];
        this.move_count = 30 / this.speed;
        this.is_dying = false;
        this.is_scared = false;

    }



}