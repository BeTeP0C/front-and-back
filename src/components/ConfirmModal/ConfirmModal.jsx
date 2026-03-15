import { useEffect } from 'react';
import './ConfirmModal.scss';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    // Блокировка скролла страницы при открытии модалки
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="confirm-overlay" onClick={onCancel}>
            <div className="confirm-modal" onClick={e => e.stopPropagation()}>
                <div className="confirm-modal__icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M12 7V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <circle cx="12" cy="16" r="1" fill="currentColor"/>
                    </svg>
                </div>
                <h3 className="confirm-modal__title">{title}</h3>
                <p className="confirm-modal__message">{message}</p>
                <div className="confirm-modal__actions">
                    <button className="confirm-btn confirm-btn--secondary" onClick={onCancel}>
                        Отмена
                    </button>
                    <button className="confirm-btn confirm-btn--danger" onClick={onConfirm}>
                        Удалить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
