document.addEventListener('DOMContentLoaded', () => {
    const adminPassword = 'daizonaitts'; // Đổi mật khẩu
    let selectedImages = []; // Ảnh phụ cho form thêm
    let editSelectedImages = []; // Ảnh phụ cho form sửa

    window.checkPassword = function() {
        const passwordInput = document.getElementById('admin-password').value;
        if (passwordInput === adminPassword) {
            document.getElementById('password-prompt').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            loadProducts();
        } else {
            alert('Mật khẩu sai!');
        }
    };

    function loadProducts() {
        fetch('https://ordertaobao-backend.vercel.app/api/products') // Sẽ đổi thành URL backend sau khi triển khai
            .then(response => response.json())
            .then(products => {
                const productList = document.getElementById('product-list');
                productList.innerHTML = '';
                products.forEach(product => {
                    const productItem = document.createElement('div');
                    productItem.classList.add('product-item');
                    productItem.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name || 'Chưa có tên'}</h3>
                        <p>${product.description || 'Chưa có mô tả'}</p>
                        <button class="btn" onclick="editProduct(${product.id})">Sửa</button>
                        <button class="btn" onclick="deleteProduct(${product.id})">Xóa</button>
                    `;
                    productList.appendChild(productItem);
                });
            })
            .catch(error => console.error('Lỗi tải sản phẩm:', error));
    }

    // Preview và quản lý ảnh phụ (form thêm)
    const imagesInput = document.getElementById('product-images');
    const imagesPreview = document.getElementById('images-preview');
    imagesInput.addEventListener('change', () => {
        const newFiles = Array.from(imagesInput.files);
        selectedImages = [...selectedImages, ...newFiles];
        updateImagesPreview(imagesPreview, selectedImages);
        imagesInput.value = '';
    });

    function updateImagesPreview(previewContainer, imagesArray) {
        previewContainer.innerHTML = '';
        imagesArray.forEach((file, index) => {
            const imgWrapper = document.createElement('div');
            imgWrapper.classList.add('preview-wrapper');
            const img = document.createElement('img');
            img.src = file instanceof File ? URL.createObjectURL(file) : file;
            img.alt = file.name || 'Ảnh phụ';
            img.classList.add('preview-img');
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'X';
            removeBtn.classList.add('remove-btn');
            removeBtn.onclick = () => {
                imagesArray.splice(index, 1);
                updateImagesPreview(previewContainer, imagesArray);
            };
            imgWrapper.appendChild(img);
            imgWrapper.appendChild(removeBtn);
            previewContainer.appendChild(imgWrapper);
        });
    }

    // Xử lý form thêm sản phẩm
    document.getElementById('product-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        selectedImages.forEach((file) => {
            formData.append(`images`, file);
        });
        fetch('https://ordertaobao-backend.vercel.app/api/products', { // Sẽ đổi thành URL backend
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                e.target.reset();
                selectedImages = [];
                imagesPreview.innerHTML = '';
                loadProducts();
            } else {
                alert('Lỗi khi thêm sản phẩm!');
            }
        })
        .catch(error => console.error('Lỗi:', error));
    });

    // Preview và quản lý ảnh phụ (form sửa)
    const editImagesInput = document.getElementById('edit-product-images');
    const editImagesPreview = document.getElementById('edit-images-preview');
    editImagesInput.addEventListener('change', () => {
        const newFiles = Array.from(editImagesInput.files);
        editSelectedImages = [...editSelectedImages, ...newFiles];
        updateImagesPreview(editImagesPreview, editSelectedImages);
        editImagesInput.value = '';
    });

    window.editProduct = function(id) {
        fetch('https://ordertaobao-backend.vercel.app/api/products') // Sẽ đổi thành URL backend
            .then(response => response.json())
            .then(products => {
                const product = products.find(p => p.id === id);
                if (product) {
                    const editForm = document.getElementById('edit-product-form');
                    editForm.id.value = product.id;
                    editForm.name.value = product.name || '';
                    editForm.description.value = product.description || '';
                    editForm.imageUrl.value = product.image || '';
                    editForm.videoUrl.value = product.video || '';
                    editForm.imagesUrl.value = product.images ? product.images.join(', ') : '';
                    editSelectedImages = [];
                    updateImagesPreview(editImagesPreview, product.images || []);
                    document.getElementById('edit-form-container').style.display = 'block';
                }
            });
    };

    document.getElementById('edit-product-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        editSelectedImages.forEach((file) => {
            formData.append(`images`, file);
        });
        const id = formData.get('id');
        if (confirm('Bạn có chắc muốn lưu thay đổi này?')) { // Thêm xác nhận
            fetch(`https://ordertaobao-backend.vercel.app/api/products/${id}`, { // Sẽ đổi thành URL backend
                method: 'PUT',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    closeEditForm();
                    loadProducts();
                } else {
                    alert('Lỗi khi sửa sản phẩm!');
                }
            })
            .catch(error => console.error('Lỗi:', error));
        }
    });

    window.closeEditForm = function() {
        document.getElementById('edit-form-container').style.display = 'none';
        document.getElementById('edit-product-form').reset();
        editSelectedImages = [];
        editImagesPreview.innerHTML = '';
    };

    window.deleteProduct = function(id) {
        if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            fetch(`https://ordertaobao-backend.vercel.app/api/products/${id}`, { // Sẽ đổi thành URL backend
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadProducts();
                } else {
                    alert('Lỗi khi xóa sản phẩm!');
                }
            })
            .catch(error => console.error('Lỗi:', error));
        }
    };
});