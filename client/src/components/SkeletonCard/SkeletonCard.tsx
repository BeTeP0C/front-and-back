import styles from './SkeletonCard.module.scss';

export default function SkeletonCard() {
  return (
    <article className={styles.card}>
      <div className={styles.image} />
      <div className={styles.body}>
        <div className={styles.category} />
        <div className={styles.title} />
        <div className={styles.descLine} />
        <div className={styles.descLineShort} />
        <div className={styles.footer}>
          <div className={styles.price} />
        </div>
      </div>
    </article>
  );
}
