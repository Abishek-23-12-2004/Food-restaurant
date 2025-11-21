// Menu management CRUD operations
(function() {
    'use strict';

    function renderMenuItems() {
        const container = document.getElementById('menu-items-list');
        if (!container) return;

        const menuItems = window.App.getMenuItems();
        container.innerHTML = '';

        if (menuItems.length === 0) {
            container.innerHTML = '<p class="no-items">No menu items. Click "Add New Item" to get started.</p>';
            return;
        }

        menuItems.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'menu-item-card';
            itemCard.innerHTML = `
                <div class="menu-item-card-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/200x150?text=${encodeURIComponent(item.name)}'">
                </div>
                <div class="menu-item-card-info">
                    <h3>${item.name}</h3>
                    <p class="item-category">${item.category}</p>
                    <p class="item-price">₹${item.price}</p>
                </div>
                <div class="menu-item-card-actions">
                    <button class="btn btn-small btn-primary" onclick="window.MenuManager.editItem(${item.id})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="window.MenuManager.deleteItem(${item.id})">Delete</button>
                </div>
            `;
            container.appendChild(itemCard);
        });
    }

    function showAddForm() {
        const modal = document.getElementById('menu-form-modal');
        const form = document.getElementById('menu-form');
        const title = document.getElementById('form-title');
        
        if (!modal || !form) return;

        form.reset();
        document.getElementById('item-id').value = '';
        title.textContent = 'Add Menu Item';
        modal.style.display = 'flex';

        // Add image preview listener
        const imageInput = document.getElementById('item-image');
        if (imageInput) {
            imageInput.addEventListener('input', updateImagePreview);
        }
    }

    function editItem(itemId) {
        const menuItems = window.App.getMenuItems();
        const item = menuItems.find(m => m.id === itemId);
        
        if (!item) return;

        const modal = document.getElementById('menu-form-modal');
        const form = document.getElementById('menu-form');
        const title = document.getElementById('form-title');
        
        if (!modal || !form) return;

        document.getElementById('item-id').value = item.id;
        document.getElementById('item-name').value = item.name;
        document.getElementById('item-price').value = item.price;
        document.getElementById('item-image').value = item.image;
        document.getElementById('item-category').value = item.category;
        
        title.textContent = 'Edit Menu Item';
        modal.style.display = 'flex';
        
        updateImagePreview();

        // Add image preview listener
        const imageInput = document.getElementById('item-image');
        if (imageInput) {
            imageInput.addEventListener('input', updateImagePreview);
        }
    }

    function deleteItem(itemId) {
        if (!confirm('Are you sure you want to delete this menu item?')) {
            return;
        }

        let menuItems = window.App.getMenuItems();
        menuItems = menuItems.filter(m => m.id !== itemId);
        window.App.saveMenuItems(menuItems);
        renderMenuItems();
    }

    function handleSubmit(event) {
        event.preventDefault();

        const id = document.getElementById('item-id').value;
        const name = document.getElementById('item-name').value;
        const price = parseFloat(document.getElementById('item-price').value);
        const image = document.getElementById('item-image').value; // User's image URL is saved here
        const category = document.getElementById('item-category').value;

        let menuItems = window.App.getMenuItems();

        if (id) {
            // Edit existing item - preserves user's custom image URL
            const itemId = typeof id === 'string' ? parseInt(id) : id;
            const index = menuItems.findIndex(m => m.id === itemId);
            if (index !== -1) {
                menuItems[index] = {
                    ...menuItems[index],
                    name,
                    price,
                    image, // User's image is saved and will persist
                    category
                };
            }
        } else {
            // Add new item - saves user's custom image URL
            const newId = menuItems.length > 0 ? Math.max(...menuItems.map(m => m.id)) + 1 : 1;
            menuItems.push({
                id: newId,
                name,
                price,
                image, // User's image is saved and will persist
                category
            });
        }

        // Save to localStorage - user's images will NOT be overwritten
        window.App.saveMenuItems(menuItems);
        renderMenuItems();
        closeForm();
    }

    function closeForm() {
        const modal = document.getElementById('menu-form-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    function updateImagePreview() {
        const imageUrl = document.getElementById('item-image').value;
        const preview = document.getElementById('image-preview');
        
        if (!preview) return;

        if (imageUrl) {
            preview.innerHTML = `<img src="${imageUrl}" alt="Preview" onerror="this.parentElement.innerHTML='<p>Invalid image URL</p>'">`;
        } else {
            preview.innerHTML = '<p>No image preview</p>';
        }
    }

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('menu-form-modal');
        if (event.target === modal) {
            closeForm();
        }
    });

    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderMenuItems);
    } else {
        renderMenuItems();
    }

    // Export functions
    window.MenuManager = {
        render: renderMenuItems,
        showAddForm,
        editItem,
        deleteItem,
        handleSubmit,
        closeForm
    };
})();

