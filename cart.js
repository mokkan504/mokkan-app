(function () {
  const CART_KEY = "mokkanCart";

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function writeCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  function updateCount() {
    const count = readCart().reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll("#cartCount").forEach((node) => {
      node.textContent = String(count);
    });
  }

  function fallbackImage(name) {
    if (name.includes("책상") || name.includes("사유")) return "./assets/mokkan-render-desk.png";
    if (name.includes("사이드") || name.includes("곁")) return "./assets/mokkan-render-side-table.png";
    return "./assets/mokkan-render-dining-table.png";
  }

  function addItem(name, type, image, option) {
    const items = readCart();
    const found = items.find((item) => item.name === name && item.type === type && item.option === option);
    if (found) {
      found.quantity += 1;
      found.image = found.image || image || fallbackImage(name);
      found.option = found.option || option;
    } else {
      items.push({ id: Date.now().toString(36), name, type, option, image: image || fallbackImage(name), quantity: 1 });
    }
    writeCart(items);
    updateCount();
  }

  function renderCart() {
    const rows = document.getElementById("cartRows");
    const empty = document.getElementById("emptyCart");
    if (!rows) return;
    const items = readCart();
    if (!items.length) {
      rows.innerHTML = "";
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;
    rows.innerHTML = items.map((item) => [
      "<tr>",
      '<td><div class="cart-product"><img src="' + (item.image || fallbackImage(item.name)) + '" alt="' + item.name + '"><div><strong>' + item.name + "</strong>" + (item.option ? '<span class="cart-option">' + item.option + "</span>" : "") + "</div></div></td>",
      "<td>" + item.type + "</td>",
      "<td>" + item.quantity + "</td>",
      '<td><button type="button" class="small-action remove-cart" data-id="' + item.id + '">삭제</button></td>',
      "</tr>"
    ].join("")).join("");
  }

  document.addEventListener("click", function (event) {
    const addButton = event.target.closest(".add-to-cart");
    if (addButton) {
      const card = addButton.closest(".product-card, article");
      const option = card?.querySelector(".product-option")?.value || "";
      addItem(addButton.dataset.name, addButton.dataset.type, addButton.dataset.image, option);
      addButton.textContent = "담았습니다";
      setTimeout(() => { addButton.textContent = "장바구니 담기"; }, 1200);
      return;
    }

    const removeButton = event.target.closest(".remove-cart");
    if (removeButton) {
      const items = readCart().filter((item) => item.id !== removeButton.dataset.id);
      writeCart(items);
      renderCart();
      updateCount();
    }
  });

  document.getElementById("clearCart")?.addEventListener("click", function () {
    writeCart([]);
    renderCart();
    updateCount();
  });

  renderCart();
  updateCount();
})();
