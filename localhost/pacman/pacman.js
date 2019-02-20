function Pacman(player, x, y, w, h) {

    this.player = player;
    this.getCurrentCell = function () {
        return [Math.floor(this.x / 30), Math.floor(this.y / 30)];
    }


    this.color = this.player === 1 ? "yellow" : "red";
    this.d = w;
    this.r = this.d / 2;
    this.mouth_bottom = 9
    this.mouth_top = -9;
    this.dir = [0, -1];
    this.next_dir = [0, -1];
    this.x = x;
    this.y = y;
    this.speed = 3;
    this.mouth_speed = 5
    this.facing_angle = 90;
    this.next_facing_angle = 90;
    this.mouth_dir = 1; //opening or closing (-1)
    this.move_count = 30 / this.speed;
    this.current_cell = this.getCurrentCell();
    this.clear_ahead = false;
    this.pellets_eaten = 0;
    this.score = 0;
    this.lives = 3;
    this.is_dying = false;
    this.is_moving = false;



    this.moveMouth = function () {
        this.mouth_bottom += (this.mouth_speed * this.mouth_dir);
        this.mouth_top -= (this.mouth_speed * this.mouth_dir);

        if (this.mouth_bottom > 50 || this.mouth_bottom < 5) {
            this.mouth_dir *= -1;
        }

    }




    this.hits = function (arr) {

        for (var i = arr.length - 1; i > -1; i--) {

            var d = dist(this.x, this.y, arr[i].x, arr[i].y);

            if (d < this.r + arr[i].r) {


                //hit a normal pellet
                if (arr[i].type === "pellet" && !arr[i].empty) {
                    arr[i].empty = true;
                    this.pellets_eaten++;
                    this.score++;
                    if (this.pellets_eaten % 1 == 0) {
                        pacman_chomp_sound.play();
                    }
                    
                    if (this.pellets_eaten % 400 == 0) {
                        boom_sound.play();
                        this.lives++;
                    }
                    
                    

                }

                //hit a power pellet
                if (arr[i].type === "power_pellet" && !arr[i].empty) {
                    arr[i].empty = true;
                    this.score += 50;
                    power_pellet_sound.play();
                    this.d += 10;

                    ghosts.forEach(function (ghost) {
                        ghost.getScared();

                    });

                }

                //hit a ghost


                if (arr[i].type === "ghost" && !arr[i].is_dying && !this.is_dying) {

                    if (arr[i].is_scared) {
                        arr[i].die(); //ghosts dies
                        this.score += 100;

                    } else {
                        this.die(); //pacman dies
                    }


                }
            }

        }

    }


    this.die = function () {

        this.lives--;
        this.is_dying = true;
        this.is_moving = false;
        pacman_death_sound.play();

        var pacman = this;
        setTimeout(function () {
            pacman.restart();

            ghosts.forEach(function (ghost) {
                ghost.restart();
            });

        }, 2000);


    }


    this.restart = function () {

        if (this.lives > 0) {
            this.d = 30;
            this.x = x;
            this.y = y;
            this.dir = [0, -1];
            this.next_dir = [0, -1];
            this.facing_angle = 90;
            this.next_facing_angle = 90;
            this.is_dying = false;
        }

    }



    this.move = function () {

        if ((this.x - 15) % 30 === 0 && (this.y - 15) % 30 === 0) { //in the middle of a cell block, look


            if (this.lookAround(this.next_dir)) {
                this.changeDir();
            }
            this.clear_ahead = this.lookAround(this.dir);

        }


        if (this.clear_ahead) {
            this.x += this.dir[0] * this.speed; // * 1.3;
            this.y += this.dir[1] * this.speed;
            this.moveMouth();


            //boundries
            if (this.x > width - this.r) {
                this.x = this.d;
            }
            if (this.x < this.r) {
                this.x = width - this.d;
            }

        }


    }


    this.lookAround = function (dir) {

        var cc = this.current_cell = this.getCurrentCell();

        //if wanting to change directions, look that way

        var next_dir_cell = [cc[0] + dir[0], cc[1] + dir[1]];

        //if it's clear to turn then turn
        var next_dir_cell_content = level.current_map[next_dir_cell[1]].slice(next_dir_cell[0], next_dir_cell[0] + 1); //map symbol

        return next_dir_cell_content != "W"; // not a wall, coast is clear, change directions or keep moving


    }




    //change direction now
    this.changeDir = function () {

        this.dir = this.next_dir;
        this.facing_angle = this.next_facing_angle;
    }


    //set a direction to be turned soon
    this.changeNextDir = function (dir, next_facing_angle) {

        this.next_dir = dir;
        this.next_facing_angle = next_facing_angle;

        //if this is a 180 turn, turn immediately
        if (Math.max(this.facing_angle, this.next_facing_angle) - Math.min(this.facing_angle, this.next_facing_angle) === 180) {
            this.changeDir();
        }

    }



    this.show = function () {
        push();

        if (this.is_dying) {
            this.facing_angle += 10;
            this.d > 0 ? this.d -= .5 : this.d = 0;

        }

        translate(this.x, this.y);
        fill(this.color);
        rotate(this.facing_angle);
        arc(0, 0, this.d, this.d, this.mouth_bottom, this.mouth_top, PIE);
        pop();

    }



}