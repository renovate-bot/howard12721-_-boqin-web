import Link from 'next/link';
import Image from 'next/image';
import styles from './cancel.module.css';

const UserIcon = () => (
    <Image
        src="https://q.trap.jp/api/v3/public/icon/howard127"
        alt="howard127"
        className={styles.icon}
        width={100}
        height={100}
    />
);

export default function CancelPage() {
    return (
        <div className={styles.container}>
            <UserIcon />
            <h1>なんで？</h1>
            <Link href="/" className={styles.button}>
                トップページに戻る
            </Link>
        </div>
    );
}
