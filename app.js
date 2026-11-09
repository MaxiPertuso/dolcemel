'use strict';

const phone = '59898966775';
const whatsapp = message => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const dialog = document.querySelector('#product-dialog');
document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
function showProduct(product) {
  document.querySelector('#dialog-title').textContent = product.name;
  document.querySelector('#dialog-description').textContent = product.description;
  const image = document.querySelector('#dialog-image');
  image.src = product.image;
  image.alt = product.name;
  document.querySelector('#dialog-illustration').hidden = !product.illustrative;
  document.querySelector('#dialog-order').href = whatsapp(`Hola DolceMel, me gustaría consultar por ${product.name}. ¿Me contás tamaños, sabores, precio y disponibilidad?`);
  dialog.showModal();
  document.body.classList.add('dialog-open');
}

const categoryLabels = { tortas: 'Tortas de autor', pasteleria: 'Pastelería fina', brigadeiros: 'Brigadeiros', especiales: 'Celebraciones' };
const container = document.querySelector('#products');
let products = [];
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}
function render(category = 'todos') {
  container.replaceChildren();
  const filtered = products.filter(product => category === 'todos' || product.category === category);
  filtered.forEach(product => {
    const article = element('article', 'product');
    const photo = element('button', 'product-photo');
    photo.type = 'button';
    photo.setAttribute('aria-label', `Ver detalles de ${product.name}`);
    photo.addEventListener('click', () => showProduct(product));
    const image = element('img');
    image.src = product.image;
    image.alt = product.name;
    image.loading = 'lazy';
    image.width = 800;
    image.height = 1000;
    photo.append(image);
    if (product.illustrative) photo.append(element('span', 'illustration', 'Imagen ilustrativa'));
    const body = element('div', 'product-body');
    body.append(element('p', 'product-category', categoryLabels[product.category]));
    body.append(element('h3', '', product.name));
    body.append(element('p', 'product-description', product.description));
    const order = element('a', 'product-order', 'Consultar por WhatsApp ↗');
    order.href = whatsapp(`Hola DolceMel, quiero consultar por ${product.name}.`);
    order.target = '_blank';
    order.rel = 'noopener';
    body.append(order);
    article.append(photo, body);
    container.append(article);
  });
  document.querySelector('#collection-status').textContent = `${filtered.length} productos en ${category === 'todos' ? 'toda la colección' : categoryLabels[category]}.`;
}
let currentFilter = 'todos';
function filter(category) {
  currentFilter = category;
  document.querySelectorAll('[data-filter]').forEach(button => {
    const active = button.dataset.filter === category;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  render(category);
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => filter(button.dataset.filter)));
document.querySelectorAll('[data-category]').forEach(link => link.addEventListener('click', () => filter(link.dataset.category)));

fetch('catalog.json').then(response => {
  if (!response.ok) throw new Error('No se pudo cargar el catálogo');
  return response.json();
}).then(catalog => {
  products = catalog;
  render(currentFilter);
  const select = document.querySelector('#order-product');
  products.forEach(product => select.append(new Option(product.name, product.name)));
}).catch(() => {
  const message = element('p', '', 'No pudimos cargar el catálogo. Consultanos por WhatsApp para conocer todos los productos.');
  container.replaceChildren(message);
  document.querySelector('#collection-status').textContent = message.textContent;
});

const dateInput = document.querySelector('#event-date');
function localToday() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
dateInput.min = localToday();
document.querySelector('#year').textContent = String(new Date().getFullYear());
document.querySelector('#order-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  dateInput.min = localToday();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const name = String(data.get('nombre')).trim();
  const feedback = document.querySelector('#form-feedback');
  if (!name) { feedback.textContent = 'Escribí tu nombre para preparar la consulta.'; form.elements.nombre.focus(); return; }
  const lines = [`Hola DolceMel, soy ${name}.`, `Quisiera consultar por: ${data.get('producto')}.`];
  const date = data.get('fecha');
  if (date) lines.push(`Fecha del evento: ${date.split('-').reverse().join('/')}.`);
  if (data.get('personas')) lines.push(`Cantidad de personas: ${data.get('personas')}.`);
  const idea = String(data.get('idea')).trim();
  if (idea) lines.push(`Mi idea: ${idea}`);
  lines.push('¿Me contás las opciones y disponibilidad?');
  // Same-tab navigation avoids popup blockers; no message is sent automatically.
  window.location.assign(whatsapp(lines.join('\n')));
});
