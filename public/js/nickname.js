async function nameRegister() {
  $("#firebase").modal({ backdrop: "static", keyboard: true });

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

    if (res != null) {
      const user = Object.values(res);
      const userIndex = user.findIndex(e => e.name === nickname);
      if (userIndex === -1) {
        // new user is created when the name is not in the db
        const key = stuRef.push().key;
        stuRef.child(key).set({
          name: nickname,
          coins: 0,
          id: key
        });
        $("#firebase").modal("toggle");
        game.scene.start("PlayGame", {
          data: { name: nickname, coins: 0, id: key }
        });
      } else {
        //retreive the data from the user and started the game
        $("#firebase").modal("toggle");
        const data = user[userIndex];
        game.scene.start("PlayGame", { data });
      }
    } else {
      const key = stuRef.push().key;
      stuRef.child(key).set({
        name: nickname,
        coins: 0,
        id: key
      });
      $("#firebase").modal("toggle");
      game.scene.start("PlayGame", {
        data: { name: nickname, coins: 0, id: key }
      });
    }
  }
}
