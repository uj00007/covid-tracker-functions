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
  // const userToken = req.query.token;
  const userId = req.query.id;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  const snapshot = await admin.database().ref("/users");
  console.log(snapshot);
  const value = await snapshot.once("value").then((dataSnapshot) => {
    // handle read data.
    console.log(dataSnapshot);
    return dataSnapshot;
  });
  console.log(value.val());
  const users = value.val();
  let adminusertokens = [];
  let user = users[userId];
  let superadminusertokens = [];

  for (let i of users) {
    if (
      i["is_admin"] &&
      i["group_code"] &&
      user["group_code"] &&
      i["group_code"] === user["group_code"]
    ) {
      adminusertokens.push(i["token"]);
    }
    if (i["is_admin"] && i["is_super_admin"]) {
      superadminusertokens.push(i["token"]);
    }
  }

  //   console.log(snapshot.once('value').then);

  //   return snapshot.once("value").then((snapshot) => {
  //     console.log(snapshot.val);
  //     return snapshot;
  //   });
  // Notification details.
  console.log(user["name"]);
  console.log(user["token"]);
  console.log(adminusertokens);

  let username = user["name"] ? user["name"] : "user";
  let grpcode = user["group_code"] ? user["group_code"] : "";
  const payloadForAdmin = {
    notification: {
      title: "Alert!!!",
      body: `User ${username} is in a hotspot zone..!!`,
      sound: "soundtone_notification.mp3",
      android_channel_id: "1",
    },
  };
  const payloadForSuperAdmin = {
    notification: {
      title: "Alert!!!",
      body: `User ${username} of group ${grpcode} is in a hotspot zone..!!`,
      sound: "soundtone_notification.mp3",
      android_channel_id: "1",
    },
  };
  const payloadForUser = {
    notification: {
      title: "Alert!!!",
      body: `You are in a hotspot zone..!!`,
      sound: "soundtone_notification.mp3",
      android_channel_id: "1",
    },
  };
  const response2 = await admin
    .messaging()
    .sendToDevice(user["token"], payloadForUser);

  if (adminusertokens && adminusertokens.length > 0) {
    console.log("gothere in admin");
    const response = await admin
      .messaging()
      .sendToDevice(adminusertokens, payloadForAdmin);
  }

  const response3 = await admin
    .messaging()
    .sendToDevice(adminusertokens, payloadForAdmin);

  // const response4 = await admin
  //   .messaging()
  //   .sendToDevice(superadminusertokens, payloadForSuperAdmin);

  // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  //   res.redirect(303, snapshot.ref.toString());
  res.json(value.toJSON());
});

exports.sendNotificationToAll = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  // const userToken = req.query.token;
  const text = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  const snapshot = await admin.database().ref("/users");
  console.log(snapshot);
  const value = await snapshot.once("value").then((dataSnapshot) => {
    // handle read data.
    console.log(dataSnapshot);
    return dataSnapshot;
  });
  console.log(value.val());
  const users = value.val();
  let usertokens = [];

  for (let i of users) {
    if (i["token"]) {
      usertokens.push(i["token"]);
    }
  }

  //   console.log(snapshot.once('value').then);

  //   return snapshot.once("value").then((snapshot) => {
  //     console.log(snapshot.val);
  //     return snapshot;
  //   });
  // Notification details.
  // console.log(user["name"]);
  // console.log(user["token"]);
  // console.log(adminusertokens);

  const payloadForUser = {
    notification: {
      title: "Alert!!!",
      body: `${text}`,
      sound: "soundtone_notification.mp3",
      android_channel_id: "1",
    },
  };
  const response2 = await admin
    .messaging()
    .sendToDevice(usertokens, payloadForUser);

  // if (adminusertokens && adminusertokens.length > 0) {
  //   console.log("gothere in admin");
  //   const response = await admin
  //     .messaging()
  //     .sendToDevice(adminusertokens, payloadForAdmin);
  // }

  // const response3 = await admin
  //   .messaging()
  //   .sendToDevice(adminusertokens, payloadForAdmin);

  // const response4 = await admin
  //   .messaging()
  //   .sendToDevice(superadminusertokens, payloadForSuperAdmin);

  // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  //   res.redirect(303, snapshot.ref.toString());
  res.json(value.toJSON());
});

exports.updateLocation = functions.https.onRequest(async (req, res) => {
  // location object would contain lat long, updated and user id (email) from shared preference basically
  const location = req.body;

  //after that .. we need to get the hotspots list from db, search for nearest hotspots , calculate the distance , if alert is there then...
  //update that user object's is safe param to false..
  /// send notification to user..
  //send notification to admin..
  console.log(location);
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  // const snapshot = await admin.database().ref("/hotspots");
  // console.log(snapshot);
  // const value = await snapshot.once("value").then((dataSnapshot) => {
  //   // handle read data.
  //   console.log(dataSnapshot);
  //   return dataSnapshot;
  // });
  // console.log(value.val());
  res.send("Location updated successfully");
});
