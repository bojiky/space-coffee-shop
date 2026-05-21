// Товары для кофейни
const productsData = [
    { id: 1, name: "Туманный латте", category: "coffee", description: "Мягкий латте с нотками ванили и карамели", price: 320, icon: "☁️", isSpecial: false },
    { id: 2, name: "Звёздный капучино", category: "coffee", description: "Классический капучино с корицей и звёздной пылью", price: 290, icon: "⭐", isSpecial: false },
    { id: 3, name: "Чёрная дыра эспрессо", category: "special", description: "Двойной эспрессо с шоколадным послевкусием", price: 210, icon: "🕳️", isSpecial: true },
    { id: 4, name: "Небула раф", category: "special", description: "Раф с фиолетовым чаем матча и сливками", price: 380, icon: "🌌", isSpecial: true },
    { id: 5, name: "Млечный путь мокко", category: "special", description: "Горячий шоколад с эспрессо и маршмеллоу", price: 350, icon: "🌠", isSpecial: true },
    { id: 6, name: "Астероидное печенье", category: "dessert", description: "Хрустящее печенье с шоколадной крошкой", price: 150, icon: "🍪", isSpecial: false },
    { id: 7, name: "Галактический чизкейк", category: "dessert", description: "Нежный чизкейк с черничным топингом", price: 280, icon: "🍰", isSpecial: false },
    { id: 8, name: "Солярис матча", category: "special", description: "Японский зелёный чай с кокосовым молоком", price: 340, icon: "🍵", isSpecial: true }
];

let cart = [];
let currentFilter = 'all';

// Генерация звёзд
function generateStars() {
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 5 + 's';
        star.style.animationDuration = Math.random() * 3 + 2 + 's';
        starsContainer.appendChild(star);
    }
}

// Загрузка корзины из localStorage
function loadCart() {
    const saved = localStorage.getItem('bojikk_coffee_cart');
    if (saved) cart = JSON.parse(saved);
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('bojikk_coffee_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const countElement = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (countElement) countElement.textContent = totalItems;
    
    const modal = document.getElementById('cart-modal');
    if (modal && modal.classList.contains('show')) renderCartItems();
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity++;
        showToast(`☕ ${product.name} +1`);
    } else {
        cart.push({ ...product, quantity: 1 });
        showToast(`✨ ${product.name} добавлен в корзину!`);
    }
    saveCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartItems();
    showToast('🗑️ Товар удалён');
}

function clearCart() {
    if (cart.length === 0) return showToast('Корзина уже пуста');
    if (confirm('Очистить корзину?')) {
        cart = [];
        saveCart();
        renderCartItems();
        showToast('🧹 Корзина очищена');
    }
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart">✨ Корзина пуста. Выбери напиток ✨</div>';
        if (totalElement) totalElement.textContent = '0 ₽';
        return;
    }
    
    let total = 0;
    container.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="cart-item">
                <div class="cart-item-icon">${item.icon}</div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString('ru-RU')} ₽ × ${item.quantity}</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Удалить</button>
            </div>
        `;
    }).join('');
    
    if (totalElement) totalElement.textContent = total.toLocaleString('ru-RU') + ' ₽';
}

function openCart() {
    const modal = document.getElementById('cart-modal');
    modal.classList.add('show');
    renderCartItems();
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    const modal = document.getElementById('cart-modal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function checkout() {
    if (cart.length === 0) {
        showToast('🛸 Сначала добавь что-нибудь в корзину');
        return;
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    alert(`🚀 Заказ оформлен!\n\nИтого: ${total.toLocaleString('ru-RU')} ₽\n\nСпасибо, что выбрали космическую кофейню! ✨`);
    cart = [];
    saveCart();
    closeCart();
    showToast('✅ Заказ успешно оформлен!');
}

function filterProducts(filter) {
    currentFilter = filter;
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
        const btnFilter = btn.getAttribute('data-filter');
        btn.classList.toggle('active', btnFilter === filter);
    });
    
    const badge = document.getElementById('filter-badge');
    const filterNames = { all: 'Все напитки', coffee: '☕ Кофе', special: '🌌 Космические', dessert: '🍰 Десерты' };
    badge.textContent = filterNames[filter] || filter;
    
    renderProducts();
}

function renderProducts() {
    const grid = document.getElementById('products-grid');
    let filtered = productsData;
    
    if (currentFilter !== 'all') {
        filtered = productsData.filter(p => p.category === currentFilter);
    }
    
    grid.innerHTML = filtered.map(product => `
        <div class="product-card">
            <div class="product-icon">${product.icon}</div>
            <div class="product-category">${product.category === 'coffee' ? '☕ Кофе' : product.category === 'special' ? '🌌 Космический' : '🍰 Десерт'}</div>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">${product.price.toLocaleString('ru-RU')} ₽</div>
            <button class="btn-card" onclick="addToCart(${product.id})">В корзину 🛸</button>
        </div>
    `).join('');
}

function resetFilter() {
    filterProducts('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function subscribe() {
    const email = document.getElementById('emailInput').value;
    if (email.includes('@') && email.includes('.')) {
        showToast(`🚀 Промокод COSMOS15 отправлен на ${email}`);
        document.getElementById('emailInput').value = '';
    } else {
        showToast('⚠️ Введи корректный email');
    }
}

document.addEventListener('click', (e) => {
    const modal = document.getElementById('cart-modal');
    if (e.target === modal) closeCart();
});

generateStars();
loadCart();
renderProducts();