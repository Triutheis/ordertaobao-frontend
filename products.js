document.addEventListener('DOMContentLoaded', () => {
    fetch('https://ordertaobao-backend.vercel.app/api/products')
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById('product-list');
            products.forEach((product, index) => {
                const productItem = document.createElement('div');
                productItem.classList.add('product-item');
                productItem.style.animationDelay = `${index * 0.2}s`;
                productItem.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div>
                        <a href="product-detail.html?id=${product.id}" class="btn btn-detail">Xem chi tiết</a>
                        <a href="https://zalo.me/0972329553" target="_blank" class="btn">Order</a>
                    </div>
                `;
                productList.appendChild(productItem);
            });
        })
        .catch(error => console.error('Lỗi tải sản phẩm:', error));
});