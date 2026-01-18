const DATA = [
    { id: 1, cat: "Café", name: "Espresso", price: 1700, desc: "Shot intenso de café.", img: "imagenes-cafe/expresso.jpg", extras: ["Doble +$900", "Con leche +$500"] },
    { id: 2, cat: "Café", name: "Latte", price: 2400, desc: "Espresso con leche vaporizada.", img: "imagenes-cafe/latte.jpg", extras: ["Leche vegetal +$600", "Vainilla +$500"] },
    { id: 3, cat: "Café", name: "Cappuccino", price: 2500, desc: "Espuma cremosa y cacao.", img: "imagenes-cafe/Cappuccino.jpg", extras: ["Canela +$0", "Doble +$900"] },
  
    { id: 4, cat: "Panadería", name: "Medialunas (x2)", price: 2000, desc: "Manteca, recién horneadas.", img: "imagenes-cafe/medialunas.jpg", extras: ["Extra dulce de leche +$500"] },
    { id: 5, cat: "Panadería", name: "Tostado JyQ", price: 3900, desc: "Pan dorado, jamón y queso.", img: "imagenes-cafe/tostado.jpg", extras: ["Con tomate +$400"] },
  
    { id: 6, cat: "Dulce", name: "Cheesecake", price: 4200, desc: "Porción del día.", img: "imagenes-cafe/cheesecake.jpg", extras: ["Salsa frutos rojos +$400"] },
  
    { id: 7, cat: "Fríos", name: "Limonada", price: 2200, desc: "Clásica, bien fresca.", img: "imagenes-cafe/limonada.jpg", extras: ["Menta +$0"] },
  ];
  
  const $ = (q) => document.querySelector(q);
  
  const menuEl = $("#menu");
  const chipsEl = $("#chips");
  
  const modal = $("#modal");
  const mTitle = $("#mTitle");
  const mDesc = $("#mDesc");
  const mPrice = $("#mPrice");
  const mCat = $("#mCat");
  const mImg = $("#mImg");
  const mExtrasWrap = $("#mExtrasWrap");
  const mExtras = $("#mExtras");
  const mNote = $("#mNote");
  const btnCopy = $("#btnCopy");
  
  let state = { category: "Todos", selected: null };
  
  function moneyARS(value) {
    return value.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0
    });
  }
  
  function categories() {
    return ["Todos", ...new Set(DATA.map(x => x.cat))];
  }
  
  function filtered() {
    return DATA.filter(x => state.category === "Todos" || x.cat === state.category);
  }
  
  function renderChips() {
    chipsEl.innerHTML = "";
    categories().forEach(cat => {
      const b = document.createElement("button");
      b.className = "chip" + (state.category === cat ? " active" : "");
      b.textContent = cat;
      b.onclick = () => {
        state.category = cat;
        renderChips();
        renderMenu();
      };
      chipsEl.appendChild(b);
    });
  }
  
  function renderMenu() {
    const items = filtered();
    menuEl.innerHTML = "";
  
    items.forEach(x => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <img class="thumb" src="${x.img}" alt="${x.name}" loading="lazy" />
        <div class="content">
          <div class="row">
            <div>
              <p class="title">${x.name}</p>
              <p class="desc">${x.desc}</p>
            </div>
            <div class="price">${moneyARS(x.price)}</div>
          </div>
          <div class="meta">
            <span class="pill">${x.cat}</span>
            <span class="pill">Tocar para ver</span>
          </div>
        </div>
      `;
      card.onclick = () => openModal(x);
      menuEl.appendChild(card);
    });
  }
  
  function openModal(item) {
    state.selected = item;
  
    mTitle.textContent = item.name;
    mDesc.textContent = item.desc;
    mPrice.textContent = moneyARS(item.price);
    mCat.textContent = item.cat;
  
    mImg.src = item.img;
    mImg.alt = item.name;
  
    mNote.value = "";
    mExtras.innerHTML = "";
  
    const extras = item.extras || [];
    mExtrasWrap.style.display = extras.length ? "block" : "none";
  
    extras.forEach(e => {
      const d = document.createElement("div");
      d.className = "extra";
      d.textContent = e;
      mExtras.appendChild(d);
    });
  
    modal.showModal();
  }
  
  btnCopy.addEventListener("click", async () => {
    if (!state.selected) return;
  
    const note = mNote.value.trim();
    const text =
  `Pedido:
  - ${state.selected.name} (${state.selected.cat}) - ${moneyARS(state.selected.price)}
  ${note ? `Notas: ${note}` : ""}`.trim();
  
    try {
      await navigator.clipboard.writeText(text);
      btnCopy.textContent = "¡Copiado! ✅";
      setTimeout(() => (btnCopy.textContent = "Copiar pedido"), 1200);
    } catch {
      prompt("Copiá el pedido:", text);
    }
  });
  
  renderChips();
  renderMenu();
  