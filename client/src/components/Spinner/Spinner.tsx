'use client';

import styles from './Spinner.module.scss';

interface Props {
  size?: number;
  text?: string;
  fullPage?: boolean;
}

export default function Spinner({ size = 40, text, fullPage }: Props) {
  const spinner = (
    <div className={styles.wrapper}>
      <div className={styles.spinner} style={{ width: size, height: size }} />
      {text && <span className={styles.text}>{text}</span>}
    </div>
  );

  if (fullPage) {
    return <div className={styles.fullPage}>{spinner}</div>;
  }

  return spinner;
}
