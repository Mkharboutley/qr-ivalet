import { useEffect, useState } from 'react';
import { useFirebaseApp } from 'reactfire';
import {
  getFirestore, collection, onSnapshot,
  query, where, orderBy, Timestamp
} from 'firebase/firestore';
import { assignTicket, cancelTicket, completeTicket } from '@/utils/ticketActions';

export default function AdminDashboard() {
  const app = useFirebaseApp();
  const db = getFirestore(app);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'tickets'),
      where('status', 'in', ['requested', 'assigned']),
      orderBy('requestedAt', 'asc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <table className="min-w-full bg-white border rounded">
        <thead>
          <tr>
            <th>#</th><th>Plate</th><th>Model</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket, i) => (
            <tr key={i}>
              <td>{ticket.ticket_number}</td>
              <td>{ticket.plate_number}</td>
              <td>{ticket.car_model}</td>
              <td>{ticket.status}</td>
              <td className="space-x-2">
                <button onClick={() => assignTicket(ticket.id, 1)} className="btn">Assign</button>
                <button onClick={() => completeTicket(ticket.id)} className="btn bg-green-500">Complete</button>
                <button onClick={() => cancelTicket(ticket.id)} className="btn bg-red-500">Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
