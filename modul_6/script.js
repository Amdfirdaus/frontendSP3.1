document.getElementById("openPopup").onclick = function () {
  document.getElementById("popup").style.display = "block";
};

document.getElementById("closePopup").onclick = function () {
  document.getElementById("popup").style.display = "none";
};

window.onclick = function (event) {
  const popup = document.getElementById("popup");
  if (event.target == popup) {
    popup.style.display = "none";
  }
};

const btnForm = document.getElementById("btnForm");
const popupForm = document.getElementById("popupForm");
const closeForm = document.getElementById("closeForm");
const kirim = document.getElementById("kirim");

btnForm.onclick = function () {
  popupForm.style.display = "block";
};

closeForm.onclick = function () {
  popupForm.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == popupForm) {
    popupForm.style.display = "none";
  }
};

kirim.onclick = function () {
  const nama = document.getElementById("nama").value;
  const harga = document.getElementById("harga").value;
  const jumlah = document.getElementById("jumlah").value;

  if (nama && harga && jumlah) {
    alert(`Data Barang:\nNama: ${nama}\nHarga: ${harga}\nJumlah: ${jumlah}`);
    popupForm.style.display = "none";
  } else {
    alert("Harap isi semua field!");
  }
};
