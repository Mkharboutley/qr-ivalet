import { getFunctions, httpsCallable } from 'firebase/functions';

export async function assignTicket(ticketId: string, workerId: number) {
  const fn = httpsCallable(getFunctions(), 'assignTicketToWorker');
  return await fn({ ticketId, workerId });
}

export async function completeTicket(ticketId: string) {
  const fn = httpsCallable(getFunctions(), 'completeTicket');
  return await fn({ ticketId });
}

export async function cancelTicket(ticketId: string) {
  const fn = httpsCallable(getFunctions(), 'cancelTicket');
  return await fn({ ticketId });
}
