// 1. MENÚ LATERAL
const sidebar        = document.getElementById('sidebar');
const openMenuBtn    = document.getElementById('openMenu');
const closeMenuBtn   = document.getElementById('closeMenu');
const overlay        = document.getElementById('sidebarOverlay');

function openSidebar() {
  sidebar.classList.add('sidebar--active');
  overlay.classList.add('sidebar-overlay--visible');
}

function closeSidebar() {
  sidebar.classList.remove('sidebar--active');
  overlay.classList.remove('sidebar-overlay--visible');
}

if (openMenuBtn)  openMenuBtn.addEventListener('click', openSidebar);
if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeSidebar);
if (overlay)      overlay.addEventListener('click', closeSidebar);

// Cerrar con tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSidebar();
});

// 2. CARRITO
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Actualiza el contador visual del header
function updateCartCount() {
  const cartCount = document.getElementById('cartCount');
  if (cartCount) cartCount.textContent = cart.length;
}
updateCartCount();

// 2a. AGREGAR PRODUCTOS
document.querySelectorAll('.card__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const product = {
      name:  btn.dataset.name,
      price: Number(btn.dataset.price)
    };

    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Feedback visual en el botón
    btn.textContent = '✔ Agregado';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Agregar';
      btn.disabled = false;
    }, 1500);
  });
});

// 2b. MOSTRAR CARRITO
const cartItemsList = document.getElementById('cartItems');
const totalEl       = document.getElementById('total');

if (cartItemsList) {
  renderCart();
}

function renderCart() {
  if (cart.length === 0) {
    cartItemsList.innerHTML = '<li class="cart__empty">Tu carrito está vacío.</li>';
    totalEl.textContent = '0';
    return;
  }

  let sum  = 0;
  let html = '';

  cart.forEach((item, index) => {
    sum += item.price;
    html += `
      <li class="cart-item">
        <span class="cart-item__info">${item.name}</span>
        <span class="cart-item__price">$${item.price.toLocaleString()}</span>
        <button class="cart-item__remove" onclick="removeItem(${index})" aria-label="Eliminar ${item.name}">✕</button>
      </li>
    `;
  });

  cartItemsList.innerHTML = html;
  totalEl.textContent = sum.toLocaleString();
}

// Eliminar un producto del carrito
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();   // Re-renderiza sin recargar la página
}

// Vaciar carrito
const clearBtn = document.getElementById('clear');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    renderCart();
  });
}

// Finalizar compra
const buyBtn = document.getElementById('buy');
if (buyBtn) {
  buyBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }
    alert('¡Compra realizada con éxito! Gracias por tu pedido.');
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    renderCart();
  });
}

// 3. FORMULARIO DE REGISTRO
const registerForm = document.getElementById('registerForm');

if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre   = document.getElementById('nombre').value.trim();
    const correo   = document.getElementById('correo').value.trim();
    const password = document.getElementById('password').value;
    const msgEl    = document.getElementById('formMessage');

    // Limpia clases previas
    msgEl.className = 'register-form__message';

    // Validación básica
    if (!nombre || !correo || !password) {
      msgEl.textContent = 'Por favor completa todos los campos.';
      msgEl.classList.add('register-form__message--error');
      return;
    }

    if (password.length < 6) {
      msgEl.textContent = 'La contraseña debe tener al menos 6 caracteres.';
      msgEl.classList.add('register-form__message--error');
      return;
    }

    // Éxito
    msgEl.textContent = `¡Cuenta creada para ${nombre}!`;
    msgEl.classList.add('register-form__message--success');
    registerForm.reset();
  });
}
