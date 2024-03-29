class PreLoadScene extends Phaser.Scene {
  constructor() {
    super("Preload");
  }

  init(data) {
    this.coins = data["data"].coins || 0;
    this.name = data["data"].name;
    this.i = 0;
    this.id = data["data"].id;
    this.currentGain = 0;
  }

  preload() {
    this.load.image("platform", "assets/platform1.png");
    this.load.image("star", "assets/coin.png");
    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48
    });
  }

  create() {
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

    game.scene.start("PlayGame", {
      data: {
        name: this.name,
        coins: this.coins,
        id: this.id,
        currentGain: this.currentGain
      }
    });
  }
}
