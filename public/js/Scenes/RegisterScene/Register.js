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
