import Badge from '../Badge';
import Button from '../Button';
import './ProductCard.scss';

const ProductCard = ({ product }) => {
  const { image, title, description, price, oldPrice, badge } = product;

  const handleAddToCart = () => {
    alert(`${title} добавлен в корзину!`);
  };

  return (
    <article className="product-card">
      <div className="product-card__image-container">
        <img 
          src={image} 
          alt={title} 
          className="product-card__image" 
        />
        {badge && (
          <div className="product-card__badge">
            <Badge variant={badge.variant}>{badge.text}</Badge>
          </div>
        )}
        <div className="product-card__overlay" />
      </div>

      <div className="product-card__content">
        <h2 className="product-card__title">{title}</h2>
        <p className="product-card__description">{description}</p>
        
        <div className="product-card__footer">
          <div className="product-card__price-block">
            {oldPrice && (
              <span className="product-card__old-price">{oldPrice} ₽</span>
            )}
            <span className="product-card__price">{price} ₽</span>
          </div>
          <Button onClick={handleAddToCart}>В корзину</Button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
