let optionSelect = [];

function isOptionSelect() {
  return optionSelect.length !== 0;
}

let question = null;
let isDeadPlayer = null;

function pushQuestion(i, game, isDead) {
  game.scene.getScene("PlayGame").i += 1;

  game.scene.pause("PlayGame");
  isDeadPlayer = isDead;

  $("#myModal").modal({ backdrop: "static", keyboard: true });

  question = questionData[i];

  // game.scene.start("PlayGame");

  const questionNo = document.getElementById("questionNo");
  questionNo.innerHTML = isDead
    ? `<div style={"background":"#000", "color":"#fff"}><b>Oops! You died. Answer this question to respawn</b></div>`
    : `<div><b>Haha! Answer this question to move ahead :) </b></div>`;
  const questions = document.getElementById("question");
  questions.innerHTML = `<div>${question.question}</div>`;

  const option = document.getElementById("option-btn");

  const p = question.option.map((e, id) => {
    return `<div id=${id} onClick="check(${id},${
      question.correctoption
    })" class="btn btn-info btn-block">${e}</div>`;
  });

  option.innerHTML = p.join(" ");
}

function check(e, option, callback) {
  const element = document.getElementById(e);
  element.classList.remove("btn-info");
  element.classList.add("btn-primary");
  if (optionSelect.length === 0) {
    optionSelect.push(e);
  } else {
    const elementToRemove = document.getElementById(optionSelect[0]);
    elementToRemove.classList.remove("btn-primary");
    elementToRemove.classList.add("btn-info");
    optionSelect.pop();
    optionSelect.push(e);
  }
}

// async function resumeGame(coins, isNotDead, currentGain) {
//   let updateCoin = isNotDead ? coins - 10 : coins + 50;
//   let updateCurrentGain = isNotDead ? currentGain - 10 : currentGain + 50;

//   game.scene.getScene("PlayGame").coins = updateCoin;
//   game.scene.getScene("PlayGame").currentGain = updateCurrentGain;

//   game.scene.getScene("PlayGame").scoreText.setText("Score:" + updateCoin);
// }

// function overGame() {
//   game.scene.stop("PlayGame");
//   game.scene.start("GameOver", { coins: coins });
// }

async function sumbit() {
  //   game.scene.getScene("PlayGame").i = +1;

  const selectOption = optionSelect[0];
  if (selectOption != undefined) {
    const coins = game.scene.getScene("PlayGame").coins;

    optionSelect = [];

    $("#myModal").modal("toggle");
    if (selectOption === question.correctoption) {
      //game should be resumed this need to handled
      if (isDeadPlayer) {
        game.scene.getScene("PlayGame").player.y = game.config.height / 2;
        game.scene.resume("PlayGame");
      } else {
        game.scene.resume("PlayGame");
      }
    } else {
      if (!isDeadPlayer) {
        game.scene.resume("PlayGame");
      } else {
        //u die
        game.scene.start("GameOver", {
          coins: coins
        });
      }
    }
  } else {
    window.alert("Please select a option");
  }
}
