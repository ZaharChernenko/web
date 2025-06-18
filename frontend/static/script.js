document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const homeLink = document.getElementById('homeLink');
    const productsLink = document.getElementById('productsLink');
    const adminLink = document.getElementById('adminLink');
    const homeSection = document.getElementById('homeSection');
    const productsSection = document.getElementById('productsSection');
    const adminSection = document.getElementById('adminSection');
    const exploreBtn = document.getElementById('exploreBtn');
    const productsGrid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const addProductBtn = document.getElementById('addProductBtn');
    const productForm = document.getElementById('productForm');
    const productFormElement = document.getElementById('productFormElement');
    const formTitle = document.getElementById('formTitle');
    const productId = document.getElementById('productId');
    const productName = document.getElementById('productName');
    const productPrice = document.getElementById('productPrice');
    const productDescription = document.getElementById('productDescription');
    const productQuantity = document.getElementById('productQuantity');
    const cancelFormBtn = document.getElementById('cancelFormBtn');
    const adminProductsList = document.getElementById('adminProductsList');

    // Состояние приложения
    let products = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let isEditing = false;

    // Базовый URL API
    const API_URL = 'http://localhost:8000';

    // Инициализация приложения
    init();

    // Функции инициализации
    function init() {
        setupEventListeners();
        updateCartCount();
        loadProducts();
    }

    function setupEventListeners() {
        // Навигация
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('home');
        });

        productsLink.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('products');
        });

        adminLink.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('admin');
        });

        exploreBtn.addEventListener('click', () => {
            showSection('products');
        });

        // Поиск
        searchBtn.addEventListener('click', searchProducts);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchProducts();
        });

        // Корзина
        cartIcon.addEventListener('click', openCart);
        closeCart.addEventListener('click', closeCartModal);
        checkoutBtn.addEventListener('click', checkout);

        // Админ-панель
        addProductBtn.addEventListener('click', showAddProductForm);
        cancelFormBtn.addEventListener('click', cancelForm);
        productFormElement.addEventListener('submit', handleProductSubmit);
    }

    // Функции для работы с разделами
    function showSection(section) {
        // Обновляем активную ссылку в навигации
        document.querySelectorAll('.navbar a').forEach(link => {
            link.classList.remove('active');
        });

        // Скрываем все разделы
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.remove('active');
        });

        // Показываем выбранный раздел
        switch(section) {
            case 'home':
                homeLink.classList.add('active');
                homeSection.classList.add('active');
                break;
            case 'products':
                productsLink.classList.add('active');
                productsSection.classList.add('active');
                break;
            case 'admin':
                adminLink.classList.add('active');
                adminSection.classList.add('active');
                break;
        }
    }

    // Функции для работы с продуктами
    async function loadProducts() {
        try {
            const response = await fetch(`${API_URL}/get_all_products`);
            if (!response.ok) throw new Error('Ошибка загрузки товаров');

            products = await response.json();
            renderProducts(products);
            renderAdminProducts(products);
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось загрузить товары');
        }
    }

    function renderProducts(productsToRender) {
        productsGrid.innerHTML = '';

        if (productsToRender.length === 0) {
            productsGrid.innerHTML = '<p>Товары не найдены</p>';
            return;
        }

        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            productCard.innerHTML = `
                <div class="product-image">
                    <i class="fas fa-laptop" style="font-size: 50px;"></i>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description || 'Описание отсутствует'}</p>
                    <div class="product-price">${product.price.toFixed(2)} ₽</div>
                    <div class="product-actions">
                        <button class="btn" onclick="addToCart(${product.id})">В корзину</button>
                        <button class="btn" onclick="viewProductDetails(${product.id})">Подробнее</button>
                    </div>
                </div>
            `;

            productsGrid.appendChild(productCard);
        });
    }

    function renderAdminProducts(productsToRender) {
        adminProductsList.innerHTML = '';

        if (productsToRender.length === 0) {
            adminProductsList.innerHTML = '<p>Товары не найдены</p>';
            return;
        }

        productsToRender.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';

            productItem.innerHTML = `
                <div class="product-item-info">
                    <div class="product-item-title">${product.name}</div>
                    <div class="product-item-price">${product.price.toFixed(2)} ₽</div>
                    <div>Количество: ${product.quantity}</div>
                </div>
                <div class="product-item-actions">
                    <button class="btn" onclick="editProduct(${product.id})">Редактировать</button>
                    <button class="btn btn-cancel" onclick="deleteProduct(${product.id})">Удалить</button>
                </div>
            `;

            adminProductsList.appendChild(productItem);
        });
    }

    function searchProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        if (!searchTerm) {
            renderProducts(products);
            return;
        }

        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            (product.description && product.description.toLowerCase().includes(searchTerm))
        );

        renderProducts(filteredProducts);
    }

    async function viewProductDetails(productId) {
        try {
            const response = await fetch(`${API_URL}/get_product/${productId}`);
            if (!response.ok) throw new Error('Ошибка загрузки товара');

            const product = await response.json();
            alert(`
                Название: ${product.name}
                Цена: ${product.price.toFixed(2)} ₽
                Описание: ${product.description || 'Отсутствует'}
                Количество: ${product.quantity}
            `);
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось загрузить информацию о товаре');
        }
    }

    // Функции для работы с корзиной
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        updateCart();
        alert('Товар добавлен в корзину');
    }

    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    function renderCartItems() {
        cartItems.innerHTML = '';

        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Корзина пуста</p>';
            cartTotal.textContent = '0 ₽';
            return;
        }

        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';

            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <i class="fas fa-laptop" style="font-size: 30px;"></i>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price.toFixed(2)} ₽</div>
                    <div class="cart-item-quantity">
                        <button onclick="changeCartItemQuantity(${item.id}, -1)">-</button>
                        <input type="text" value="${item.quantity}" readonly>
                        <button onclick="changeCartItemQuantity(${item.id}, 1)">+</button>
                        <span class="cart-item-remove" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </span>
                    </div>
                </div>
            `;

            cartItems.appendChild(cartItem);
        });

        cartTotal.textContent = `${total.toFixed(2)} ₽`;
    }

    function changeCartItemQuantity(productId, change) {
        const item = cart.find(item => item.id === productId);
        if (!item) return;

        item.quantity += change;

        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }

        updateCart();
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }

    function openCart() {
        renderCartItems();
        cartModal.style.display = 'flex';
    }

    function closeCartModal() {
        cartModal.style.display = 'none';
    }

    function checkout() {
        if (cart.length === 0) {
            alert('Корзина пуста');
            return;
        }

        alert('Заказ оформлен! Спасибо за покупку!');
        cart = [];
        updateCart();
        closeCartModal();
    }

    // Функции для админ-панели
    function showAddProductForm() {
        isEditing = false;
        formTitle.textContent = 'Добавить новый товар';
        productFormElement.reset();
        productId.value = '';
        productForm.style.display = 'block';
    }

    function cancelForm() {
        productForm.style.display = 'none';
    }

    async function editProduct(productIdArg) {
        try {
            const response = await fetch(`${API_URL}/get_product/${productIdArg}`);
            if (!response.ok) throw new Error('Ошибка загрузки товара');

            const product = await response.json();

            isEditing = true;
            formTitle.textContent = 'Редактировать товар';
            productId.value = product.id;
            productName.value = product.name;
            productPrice.value = product.price;
            productDescription.value = product.description || '';
            productQuantity.value = product.quantity;

            productForm.style.display = 'block';
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось загрузить товар для редактирования');
        }
    }

async function handleProductSubmit(e) {
    e.preventDefault();

    const productData = {
        name: productName.value,
        price: parseFloat(productPrice.value),
        description: productDescription.value,
        quantity: parseInt(productQuantity.value)
    };

    try {
        let response;
        if (isEditing) {
            const id = productId.value; // Получаем значение productId
            if (!id) throw new Error('ID товара не указан');

            response = await fetch(`${API_URL}/update_product/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
        } else {
            response = await fetch(`${API_URL}/create_product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
        }

        if (!response.ok) throw new Error('Ошибка сохранения товара');

        const savedProduct = await response.json();
        alert('Товар успешно сохранен');

        productForm.style.display = 'none';
        loadProducts();
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось сохранить товар: ' + error.message);
    }
}

    async function deleteProduct(productId) {
        if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;

        try {
            const response = await fetch(`${API_URL}/delete_product/${productId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Ошибка удаления товара');

            alert('Товар успешно удален');
            loadProducts();
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось удалить товар');
        }
    }

    // Делаем функции доступными глобально для обработчиков событий в HTML
    window.addToCart = addToCart;
    window.viewProductDetails = viewProductDetails;
    window.changeCartItemQuantity = changeCartItemQuantity;
    window.removeFromCart = removeFromCart;
    window.editProduct = editProduct;
    window.deleteProduct = deleteProduct;
});
