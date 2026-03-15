import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
    }
});

export const api = {
    // ==========================================
    // AUTH - Аутентификация
    // ==========================================

    // Регистрация пользователя
    register: async (userData) => {
        const response = await apiClient.post("/auth/register", userData);
        return response.data;
    },

    // Вход в систему
    login: async (credentials) => {
        const response = await apiClient.post("/auth/login", credentials);
        return response.data;
    },

    // ==========================================
    // PRODUCTS - Товары
    // ==========================================

    // Получить все товары
    getProducts: async () => {
        const response = await apiClient.get("/products");
        return response.data;
    },

    // Получить товар по ID
    getProductById: async (id) => {
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    },

    // Создать новый товар
    createProduct: async (product) => {
        const response = await apiClient.post("/products", product);
        return response.data;
    },

    // Обновить товар (PUT)
    updateProduct: async (id, product) => {
        const response = await apiClient.put(`/products/${id}`, product);
        return response.data;
    },

    // Удалить товар
    deleteProduct: async (id) => {
        await apiClient.delete(`/products/${id}`);
    }
};
