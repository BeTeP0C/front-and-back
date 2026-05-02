'use client';

import { useEffect } from 'react';
import styles from './ConfirmModal.module.scss';

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, title, message, confirmText = 'Удалить', onConfirm, onCancel }: Props) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={onCancel}>Отмена</button>
          <button className={styles.btnDanger} onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
