// pages/portal.tsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function PortalRedirect() {
  const router = useRouter();
  const { ticketId } = router.query;

  useEffect(() => {
    if (ticketId && typeof ticketId === 'string') {
      router.push(`/clients/${ticketId}`);
    }
  }, [ticketId, router]);

  return <p style={{ padding: 24 }}>Redirecting to your ticket view...</p>;
}
