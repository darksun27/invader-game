(function() {
  const config = {
    apiKey: "AIzaSyCW0wlcUs2uUsJ4_00sDlnP2eI9p_pN5EY",
    authDomain: "jumper123-68e9a.firebaseapp.com",
    databaseURL: "https://jumper123-68e9a.firebaseio.com",
    projectId: "jumper123-68e9a"
  };

  firebase.initializeApp(config);
  saveData();
})();

const stuRef = firebase.database();

function saveData() {
  stuRef.ref().child("student");
  stuRef.push({ hello: "lolololoo" });
}
