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
