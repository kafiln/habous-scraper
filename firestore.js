const prayers = require("./remain.json"); // length = 41358
// const serviceAccount = require("./key.json");
const { db } = require("./config");
const fs = require("fs");

const firestoreService = require("firestore-export-import");
const databaseURL = "https://salat-1234.firebaseio.com";

db.collection("prayers")
  .get()
  .then((res) => console.log(res.docs.length))
  .catch((err) => console.log(err));

// JSON To Firestore
// const jsonToFirestore = async () => {
//   try {
//     console.log("Initialzing Firebase");
//     await firestoreService.initializeApp(serviceAccount, databaseURL);
//     console.log("Firebase Initialized");

//     await firestoreService.restore(prayers);
//   } catch (error) {
//     console.log(error.message);
//   } finally {
//     console.log("Upload done");
//   }
// };

// jsonToFirestore();
