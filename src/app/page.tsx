'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

// eslint-disable-next-line @next/next/no-img-element
const UserIcon = () => (
  <img
    src="https://q.trap.jp/api/v3/public/icon/howard127"
    alt="howard127"
    className={styles.icon}
  />
);

const PRESET_AMOUNTS = [100, 500, 1000, 5000];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch('/api/me');
        if (res.ok) {
          const data = await res.json();
          setBalance(data.balance);
        }
      } catch (e) {
        console.error('Failed to fetch balance', e);
      }
    };
    fetchBalance();
  }, []);

  const handleSubmit = async (selectedAmount: number) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedAmount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initiate donation');
      }

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <UserIcon />
      {balance !== null && (
        <div className={styles.balance}>ぼくのこぴあ: {balance}</div>
      )}
      <div className={styles.title}>こぴあください</div>
      <div className={styles.subtitle}>↓あげる↓</div>

      <div className={styles.grid}>
        {PRESET_AMOUNTS.map((amt) => (
          <button
            key={amt}
            onClick={() => handleSubmit(amt)}
            className={styles.amountButton}
            disabled={loading}
          >
            {amt}
          </button>
        ))}
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </main>
  );
}
