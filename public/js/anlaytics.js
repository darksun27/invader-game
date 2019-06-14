stuRef.on("value", snapshot => {
  //   const userData = snapShot.val();
  snapshot.forEach(function(userSnapshot) {
    if (document.querySelector(`#${userSnapshot.key}`) !== null) {
      let value = document.querySelector(`#${userSnapshot.key}`);
      value.innerHTML = `${userSnapshot.val().name} :  ${
        userSnapshot.val().coins
      }`;
    } else {
      let outer = document.querySelector(".card-body");
      let div = document.createElement("div");
      div.id = userSnapshot.key;
      div.innerHTML = `${userSnapshot.val().name} :  ${
        userSnapshot.val().coins
      }`;
      console.log(div);
      outer.appendChild(div);
    }
  });
  //   fillLeaderBoard(userData);
});

// function fillLeaderBoard(userData) {
//   let value = [];
//   Object.keys(userData).map((userInfo, i) => {
//     value.push(userData[userInfo]);
//   });
//   updateLeaderBoard(value);
// }

// function updateLeaderBoard(info) {
//   let newInfo = [...info].sort((a, b) => b.coins - a.coins);
//   console.log(newInfo);
//   let cardBody = document.querySelector(".data") || { id: null };
//   let outer = document.querySelector(".card-body");
//   let data = null;
//   newInfo.map(elem => {
//     data = document.createElement("div");
//     data.className = "data";
//     if (cardBody.id === elem.id) {
//       console.log("adasasdasdsadsdasdas");
//       data.innerHTML = `${elem.name}: ${elem.coins}`;
//     } else {
//       data.id = elem.id;
//       outer.appendChild(data);
//       data.innerHTML = `${elem.name} :  ${elem.coins}`;
//     }
//   });
// }
