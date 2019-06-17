let optionSelect = [];
console.log(questionData);
function isOptionSelect() {
  return optionSelect.length !== 0;
}

let question = null;
let isDeadPlayer = null;

function pushQuestion(i, game, isDead, array) {
  game.scene.getScene("PlayGame").i += 1;
  game.scene.pause("PlayGame");
  isDeadPlayer = isDead;
  $("#myModal").modal({ backdrop: "static", keyboard: true });

  const index = array[i];

  question = questionData[index - 1];

  const questionNo = document.getElementById("questionNo");
  questionNo.innerHTML = isDead
    ? `<div><b>Oops! Yoou died . Answer the question to respawn<b></div>`
    : `<div><b>Haha! Answer this question to move ahead :)</b></div>`;
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

async function resumeGame(coins, isNotDead, currentGain) {
  let updateCoin = isNotDead ? coins : coins + 50;
  let updateCurrentGain = isNotDead ? currentGain : currentGain + 50;

  game.scene.getScene("PlayGame").coins = updateCoin;
  game.scene.getScene("PlayGame").currentGain = updateCurrentGain;
  const name = game.scene.getScene("PlayGame").name;
  const id = game.scene.getScene("PlayGame").id;
  const userRef = stuRef.ref;
  await userRef.child(id).ref.update({ coins: updateCoin, id, name });

  game.scene.getScene("PlayGame").scoreText.setText("Earnings: " + updateCoin);
  game.scene.resume("PlayGame");
}

async function sumbit() {
  const selectOption = optionSelect[0];
  if (selectOption != undefined) {
    const coins = game.scene.getScene("PlayGame").coins;
    const currentGain = game.scene.getScene("PlayGame").currentGain;

    optionSelect = [];

    $("#myModal").modal("toggle");
    if (selectOption === question.correctoption) {
      //game should be resumed this need to handled
      if (isDeadPlayer) {
        game.scene.getScene("PlayGame").player.y = game.config.height / 2;
        resumeGame(coins, isDeadPlayer, currentGain);
      } else {
        resumeGame(coins, isDeadPlayer, currentGain);
      }
    } else {
      if (!isDeadPlayer) {
        resumeGame(coins, !isDeadPlayer, currentGain);
      } else {
        //u die
        game.scene.stop("PlayGame");
        game.scene.start("GameOver", {
          coins: coins,
          currentGain: currentGain,
          text: "YOU DIED, GAME OVER"
        });
      }
    }
  } else {
    window.alert("Please select a option");
  }
}
