// ====== Data Lokasi (Benua dan Negara) ======
const dataLokasi = {
  asia: ["Jepang", "Indonesia", "Korea Selatan", "India"],
  eropa: ["Jerman", "Prancis", "Italia", "Spanyol"],
  amerika: ["Amerika Serikat", "Kanada", "Brasil", "Meksiko"],
};

// ====== 1. Fungsi untuk mengisi dropdown Benua ======
function inisialisasiBenua() {
  const selectBenua = document.getElementById("benua");

  // Tambahkan opsi default
  let defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "--- Pilih Benua ---";
  selectBenua.appendChild(defaultOption);

  // Tambahkan semua benua dari dataLokasi
  for (const benuaKey in dataLokasi) {
    let option = document.createElement("option");
    option.value = benuaKey;
    option.textContent = benuaKey.charAt(0).toUpperCase() + benuaKey.slice(1);
    selectBenua.appendChild(option);
  }
}

// ====== 2. Fungsi utama: dijalankan saat pilihan Benua diubah ======
function updateNegara() {
  const selectBenua = document.getElementById("benua");
  const selectNegara = document.getElementById("negara");
  const hasilElemen = document.getElementById("hasil");

  // Ambil nilai (value) benua yang dipilih
  const benuaTerpilih = selectBenua.value;

  // Reset dropdown negara dan hasil sebelumnya
  selectNegara.innerHTML = "";
  hasilElemen.textContent = "";

  // Jika ada benua dipilih
  if (benuaTerpilih) {
    // Tambahkan opsi default untuk negara
    let defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "-- Pilih Negara --";
    selectNegara.appendChild(defaultOption);

    // Ambil array negara berdasarkan benua
    const negaraArray = dataLokasi[benuaTerpilih];

    // Tambahkan opsi negara
    negaraArray.forEach(function (negara) {
      let option = document.createElement("option");
      option.value = negara.toLowerCase().replace(/\s+/g, "-");
      option.textContent = negara;
      selectNegara.appendChild(option);
    });

    // Tambahkan event listener ketika negara dipilih
    selectNegara.onchange = tampilkanHasil;
  } else {
    // Jika belum memilih benua
    let defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "-- Pilih Benua Dahulu --";
    selectNegara.appendChild(defaultOption);
  }
}

// ====== 3. Fungsi untuk menampilkan hasil akhir ======
function tampilkanHasil() {
  const selectBenua = document.getElementById("benua");
  const selectNegara = document.getElementById("negara");
  const hasilElemen = document.getElementById("hasil");

  const benuaTeks = selectBenua.options[selectBenua.selectedIndex].textContent;
  const negaraTeks =
    selectNegara.options[selectNegara.selectedIndex].textContent;

  if (selectNegara.value) {
    hasilElemen.textContent = `Anda memilih: ${negaraTeks}, yang terletak di benua ${benuaTeks}.`;
    hasilElemen.style.color = "green";
  } else {
    hasilElemen.textContent = "Silakan lengkapi pilihan Anda.";
    hasilElemen.style.color = "orange";
  }
}

// ====== 4. Jalankan fungsi inisialisasi saat halaman dimuat ======
document.addEventListener("DOMContentLoaded", inisialisasiBenua);
