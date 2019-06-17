let question = null;
let isDeadPlayer = null;
let yourAnswer = null;
let answerState = {};

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
  question.option.map((answer, id) => {
    let div = document.createElement("div");
    div.textContent = answer;
    option.appendChild(div);
    div.id = id;
    div.className = "btn btn-info btn-block options";
    div.onclick = optionClicked(div.id);
  });

  document
    .getElementById("myModal")
    .addEventListener("keypress", e => checkAnswer(e));
}

//option buttons event
function optionClicked(id) {
  let nodeId = document.getElementById(`${id}`);
  nodeId.addEventListener("mousedown", () => {
    answerState["yourAnswer"] = id;
  });
}

//check key code to submit answer (enter button)
function checkAnswer(e) {
  if (e.keyCode === 13) {
    sumbit(answerState.yourAnswer);
    answerState = {};
  }
}

//resume the paused game after ques is answered
async function resumeGame(coins, currentGain, correct) {
  let updateCoin = 0;
  let updateCurrentGain = 0;
  if (correct) {
    updateCoin = coins + 50;
    updateCurrentGain = currentGain + 50;
  } else {
    currentGain = currentGain;
    updateCoin = coins;
  }

  game.scene.getScene("PlayGame").coins = updateCoin;
  game.scene.getScene("PlayGame").currentGain = updateCurrentGain;
  const name = game.scene.getScene("PlayGame").name;
  const id = game.scene.getScene("PlayGame").id;
  const userRef = stuRef.ref;
  await userRef.child(id).ref.update({ coins: updateCoin, id, name });
  game.scene.getScene("PlayGame").scoreText.setText("Earnings: " + updateCoin);
  game.scene.resume("PlayGame");
}

//submit the answer choosen
async function sumbit(selectOption) {
  if (selectOption !== undefined) {
    const coins = game.scene.getScene("PlayGame").coins;
    const currentGain = game.scene.getScene("PlayGame").currentGain;

    optionSelect = [];

    question.option.map((_, id) => {
      let divRemove = document.getElementById(id);
      divRemove.parentNode.removeChild(divRemove);
    });

    $("#myModal").modal("toggle");

    if (Number(selectOption) === question.correctoption) {
      if (isDeadPlayer) {
        game.scene.getScene("PlayGame").player.y = game.config.height / 2;
        resumeGame(coins, currentGain, true);
      } else {
        resumeGame(coins, currentGain, true);
      }
    } else {
      if (!isDeadPlayer) {
        resumeGame(coins, currentGain, false);
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
