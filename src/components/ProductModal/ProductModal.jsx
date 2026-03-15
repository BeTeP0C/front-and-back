import { useState, useEffect } from 'react';
import './ProductModal.scss';

const ProductModal = ({ isOpen, mode, initialProduct, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        price: '',
        image: ''
    });
    const [imagePreviewError, setImagePreviewError] = useState(false);

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

    useEffect(() => {
        if (mode === 'edit' && initialProduct) {
            setFormData({
                title: initialProduct.title || '',
                category: initialProduct.category || '',
                description: initialProduct.description || '',
                price: initialProduct.price || '',
                image: initialProduct.image || ''
            });
            setImagePreviewError(false);
        } else {
            setFormData({
                title: '',
                category: '',
                description: '',
                price: '',
                image: ''
            });
            setImagePreviewError(false);
        }
    }, [mode, initialProduct, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'image') {
            setImagePreviewError(false);
        }
    };

    const handleImageError = () => {
        setImagePreviewError(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const payload = {
            ...formData,
            price: Number(formData.price)
        };

        if (mode === 'edit' && initialProduct) {
            payload.id = initialProduct.id;
        }

        onSubmit(payload);
    };

    if (!isOpen) return null;

    const hasValidImagePreview = formData.image && !imagePreviewError;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal__header">
                    <h2 className="modal__title">
                        {mode === 'create' ? 'Добавить товар' : 'Редактировать товар'}
                    </h2>
                    <button className="modal__close" onClick={onClose}>×</button>
                </div>

                <form className="modal__form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="image">URL изображения</label>
                        <input
                            type="url"
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                        />
                        {formData.image && (
                            <div className="image-preview">
                                {hasValidImagePreview ? (
                                    <img 
                                        src={formData.image} 
                                        alt="Превью" 
                                        onError={handleImageError}
                                    />
                                ) : (
                                    <div className="image-preview__error">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                                            <path d="M9 9L15 15M15 9L9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                        </svg>
                                        <span>Не удалось загрузить изображение</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="title">Название</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Введите название товара"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Категория</label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            placeholder="Введите категорию"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Описание</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Введите описание товара"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Цена (₽)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            placeholder="0"
                        />
                    </div>

                    <div className="modal__actions">
                        <button type="button" className="btn btn--secondary" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn--primary">
                            {mode === 'create' ? 'Создать' : 'Сохранить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
