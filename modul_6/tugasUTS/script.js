// Ambil elemen penting
const kategori = document.getElementById("kategori");
const namaBarang = document.getElementById("namaBarang");
const hargaBarang = document.getElementById("hargaBarang");
const jumlahBarang = document.getElementById("jumlahBarang");
const jenisPenjualan = document.getElementById("jenisPenjualan");

const totalPenjualan = document.getElementById("totalPenjualan");
const diskon = document.getElementById("diskon");
const pajak = document.getElementById("pajak");
const hargaTotal = document.getElementById("hargaTotal");

const popupLaptop = document.getElementById("popupLaptop");
const popupAksesoris = document.getElementById("popupAksesoris");
const popupJenis = document.getElementById("popupJenis");

let barangDipilih = null;
let jenisDipilih = null;

// === TAMPILKAN POPUP SAAT KLIK KOLOM NAMA BARANG ===
namaBarang.addEventListener("click", () => {
  if (kategori.value === "") {
    alert("Pilih kategori terlebih dahulu sebelum memilih barang!");
    return;
  }

  // Tampilkan popup sesuai kategori
  if (kategori.value === "laptop") popupLaptop.style.display = "flex";
  if (kategori.value === "aksesoris") popupAksesoris.style.display = "flex";
});

// === PILIH ITEM BARANG DARI POPUP ===
document
  .querySelectorAll("#popupLaptop li, #popupAksesoris li")
  .forEach((item) => {
    item.addEventListener("click", () => {
      document
        .querySelectorAll("#popupLaptop li, #popupAksesoris li")
        .forEach((li) => li.classList.remove("selected"));
      item.classList.add("selected");

      barangDipilih = {
        nama: item.dataset.nama,
        harga: parseFloat(item.dataset.harga),
      };
    });
  });

// === TOMBOL SIMPAN / BATAL UNTUK POPUP BARANG ===
document.querySelectorAll(".popup .simpan").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (barangDipilih) {
      namaBarang.value = barangDipilih.nama;
      hargaBarang.value = barangDipilih.harga;
    }
    popupLaptop.style.display = "none";
    popupAksesoris.style.display = "none";
  });
});

document.querySelectorAll(".popup .batal").forEach((btn) => {
  btn.addEventListener("click", () => {
    popupLaptop.style.display = "none";
    popupAksesoris.style.display = "none";
    popupJenis.style.display = "none";
  });
});

// === JENIS PENJUALAN POPUP ===
document.getElementById("btnJenis").addEventListener("click", () => {
  popupJenis.style.display = "flex";
});

document.querySelectorAll("#popupJenis li").forEach((item) => {
  item.addEventListener("click", () => {
    document
      .querySelectorAll("#popupJenis li")
      .forEach((li) => li.classList.remove("selected"));
    item.classList.add("selected");
    jenisDipilih = item.dataset.jenis;
  });
});

popupJenis.querySelector(".simpan").addEventListener("click", () => {
  if (jenisDipilih) jenisPenjualan.value = jenisDipilih.toUpperCase();
  popupJenis.style.display = "none";
});

// === HITUNG TOTAL HARGA ===
document.getElementById("btnHitung").addEventListener("click", () => {
  if (!barangDipilih || !jenisDipilih || !jumlahBarang.value) {
    alert("Lengkapi semua data sebelum menghitung!");
    return;
  }

  const harga = parseFloat(hargaBarang.value) || 0;
  const jumlah = parseInt(jumlahBarang.value) || 0;
  const total = harga * jumlah;

  // Pajak berdasarkan kategori
  let pajakValue = 0;
  if (kategori.value === "laptop") pajakValue = total * 0.15;
  if (kategori.value === "aksesoris") pajakValue = total * 0.1;

  // Diskon 10% jika tunai
  let diskonValue = 0;
  if (jenisDipilih === "tunai") diskonValue = total * 0.1;

  const totalAkhir = total - diskonValue + pajakValue;

  totalPenjualan.value = total.toLocaleString("id-ID");
  diskon.value = diskonValue.toLocaleString("id-ID");
  pajak.value = pajakValue.toLocaleString("id-ID");
  hargaTotal.value = totalAkhir.toLocaleString("id-ID");
});

// === RESET SEMUA DATA ===
document.getElementById("btnReset").addEventListener("click", () => {
  [
    namaBarang,
    hargaBarang,
    jumlahBarang,
    totalPenjualan,
    diskon,
    pajak,
    hargaTotal,
    jenisPenjualan,
  ].forEach((i) => (i.value = ""));
  kategori.value = "";
  barangDipilih = null;
  jenisDipilih = null;
});
