// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAjZndEPjdJVSrpLl_IPeJrNpkLVco7Vok",
  authDomain: "agroai-c0e2a.firebaseapp.com",
  databaseURL: "https://agroai-c0e2a-default-rtdb.firebaseio.com",
  projectId: "agroai-c0e2a",
  storageBucket: "agroai-c0e2a.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);

// ✅ Make `db` accessible globally for other JS files
window.db = firebase.database();
