let game = new Phaser.Game(
  window.innerWidth,
  window.innerHeight,
  Phaser.AUTO,
  "phaser-start",
  {
    preload: preload,
    create: create,
    update: update,
    render: render
  }
);

function preload() {
  game.load.image("bullet", "assets/bullet.png");
  game.load.image("enemyBullet", "assets/enemy-bullet.png");
  game.load.spritesheet("invader", "assets/invader32x32x4.png", 32, 32);
  game.load.image("ship", "assets/player.png");
  game.load.spritesheet("kaboom", "assets/explode.png", 128, 128);
  game.load.image("starfield", "assets/space-1.png");
  game.load.audio("loadSound", "assets/sound/startSound.mp3");
  game.load.audio("explodeSound", "assets/sound/explode1.mp3");
  game.load.atlas(
    "generic",
    "assets/generic-joystick.png",
    "assets/generic-joystick.json"
  );
}

let loadSound;
let explodeSound;
let player;
let aliens;
let bullets;
let bulletTime = 0;
let cursors;
let fireButton;
let explosions;
let starfield;
let score = 0;
let scoreString = "";
let scoreText;
let livesText;
let lives;
let enemyBullet;
let firingTimer = 0;
let stateText;
let livingEnemies = [];
let pad = null;
let stick = null;
let buttonA = null;

let nums = new Set();
while (nums.size !== 6) {
  nums.add(Math.floor(Math.random() * 6) + 1);
}

let array = [...nums];
let i = array.length - 1;

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // console.log(Phaser);
  // //phaser joystick
  // pad = game.plugins.add(Phaser.VirtualJoystick);
  // stick = pad.addStick(0, 0, 200, "generic");
  // stick.alignBottomLeft(20);
  // stick.motionLock = Phaser.VirtualJoystick.HORIZONTAL;
  // buttonA = pad.addButton(500, 520, "generic", "button1-up", "button1-down");
  // buttonA.alignBottomRight(20);

  //  The scrolling starfield background
  starfield = game.add.tileSprite(
    0,
    0,
    window.innerWidth,
    window.innerHeight,
    "starfield"
  );

  //load sound
  loadSound = game.add.audio("loadSound");
  loadSound.play();
  game.input.onDown.add(restartMusic, this);

  //explode sound
  explodeSound = game.add.audio("explodeSound");

  //  Our bullet group
  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(1, "bullet");
  bullets.setAll("anchor.x", 0.5);
  bullets.setAll("anchor.y", 1);
  bullets.setAll("outOfBoundsKill", true);
  bullets.setAll("checkWorldBounds", true);

  // The enemy's bullets
  enemyBullets = game.add.group();
  enemyBullets.enableBody = true;
  enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
  enemyBullets.createMultiple(30, "enemyBullet");
  enemyBullets.setAll("anchor.x", 0.5);
  enemyBullets.setAll("anchor.y", 1);
  enemyBullets.setAll("outOfBoundsKill", true);
  enemyBullets.setAll("checkWorldBounds", true);
  enemyBullets.width = 100;
  enemyBullets.height = 100;

  //  The hero!
  player = game.add.sprite(game.world.width / 2, 600, "ship");
  player.anchor.setTo(0.5, 0.5);
  player.width = 30;
  player.height = 30;
  game.physics.enable(player, Phaser.Physics.ARCADE);

  //  The baddies!
  aliens = game.add.group();
  aliens.enableBody = true;
  aliens.physicsBodyType = Phaser.Physics.ARCADE;

  createAliens();

  //  The score
  scoreString = "Score : ";
  scoreText = game.add.text(10, 10, scoreString + score, {
    font: "34px Arial",
    fill: "#c51b7d"
  });
  scoreText.stroke = "#de77ae";
  scoreText.strokeThickness = 16;
  scoreText.setShadow(2, 2, "#333333", 2, false, true);

  //  Lives
  lives = game.add.group();
  livesText = game.add.text(game.world.width - 200, 10, "Lives : ", {
    font: "34px Arial",
    fill: "#c51b7d"
  });
  livesText.stroke = "#de77ae";
  livesText.strokeThickness = 16;
  livesText.setShadow(2, 2, "#333333", 2, false, true);

  //  Text
  stateText = game.add.text(game.world.centerX, game.world.centerY, " ", {
    font: "84px Arial",
    fill: "#c51b7d"
  });
  stateText.anchor.setTo(0.5, 0.5);
  stateText.visible = false;

  for (let i = 0; i < 3; i++) {
    let ship = lives.create(game.world.width - 170 + 30 * i, 80, "ship");
    ship.anchor.setTo(0.5, 0.5);
    ship.angle = 90;
    ship.alpha = 0.4;
  }

  //  An explosion pool
  explosions = game.add.group();
  explosions.createMultiple(30, "kaboom");
  explosions.forEach(setupInvader, this);

  //  And some controls to play the game with
  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function createAliens() {
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 10; x++) {
      let alien = aliens.create(x * 48, y * 50, "invader");
      alien.anchor.setTo(0.5, 0.5);
      alien.animations.add("fly", [0, 1, 2, 3], 20, true);
      alien.play("fly");
      alien.body.moves = false;
    }
  }

  aliens.x = 100;
  aliens.y = 200;

  //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
  let tween = game.add
    .tween(aliens)
    .to({ x: 600 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

  //  When the tween loops it calls descend
  tween.onLoop.add(descend, this);
}

function setupInvader(invader) {
  invader.anchor.x = 0.5;
  invader.anchor.y = 0.5;
  invader.animations.add("kaboom");
}

function descend() {
  aliens.y += 10;
}

function update() {
  //  Scroll the background
  starfield.tilePosition.y += 2;

  if (player.alive) {
    //  Reset the player, then check for movement keys
    player.body.velocity.setTo(0, 0);

    if (cursors.left.isDown) {
      player.body.velocity.x = -200;
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 200;
    }

    //  Firing?
    if (fireButton.isDown) {
      fireBullet();
    }

    if (game.time.now > firingTimer) {
      enemyFires();
    }

    //  Run collision
    game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
    game.physics.arcade.overlap(
      enemyBullets,
      player,
      enemyHitsPlayer,
      null,
      this
    );
  }
}

function restartMusic() {
  loadSound.restart();
}
function render() {}

function collisionHandler(bullet, alien) {
  //  When a bullet hits an alien we kill them both
  if (i >= 0) {
    pushQuestion(i);
    i = i - 1;
  }

  explodeSound.play();
  bullet.kill();
  alien.kill();

  //  Increase the score
  score += 20;
  scoreText.text = scoreString + score;

  //  And create an explosion :)
  let explosion = explosions.getFirstExists(false);
  explosion.reset(alien.body.x, alien.body.y);
  explosion.play("kaboom", 30, false, true);

  if (aliens.countLiving() == 0) {
    score += 1000;
    scoreText.text = scoreString + score;

    enemyBullets.callAll("kill", this);
    stateText.text = " You Won, \n Click to restart";
    stateText.visible = true;

    //the "click to restart" handler
    game.input.onTap.addOnce(restart, this);
  }
}

function enemyHitsPlayer(player, bullet) {
  bullet.kill();

  live = lives.getFirstAlive();

  if (live) {
    live.kill();
  }

  //  And create an explosion :)
  let explosion = explosions.getFirstExists(false);
  explosion.reset(player.body.x, player.body.y);
  explosion.play("kaboom", 30, false, true);

  // When the player dies
  if (lives.countLiving() < 1) {
    player.kill();
    enemyBullets.callAll("kill");

    stateText.text = " GAME OVER \n Click to restart";
    stateText.visible = true;
    stateText.stroke = "#de77ae";
    stateText.strokeThickness = 16;
    stateText.setShadow(2, 2, "#333333", 2, false, true);

    stateText.game.input.onTap //the "click to restart" handler
      .addOnce(restart, this);
  }
}

function enemyFires() {
  //  Grab the first bullet we can from the pool
  enemyBullet = enemyBullets.getFirstExists(false);

  livingEnemies.length = 0;

  aliens.forEachAlive(function(alien) {
    // put every living enemy in an array
    livingEnemies.push(alien);
  });

  if (enemyBullet && livingEnemies.length > 0) {
    let random = game.rnd.integerInRange(0, livingEnemies.length - 1);

    // randomly select one of them
    let shooter = livingEnemies[random];
    // And fire the bullet from this enemy
    enemyBullet.reset(shooter.body.x, shooter.body.y);

    game.physics.arcade.moveToObject(enemyBullet, player, 120);
    firingTimer = game.time.now + 2000;
  }
}

function fireBullet() {
  //  To avoid them being allowed to fire too fast we set a time limit
  if (game.time.now > bulletTime) {
    //  Grab the first bullet we can from the pool
    bullet = bullets.getFirstExists(false);

    if (bullet) {
      //  And fire it
      bullet.reset(player.x, player.y + 8);
      bullet.body.velocity.y = -400;
      bulletTime = game.time.now + 200;
    }
  }
}

function resetBullet(bullet) {
  //  Called if the bullet goes out of the screen
  bullet.kill();
}

function restart() {
  //  A new level starts

  //resets the life count
  lives.callAll("revive");
  //  And brings the aliens back from the dead :)
  game.stage.backGroundColor = "#182d3b";
  aliens.removeAll();
  createAliens();

  //revives the player
  player.revive();
  //hides the text
  stateText.visible = false;
}
