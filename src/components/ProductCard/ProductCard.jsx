import { useState } from 'react';
import Badge from '../Badge';
import Button from '../Button';
import './ProductCard.scss';

const ProductCard = ({ product, onEdit, onDelete }) => {
    const { id, name, category, description, price, stock, image } = product;
    const [imageError, setImageError] = useState(false);

    const formatPrice = (value) => {
        return new Intl.NumberFormat('ru-RU').format(value);
    };

    const getStockStatus = () => {
        if (stock === 0) return { text: 'Нет в наличии', variant: 'sale' };
        if (stock < 10) return { text: `Осталось ${stock} шт.`, variant: 'sale' };
        return { text: 'В наличии', variant: 'default' };
    };

    const stockStatus = getStockStatus();

    const handleImageError = () => {
        setImageError(true);
    };

    const hasValidImage = image && !imageError;

    return (
        <article className="product-card">
            <div className="product-card__image-container">
                {hasValidImage ? (
                    <img 
                        src={image} 
                        alt={name}
                        className="product-card__image"
                        onError={handleImageError}
                    />
                ) : (
                    <div className="product-card__placeholder">
                        <svg className="product-card__placeholder-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                            <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M3 16L8 11L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M13 14L16 11L21 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{category}</span>
                    </div>
                )}
                <div className="product-card__badge">
                    <Badge variant={stockStatus.variant}>{stockStatus.text}</Badge>
                </div>
            </div>

            <div className="product-card__content">
                <span className="product-card__category">{category}</span>
                <h2 className="product-card__title">{name}</h2>
                <p className="product-card__description">{description}</p>
                
                <div className="product-card__footer">
                    <div className="product-card__price-block">
                        <span className="product-card__price">{formatPrice(price)} ₽</span>
                        <span className="product-card__stock">Склад: {stock} шт.</span>
                    </div>
                    <div className="product-card__actions">
                        <Button variant="secondary" onClick={() => onEdit(product)}>✏️</Button>
                        <Button variant="danger" onClick={() => onDelete(id)}>🗑️</Button>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
