import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

const firestore = admin.firestore();

export const dayStartBatch = functions.pubsub
  .schedule('every day 00:00')
  .timeZone('Asia/Tokyo')
  .onRun((context) => {
    const taskRef = firestore.collection('tasks');

    taskRef
      .where('isTemporary', '==', true)
      .get()
      .then((snapshot) => {
        snapshot.forEach((document) => {
          document.ref.delete();
        });
      });

    taskRef
      .where('isDone', '==', true)
      .get()
      .then((snapshot) => {
        snapshot.forEach((document) => {
          document.ref.update({ isDone: false });
        });
      });
  });
