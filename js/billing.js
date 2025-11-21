// Billing and payment functionality
(function() {
    'use strict';

    function generateQRCode() {
        const cart = window.App.getCart();
        if (cart.length === 0) {
            alert('Cart is empty!');
            return;
        }

        const total = window.Cart.getCartTotal();
        const orderId = window.App.generateId();
        const timestamp = new Date().toISOString();

        // Create order data for QR code
        const orderData = {
            orderId: orderId,
            total: total,
            timestamp: timestamp,
            items: cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            }))
        };

        // Show QR code modal
        showQRModal(orderData);
    }

    function showQRModal(orderData) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'qr-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Payment QR Code</h2>
                <div class="qr-info">
                    <p><strong>Order ID:</strong> ${orderData.orderId}</p>
                    <p><strong>Total Amount:</strong> ₹${orderData.total}</p>
                </div>
                <div id="qrcode"></div>
                <p class="qr-note">Scan to pay ₹${orderData.total}</p>
                <button class="btn btn-primary" onclick="window.Billing.completePayment('${orderData.orderId}')">Payment Completed</button>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'flex';

        // Generate QR code
        const qrData = `Order: ${orderData.orderId}\nAmount: ₹${orderData.total}\nTime: ${new Date(orderData.timestamp).toLocaleString()}`;
        new QRCode(document.getElementById('qrcode'), {
            text: qrData,
            width: 256,
            height: 256,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });

        // Close modal handlers
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    function completePayment(orderId) {
        const cart = window.App.getCart();
        if (cart.length === 0) {
            alert('Cart is empty!');
            return;
        }

        const total = window.Cart.getCartTotal();
        const order = {
            id: orderId,
            items: JSON.parse(JSON.stringify(cart)),
            total: total,
            timestamp: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0]
        };

        // Save order
        const orders = window.App.getOrders();
        orders.push(order);
        window.App.saveOrders(orders);

        // Clear cart
        window.App.saveCart([]);
        window.Cart.render();

        // Close modal
        const modal = document.getElementById('qr-modal');
        if (modal) {
            modal.remove();
        }

        alert(`Payment completed! Order ID: ${orderId}`);
    }

    function printBill() {
        const cart = window.App.getCart();
        if (cart.length === 0) {
            alert('Cart is empty!');
            return;
        }

        const total = window.Cart.getCartTotal();
        const orderId = window.App.generateId();
        const date = new Date().toLocaleString();

        // Create print window
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Bill - ${orderId}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                        max-width: 400px;
                        margin: 0 auto;
                    }
                    .bill-header {
                        text-align: center;
                        border-bottom: 2px solid #333;
                        padding-bottom: 10px;
                        margin-bottom: 20px;
                    }
                    .bill-header h1 {
                        margin: 0;
                        font-size: 24px;
                    }
                    .bill-info {
                        margin-bottom: 20px;
                    }
                    .bill-info p {
                        margin: 5px 0;
                    }
                    .bill-items {
                        margin-bottom: 20px;
                    }
                    .bill-item {
                        display: flex;
                        justify-content: space-between;
                        padding: 8px 0;
                        border-bottom: 1px solid #eee;
                    }
                    .bill-total {
                        border-top: 2px solid #333;
                        padding-top: 10px;
                        margin-top: 20px;
                        font-size: 18px;
                        font-weight: bold;
                        display: flex;
                        justify-content: space-between;
                    }
                    .bill-footer {
                        text-align: center;
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #eee;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="bill-header">
                    <h1>RESTAURANT BILL</h1>
                </div>
                <div class="bill-info">
                    <p><strong>Order ID:</strong> ${orderId}</p>
                    <p><strong>Date:</strong> ${date}</p>
                </div>
                <div class="bill-items">
                    ${cart.map(item => `
                        <div class="bill-item">
                            <span>${item.name} (${item.quantity} × ₹${item.price})</span>
                            <span>₹${item.price * item.quantity}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="bill-total">
                    <span>TOTAL:</span>
                    <span>₹${total}</span>
                </div>
                <div class="bill-footer">
                    <p>Thank you for your visit!</p>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }

    // Export functions
    window.Billing = {
        generateQRCode,
        completePayment,
        printBill
    };
})();

