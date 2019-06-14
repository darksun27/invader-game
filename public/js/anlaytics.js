stuRef.on("value", snapShot => {
  const userData = snapShot.val();
  fillLeaderBoard(userData);
});

function fillLeaderBoard(userData) {
  let value = [];
  Object.keys(userData).map((userInfo, i) => {
    value.push(userData[userInfo]);
  });
  updateLeaderBoard(value);
}

function updateLeaderBoard(info) {
  let newInfo = [...info].sort((a, b) => b.coins - a.coins);
  console.log(newInfo);

  newInfo.map(elem => {
    if (document.querySelector(`#${elem.id}`) !== null) {
      let value = document.querySelector(`#${elem.id}`);
      value.innerHTML = `${elem.name} :  ${elem.coins}`;
      value.accessKey = Number(elem.coins);
    } else {
      let outer = document.querySelector(".card-body");
      let div = document.createElement("div");
      div.id = elem.id;
      div.className = "result";
      div.innerHTML = `${elem.name} :  ${elem.coins}`;
      div.accessKey = Number(elem.coins);

      outer.appendChild(div);
    }
  });

  sortMe();
}

function sortMe() {
  var list = document.querySelector(".card-body");

  var items = list.childNodes;
  var itemsArr = [];
  for (var i in items) {
    if (items[i].nodeType == 1) {
      // get rid of the whitespace text nodes
      itemsArr.push(items[i]);
    }
  }

  itemsArr.sort(function(a, b) {
    return b.accessKey - a.accessKey;
  });

  for (i = 0; i < itemsArr.length; ++i) {
    list.appendChild(itemsArr[i]);
  }
}
