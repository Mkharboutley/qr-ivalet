import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
import { useFirebaseApp } from 'reactfire';
import styles from '@/styles/ticketid.module.css';

export default function ClientTicketView() {
  const app = useFirebaseApp();
  const db = getFirestore(app);
  const router = useRouter();
  const { ticketId } = router.query;

  const [ticket, setTicket] = useState<any>(null);
  const [docId, setDocId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [requested, setRequested] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!ticketId) return;
    const fetchTicket = async () => {
      try {
        const q = query(
          collection(db, 'tickets'),
          where('ticket_number', '==', parseInt(ticketId as string))
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const d = snap.docs[0];
          const data = d.data();
          setDocId(d.id);
          setTicket(data);
          const hasRequested = data.requestedAt && data.etaMinutes;
          setRequested(hasRequested);

          if (hasRequested) {
            const etaTime =
              data.requestedAt.toDate().getTime() + data.etaMinutes * 60000;
            setCountdown(Math.max(etaTime - Date.now(), 0));
          }
        } else {
          setError('Ticket not found.');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [ticketId]);

  useEffect(() => {
    if (!requested || countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(prev - 1000, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [requested, countdown]);

  const handleRequest = async () => {
    const DEFAULT_DELIVERY_MIN = 7;
    const WORKERS = 5;

    const activeSnap = await getDocs(
      query(
        collection(db, 'tickets'),
        where('status', '==', 'requested'),
        orderBy('requestedAt', 'asc')
      )
    );
    const activeRequests = activeSnap.docs.length;
    const etaMinutes =
      activeRequests < WORKERS
        ? DEFAULT_DELIVERY_MIN
        : Math.ceil(activeRequests / WORKERS) * DEFAULT_DELIVERY_MIN;

    const now = Timestamp.now();
    await updateDoc(doc(db, 'tickets', docId), {
      requestedAt: now,
      etaMinutes,
      status: 'requested',
      assignedWorker: activeRequests < WORKERS ? activeRequests + 1 : null,
    });

    setRequested(true);
    setCountdown(etaMinutes * 60000);
    setTicket((prev: any) => ({
      ...prev,
      status: 'requested',
      requestedAt: now,
      etaMinutes,
    }));
  };

  const mins = Math.floor(countdown / 60000).toString().padStart(2, '0');
  const secs = Math.floor((countdown % 60000) / 1000).toString().padStart(2, '0');

  if (loading) return <p className={styles.container}>Loading ticket...</p>;
  if (error) return <p className={styles.container}>{error}</p>;

return (
  <div className={styles.container}>
    <img src="/logo.gif" alt="i-Valet" className={styles.logo} />

    <div className={styles.card}>
      <h2 className={styles.title}>Valet Ticket</h2>

      <div className={styles.detail}>
        <p><strong>Ticket #:</strong> {ticket.ticket_number}</p>
        <p><strong>Plate:</strong> {ticket.plate_number}</p>
        <p><strong>Model:</strong> {ticket.car_model}</p>
        <p><strong>Entry Time:</strong> {ticket.createdAt?.toDate().toLocaleString()}</p>
        <p><strong>Status:</strong> {ticket.status}</p>
      </div>

      {requested ? (
        <div className={styles.countdown}>
          {mins}:{secs}
        </div>
      ) : (
        <button onClick={handleRequest} className={styles.button}>
          Request My Car
        </button>
      )}
    </div>

    <div className={styles.shadowBox}>
      <img src="/car-waiting.gif" alt="waiting" className={styles.gif} />
    </div>
  </div>
  );
}