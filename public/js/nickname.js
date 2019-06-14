async function nameRegister() {
  let nickname = document.querySelector("#name").value;
  if (nickname === "") {
    alert("please Enter your nick name below and compete with other :)");
  } else {
    // retrieve the game when the user is not in the db

    const users = new Promise((resolve, reject) => {
      stuRef.on("value", function(snapshot) {
        const val = snapshot.val();
        resolve(val);
      });
    });

    const res = await users;

    const user = Object.values(res);
    const userIndex = user.findIndex(e => e.player.name === nickname);
    if (userIndex === -1) {
      // new user is created when the name is not in the db
      const key = stuRef.push().key;
      stuRef.child(key).set({
        playerName: nickname,
        coins: 0
      });
      $("#firebase").modal("toggle");
      game.scene.start("PlayGame");
    } else {
      //retreive the data from the user and started the game
      $("#firebase").modal("toggle");
      const data = user[userIndex].player;
      game.scene.start("PlayGame", { data });
    }
  }
}
