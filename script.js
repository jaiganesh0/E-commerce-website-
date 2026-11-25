// E-commerce website - vanilla JS. Cart is saved in localStorage.
const PRODUCTS = [
 {id:1,n:'Wireless Earbuds',c:'Electronics',p:1499,col:'#27358f'},{id:2,n:'Smart Watch',c:'Electronics',p:2999,col:'#17a8cf'},
 {id:3,n:'LED Desk Lamp',c:'Home',p:799,col:'#d4a017'},{id:4,n:'Cotton T-Shirt',c:'Fashion',p:499,col:'#d6246e'},
 {id:5,n:'Running Shoes',c:'Fashion',p:1899,col:'#e4572e'},{id:6,n:'Steel Water Bottle',c:'Home',p:349,col:'#3a7d44'},
 {id:7,n:'Laptop Backpack',c:'Fashion',p:1099,col:'#34495e'},{id:8,n:'Bluetooth Speaker',c:'Electronics',p:1299,col:'#6a4c93'}];
let cart = {}; try { cart = JSON.parse(localStorage.getItem('quickcart') || '{}'); } catch {}
const $ = id => document.getElementById(id), money = n => 'Rs. ' + n.toLocaleString('en-IN');
const save = () => { try { localStorage.setItem('quickcart', JSON.stringify(cart)); } catch {} };

function renderProducts() {
  const q = $('q').value.toLowerCase(), cat = $('cat').value, s = $('sort').value;
  const list = PRODUCTS.filter(p => (cat === 'All' || p.c === cat) && p.n.toLowerCase().includes(q));
  if (s) list.sort((a, b) => s === 'asc' ? a.p - b.p : b.p - a.p);
  $('products').innerHTML = list.map(p => `<article class="card"><div class="pic" style="background:${p.col}">${p.n[0]}</div><div class="info"><h3>${p.n}</h3><small>${p.c}</small><span class="price">${money(p.p)}</span><button class="add" data-id="${p.id}">Add to cart</button></div></article>`).join('');
  $('none').hidden = list.length > 0;
}
function renderCart() {
  const rows = Object.entries(cart).map(([id, q]) => ({ p: PRODUCTS.find(x => x.id == id), q }));
  $('items').innerHTML = rows.map(({ p, q }) => `<li><span>${p.n}<br><small>${money(p.p)} each</small></span><b>${money(p.p * q)}</b>
    <span class="q"><button data-act="dec" data-id="${p.id}" aria-label="Decrease ${p.n}">-</button>${q}<button data-act="inc" data-id="${p.id}" aria-label="Increase ${p.n}">+</button></span><button class="rm" data-act="rm" data-id="${p.id}">Remove</button></li>`).join('');
  $('empty').hidden = rows.length > 0; $('n').textContent = rows.reduce((s, r) => s + r.q, 0);
  $('total').textContent = money(rows.reduce((s, r) => s + r.p.p * r.q, 0)); save();
}
$('cat').innerHTML = ['All', ...new Set(PRODUCTS.map(p => p.c))].map(c => `<option>${c}</option>`).join('');
['q', 'cat', 'sort'].forEach(id => $(id).addEventListener('input', renderProducts));
$('products').onclick = e => { const b = e.target.closest('.add'); if (!b) return; cart[b.dataset.id] = (cart[b.dataset.id] || 0) + 1; $('msg').textContent = ''; renderCart(); };
$('items').onclick = e => { const b = e.target.closest('button'); if (!b) return; const id = b.dataset.id, a = b.dataset.act;
  if (a === 'inc') cart[id]++; else if (a === 'dec') { if (--cart[id] <= 0) delete cart[id]; } else delete cart[id]; renderCart(); };
$('checkout').onclick = () => { if (!Object.keys(cart).length) { $('msg').textContent = 'Add something to your cart first.'; return; } cart = {}; renderCart(); $('msg').textContent = 'Order placed. Thank you for shopping!'; };
renderProducts(); renderCart();
