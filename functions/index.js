const functions = require("firebase-functions");

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require("firebase-admin");
admin.initializeApp();
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  const snapshot = await admin
    .database()
    .ref("/messages")
    .push({ original: original });
  // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  res.redirect(303, snapshot.ref.toString());
});

exports.sendNotification = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  // const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  const snapshot = await admin.database().ref("/hotspots");
  console.log(snapshot);
  const value = await snapshot.once("value").then((dataSnapshot) => {
    // handle read data.
    console.log(dataSnapshot);
    return dataSnapshot;
  });
  console.log(value.val());
  res.json(value.toJSON());
  //   console.log(snapshot.once('value').then);

  //   return snapshot.once("value").then((snapshot) => {
  //     console.log(snapshot.val);
  //     return snapshot;
  //   });
  // Notification details.
  //   const payload = {
  //     notification: {
  //       title: "You have a new follower!",
  //       body: `${follower.displayName} is now following you.`,
  //       icon: follower.photoURL,
  //     },
  //   };

  //   const response = await admin.messaging().sendToDevice(tokens, payload);

  // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  //   res.redirect(303, snapshot.ref.toString());
});
