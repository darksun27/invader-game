var game;

const nums = new Set();
while (nums.size !== questionData.length) {
  nums.add(Math.floor(Math.random() * questionData.length) + 1);
}

const array = [...nums];
console.log(array);

// global game options
let gameOptions = {
  platformStartSpeed: 300,
  spawnRange: [100, 200],
  platformSizeRange: [200, 400],
  playerGravity: 900,
  jumpForce: 400,
  playerStartPosition: 200,
  jumps: 2
};

window.onload = function() {
  let gameConfig = {
    // object containing configuration options
    type: Phaser.AUTO,
    width: 960,
    height: window.innerHeight * 0.8,
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

class Register extends Phaser.Scene {
  constructor() {
    super("register");
  }
  init() {
    this.register = this.registerName;
  }

  preload() {
    // this.load.atlas("gems", "assets/gems.png", "assets/gems.json");
    this.load.path = "assets/";

    this.load.image("cat1", "cat1.png");
    this.load.image("cat2", "cat2.png");
    this.load.image("cat3", "cat3.png");
    this.load.image("cat4", "cat4.png");
  }
  create() {
    this.anims.create({
      key: "snooze",
      frames: [
        { key: "cat1" },
        { key: "cat2" },
        { key: "cat3" },
        { key: "cat4", duration: 50 }
      ],
      frameRate: 8,
      repeat: -1
    });

    this.add
      .sprite(450, 150, "cat1")
      .setScale(3)
      .play("snooze");
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
    this.load.image("sky", "assets/sky.png");
    this.load.image("robo", "assets/case.jpg");
    this.load.atlas("gems", "assets/gems.png", "assets/gems.json");
  }

  create() {
    let image = this.add.image(600, 300, "sky");
    let robo = this.add.image(600, 300, "robo");

    image.setScale(2).setScrollFactor(0);
    robo.setScale(2).setScrollFactor(0);
    robo.setAlpha(0.1);
    this.add.text(100, 100, this.data.text, {
      fontSize: "64px",
      fill: "#000",
      fontFamily: 'Verdana, "Times New Roman", Tahoma, serif'
    });

    let currentGain = game.scene.getScene("PlayGame").currentGain;
    if (currentGain >= 0) {
      this.sign = "+";
    } else {
      this.sign = "";
    }
    this.clickButton = this.add
      .text(400, 450, "Play Again", {
        fontSize: "30px",
        fill: "#000",
        stroke: "#fff",
        strokeThickness: 12,
        shadow: {
          offsetX: 0,
          offsetY: 0,
          color: "#000",
          blur: 0,
          stroke: false,
          fill: false
        }
      })
      .setInteractive()
      .on("pointerdown", () => {
        game.scene.stop("GameOver");

        game.scene.start("PlayGame", {
          data: {
            name: game.scene.getScene("PlayGame").name,
            coins: game.scene.getScene("PlayGame").coins,
            id: game.scene.getScene("PlayGame").id,
            currentGain: 0
          }
        });
      });

    this.add.text(400, 200, `${this.sign}${currentGain} Coins earned`, {
      fontSize: "20px",
      fill: "#000",
      fontFamily: 'Verdana, "Times New Roman", Tahoma, serif'
    });

    this.add.text(360, 250, `Total score =  ${this.data.coins} coins`, {
      fontSize: "20px",
      fill: "#000",
      fontFamily: 'Verdana, "Times New Roman", Tahoma, serif'
    });
    this.anims.create({
      key: "everything",
      frames: this.anims.generateFrameNames("gems"),
      repeat: -1
    });

    this.add
      .sprite(490, 320, "gems")
      .setScale(1)
      .play("everything");
  }
}

// playGame scene
class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }

  init(data) {
    this.coins = data["data"].coins || 0;
    this.name = data["data"].name;
    this.i = 0;
    this.id = data["data"].id;
    this.currentGain = 0;
  }

  preload() {
    this.load.image("platform", "assets/platform.png");
    this.load.image("star", "assets/coin.png");
    this.load.image("sky", "assets/sky.png");
    this.load.image("player", "assets/player.png");
    this.load.image("ques", "assets/question.png");
    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48
    });
    this.load.audio("theme", "assets/sound/startSound.mp3");
    this.load.audio("death", "assets/sound/explode1.mp3");
    this.load.audio("starmusic", "assets/sound/p-ping.mp3");
  }

  async collectStar(player, star) {
    star.disableBody(true, true);
    this.coins += 5;
    console.log(this.coins);
    this.currentGain += 5;
    const userRef = stuRef.ref;
    this.scoreText.setText("Earnings: " + this.coins);
    this.starmusic.play();
    await userRef
      .child(this.id)
      .ref.update({ coins: this.coins, id: this.id, name: this.name });
  }

  collectQues(player, ques) {
    ques.disableBody(true, true);
    pushQuestion(this.i, game, false, array);
  }

  create() {
    this.music = this.sound.add("theme");
    this.death = this.sound.add("death");
    this.starmusic = this.sound.add("starmusic");
    this.music.play();
    let image = this.add.image(400, 300, "sky");

    let scaleX = this.cameras.main.width / image.width;
    let scaleY = this.cameras.main.height / image.height;
    let scale = Math.max(scaleX, scaleY);
    image.setScale(4).setScrollFactor(0);
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

    // group with all active platforms.
    this.quesGroup = this.add.group({
      // once a platform is removed, it's added to the pool
      removeCallback: function(ques) {
        ques.scene.quesPool.add(ques);
      }
    });

    // pool
    this.quesPool = this.add.group({
      // once a platform is removed from the pool, it's added to the active platforms group
      removeCallback: function(ques) {
        ques.scene.quesGroup.add(ques);
      }
    });

    // number of consecutive jumps made by the player
    this.playerJumps = 0;

    // adding a platform to the game, the arguments are platform width and x position
    this.addPlatform(game.config.width, game.config.width / 2);
    this.addCoins(game.config.width, game.config.width / 2);
    this.addQues(game.config.width, game.config.width / 2);

    // adding the player;
    this.player = this.physics.add.sprite(
      gameOptions.playerStartPosition,
      game.config.height / 2,
      "dude"
    );

    this.staticCoin = this.physics.add.sprite(920, 50, "star");
    this.staticCoin.body.setAllowGravity(false);
    this.staticCoin.displayWidth = 40;
    this.staticCoin.displayHeight = 40;
    this.scoreText = this.add.text(630, 32, `Earnings: ${this.coins}`, {
      fontSize: "30px",
      fill: "#000",
      stroke: "#fff",
      strokeThickness: 12,
      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: "#000",
        blur: 0,
        stroke: false,
        fill: false
      }
    });

    this.playerName = this.add.text(16, 32, `Player: ${this.name}`, {
      fontSize: "30px",
      fill: "#000",
      stroke: "#fff",
      strokeThickness: 12,
      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: "#000",
        blur: 0,
        stroke: false,
        fill: false
      }
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
    this.physics.add.collider(this.quesGroup, this.platformGroup);
    this.physics.add.overlap(
      this.player,
      this.coinGroup,
      this.collectStar,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.quesGroup,
      this.collectQues,
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
        posX - 20,
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
      coin = this.physics.add.sprite(posX, game.config.height * 0.7, "star");

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

  addQues(platformWidth, posX) {
    let ques;
    if (this.quesPool.getLength()) {
      ques = this.quesPool.getFirst();
      ques.x = posX;
      ques.active = true;
      ques.visible = true;
      this.quesPool.remove(ques);
    } else {
      ques = this.physics.add.sprite(
        posX * 2,
        game.config.height * 0.7,
        "ques"
      );

      ques.setImmovable(true);
      ques.body.setAllowGravity(false);
      ques.setVelocityX(gameOptions.platformStartSpeed * -1);
      this.quesGroup.add(ques);
    }
    ques.displayWidth = 40;
    ques.displayHeight = 40;
    this.nextQuesDistance = Phaser.Math.Between(
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
    if (this.i > questionData.length - 1) {
      game.scene.stop("PlayGame");

      game.scene.start("GameOver", {
        coins: this.coins,
        currentGain: this.currentGain,
        text: "YOU PLAYED WELL, HURAY"
      });
    }
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

    if (this.cursors.space.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-600);
    }
    // game over
    if (this.player.y > game.config.height) {
      this.music.pause();
      this.death.play();

      pushQuestion(this.i, game, true, array);

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

    this.quesGroup.getChildren().forEach(function(ques) {
      let quesDistance = game.config.width - ques.x - ques.displayWidth / 2;
      minDistance2 = Math.min(minDistance2, quesDistance);
      if (ques.x < -ques.displayWidth / 2) {
        this.quesGroup.killAndHide(ques);
        this.quesGroup.remove(ques);
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

    if (minDistance2 > this.nextQuesDistance) {
      var nextQuesWidth = Phaser.Math.Between(
        gameOptions.platformSizeRange[0],
        gameOptions.platformSizeRange[1]
      );
      this.addQues(nextQuesWidth, game.config.width + nextQuesWidth / 2);
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
