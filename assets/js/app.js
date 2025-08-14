(function(){"use strict";
  const phone = "5544991262009";
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const footerZap = document.getElementById("footerZap");

  menuBtn && menuBtn.addEventListener("click", () => mobileMenu.classList.toggle("show"));

  function openWhatsApp(message) {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  // Footer button default
  footerZap && footerZap.addEventListener("click", (e) => {
    e.preventDefault();
    openWhatsApp("Olá! Quero fazer um pedido 🍕");
  });

  // Generic buttons with data-wa-message
  document.querySelectorAll(".zap-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const msg = btn.getAttribute("data-wa-message") || "Olá! Quero fazer um pedido 🍕";
      openWhatsApp(msg);
    });
  });

  // MENU interactions
  const cart = [];
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartOverlay");
  const openCart = document.getElementById("openCart");
  const closeCart = document.getElementById("closeCart");
  const checkout = document.getElementById("checkout");
  const checkoutDrawer = document.getElementById("checkoutDrawer");

  function updateCartUI() {
    if(!cartItems) return;
    cartItems.innerHTML = "";
    let total = 0;
    cart.forEach((item, idx) => {
      total += item.price * item.qty;
      const row = document.createElement("div");
      row.className = "flex items-center justify-between gap-3 border border-neutral-200 rounded-xl p-3 bg-white";
      row.innerHTML = `
        <div>
          <div class="font-semibold">${item.name}</div>
          <div class="text-xs text-neutral-600">Qtd: ${item.qty} • R$ ${item.price.toFixed(2).replace('.', ',')}</div>
        </div>
        <div class="flex items-center gap-2">
          <button data-idx="${idx}" class="dec px-3 py-1 rounded-lg border">-</button>
          <button data-idx="${idx}" class="inc px-3 py-1 rounded-lg border">+</button>
          <button data-idx="${idx}" class="rm px-3 py-1 rounded-lg border text-red-600">x</button>
        </div>`;
      cartItems.appendChild(row);
    });
    if(cartCount) cartCount.textContent = cart.reduce((a,b)=>a+b.qty,0);
    if(cartTotal) cartTotal.textContent = "R$ " + total.toFixed(2).replace('.', ',');
    // bind buttons
    cartItems.querySelectorAll(".inc").forEach(b => b.onclick = () => { cart[b.dataset.idx].qty++; updateCartUI(); });
    cartItems.querySelectorAll(".dec").forEach(b => b.onclick = () => { cart[b.dataset.idx].qty = Math.max(1, cart[b.dataset.idx].qty-1); updateCartUI(); });
    cartItems.querySelectorAll(".rm").forEach(b => b.onclick = () => { cart.splice(b.dataset.idx,1); updateCartUI(); });
  }

  function openDrawer() {
    cartDrawer && cartDrawer.classList.add("show");
    cartOverlay && cartOverlay.classList.add("show");
  }
  function closeDrawer() {
    cartDrawer && cartDrawer.classList.remove("show");
    cartOverlay && cartOverlay.classList.remove("show");
  }
  openCart && openCart.addEventListener("click", e => { e.preventDefault(); openDrawer(); });
  closeCart && closeCart.addEventListener("click", e => { e.preventDefault(); closeDrawer(); });
  cartOverlay && cartOverlay.addEventListener("click", closeDrawer);

  function addToCart(name, priceStr) {
    const price = parseFloat(priceStr.replace('.', '').replace(',', '.'));
    const existing = cart.find(i => i.name === name);
    if(existing) existing.qty++; else cart.push({ name, price, qty: 1 });
    updateCartUI();
  }

  document.querySelectorAll(".add-cart").forEach(btn => {
    btn.addEventListener("click", () => addToCart(btn.dataset.item, btn.dataset.price));
  });

  document.querySelectorAll(".zap-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.item;
      const price = btn.dataset.price;
      openWhatsApp(`Olá! Quero pedir 1x ${name} (R$ ${price}).`);
    });
  });

  function buildCartMessage() {
    if(cart.length === 0) return "Olá! Quero fazer um pedido 🍕";
    const lines = cart.map(i => `- ${i.qty}x ${i.name}`);
    return `Olá! Quero fazer um pedido:\n${lines.join('\n')}`;
  }

  function checkoutNow() {
    openWhatsApp(buildCartMessage());
  }

  checkout && checkout.addEventListener("click", e => { e.preventDefault(); checkoutNow(); });
  checkoutDrawer && checkoutDrawer.addEventListener("click", e => { e.preventDefault(); checkoutNow(); });

})();
