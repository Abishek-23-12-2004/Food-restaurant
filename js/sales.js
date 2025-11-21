// Sales report functionality
(function() {
    'use strict';

    function renderSalesReport() {
        const orders = window.App.getOrders();
        const monthSelect = document.getElementById('month-select');
        const yearSelect = document.getElementById('year-select');
        const reportContainer = document.getElementById('sales-report-container');
        const totalSalesEl = document.getElementById('total-sales');
        const totalOrdersEl = document.getElementById('total-orders');

        if (!reportContainer) return;

        // Get selected month and year
        const selectedMonth = monthSelect ? parseInt(monthSelect.value) : new Date().getMonth() + 1;
        const selectedYear = yearSelect ? parseInt(yearSelect.value) : new Date().getFullYear();

        // Filter orders by month and year
        const filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.timestamp);
            return orderDate.getMonth() + 1 === selectedMonth && 
                   orderDate.getFullYear() === selectedYear;
        });

        // Calculate totals
        const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = filteredOrders.length;

        // Update summary
        if (totalSalesEl) totalSalesEl.textContent = `₹${totalSales.toFixed(2)}`;
        if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;

        // Render orders
        reportContainer.innerHTML = '';

        if (filteredOrders.length === 0) {
            reportContainer.innerHTML = '<p class="no-orders">No orders found for selected month.</p>';
            return;
        }

        // Sort orders by date (newest first)
        filteredOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        filteredOrders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';
            const orderDate = new Date(order.timestamp);
            orderCard.innerHTML = `
                <div class="order-header">
                    <div>
                        <h3>Order #${order.id.substring(0, 8)}</h3>
                        <p class="order-date">${orderDate.toLocaleString()}</p>
                    </div>
                    <div class="order-total">₹${order.total}</div>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.name}</span>
                            <span>${item.quantity} × ₹${item.price} = ₹${item.price * item.quantity}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            reportContainer.appendChild(orderCard);
        });
    }

    function initializeDateSelects() {
        const monthSelect = document.getElementById('month-select');
        const yearSelect = document.getElementById('year-select');

        if (monthSelect) {
            const currentMonth = new Date().getMonth() + 1;
            monthSelect.value = currentMonth;
        }

        if (yearSelect) {
            const currentYear = new Date().getFullYear();
            // Populate years (current year and previous 2 years)
            for (let i = 0; i < 3; i++) {
                const option = document.createElement('option');
                option.value = currentYear - i;
                option.textContent = currentYear - i;
                yearSelect.appendChild(option);
            }
            yearSelect.value = currentYear;
        }

        // Add event listeners
        if (monthSelect) {
            monthSelect.addEventListener('change', renderSalesReport);
        }
        if (yearSelect) {
            yearSelect.addEventListener('change', renderSalesReport);
        }
    }

    function printReport() {
        const orders = window.App.getOrders();
        const monthSelect = document.getElementById('month-select');
        const yearSelect = document.getElementById('year-select');
        
        const selectedMonth = monthSelect ? parseInt(monthSelect.value) : new Date().getMonth() + 1;
        const selectedYear = yearSelect ? parseInt(yearSelect.value) : new Date().getFullYear();

        const filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.timestamp);
            return orderDate.getMonth() + 1 === selectedMonth && 
                   orderDate.getFullYear() === selectedYear;
        });

        const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Sales Report - ${monthNames[selectedMonth - 1]} ${selectedYear}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                    }
                    .report-header {
                        text-align: center;
                        border-bottom: 2px solid #333;
                        padding-bottom: 10px;
                        margin-bottom: 20px;
                    }
                    .report-summary {
                        display: flex;
                        justify-content: space-around;
                        margin-bottom: 30px;
                        padding: 20px;
                        background: #f5f5f5;
                    }
                    .summary-item {
                        text-align: center;
                    }
                    .summary-item h3 {
                        margin: 0;
                        color: #666;
                    }
                    .summary-item p {
                        margin: 5px 0;
                        font-size: 24px;
                        font-weight: bold;
                    }
                    .order-card {
                        border: 1px solid #ddd;
                        padding: 15px;
                        margin-bottom: 15px;
                        page-break-inside: avoid;
                    }
                    .order-header {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 10px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid #eee;
                    }
                    .order-item {
                        display: flex;
                        justify-content: space-between;
                        padding: 5px 0;
                    }
                </style>
            </head>
            <body>
                <div class="report-header">
                    <h1>MONTHLY SALES REPORT</h1>
                    <h2>${monthNames[selectedMonth - 1]} ${selectedYear}</h2>
                </div>
                <div class="report-summary">
                    <div class="summary-item">
                        <h3>Total Sales</h3>
                        <p>₹${totalSales.toFixed(2)}</p>
                    </div>
                    <div class="summary-item">
                        <h3>Total Orders</h3>
                        <p>${filteredOrders.length}</p>
                    </div>
                </div>
                ${filteredOrders.map(order => {
                    const orderDate = new Date(order.timestamp);
                    return `
                        <div class="order-card">
                            <div class="order-header">
                                <div>
                                    <strong>Order #${order.id.substring(0, 8)}</strong>
                                    <p>${orderDate.toLocaleString()}</p>
                                </div>
                                <div><strong>₹${order.total}</strong></div>
                            </div>
                            ${order.items.map(item => `
                                <div class="order-item">
                                    <span>${item.name}</span>
                                    <span>${item.quantity} × ₹${item.price} = ₹${item.price * item.quantity}</span>
                                </div>
                            `).join('')}
                        </div>
                    `;
                }).join('')}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }

    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeDateSelects();
            renderSalesReport();
        });
    } else {
        initializeDateSelects();
        renderSalesReport();
    }

    // Export functions
    window.Sales = {
        render: renderSalesReport,
        print: printReport
    };
})();

