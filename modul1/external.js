// =======================
// 1. Output Dasar
// =======================
console.log("Hello dari file external!");
alert("Halo, ini dari file external!");
document.write("Ini ditulis lewat file external.<br>");
document.getElementById("judul").innerHTML =
  "Belajar JavaScript dari file external";

// =======================
// 2. Variabel
// =======================
var nama = "Ahmad Firdaus";
let umur = 20;
let hobi = "Sepak Bola";
var perguruantinggi = "Ilmu Komputer";
var Nim = 12345678910;

let kalimat = `Hallo Semua, Perkenalkan Nama Saya ${nama}.
Saya berusia ${umur} tahun, hobi saya adalah ${hobi}.
Sekarang saya menempuh pendidikan di bidang ${perguruantinggi}
dengan NIM ${Nim}.`;

alert(kalimat);
document.getElementById("output").innerHTML = kalimat;

// =======================
// 3. Jendela Dialog
// =======================
let namaInput = prompt("Siapa nama kamu?", "Guest");
let lanjut = confirm("Apakah kamu ingin melanjutkan?");
if (lanjut) {
  alert("Halo " + namaInput + ", selamat belajar JavaScript!");
} else {
  alert("Baiklah, sampai jumpa " + namaInput + "!");
}

// =======================
// 4. Operator
// =======================
let a = 10,
  b = 3;
let nilai = 75;

// Aritmatika
console.log("Tambah:", a + b);
console.log("Kurang:", a - b);
console.log("Kali:", a * b);
console.log("Bagi:", a / b);
console.log("Modulus:", a % b);
console.log("Pangkat:", a ** b);

// Penugasan
let x = 5;
x += 2;
console.log("x setelah += 2:", x);

// Perbandingan
console.log("Apakah umur == 20?", umur == 20);
console.log("Apakah umur > 18?", umur > 18);

// Logika
console.log("true && false =", true && false);
console.log("true || false =", true || false);
console.log("!true =", !true);

// Ternary
let hasil = nilai >= 60 ? "Lulus" : "Tidak Lulus";
console.log("Hasil nilai:", hasil);

// =======================
// 5. Percabangan
// =======================
// If-Else If
let grade;
if (nilai >= 85) {
  grade = "A";
} else if (nilai >= 70) {
  grade = "B";
} else if (nilai >= 60) {
  grade = "C";
} else {
  grade = "D";
}

// Switch
let hari = "Senin";
let pesan;
switch (hari) {
  case "Senin":
    pesan = "Awal minggu";
    break;
  case "Jumat":
    pesan = "Akhir minggu kerja";
    break;
  default:
    pesan = "Hari biasa";
}

// Nested If (Password Check)
let username = "admin";
let password = "12345";
let statusLogin;

if (username === "admin") {
  if (password === "12345") {
    statusLogin = "Login berhasil";
  } else {
    statusLogin = "Password salah";
  }
} else {
  statusLogin = "Username tidak ditemukan";
}

// =======================
// 6. Tampilkan Semua ke HTML
// =======================
document.getElementById(
  "output"
).innerHTML += `<br><br>Nilai kamu: ${nilai}, Grade: ${grade}<br>
   Hari ini: ${hari}, Pesan: ${pesan}<br>
   Status Login: ${statusLogin}`;
