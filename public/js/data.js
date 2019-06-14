const optionSelect = [];
function isOptionSelect() {
  return optionSelect.length !== 0;
}
let question = null;
let isDeadPlayer = null;

function pushQuestion(i, game, isDead) {
  game.scene.pause("PlayGame");
  isDeadPlayer = isDead;

  $("#myModal").modal({
    keyboard: false
  });

  question = questionData[i];

  // game.scene.start("PlayGame");

  const questionNo = document.getElementById("questionNo");
  questionNo.innerHTML = `<div>Now you died answer the question to respan</div>`;
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

async function sumbit() {
  const selectOption = optionSelect[0];
  const userRef = stuRef.ref;
  const name = game.scene.getScene("PlayGame").name;
  const coins = game.scene.getScene("PlayGame").coins;
  const id = game.scene.getScene("PlayGame").id;

  await userRef.child(id).ref.update({ coins, id, name });

  if (selectOption === question.correctoption) {
    //game should be resumed this need to handled
    const coins = game.scene.getScene("PlayGame").coins;

    if (isDeadPlayer) {
      game.scene.getScene("PlayGame").player.y = game.config.height / 2;
      game.scene.resume("PlayGame", { coins, coins });
    } else {
      game.scene.resume("PlayGame", { coins, coins });
    }
  } else {
    //u die
    const coins = game.scene.getScene("PlayGame").coins;
    game.scene.start("GameOver", { coins: coins });
  }
}
