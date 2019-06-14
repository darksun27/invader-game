var game;

// global game options
let gameOptions = {
  platformStartSpeed: 300,
  spawnRange: [100, 300],
  platformSizeRange: [50, 250],
  playerGravity: 900,
  // starsGravity: 1200,
  jumpForce: 400,
  playerStartPosition: 200,
  jumps: 2
};

window.onload = function() {
  let gameConfig = {
    // object containing configuration options
    type: Phaser.AUTO,
    width: window.innerWidth / 2,
    height: window.innerHeight,
    scene: [Register, playGame, GameOverScene],
    backgroundColor: 0x444444,

    // physics settings
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    }
  };
  game = new Phaser.Game(gameConfig);
  window.focus();
  resize();
  window.addEventListener("resize", resize, false);
};

//variables
// let cursor = null;

// GameOver Scene

class Register extends Phaser.Scene {
  constructor() {
    super("register");
  }
  init() {
    this.register = this.registerName;
  }

  create() {
    this.register();
  }
  registerName() {
    $("#firebase").modal("show");
  }
}

class GameOverScene extends Phaser.Scene {
  constructor(data) {
    super("GameOver");
  }

  init(data) {
    this.data = data;
  }

  preload() {
    this.load.image("background_image", "assets/sky.png");
  }

  create() {
    let background = this.add.sprite(0, 0, "background_image");
    background.setOrigin(0, 0);
    this.add.text("50", "50", "GameOver");
    this.add.text("50", "80", "You Lose");
    this.add.text("50", "100", `You Get ${this.data.coins} coins`);
  }
}

// playGame scene
class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }

  init(data) {
    console.log(data);
    const coins = data.coins || 0;
    this.coins = coins;
    this.name = data["data"].name || null;
    this.i = 0;
  }

  preload() {
    this.load.image("platform", "assets/platform.png");
    this.load.image("star", "assets/coin.png");
    this.load.image("sky", "assets/sky.png");
    this.load.image("player", "assets/player.png");
    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48
    });
    this.load.audio("theme", "assets/sound/startSound.mp3");
    this.load.audio("death", "assets/sound/explode1.mp3");
  }

  collectStar(player, star) {
    star.disableBody(true, true);
    pushQuestion(this.i, game, false);

    // this.scoreText
  }

  create() {
    this.music = this.sound.add("theme");
    this.death = this.sound.add("death");
    this.music.play();
    this.add.image(400, 300, "sky");

    // group with all active platforms.
    this.platformGroup = this.add.group({
      // once a platform is removed, it's added to the pool
      removeCallback: function(platform) {
        platform.scene.platformPool.add(platform);
      }
    });

    // pool
    this.platformPool = this.add.group({
      // once a platform is removed from the pool, it's added to the active platforms group
      removeCallback: function(platform) {
        platform.scene.platformGroup.add(platform);
      }
    });

    // group with all active platforms.
    this.coinGroup = this.add.group({
      // once a platform is removed, it's added to the pool
      removeCallback: function(coin) {
        coin.scene.coinPool.add(coin);
      }
    });

    // pool
    this.coinPool = this.add.group({
      // once a platform is removed from the pool, it's added to the active platforms group
      removeCallback: function(coin) {
        coin.scene.coinGroup.add(coin);
      }
    });

    // number of consecutive jumps made by the player
    this.playerJumps = 0;

    // adding a platform to the game, the arguments are platform width and x position
    this.addPlatform(game.config.width, game.config.width / 2);
    this.addCoins(game.config.width, game.config.width / 2);

    // adding the player;
    this.player = this.physics.add.sprite(
      gameOptions.playerStartPosition,
      game.config.height / 2,
      "dude"
    );

    this.scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "16px",
      fill: "#000"
    });

    this.playerName = this.add.text(16, 32, `Name: ${this.name}`, {
      fontSize: "16px",
      fill: "#000"
    });

    this.player.setBounce(0.2);
    this.player.setGravityY(gameOptions.playerGravity);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    // setting collisions between the player and the platform group
    this.physics.add.collider(this.player, this.platformGroup);
    this.physics.add.collider(this.coinGroup, this.platformGroup);
    this.physics.add.overlap(
      this.player,
      this.coinGroup,
      this.collectStar,
      null,
      this
    );
  }

  // the core of the script: platform are added from the pool or created on the fly
  addPlatform(platformWidth, posX) {
    let platform;
    if (this.platformPool.getLength()) {
      platform = this.platformPool.getFirst();
      platform.x = posX;
      platform.active = true;
      platform.visible = true;
      this.platformPool.remove(platform);
    } else {
      platform = this.physics.add.sprite(
        posX,
        game.config.height * 0.8,
        "platform"
      );

      platform.setImmovable(true);
      platform.body.setAllowGravity(false);
      platform.setVelocityX(gameOptions.platformStartSpeed * -1);
      this.platformGroup.add(platform);
    }
    platform.displayWidth = platformWidth;
    this.nextPlatformDistance = Phaser.Math.Between(
      gameOptions.spawnRange[0],
      gameOptions.spawnRange[1]
    );
  }

  addCoins(platformWidth, posX) {
    let coin;
    if (this.coinPool.getLength()) {
      coin = this.coinPool.getFirst();
      coin.x = posX;
      coin.active = true;
      coin.visible = true;
      this.coinPool.remove(coin);
    } else {
      coin = this.physics.add.sprite(
        posX * 2,
        game.config.height * 0.7,
        "star"
      );
      console.log(coin);

      coin.setImmovable(true);
      coin.body.setAllowGravity(false);
      coin.setVelocityX(gameOptions.platformStartSpeed * -1);
      this.coinGroup.add(coin);
    }
    coin.displayWidth = 40;
    coin.displayHeight = 40;
    this.nextCoinDistance = Phaser.Math.Between(
      gameOptions.spawnRange[0],
      gameOptions.spawnRange[1]
    );
  }

  // the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
  jump() {
    if (
      this.player.body.touching.down ||
      (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps)
    ) {
      if (this.player.body.touching.down) {
        this.playerJumps = 0;
      }
      this.player.setVelocityY(gameOptions.jumpForce * -1);
      this.playerJumps++;
    }
  }
  update() {
    console.log(this.coins, "??????");
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-120);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(60);

      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-600);
    }
    // game over
    if (this.player.y > game.config.height) {
      this.music.pause();
      this.death.play();

      pushQuestion(this.i, game, true);

      // this.music.resume();
    }
    this.player.x = gameOptions.playerStartPosition;

    // recycling platforms
    let minDistance = game.config.width;
    this.platformGroup.getChildren().forEach(function(platform) {
      let platformDistance =
        game.config.width - platform.x - platform.displayWidth / 2;
      minDistance = Math.min(minDistance, platformDistance);
      if (platform.x < -platform.displayWidth / 2) {
        this.platformGroup.killAndHide(platform);
        this.platformGroup.remove(platform);
      }
    }, this);

    let minDistance2 = game.config.width;

    this.coinGroup.getChildren().forEach(function(coin) {
      let coinDistance = game.config.width - coin.x - coin.displayWidth / 2;
      minDistance2 = Math.min(minDistance2, coinDistance);
      if (coin.x < -coin.displayWidth / 2) {
        this.coinGroup.killAndHide(coin);
        this.coinGroup.remove(coin);
      }
    }, this);

    // adding new platforms
    if (minDistance > this.nextPlatformDistance) {
      var nextPlatformWidth = Phaser.Math.Between(
        gameOptions.platformSizeRange[0],
        gameOptions.platformSizeRange[1]
      );
      this.addPlatform(
        nextPlatformWidth,
        game.config.width + nextPlatformWidth / 2
      );
    }
    if (minDistance2 > this.nextCoinDistance) {
      var nextCoinWidth = Phaser.Math.Between(
        gameOptions.platformSizeRange[0],
        gameOptions.platformSizeRange[1]
      );
      this.addCoins(nextCoinWidth, game.config.width + nextCoinWidth / 2);
    }
  }
}
function resize() {
  let canvas = document.querySelector("canvas");
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;
  let windowRatio = windowWidth / windowHeight;
  let gameRatio = game.config.width / game.config.height;
  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + "px";
    canvas.style.height = windowWidth / gameRatio + "px";
  } else {
    canvas.style.width = windowHeight * gameRatio + "px";
    canvas.style.height = windowHeight + "px";
  }
}
