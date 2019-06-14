function nameRegister() {
  let nickname = document.querySelector("#name").value;
  if (nickname === "") {
    alert("please Enter your nick name below and compete with other :)");
  } else {
    stuRef.push({ player: { name: nickname, coins: 0 } });
  }

  $("#firebase").modal("toggle");
  game.scene.start("PlayGame");
}
