import Link from 'next/link';
import styles from './success.module.css';

// eslint-disable-next-line @next/next/no-img-element
const UserIcon = () => (
    <img
        src="https://q.trap.jp/api/v3/public/icon/howard127"
        alt="howard127"
        className={styles.icon}
    />
);

export default function SuccessPage() {
    return (
        <div className={styles.container}>
            <UserIcon />
            <h1>ありがとう！</h1>
            <Link href="/" className={styles.button}>
                トップページに戻る
            </Link>
        </div>
    );
}
