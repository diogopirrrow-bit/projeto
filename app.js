"use strict";
// Dados de apresentação. Nenhum produto, preço ou especificação é uma oferta real.
const products = [
  {
    id: "atlantic-midlength",
    name: "Atlantic Midlength",
    category: "Pranchas",
    note: "Fluidez, sem pressa.",
    price: 590,
    art: 0,
    tag: "Linhas clássicas",
    variants: ["6′8″", "7′0″", "7′2″"],
    color: "Areia",
    description:
      "Uma silhueta midlength de linhas suaves. Uma proposta para quem gosta de desenhar a onda com tempo e explorar outras sensações.",
    specs: [
      ["Formato ilustrado", "Midlength · nose arredondado"],
      ["Medidas de demonstração", "6′8″ / 7′0″ / 7′2″"],
      ["Construção e volume", "A validar com o fornecedor"],
    ],
    help: "As medidas desta proposta são ilustrativas. A escolha de uma prancha depende do teu nível, peso, experiência e das condições do mar. Na versão real, esta área terá volumes e recomendações validados.",
  },
  {
    id: "ocean-fullsuit",
    name: "Ocean Fullsuit 4/3",
    category: "Fatos",
    note: "Mais tempo dentro de água.",
    price: 245,
    art: 1,
    tag: "Dentro de água",
    variants: ["S", "M", "L", "XL"],
    color: "Carvão",
    description:
      "Um fato integral de linhas discretas, pensado aqui como exemplo de apresentação do equipamento. A proteção certa começa numa escolha informada.",
    specs: [
      ["Modelo ilustrado", "Fato integral · fecho no peito"],
      ["Espessura conceptual", "4/3 mm · por confirmar"],
      ["Composição e tabela de medidas", "A validar com o fornecedor"],
    ],
    help: "Um fato deve assentar de forma ajustada sem limitar os movimentos. A tabela de altura, peso e medidas terá de ser fornecida pela marca antes de qualquer recomendação de tamanho.",
  },
  {
    id: "everyday-wave-tee",
    name: "Everyday Wave Tee",
    category: "Vestuário",
    note: "O mar também vem contigo.",
    price: 35,
    art: 2,
    tag: "Fora de água",
    variants: ["S", "M", "L", "XL"],
    color: "Cru",
    description:
      "Uma t-shirt simples para os intervalos entre sessões. Um estudo de produto de marca própria, com um pequeno motivo de onda no peito.",
    specs: [
      ["Modelo ilustrado", "T-shirt · manga curta"],
      ["Cor conceptual", "Cru"],
      ["Composição, corte e gramagem", "Por definir"],
    ],
    help: "Os tamanhos são exemplos de navegação. O corte e a tabela de medidas serão definidos depois de confirmar o produto real; esta imagem não comprova composição ou gramagem.",
  },
  {
    id: "sunset-twin",
    name: "Sunset Twin",
    category: "Pranchas",
    note: "Uma linha diferente na onda.",
    price: 545,
    art: 3,
    tag: "Outra perspetiva",
    variants: ["5′6″", "5′8″", "5′10″"],
    color: "Terracota",
    description:
      "Uma silhueta fish em terracota e areia. Uma proposta visual para explorar a diversidade de formas de uma seleção de pranchas.",
    specs: [
      ["Formato ilustrado", "Fish · cauda recortada"],
      ["Medidas de demonstração", "5′6″ / 5′8″ / 5′10″"],
      ["Construção, volume e quilhas", "A validar com o fornecedor"],
    ],
    help: "O nome Twin é conceptual. O sistema de quilhas, o volume e a construção ainda não estão definidos. A escolha de uma prancha real deve ser acompanhada por informação técnica confirmada.",
  },
];
const categories = ["Tudo", "Pranchas", "Fatos", "Vestuário"];
const equipment = [
  {
    id: "prancha",
    name: "Prancha",
    detail: "Só precisas de levar vontade.",
    art: 0,
  },
  {
    id: "conjunto",
    name: "Prancha + fato",
    detail: "A combinação para a sessão.",
    art: 3,
  },
  {
    id: "fato",
    name: "Fato",
    detail: "O complemento para entrar na água.",
    art: 1,
  },
];
const state = {
  category: "Tudo",
  query: "",
  sort: "featured",
  variant: 0,
  rental: "prancha",
  duration: "Meio dia",
  filtersOpen: false,
};
let cart = [];
try {
  const saved = JSON.parse(
    sessionStorage.getItem("surf-point-selection") || "[]",
  );
  if (Array.isArray(saved))
    cart = saved.filter(
      (x) =>
        products.some((p) => p.id === x.id && p.variants.includes(x.variant)) &&
        Number.isInteger(x.quantity) &&
        x.quantity > 0 &&
        x.quantity <= 20,
    );
} catch {
  /* Armazenamento pode estar indisponível em file://. */
}
const main = document.getElementById("conteudo");
const dialog = document.getElementById("overlay");
const dialogContent = document.getElementById("dialog-content");
let returnFocus = null;
let currentProduct = null;
const money = (n) =>
  new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
const escapeHTML = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const arrow =
  '<svg class="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
const productArt = (p) =>
  `<div class="art art-${p.art}" role="img" aria-label="${escapeHTML(p.name)} — imagem conceptual gerada por IA"></div>`;
const rentalArt = (e) =>
  e.id === "conjunto"
    ? `<div class="rental-kit">${productArt(products[0])}${productArt(products[1])}</div>`
    : productArt(e);
const card = (p) =>
  `<a class="product-card" href="#produto/${p.id}"><div class="card-art">${productArt(p)}<span class="card-tag">${p.tag}</span><span class="card-link-icon" aria-hidden="true">${arrow}</span></div><div class="product-meta"><span>${p.category}</span><span>${p.color}</span></div><h3>${p.name}</h3><div class="card-bottom"><span class="price">${money(p.price)}</span><span class="card-variants">${p.variants.length} ${p.category === "Pranchas" ? "medidas" : "tamanhos"}</span></div></a>`;

function home() {
  return `<section class="hero" aria-labelledby="home-title"><div class="hero-copy"><p class="eyebrow">Surf Point · Ericeira, Portugal</p><h1 id="home-title">O mar<br> não<br> <em>espera.</em></h1><p class="hero-description">Pranchas, fatos e o essencial para o teu próximo encontro com o Atlântico.</p><a class="button orange" href="#loja">Explorar a loja ${arrow}</a><a class="hero-rental" href="#alugueres">Só de passagem? Descobre os alugueres ${arrow}</a></div><div class="hero-image"><img src="assets/hero.png" alt="Ondas e falésias de uma costa atlântica imaginada, numa imagem gerada por IA" fetchpriority="high"><span class="hero-index">01 — O PONTO DE PARTIDA</span><span class="hero-image-caption">Há dias que pedem mar.</span><span class="image-tag">PAISAGEM CONCEPTUAL · IA</span></div></section>
<nav class="category-strip" aria-label="Explorar por categoria">${[
    ["Pranchas", "loja?categoria=Pranchas"],
    ["Fatos", "loja?categoria=Fatos"],
    ["Vestuário", "loja?categoria=Vestuário"],
    ["Alugueres", "alugueres"],
  ]
    .map(
      ([name, route], i) =>
        `<a href="#${route}"><small>0${i + 1}</small><strong>${name}</strong>${arrow}</a>`,
    )
    .join("")}</nav>
<section class="wrap home-collection"><div class="collection-intro"><p class="eyebrow">Material em primeiro lugar</p><p>Dentro de água ou depois da sessão.<br>Uma seleção para descobrir ao teu ritmo.</p></div><div class="section-heading"><h2>O teu próximo<br><span>essencial.</span></h2><a class="text-link" href="#loja">Ver a seleção ${arrow}</a></div><div class="product-grid">${products.map(card).join("")}</div><p class="collection-note">Seleção conceptual · Produtos, variantes e preços de demonstração. Sem encomendas reais.</p></section>
<section class="rental-feature" aria-labelledby="home-rental-title"><div class="rental-art">${productArt(products[3])}<span class="vertical-note">MENOS BAGAGEM. MAIS MAR.</span><span class="rental-stamp" aria-hidden="true">RENT<br>& SURF</span></div><div class="rental-feature-copy"><p class="eyebrow">Outro modo de entrar na água / Alugueres</p><h2 id="home-rental-title">Viaja leve.<br>Surfa mais.</h2><p>Não trouxeste o equipamento? Explora uma proposta de aluguer de prancha e fato para a tua sessão.</p><a class="button" href="#alugueres">Descobrir os alugueres ${arrow}</a></div></section>
<section class="wrap home-story"><div><p class="eyebrow">Da loja para o mar</p><h2>Há um ponto<br>onde tudo começa.</h2></div><div><div class="story-rule"></div><p>Uma prancha debaixo do braço. Uma conversa sobre o mar. A ideia é simples: trazer para o digital a proximidade de uma loja de surf.</p><a class="text-link" href="#ponto">O nosso ponto de partida ${arrow}</a></div></section>`;
}
function catalog() {
  return `<section class="wrap page-head"><div class="breadcrumb"><a href="#inicio">Início</a><span aria-hidden="true">/</span><span>Loja</span></div><div class="page-head-row"><h1>Encontra a tua<br><span>próxima linha.</span></h1><p>Pranchas, fatos e peças para fora de água. Explora a seleção, compara e escolhe ao teu ritmo.</p></div></section><section class="wrap catalog" aria-label="Catálogo de produtos"><div class="catalog-toolbar"><button class="mobile-filter-toggle" aria-expanded="${state.filtersOpen}" aria-controls="categories" data-action="filters">Filtrar por categoria <span aria-hidden="true">${state.filtersOpen ? "−" : "+"}</span></button><div id="categories" class="category-filters ${state.filtersOpen ? "is-open" : ""}" role="group" aria-label="Categoria">${categories.map((c) => `<button class="filter-button" data-category="${c}" aria-pressed="${state.category === c}">${c}</button>`).join("")}</div><div class="catalog-tools"><label class="search-field"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></svg><span class="sr-only">Pesquisar produtos no catálogo</span><input id="catalog-search" type="search" autocomplete="off" placeholder="O que procuras?" value="${escapeHTML(state.query)}"></label><label class="sort-label"><span>Ordenar:</span><select id="catalog-sort" aria-label="Ordenar produtos"><option value="featured">Seleção Surf Point</option><option value="asc">Preço: crescente</option><option value="desc">Preço: decrescente</option><option value="name">Nome: A–Z</option></select></label></div></div><div class="catalog-status"><span id="product-count" aria-live="polite"></span><button class="reset-button" data-action="reset">Limpar filtros</button></div><div class="product-grid catalog-grid" id="catalog-grid"></div><p class="collection-note">Todos os produtos, imagens e preços são demonstrativos.</p></section>`;
}
function updateCatalog() {
  const normalized = (s) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  let list = products.filter(
    (p) =>
      (state.category === "Tudo" || p.category === state.category) &&
      normalized(p.name + " " + p.category + " " + p.color).includes(
        normalized(state.query.trim()),
      ),
  );
  if (state.sort === "asc") list.sort((a, b) => a.price - b.price);
  if (state.sort === "desc") list.sort((a, b) => b.price - a.price);
  if (state.sort === "name")
    list.sort((a, b) => a.name.localeCompare(b.name, "pt"));
  document.getElementById("catalog-grid").innerHTML = list.length
    ? list.map(card).join("")
    : `<div class="empty-state"><p class="eyebrow">Pesquisa sem resultados</p><h2>Ainda não encontraste a tua onda?</h2><p>Experimenta outra palavra ou volta a ver toda a seleção.</p><button class="button" data-action="reset">Limpar pesquisa e filtros ${arrow}</button></div>`;
  document.getElementById("product-count").textContent =
    `${list.length} ${list.length === 1 ? "produto" : "produtos"}${state.category === "Tudo" ? "" : ` / ${state.category}`}`;
  document
    .querySelectorAll("[data-category]")
    .forEach((b) =>
      b.setAttribute(
        "aria-pressed",
        String(b.dataset.category === state.category),
      ),
    );
  const reset = document.querySelector(".catalog-status .reset-button");
  reset.hidden =
    state.category === "Tudo" && !state.query && state.sort === "featured";
}
function productPage(p) {
  return `<section class="wrap product-page"><div class="breadcrumb"><a href="#inicio">Início</a><span>/</span><a href="#loja">Loja</a><span>/</span><a href="#loja?categoria=${encodeURIComponent(p.category)}">${p.category}</a><span>/</span><span>${p.name}</span></div><div class="product-layout"><div class="product-gallery"><div class="gallery-stage" id="gallery-stage">${productArt(p)}<span class="gallery-badge">${p.color} / Estudo de produto</span></div><div class="gallery-tabs" role="group" aria-label="Apresentação do produto"><button class="gallery-tab" data-gallery="full" aria-pressed="true">${productArt(p)}<span>Vista completa</span></button><button class="gallery-tab" data-gallery="detail" aria-pressed="false">${productArt(p)}<span>Aproximar imagem</span></button></div><p class="caption">Imagem conceptual gerada por IA. Não representa um artigo real da loja.</p></div><div class="product-info"><p class="eyebrow">Surf Point / ${p.category}</p><h1>${p.name}</h1><div class="product-price">${money(p.price)}<span>Preço demonstrativo</span></div><p class="product-description">${p.description}</p><fieldset class="variant-fieldset"><legend>${p.category === "Pranchas" ? "Medida" : "Tamanho"} <span id="selected-variant">/ ${p.variants[0]}</span></legend><div class="variant-list">${p.variants.map((v, i) => `<button class="variant-button" data-variant="${i}" aria-pressed="${i === 0}">${v}</button>`).join("")}</div></fieldset><button class="choice-help" data-action="help">Precisas de ajuda a escolher?</button><button class="button full" data-action="add">Adicionar à seleção <span class="arrow" aria-hidden="true">+</span></button><p class="caption">Uma seleção local. Não cria uma encomenda.</p><div class="product-details"><details open><summary>O produto, em detalhe</summary><ul class="spec-list">${p.specs.map(([a, b]) => `<li><span>${a}</span><span>${b}</span></li>`).join("")}</ul><p>Ficha conceptual. As características técnicas serão confirmadas antes de qualquer venda.</p></details><details><summary>Entregas e devoluções</summary><p>Condições por definir com a Surf Point. Não estão confirmados portes, prazos ou regras de devolução. Este protótipo não aceita encomendas.</p></details><details><summary>Ver o equipamento na loja</summary><p>A proximidade da loja é o ponto de partida desta proposta. Moradas, horários e formas de contacto serão integrados depois de confirmados.</p></details></div></div></div></section><section class="wrap related-section"><div class="section-heading"><h2>Na mesma <span>onda.</span></h2><a class="text-link" href="#loja">Ver tudo ${arrow}</a></div><div class="product-grid">${products
    .filter((x) => x.id !== p.id)
    .map(card)
    .join("")}</div></section>`;
}
function rentals() {
  const e = equipment.find((x) => x.id === state.rental);
  return `<section class="wrap rental-heading"><div class="breadcrumb"><a href="#inicio">Início</a><span>/</span><span>Alugueres</span></div><p class="eyebrow">Surf Point / Rent & surf</p><div class="rental-heading-row"><h1>Leva só<br>a vontade.</h1><p>Prancha, fato ou os dois. Imagina a tua sessão e prepara uma seleção de equipamento, sem compromisso.</p></div></section><section class="rental-configurator" aria-label="Simulador de aluguer"><div class="rental-visual"><span class="rental-visual-tag eyebrow">MENOS BAGAGEM. MAIS MAR.</span><div id="rental-art">${rentalArt(e)}</div><div class="rental-visual-label"><strong id="rental-label">${e.name}</strong><span>EQUIPAMENTO CONCEPTUAL · IA</span></div></div><div class="rental-form"><div class="numbered-label"><span>01</span><h2>O que vai contigo?</h2></div><div class="equipment-list" role="group" aria-label="Equipamento para alugar">${equipment.map((x) => `<button class="equipment-option" data-equipment="${x.id}" aria-pressed="${state.rental === x.id}"><span class="radio-dot" aria-hidden="true"></span><span><strong>${x.name}</strong><small>${x.detail}</small></span>${arrow}</button>`).join("")}</div><div class="numbered-label"><span>02</span><h2>Sem olhar para o relógio.</h2></div><label class="duration-field">Duração ilustrativa<select id="rental-duration">${["2 horas", "Meio dia", "1 dia"].map((x) => `<option${state.duration === x ? " selected" : ""}>${x}</option>`).join("")}</select></label><div class="rental-summary-line"><span>Tarifa de aluguer</span><strong>A definir</strong></div><button class="button full" data-action="rental-summary">Ver a minha simulação ${arrow}</button><p class="caption">Sem consulta de disponibilidade ou reserva. Tarifas e condições por definir.</p></div></section><section class="wrap rental-process"><h2>Do ponto de partida à água.</h2><div class="steps">${[
    ["Escolher", "Explora os tipos de equipamento e a duração da sessão."],
    [
      "Confirmar",
      "Numa futura versão: confirmar equipamento, disponibilidade e condições com a loja.",
    ],
    [
      "Entrar no mar",
      "Recolha e devolução serão definidas antes do lançamento do serviço digital.",
    ],
  ]
    .map(
      ([h, p], i) =>
        `<article><span>0${i + 1}</span><div><h3>${h}</h3><p>${p}</p></div></article>`,
    )
    .join(
      "",
    )}</div></section><section class="wrap rental-faq"><h2>Antes de<br>entrar na água.</h2><div><details><summary>Esta simulação é uma reserva?</summary><p>Não. A seleção fica apenas neste navegador. Não consulta stock, não envia pedidos e não garante equipamento ou datas.</p></details><details><summary>Qual é a prancha indicada para mim?</summary><p>O nível, o peso e as condições do mar são importantes para a escolha. O equipamento e o aconselhamento reais terão de ser confirmados com a equipa da loja.</p></details><details><summary>Quanto custa e onde se recolhe?</summary><p>As tarifas, cauções, horários, condições de utilização e locais de recolha estão por definir. Nenhum destes elementos é uma condição comercial nesta demonstração.</p></details></div></section>`;
}
function brand() {
  return `<section class="wrap brand-heading"><p class="eyebrow">Surf Point / O nosso ponto</p><div><h1>Uma loja.<br>Muitas linhas<br>para o mar.</h1><p>O surf começa antes de entrar na água. No material que escolhes. Nas conversas que levas. Na vontade de voltar.</p></div></section><div class="brand-image"><img src="assets/hero.png" alt="Paisagem atlântica imaginada, gerada por IA; não identifica uma praia real"><span class="image-tag">PAISAGEM CONCEPTUAL · IA</span></div><section class="wrap brand-text"><h2>A proximidade<br>também se sente<br>no digital.</h2><div><p>Pranchas em primeiro plano. Equipamento que se pode descobrir com calma. Uma identidade direta, inspirada no lettering e no contraste das imagens da Surf Point que nos foram fornecidas.</p><p>Esta é uma proposta para prolongar a experiência da loja no digital. A história, as pessoas e as fotografias reais terão o seu lugar depois de confirmadas com o proprietário.</p><a class="text-link" href="#loja">Descobrir a seleção ${arrow}</a></div></section><div class="wrap brand-manifesto"><span>Equipamento</span><span aria-hidden="true">+</span><span>Proximidade</span><span aria-hidden="true">+</span><span>Cultura de surf</span></div><section class="wrap home-story"><div><p class="eyebrow">Um caminho possível</p><h2>Primeiro, a visão.<br>Depois, a próxima onda.</h2></div><div><p>Uma demonstração para conversar sobre o que faz sentido para a Surf Point. O catálogo real, a identidade final e as condições comerciais serão definidos em conjunto.</p><button class="text-button" data-action="about">Sobre esta demonstração ${arrow}</button></div></section>`;
}
function render() {
  const [path, params = ""] = (location.hash.slice(1) || "inicio").split("?");
  const searchParams = new URLSearchParams(params);
  currentProduct = null;
  if (dialog.open) closeDialog(false);
  if (path === "loja") {
    if (searchParams.has("categoria"))
      state.category = categories.includes(searchParams.get("categoria"))
        ? searchParams.get("categoria")
        : "Tudo";
    if (searchParams.has("pesquisa"))
      state.query = searchParams.get("pesquisa");
    main.innerHTML = catalog();
    document.getElementById("catalog-sort").value = state.sort;
    updateCatalog();
  } else if (path.startsWith("produto/")) {
    currentProduct = products.find((p) => p.id === path.split("/")[1]);
    state.variant = 0;
    main.innerHTML = currentProduct
      ? productPage(currentProduct)
      : `<section class="wrap page-head"><h1>Esta linha<br>não existe.</h1><p>O produto que procuras não faz parte desta seleção.</p><a class="text-link" href="#loja">Voltar à loja ${arrow}</a></section>`;
  } else
    main.innerHTML =
      path === "alugueres" ? rentals() : path === "ponto" ? brand() : home();
  const navPath = path.startsWith("produto/") ? "loja" : path;
  document.querySelectorAll("[data-nav]").forEach((a) => {
    if (a.dataset.nav === navPath) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  document.title = `${currentProduct ? currentProduct.name : path === "loja" ? "A seleção" : path === "alugueres" ? "Alugueres" : path === "ponto" ? "O nosso ponto" : "O ponto de partida é o mar."} — Surf Point`;
  window.scrollTo({ top: 0, behavior: "instant" });
  main.focus({ preventScroll: true });
}
function announce(message) {
  document.getElementById("announcer").textContent = message;
}
function updateCart() {
  const count = cart.reduce((sum, x) => sum + x.quantity, 0);
  document.querySelector(".cart-count").textContent = count;
  document
    .querySelector("[data-action=cart]")
    .setAttribute(
      "aria-label",
      `Abrir seleção, ${count} ${count === 1 ? "artigo" : "artigos"}`,
    );
  try {
    sessionStorage.setItem("surf-point-selection", JSON.stringify(cart));
  } catch {
    /* A seleção continua a funcionar em memória. */
  }
}
function modal(title, content, kind = "info") {
  if (!dialog.open) returnFocus = document.activeElement;
  dialog.dataset.kind = kind;
  dialogContent.innerHTML = `<div class="dialog-inner"><div class="dialog-top"><h2 id="dialog-title">${title}</h2><button class="close-button" data-action="close" aria-label="Fechar diálogo">×</button></div>${content}</div>`;
  if (!dialog.open) dialog.showModal();
  const first = dialog.querySelector(
    kind === "search" ? "input" : ".close-button",
  );
  first?.focus();
}
function closeDialog(restore = true) {
  dialog.close();
  if (restore && returnFocus?.isConnected) returnFocus.focus();
}
function showCart(added = false) {
  let content = added
    ? '<p role="status">Adicionado à tua seleção. Continua a explorar ao teu ritmo.</p>'
    : "";
  if (!cart.length)
    content += `<div class="cart-empty"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l1 13H4L5 8zM8 8V6a4 4 0 0 1 8 0v2"/></svg><h3>Espaço para a próxima onda.</h3><p>Ainda não adicionaste equipamento à tua seleção.</p><a class="button full" href="#loja" data-close-link>Explorar a loja ${arrow}</a></div>`;
  else {
    content += cart
      .map((item, i) => {
        const p = products.find((p) => p.id === item.id);
        return `<article class="cart-item">${productArt(p)}<div><h3>${p.name}</h3><p>${item.variant} · ${money(p.price)}</p><div class="cart-item-controls"><div class="quantity-control" aria-label="Quantidade de ${p.name}"><button data-quantity="${i}" data-change="-1" aria-label="Diminuir quantidade de ${p.name}" ${item.quantity === 1 ? "disabled" : ""}>−</button><span aria-live="polite">${item.quantity}</span><button data-quantity="${i}" data-change="1" aria-label="Aumentar quantidade de ${p.name}" ${item.quantity >= 20 ? "disabled" : ""}>+</button></div><button class="remove-item" data-remove="${i}" aria-label="Remover ${p.name}">Remover</button></div></div></article>`;
      })
      .join("");
    const total = cart.reduce(
      (n, x) => n + products.find((p) => p.id === x.id).price * x.quantity,
      0,
    );
    content += `<div class="cart-total"><span>Total ilustrativo</span><strong>${money(total)}</strong></div><p class="cart-notice">Sem encomendas ou pagamentos. Esta seleção é apenas uma demonstração local.</p><button class="button full" data-action="close">Continuar a explorar ${arrow}</button>`;
  }
  modal(
    "A tua seleção" +
      (cart.length ? ` (${cart.reduce((n, x) => n + x.quantity, 0)})` : ""),
    content,
    "cart",
  );
}
document.addEventListener("click", (event) => {
  const skip = event.target.closest(".skip-link");
  if (skip) {
    event.preventDefault();
    main.focus({ preventScroll: true });
    main.scrollIntoView({ block: "start", behavior: "instant" });
    return;
  }
  const closeLink = event.target.closest("[data-close-link]");
  if (closeLink) closeDialog(false);
  const b = event.target.closest("button");
  if (!b) return;
  if (b.dataset.category) {
    state.category = b.dataset.category;
    updateCatalog();
  }
  if (b.dataset.variant !== undefined) {
    state.variant = Number(b.dataset.variant);
    document
      .querySelectorAll("[data-variant]")
      .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    document.getElementById("selected-variant").textContent =
      "/ " + currentProduct.variants[state.variant];
  }
  if (b.dataset.gallery) {
    document
      .getElementById("gallery-stage")
      .classList.toggle("detail-view", b.dataset.gallery === "detail");
    document
      .querySelectorAll("[data-gallery]")
      .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    announce(
      b.dataset.gallery === "detail" ? "Imagem aproximada." : "Vista completa.",
    );
  }
  if (b.dataset.equipment) {
    state.rental = b.dataset.equipment;
    const e = equipment.find((x) => x.id === state.rental);
    document.getElementById("rental-art").innerHTML = rentalArt(e);
    document.getElementById("rental-label").textContent = e.name;
    document
      .querySelectorAll("[data-equipment]")
      .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    announce(`Equipamento: ${e.name}.`);
  }
  if (b.dataset.remove !== undefined) {
    cart.splice(Number(b.dataset.remove), 1);
    updateCart();
    showCart();
    announce("Artigo removido da seleção.");
  }
  if (b.dataset.quantity !== undefined) {
    const i = Number(b.dataset.quantity),
      change = Number(b.dataset.change);
    cart[i].quantity = Math.max(1, Math.min(20, cart[i].quantity + change));
    updateCart();
    showCart();
    dialog
      .querySelector(`[data-quantity="${i}"][data-change="${change}"]`)
      ?.focus();
  }
  const action = b.dataset.action;
  if (action === "close") closeDialog();
  if (action === "cart") showCart();
  if (action === "filters") {
    state.filtersOpen = !state.filtersOpen;
    b.setAttribute("aria-expanded", String(state.filtersOpen));
    b.querySelector("span").textContent = state.filtersOpen ? "−" : "+";
    document
      .getElementById("categories")
      .classList.toggle("is-open", state.filtersOpen);
  }
  if (action === "reset") {
    state.category = "Tudo";
    state.query = "";
    state.sort = "featured";
    document.getElementById("catalog-search").value = "";
    document.getElementById("catalog-sort").value = "featured";
    updateCatalog();
    document.getElementById("catalog-search").focus();
    announce("Filtros limpos. Quatro produtos disponíveis.");
  }
  if (action === "add" && currentProduct) {
    const variant = currentProduct.variants[state.variant];
    const item = cart.find(
      (x) => x.id === currentProduct.id && x.variant === variant,
    );
    if (item) item.quantity = Math.min(item.quantity + 1, 20);
    else cart.push({ id: currentProduct.id, variant, quantity: 1 });
    updateCart();
    showCart(true);
  }
  if (action === "search")
    modal(
      "Encontra o teu essencial.",
      `<form id="site-search" class="dialog-search"><label class="sr-only" for="global-search">Nome, categoria ou cor</label><input type="search" id="global-search" name="q" placeholder="Prancha, fato, t-shirt…" autocomplete="off"><button aria-label="Pesquisar no catálogo" type="submit">${arrow}</button></form><p class="caption">Pesquisa local na seleção demonstrativa.</p><div class="search-suggestions"><a href="#loja?categoria=Pranchas" data-close-link>Pranchas ${arrow}</a><a href="#loja?categoria=Fatos" data-close-link>Fatos ${arrow}</a><a href="#loja?categoria=Vestuário" data-close-link>Vestuário ${arrow}</a></div>`,
      "search",
    );
  if (action === "menu")
    modal(
      "O teu ponto de partida.",
      `<nav class="mobile-nav-links" aria-label="Navegação móvel"><a href="#loja" data-close-link>Loja ${arrow}</a><a href="#alugueres" data-close-link>Alugueres ${arrow}</a><a href="#ponto" data-close-link>O nosso ponto ${arrow}</a></nav><p class="caption">Surf Point · Ericeira, Portugal</p>`,
      "menu",
    );
  if (action === "help" && currentProduct)
    modal(
      "Encontrar a medida certa.",
      `<p>${currentProduct.help}</p><div class="dialog-section"><h3>Antes de escolher</h3><p>A ficha final deve incluir informação técnica e uma tabela de medidas fornecidas pela marca. Não há aconselhamento personalizado ou compra nesta demonstração.</p></div><button class="button full" data-action="close">Voltar ao produto ${arrow}</button>`,
    );
  if (action === "rental-summary") {
    const e = equipment.find((x) => x.id === state.rental);
    modal(
      "O plano para a tua sessão.",
      `<p>A tua simulação está preparada. Nenhuma reserva foi criada.</p><dl class="rental-result"><div><dt>Equipamento</dt><dd>${e.name}</dd></div><div><dt>Duração ilustrativa</dt><dd>${state.duration}</dd></div><div><dt>Tarifa</dt><dd>Por definir</dd></div><div><dt>Disponibilidade</dt><dd>Não consultada</dd></div></dl><p class="caption">Equipamento, preços, cauções e recolha a confirmar com a Surf Point. Não é enviado qualquer pedido.</p><button class="button full" data-action="close">Voltar à simulação ${arrow}</button>`,
    );
  }
  if (action === "about")
    modal(
      "Uma visão para a Surf Point.",
      `<p>Protótipo independente de apresentação. A identidade gráfica é uma proposta inspirada nas capturas do Instagram fornecidas, sem aprovação oficial.</p><div class="dialog-section"><h3>O que é demonstrativo</h3><p>Produtos, nomes, medidas, preços e durações. As imagens do equipamento e da costa foram geradas por IA e fornecidas nos anexos. A paisagem não representa uma praia identificada.</p></div><div class="dialog-section"><h3>O que fica para definir</h3><p>Catálogo, fotografias reais autorizadas, identidade final, contactos e condições comerciais. Não há compras, reservas, contas de utilizador ou envio de dados.</p></div><button class="button full" data-action="close">Continuar a explorar ${arrow}</button>`,
    );
});
document.addEventListener("input", (event) => {
  if (event.target.id === "catalog-search") {
    state.query = event.target.value;
    updateCatalog();
  }
});
document.addEventListener("change", (event) => {
  if (event.target.id === "catalog-sort") {
    state.sort = event.target.value;
    updateCatalog();
  }
  if (event.target.id === "rental-duration")
    state.duration = event.target.value;
});
document.addEventListener("submit", (event) => {
  if (event.target.id === "site-search") {
    event.preventDefault();
    const q = document.getElementById("global-search").value;
    state.category = "Tudo";
    state.query = q;
    state.sort = "featured";
    closeDialog(false);
    const destination = "#loja?pesquisa=" + encodeURIComponent(q);
    if (location.hash === destination) render();
    else location.hash = destination;
  }
});
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      closeDialog();
  }
});
dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeDialog();
});
dialog.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const items = [
    ...dialog.querySelectorAll(
      'button:not(:disabled),a[href],input,select,[tabindex="0"]',
    ),
  ].filter((x) => x.getClientRects().length);
  const first = items[0],
    last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
});
window.addEventListener("hashchange", render);
updateCart();
render();
