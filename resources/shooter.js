let shooter = function() {
  let gif = document.querySelector("#shooter-gif");
  let bird_canvas = document.querySelector("#invaders-canvas");
  gif.className = "invisible";
  bird_canvas.className = "myCanvas";
  let playShooter = function() {
    var canvas = document.getElementById("invaders-canvas");
    var ctx = canvas.getContext("2d");

    var ship = new Image();
    var ship_x = canvas.width / 2;
    var ship_y = canvas.height - 100;
    ship.src = "../images/ship.gif";

    var space = new Image();
    space.src = "../images/space.png";

    var alive = true;
    var score = 0;
    var left = false;
    var right = false;
    var up = false;
    var down = false;
    var shooter_score_update = false;

    var enemies_total = 10;
    var enemies_array = [];
    var enemy_x = 10;
    var enemy_y = 0;
    var enemy_speed = 3;
    var enemy = new Image();
    enemy.src = "../images/enemy1.png";

    var laser_sound = new Audio();
    laser_sound.src = "../sound/Ship_shoot.wav";

    var enemy_die = new Audio();
    enemy_die.src = "../sound/enemy_die.wav";

    var ship_die = new Audio();
    ship_die.src = "../sound/Ship_die.wav";

    var laser_length = 1000000;
    var laser_array = [];
    var laser_array2 = [];
    var laser_array3 = [];
    var laser_array4 = [];
    var laser_array5 = [];
    var laser_array6 = [];
    var laser = new Image();
    laser.src = "../images/bullet.png";

    document.addEventListener("keydown", keyDown, false);
    document.addEventListener("keyup", keyUp, false);

    function keyDown(e) {
      if (e.keyCode == 39) right = true;
      else if (e.keyCode == 37) left = true;
      if (e.keyCode == 38) up = true;
      else if (e.keyCode == 40) down = true;
      if (e.keyCode == 88 && laser_array.length <= laser_length) {
        laser_array.push([ship_x, ship_y, 0]);
        laser_array2.push([ship_x, ship_y, 0]);
        laser_array3.push([ship_x, ship_y, 0]);
        if (laser_sound.paused == true) {
          laser_sound.play();
        } else {
          laser_sound.pause();
        }
      }
    }

    function keyUp(e) {
      if (e.keyCode == 39) right = false;
      else if (e.keyCode == 37) left = false;
      if (e.keyCode == 38) up = false;
      else if (e.keyCode == 40) down = false;
    }

    //add enemies
    for (var i = 0; i < enemies_total; i++) {
      enemies_array.push([enemy_x, enemy_y]);
      enemy_x += enemy.width + 30;
      if (enemy_x >= canvas.width) {
        enemy_x = 10;
      }
    }

    function drawship() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(space, 0, 0);
      if (alive == true) {
        if (right) ship_x += 5;
        else if (left) ship_x -= 5;
        if (up) ship_y -= 5;
        else if (down) ship_y += 5;

        if (ship_x <= 0) ship_x = 0;

        if (ship_x + ship.width >= canvas.width)
          ship_x = canvas.width - ship.width;

        if (ship_y <= 0) ship_y = 0;

        if (ship_y + ship.height >= canvas.height)
          ship_y = canvas.height - ship.height;

        //move enenmies and draw
        for (var i = 0; i < enemies_array.length; ++i) {
          if (enemies_array[i][1] < canvas.height) {
            enemies_array[i][1] += 1;
          } else if (enemies_array[i][1] >= canvas.height) {
            enemies_array[i][1] = 0;
          }
          ctx.drawImage(enemy, enemies_array[i][0], enemies_array[i][1]);
        }
        if (laser_array.length != 0) {
          for (var i = 0; i < laser_array.length; i++) {
            ctx.drawImage(laser, laser_array[i][0], laser_array[i][1]);
            ctx.drawImage(laser, laser_array2[i][0], laser_array2[i][1]);
            ctx.drawImage(laser, laser_array3[i][0], laser_array3[i][1]);
          }
        }
        for (var i = 0; i < laser_array.length; i++) {
          laser_array[i][1] -= 10;
          if (laser_array[i][1] <= 0) {
            laser_array[i].splice(i, 1);
          }
          laser_array2[i][1] -= 10;
          laser_array2[i][0] -= 5;
          if (laser_array2[i][1] <= 0) {
            laser_array2[i].splice(i, 1);
          }
          laser_array3[i][1] -= 10;
          laser_array3[i][0] += 5;
          if (laser_array3[i][1] <= 0) {
            laser_array3[i].splice(i, 1);
          }
        }
        //Collision
        var remove = false;
        for (var i = 0; i < laser_array.length; i++) {
          for (var j = 0; j < enemies_array.length; j++) {
            if (
              (laser_array[i][1] <= enemies_array[j][1] + enemy.height &&
                laser_array[i][0] >= enemies_array[j][0] &&
                laser_array[i][0] <= enemies_array[j][0] + enemy.width) ||
              (laser_array2[i][1] <= enemies_array[j][1] + enemy.height &&
                laser_array2[i][0] >= enemies_array[j][0] &&
                laser_array2[i][0] <= enemies_array[j][0] + enemy.width) ||
              (laser_array3[i][1] <= enemies_array[j][1] + enemy.height &&
                laser_array3[i][0] >= enemies_array[j][0] &&
                laser_array3[i][0] <= enemies_array[j][0] + enemy.width)
            ) {
              remove = true;
              enemies_array.splice(j, 1);
              enemy_die.play();
              score += 1;
              enemies_array.push([
                Math.random() * (canvas.width - 10) + 1,
                enemy_y
              ]);
              enemies_array.push([
                Math.random() * (canvas.width - 10) + 1,
                enemy_y
              ]);
            }
          }
          if (remove == true) {
            laser_array.splice(i, 1);
            laser_array2.splice(i, 1);
            laser_array3.splice(i, 1);

            remove = false;
          }
        }
        //ship collision
        for (var i = 0; i < enemies_array.length; i++) {
          if (
            ship_x > enemies_array[i][0] &&
            ship_x < enemies_array[i][0] + enemy.width &&
            ship_y > enemies_array[i][1] &&
            ship_y < enemies_array[i][1] + enemy.height
          ) {
            ship_die.play();
            alive = false;
          }
          if (
            ship_x + ship.width < enemies_array[i][0] + enemy.width &&
            ship_x + ship.width > enemies_array[i][0] &&
            ship_y > enemies_array[i][1] &&
            ship_y < enemies_array[i][1] + enemy.height
          ) {
            ship_die.play();
            alive = false;
          }
          if (
            ship_y + ship.height > enemies_array[i][1] &&
            ship_y + ship.height < enemies_array[i][1] + enemy.height &&
            ship_x > enemies_array[i][0] &&
            ship_x < enemies_array[i][0] + enemy.width
          ) {
            ship_die.play();
            alive = false;
          }

          if (
            ship_y + ship.height > enemies_array[i][1] &&
            ship_y + ship.height < enemies_array[i][1] + enemy.heighth &&
            ship_x + ship.width < enemies[i][0] + enemy.width &&
            ship_x + ship.width > enemies_array[i][0]
          ) {
            ship_die.play();
            alive = false;
          }
        }
        ctx.drawImage(ship, ship_x, ship_y);
        requestAnimationFrame(drawship);
        ctx.font = "bold 18px Arial";
        ctx.fillStyle = "#fff";
        ctx.fillText("Score: ", 490, 30);
        ctx.fillText(score, 550, 30);
      } //alive == false
      else {
        ctx.font = "bold 40px Arial";
        ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillText("Score: ", canvas.width / 2 - 100, canvas.height / 2 + 40);
        ctx.fillText(score, canvas.width / 2 + 50, canvas.height / 2 + 40);
        ctx.font = "bold 20px Arial";
        ctx.fillText(
          "Press the Start button to try again",
          canvas.width / 2 - 100,
          canvas.height / 2 + 70
        );
        if (shooter_score_update == false) {
          let time = new Date();
          let activity = {
            Timestamp: time,
            Game: "Space Invaders",
            Score: score
          };
          updateUserActivityAndScores(activity);
          shooter_score_update = true;
        }
      }
    }

    drawship();
  };
  playShooter();
};
