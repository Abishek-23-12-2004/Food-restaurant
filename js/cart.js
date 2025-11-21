// Cart operations
(function() {
    'use strict';

    function addToCart(itemId) {
        const menuItems = window.App.getMenuItems();
        const item = menuItems.find(m => m.id === itemId);
        
        if (!item) return;

        let cart = window.App.getCart();
        const existingItem = cart.find(c => c.id === itemId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: 1
            });
        }

        window.App.saveCart(cart);
        renderCart();
        showNotification(`${item.name} added to cart!`);
    }

    function removeFromCart(itemId) {
        let cart = window.App.getCart();
        cart = cart.filter(c => c.id !== itemId);
        window.App.saveCart(cart);
        renderCart();
    }

    function updateQuantity(itemId, change) {
        let cart = window.App.getCart();
        const item = cart.find(c => c.id === itemId);
        
        if (!item) return;

        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            window.App.saveCart(cart);
            renderCart();
        }
    }

    function clearCart() {
        if (confirm('Are you sure you want to clear the cart?')) {
            window.App.saveCart([]);
            renderCart();
            showNotification('Cart cleared!');
        }
    }

    function getCartTotal() {
        const cart = window.App.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    function renderCart() {
        const cartContainer = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const cartCount = document.getElementById('cart-count');
        
        if (!cartContainer) return;

        const cart = window.App.getCart();
        cartContainer.innerHTML = '';

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            if (cartTotal) cartTotal.textContent = '₹0';
            if (cartCount) cartCount.textContent = '0';
            return;
        }

        const total = getCartTotal();
        if (cartTotal) cartTotal.textContent = `₹${total}`;
        
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) cartCount.textContent = itemCount;

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60x60?text=${encodeURIComponent(item.name)}'">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="window.Cart.updateQuantity(${item.id}, -1)">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="window.Cart.updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="window.Cart.removeFromCart(${item.id})" title="Remove">×</button>
                </div>
            `;
            cartContainer.appendChild(cartItem);
        });
    }

    function showNotification(message) {
        // Simple notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Initialize cart display
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderCart);
    } else {
        renderCart();
    }

    // Export functions
    window.Cart = {
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        render: renderCart
    };
})();

