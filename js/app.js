// Initialize application and localStorage
(function() {
    'use strict';

    // Default menu items with images from free sources
    const defaultMenuItems = [
        {
            id: 1,
            name: 'Coffee',
            price: 25,
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop&q=80',
            category: 'Beverages'
        },
        {
            id: 2,
            name: 'Tea',
            price: 20,
            image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&q=80',
            category: 'Beverages'
        },
        {
            id: 3,
            name: 'Dosa',
            price: 50,
            image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop&q=80',
            category: 'Main Course'
        },
        {
            id: 4,
            name: 'Pongal',
            price: 40,
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&q=80',
            category: 'Main Course'
        },
        {
            id: 5,
            name: 'Vada',
            price: 30,
            image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop&q=80',
            category: 'Snacks'
        },
        {
            id: 6,
            name: 'Idly',
            price: 35,
            image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop&q=80',
            category: 'Main Course'
        },
        {
            id: 7,
            name: 'Poori',
            price: 45,
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&q=80',
            category: 'Main Course'
        },
        {
            id: 8,
            name: 'Chappathi',
            price: 30,
            image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop&q=80',
            category: 'Main Course'
        },
        {
            id: 9,
            name: 'Puttu',
            price: 40,
            image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop&q=80',
            category: 'Main Course'
        }
    ];

    // Initialize localStorage if not exists
    // IMPORTANT: This only runs if menuItems don't exist - it will NEVER overwrite
    // images or items that users add through the CRUD operations
    function initializeStorage() {
        // Only set default menu items if menuItems doesn't exist
        // User-added items and images through CRUD will be preserved
        if (!localStorage.getItem('menuItems')) {
            localStorage.setItem('menuItems', JSON.stringify(defaultMenuItems));
        }
        if (!localStorage.getItem('orders')) {
            localStorage.setItem('orders', JSON.stringify([]));
        }
        if (!localStorage.getItem('currentCart')) {
            localStorage.setItem('currentCart', JSON.stringify([]));
        }
    }

    // Get menu items from localStorage
    function getMenuItems() {
        return JSON.parse(localStorage.getItem('menuItems') || '[]');
    }

    // Save menu items to localStorage
    function saveMenuItems(items) {
        localStorage.setItem('menuItems', JSON.stringify(items));
    }

    // Get current cart from localStorage
    function getCart() {
        return JSON.parse(localStorage.getItem('currentCart') || '[]');
    }

    // Save cart to localStorage
    function saveCart(cart) {
        localStorage.setItem('currentCart', JSON.stringify(cart));
    }

    // Get orders from localStorage
    function getOrders() {
        return JSON.parse(localStorage.getItem('orders') || '[]');
    }

    // Save orders to localStorage
    function saveOrders(orders) {
        localStorage.setItem('orders', JSON.stringify(orders));
    }

    // Generate unique ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeStorage);
    } else {
        initializeStorage();
    }

    // Export functions to global scope
    window.App = {
        getMenuItems,
        saveMenuItems,
        getCart,
        saveCart,
        getOrders,
        saveOrders,
        generateId
    };
})();

