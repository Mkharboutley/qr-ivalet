
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const notifyClientWhenReady = functions.firestore
  .document('tickets/{ticketId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status !== 'assigned' && after.status === 'assigned') {
      console.log(`Notify client that ticket ${context.params.ticketId} is ready.`);
    }
    return null;
  });

export const expireUnscannedTickets = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async () => {
    const snapshot = await db.collection('tickets').where('status', '==', 'assigned').get();
    const now = admin.firestore.Timestamp.now();
    const batch = db.batch();

    snapshot.forEach(doc => {
      const assignedAt = doc.data().assignedAt;
      if (assignedAt && now.seconds - assignedAt.seconds > 300) {
        batch.update(doc.ref, { status: 'expired', expiredAt: now });
      }
    });

    await batch.commit();
    console.log('Expired unscanned tickets checked.');
    return null;
  });

export const assignTicketToWorker = functions.https.onCall(async (data, context) => {
  const { ticketId, workerId } = data;
  const ref = db.collection('tickets').doc(ticketId);
  await ref.update({ assignedWorker: workerId, status: 'assigned', assignedAt: admin.firestore.Timestamp.now() });
  return { success: true };
});

export const completeTicket = functions.https.onCall(async (data, context) => {
  const { ticketId } = data;
  const ref = db.collection('tickets').doc(ticketId);
  await ref.update({ status: 'completed', completedAt: admin.firestore.Timestamp.now() });
  return { success: true };
});

export const cancelTicket = functions.https.onCall(async (data, context) => {
  const { ticketId } = data;
  const ref = db.collection('tickets').doc(ticketId);
  await ref.update({ status: 'cancelled', cancelledAt: admin.firestore.Timestamp.now() });
  return { success: true };
});
