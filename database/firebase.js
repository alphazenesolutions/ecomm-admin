import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBamHQtt1bmB0OePa6t466XyXGOGh9iStc",
  authDomain: "ecom-dc9f8.firebaseapp.com",
  projectId: "ecom-dc9f8",
  storageBucket: "ecom-dc9f8.appspot.com",
  messagingSenderId: "139982223720",
  appId: "1:139982223720:web:f597e07626449f62e93edd"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}else {
  firebase.app(); // if already initialized, use that one
}
export { firebase };