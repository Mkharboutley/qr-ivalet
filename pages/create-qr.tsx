import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  getFirestore,
  collection,
  doc,
  runTransaction,
  Timestamp
} from 'firebase/firestore';
import { useFirebaseApp } from 'reactfire';
import { QRCodeCanvas } from 'qrcode.react';
import styles from '@/styles/create.module.css';

export default function CreateQR() {
  const app = useFirebaseApp();
  const db = getFirestore(app);
  const router = useRouter();

  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [ticketUrl, setTicketUrl] = useState('');
  const [ticketNumber, setTicketNumber] = useState<number | null>(null);
  const [createdAt, setCreatedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  const fieldsFrozen = ticketNumber !== null;

  const handleCreate = async () => {
    if (!plate || !model) return;
    setLoading(true);

    const counterRef = doc(db, 'counters', 'tickets');
    const ticketRef = collection(db, 'tickets');

    await runTransaction(db, async (transaction) => {
      const counterSnap = await transaction.get(counterRef);
      const last = counterSnap.exists() ? counterSnap.data().last_number : 0;
      const next = last + 1;
      transaction.set(counterRef, { last_number: next });

      const docRef = doc(ticketRef); // generates a new document reference

      const newDoc = doc(ticketRef);
      const url = `https://qr-ivalet.web.app/clients/${next.toString().padStart(4, '0')}`;
      const timestamp = Timestamp.now();

      transaction.set(docRef, {
        ticket_number: next,
        plate_number: plate,
        car_model: model,
        status: 'new',
        requestedAt: Timestamp.now(), // ✅ This line enables dashboard visibility
        ticket_url: url,
        created_at: Timestamp.now(),
      });

      setTicketNumber(next);
      setTicketUrl(url);
      setCreatedAt(timestamp.toDate());
    });

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar} onClick={() => router.back()}>
        <img src="/icons/back.svg" alt="Back" width="28" height="28" />
      </div>

      <div className={styles.wrapper}>
        <input
          type="tel"
          placeholder="Plate Number"
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          disabled={fieldsFrozen}
          className={styles.input}
        />

        <input
          type="text"
          placeholder="Car Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled={fieldsFrozen}
          className={styles.input}
        />

        {ticketNumber && ticketUrl && (
          <div className={styles.qrCard}>
            <div className={styles.qrTitle}>QR Code Generated</div>

            <QRCodeCanvas value={ticketUrl} size={180} />

            <div className={styles.qrInfo}>
              <p><strong>ID:</strong> {ticketNumber.toString().padStart(4, '0')}</p>
              <p><strong>Plate:</strong> {plate}</p>
              <p><strong>Model:</strong> {model}</p>
              <p><strong>Time:</strong> {createdAt?.toLocaleString()}</p>
            </div>

            <button className={styles.closeButton} onClick={() => {
              setPlate('');
              setModel('');
              setTicketNumber(null);
              setTicketUrl('');
              setCreatedAt(null);
            }}>
              Close
            </button>
          </div>
        )}


        {!fieldsFrozen && (
          <button
            onClick={handleCreate}
            disabled={loading}
            className={styles.button}
          >
            {loading ? 'Generating...' : 'Generate QR'}
          </button>
        )}
      </div>
    </div>
  );
}
