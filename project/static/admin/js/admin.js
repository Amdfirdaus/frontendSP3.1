// ======================
// ELEMENTS
// ======================
const gridPanel = document.getElementById("gridPanel");
const formPanel = document.getElementById("formPanel");
const categoryPanel = document.getElementById("categoryPanel");

const formTitle = document.getElementById("formTitle");

const productGrid = document.getElementById("productGrid");
const productForm = document.getElementById("productForm");
const categoryForm = document.getElementById("categoryForm");

const productId = document.getElementById("productId");
const nama_produk = document.getElementById("nama_produk");
const deskripsi = document.getElementById("deskripsi");
const harga = document.getElementById("harga");
const kategori = document.getElementById("kategori");
const gambar = document.getElementById("gambar");
const stok = document.getElementById("stok");

const nama_kategori = document.getElementById("nama_kategori");

const searchInput = document.getElementById("search");
const filterKategori = document.getElementById("filterKategori");

let products = [];

// ======================
// PANEL CONTROL
// ======================
function hideAll() {
  gridPanel.classList.add("hidden");
  formPanel.classList.add("hidden");
  categoryPanel.classList.add("hidden");
  
  // Remove active class from all sidebar items
  document.querySelectorAll(".sidebar li").forEach((li) => {
    li.classList.remove("active");
  });
}

function showGrid() {
  hideAll();
  gridPanel.classList.remove("hidden");
  document.querySelectorAll(".sidebar li")[0].classList.add("active");
}

function showForm() {
  hideAll();
  formPanel.classList.remove("hidden");
  formTitle.innerText = "Tambah Produk";
  productForm.reset();
  productId.value = "";
  loadCategories(); // Reload categories when showing form
  document.querySelectorAll(".sidebar li")[1].classList.add("active");
}

function showCategoryForm() {
  hideAll();
  categoryPanel.classList.remove("hidden");
  categoryForm.reset();
  document.querySelectorAll(".sidebar li")[2].classList.add("active");
}

// ======================
// LOAD PRODUCTS
// ======================
function loadProducts() {
  fetch("/api/admin/products")
    .then((r) => r.json())
    .then((data) => {
      products = data;
      renderProducts(data);
    });
}

// ======================
// LOAD CATEGORIES
// ======================
function loadCategories() {
  fetch("/api/categories")
    .then((r) => {
      if (!r.ok) {
        throw new Error("Gagal memuat kategori");
      }
      return r.json();
    })
    .then((data) => {
      if (!data || data.length === 0) {
        kategori.innerHTML = `<option value="">Tidak ada kategori</option>`;
        filterKategori.innerHTML = `<option value="">Semua Kategori</option>`;
        return;
      }

      kategori.innerHTML = `<option value="">Pilih Kategori</option>`;
      filterKategori.innerHTML = `<option value="">Semua Kategori</option>`;

      data.forEach((k) => {
        kategori.innerHTML += `
          <option value="${k.id}">${k.nama_kategori}</option>
        `;
        filterKategori.innerHTML += `
          <option value="${k.nama_kategori}">${k.nama_kategori}</option>
        `;
      });
    })
    .catch((err) => {
      console.error("Error loading categories:", err);
      kategori.innerHTML = `<option value="">Error memuat kategori</option>`;
      filterKategori.innerHTML = `<option value="">Semua Kategori</option>`;
    });
}

// ======================
// RENDER PRODUCTS
// ======================
function renderProducts(data) {
  productGrid.innerHTML = "";

  data.forEach((p) => {
    productGrid.innerHTML += `
      <div class="product-card">
        <img src="${p.gambar || ""}">
        <h6>${p.nama_produk}</h6>
        <small>${p.kategori}</small>
        <div class="price">Rp ${p.harga}</div>
        <div class="stock">Stok: ${p.stok}</div>

        <div class="actions">
          <button onclick='editProduct(${JSON.stringify(p)})'>Edit</button>
          <button onclick='deleteProduct(${p.id})'>Hapus</button>
        </div>
      </div>
    `;
  });
}

// ======================
// ADD / EDIT PRODUCT
// ======================
productForm.onsubmit = (e) => {
  e.preventDefault();

  // Validate kategori is selected
  if (!kategori.value) {
    alert("Pilih kategori terlebih dahulu");
    return;
  }

  // Validate gambar is required for new products
  if (!productId.value && !gambar.files[0]) {
    alert("Gambar wajib diisi untuk produk baru");
    return;
  }

  const fd = new FormData();
  fd.append("nama_produk", nama_produk.value);
  fd.append("deskripsi", deskripsi.value);
  fd.append("harga", harga.value);
  fd.append("kategori_id", kategori.value);
  fd.append("stok", stok.value);
  if (gambar.files[0]) fd.append("gambar", gambar.files[0]);

  const url = productId.value
    ? `/api/admin/products/${productId.value}`
    : `/api/admin/products`;

  fetch(url, {
    method: "POST",
    body: fd,
    credentials: "include"
  })
    .then((r) => {
      if (!r.ok) {
        return r.json().then((data) => {
          throw new Error(data.error || "Gagal menyimpan produk");
        });
      }
      return r.json();
    })
    .then((data) => {
      alert(data.message || "Produk berhasil disimpan");
      showGrid();
      loadProducts();
    })
    .catch((err) => {
      alert("Terjadi kesalahan: " + err.message);
    });
};

// ======================
// EDIT PRODUCT
// ======================
function editProduct(p) {
  showForm();
  formTitle.innerText = "Edit Produk";

  productId.value = p.id;
  nama_produk.value = p.nama_produk;
  deskripsi.value = p.deskripsi;
  harga.value = p.harga;
  stok.value = p.stok;
  kategori.value = p.kategori_id;
}

// ======================
// DELETE PRODUCT
// ======================
function deleteProduct(id) {
  if (!confirm("Hapus produk ini?")) return;

  fetch(`/api/admin/products/${id}`, {
    method: "DELETE",
    credentials: "include"
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
        return;
      }
      alert(data.message || "Produk berhasil dihapus");
      loadProducts();
    })
    .catch((err) => {
      alert("Terjadi kesalahan: " + err.message);
    });
}

// ======================
// ADD CATEGORY
// ======================
categoryForm.onsubmit = (e) => {
  e.preventDefault();

  const nama = nama_kategori.value.trim();
  if (!nama) {
    alert("Nama kategori wajib diisi");
    return;
  }

  fetch("/api/admin/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ nama_kategori: nama }),
  })
    .then((r) => {
      if (!r.ok) {
        return r.json().then((data) => {
          throw new Error(data.error || "Gagal menambahkan kategori");
        });
      }
      return r.json();
    })
    .then((res) => {
      alert(res.message || "Kategori ditambahkan");
      nama_kategori.value = ""; // Clear input
      loadCategories(); // Reload categories
      showGrid(); // Go back to grid
    })
    .catch((err) => {
      alert("Error: " + err.message);
    });
};

// ======================
// SEARCH & FILTER
// ======================
function applyFilter() {
  const s = searchInput.value.toLowerCase();
  const k = filterKategori.value.toLowerCase();

  renderProducts(
    products.filter(
      (p) =>
        p.nama_produk.toLowerCase().includes(s) &&
        (k === "" || p.kategori.toLowerCase() === k)
    )
  );
}

searchInput.onkeyup = applyFilter;
filterKategori.onchange = applyFilter;

// ======================
// INIT
// ======================
loadCategories();
loadProducts();
showGrid();
