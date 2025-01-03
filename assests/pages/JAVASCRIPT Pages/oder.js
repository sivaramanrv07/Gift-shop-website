document.addEventListener('DOMContentLoaded', function() {
    const userEmail = localStorage.getItem('userEmail');
    const orderHistory = JSON.parse(localStorage.getItem(userEmail + '_orderHistory')) || [];

    const orderHistoryList = document.getElementById('order-history-list');

    if (orderHistory.length === 0) {
        orderHistoryList.innerHTML = '<p>You have no previous orders.</p>';
    } else {
        orderHistory.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.classList.add('order-item');
            
         
            orderDiv.innerHTML = `
                <h3>Order Date: ${order.orderDate}</h3>
                <p>Total Price: ₹${order.totalPrice.toFixed(2)}</p>
                <ul>
                    ${order.items.map(item => `
                        <li class="order-item-details">
                            <img src="${item.image}" alt="${item.name}" class="order-item-image">
                            <span>${item.name} (₹${parseFloat(item.price.replace('₹', '').replace('/-', '').trim())} x ${item.quantity})</span>
                        </li>
                    `).join('')}
                </ul>
                <hr>
            `;
            orderHistoryList.appendChild(orderDiv);
        });
    }
});