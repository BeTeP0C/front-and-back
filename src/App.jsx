import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import ConfirmModal from './components/ConfirmModal';
import { api } from './api';
import './App.scss';

function App() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [editingProduct, setEditingProduct] = useState(null);

    // Состояние для модалки подтверждения удаления
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // Загрузка товаров при монтировании
    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getProducts();
            setProducts(data);
        } catch (err) {
            console.error('Ошибка загрузки:', err);
            setError('Не удалось загрузить товары. Проверьте, запущен ли сервер.');
        } finally {
            setLoading(false);
        }
    };

    // Открыть модалку для создания
    const openCreate = () => {
        setModalMode('create');
        setEditingProduct(null);
        setModalOpen(true);
    };

    // Открыть модалку для редактирования
    const openEdit = (product) => {
        setModalMode('edit');
        setEditingProduct(product);
        setModalOpen(true);
    };

    // Закрыть модалку
    const closeModal = () => {
        setModalOpen(false);
        setEditingProduct(null);
    };

    // Открыть модалку подтверждения удаления
    const handleDeleteClick = (id) => {
        const product = products.find(p => p.id === id);
        setProductToDelete(product);
        setConfirmOpen(true);
    };

    // Закрыть модалку подтверждения
    const closeConfirm = () => {
        setConfirmOpen(false);
        setProductToDelete(null);
    };

    // Подтвердить удаление
    const confirmDelete = async () => {
        if (!productToDelete) return;

        try {
            await api.deleteProduct(productToDelete.id);
            setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
            closeConfirm();
        } catch (err) {
            console.error('Ошибка удаления:', err);
            alert('Ошибка удаления товара');
        }
    };

    // Отправка формы (создание/редактирование)
    const handleSubmitModal = async (payload) => {
        try {
            if (modalMode === 'create') {
                const newProduct = await api.createProduct(payload);
                setProducts(prev => [...prev, newProduct]);
            } else {
                const updatedProduct = await api.updateProduct(payload.id, payload);
                setProducts(prev => prev.map(p => p.id === payload.id ? updatedProduct : p));
            }
            closeModal();
        } catch (err) {
            console.error('Ошибка сохранения:', err);
            alert('Ошибка сохранения товара');
        }
    };

    return (
        <div className="app">
            <header className="app__header">
                <div className="app__header-content">
                    <div>
                        <h1 className="app__title">TechStore</h1>
                        <p className="app__subtitle">Интернет-магазин электроники</p>
                    </div>
                    <button className="app__add-btn" onClick={openCreate}>
                        + Добавить товар
                    </button>
                </div>
            </header>

            <main className="app__main">
                {loading && (
                    <div className="app__status">Загрузка товаров...</div>
                )}

                {error && (
                    <div className="app__status app__status--error">
                        {error}
                        <button onClick={loadProducts} className="app__retry-btn">
                            Повторить
                        </button>
                    </div>
                )}

                {!loading && !error && products.length === 0 && (
                    <div className="app__status">
                        Товаров пока нет. Добавьте первый товар!
                    </div>
                )}

                {!loading && !error && products.length > 0 && (
                    <div className="app__products">
                        {products.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onEdit={openEdit}
                                onDelete={handleDeleteClick}
                            />
                        ))}
                    </div>
                )}
            </main>

            <footer className="app__footer">
                <p>© {new Date().getFullYear()} TechStore. Практическое занятие №4</p>
            </footer>

            <ProductModal
                isOpen={modalOpen}
                mode={modalMode}
                initialProduct={editingProduct}
                onClose={closeModal}
                onSubmit={handleSubmitModal}
            />

            <ConfirmModal
                isOpen={confirmOpen}
                title="Удалить товар?"
                message={productToDelete ? `Вы уверены, что хотите удалить "${productToDelete.title}"? Это действие нельзя отменить.` : ''}
                onConfirm={confirmDelete}
                onCancel={closeConfirm}
            />
        </div>
    );
}

export default App;
