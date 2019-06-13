function pushQuestion(i, game) {
  game.scene.pause("PlayGame");

  $("#myModal").modal({
    keyboard: false
  });

  const question = questionData[i];

  // game.scene.start("PlayGame");

  const questionNo = document.getElementById("questionNo");
  questionNo.innerHTML = `<div>Question ${i + 1}</div>`;
  const questions = document.getElementById("question");
  questions.innerHTML = `<div>${question.question}</div>`;

  const option = document.getElementById("option-btn");

  const p = question.option.map((e, id) => {
    return `<div id=${id} onClick="check(${id},${
      question.correctoption
    })" class="btn btn-primary btn-block">${e}</div>`;
  });

  option.innerHTML = p.join(" ");

  //   setTimeout(() => {
  //     callback(true);
  //   }, 1000);
}

function check(e, option, callback) {
  const element = document.getElementById(e);
  if (e === option) {
    element.classList.add("btn-success");
  } else {
    element.classList.add("btn-danger");
  }
}
