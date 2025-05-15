import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { requireAuth } from '@/utils/auth';
import styles from '@/styles/entry.module.css';

export default function EntryScreen() {
  const router = useRouter();

  useEffect(() => {
    requireAuth((user) => {
      console.log('Valet logged in:', user.email);
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <img
          src="/logo2.gif"
          alt="Valet Logo"
          className={styles.logo}
        />

        <button
          onClick={() => router.push('/create-qr')}
          className={styles.button}
        >
          <img src="/icons/plus-icon.png" alt="Create" width="50" height="50" />
          Create New Ticket
        </button>

        <button
          onClick={() => router.push('/scan-close')}
          className={`${styles.button} ${styles.secondary}`}
        >
          <img src="/icons/scan-icon.png" alt="Scan" width="50" height="50" />
          Scan & Close Ticket
        </button>
      </div>
    </div>
  );
}
