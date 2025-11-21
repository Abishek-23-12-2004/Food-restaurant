// Menu display and rendering logic
(function() {
    'use strict';

    function renderMenu() {
        const menuContainer = document.getElementById('menu-container');
        if (!menuContainer) return;

        const menuItems = window.App.getMenuItems();
        menuContainer.innerHTML = '';

        if (menuItems.length === 0) {
            menuContainer.innerHTML = '<p class="no-items">No menu items available. Please add items in Manage Menu.</p>';
            return;
        }

        menuItems.forEach(item => {
            const menuCard = document.createElement('div');
            menuCard.className = 'menu-item';
            menuCard.innerHTML = `
                <div class="menu-item-image" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300x200?text=${encodeURIComponent(item.name)}'">
                </div>
                <div class="menu-item-info">
                    <h3>${item.name}</h3>
                    <p class="menu-price">₹${item.price}</p>
                </div>
            `;

            // Add click event to add item to cart
            menuCard.querySelector('.menu-item-image').addEventListener('click', () => {
                window.Cart.addToCart(item.id);
            });

            menuContainer.appendChild(menuCard);
        });
    }

    // Initialize menu display
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderMenu);
    } else {
        renderMenu();
    }

    // Export render function
    window.Menu = {
        render: renderMenu
    };
})();

