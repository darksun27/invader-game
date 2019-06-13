function pushQuestion(i, game, callback) {
  console.log(question);
  console.log(i, question[i]);
  console.log("push queston");

  $("#myModal").modal({
    keyboard: false
  });

  const questionNo = document.getElementById("questionNo");
  questionNo.innerHTML = `<div>Question ${i}</div>`;
  const questions = document.getElementById("question");
  questions.innerHTML = `<div>${question[i].question}</div>`;

  const option = document.getElementById("option-btn");

  const p = question[i].option.map((e, id) => {
    return `<div id=${id} onClick="check(${id},${
      question[i].correctoption
    })" class="btn btn-primary btn-block">${e}</div>`;
  });

  option.innerHTML = p.join(" ");
}

function check(e, option) {
  console.log(e === option);
}
