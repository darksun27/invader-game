var game;

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
    type: Phaser.AUTO,
    width: 960,
    height: window.innerHeight * 0.8,
    scene: [Register, PreLoadScene, PlayGame, GameOverScene],
    backgroundColor: 0x444444,
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
