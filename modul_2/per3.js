function showOutput(teks) {
  document.getElementById("output").innerHTML += teks + "<br>";
}
function clearOutput() {
  document.getElementById("output").innerHTML = "";
}

// =========================
// Operator
// =========================
function demoOperator() {
  clearOutput();
  let a = 10,
    b = 5;

  showOutput("Penjumlahan: " + (a + b));
  showOutput("Pengurangan: " + (a - b));
  showOutput("Perkalian: " + a * b);
  showOutput("Pembagian: " + a / b);
  showOutput("Modulus: " + (a % b));

  let x = 10;
  x += 5;
  showOutput("Penugasan += : " + x);

  showOutput("Apakah a > b ? " + (a > b));
  showOutput("Apakah a == b ? " + (a == b));

  let c = true,
    d = false;
  showOutput("AND: " + (c && d));
  showOutput("OR : " + (c || d));
  showOutput("NOT: " + !c);

  let nilai = 80;
  showOutput("Hasil ternary: " + (nilai >= 75 ? "Lulus" : "Tidak Lulus"));
}

// =========================
// Percabangan
// =========================
function demoPercabangan() {
  clearOutput();
  let umur = 20;

  if (umur >= 18) showOutput("Dewasa");
  else showOutput("Anak-anak");

  if (umur < 18) showOutput("Anak-anak");
  else showOutput("Dewasa");

  let hari = "Senin";
  if (hari == "Senin") showOutput("Hari Senin");
  else if (hari == "Selasa") showOutput("Hari Selasa");
  else showOutput("Hari Lain");

  let warna = "merah";
  switch (warna) {
    case "merah":
      showOutput("Berhenti");
      break;
    case "kuning":
      showOutput("Hati-hati");
      break;
    case "hijau":
      showOutput("Jalan");
      break;
    default:
      showOutput("Warna tidak dikenal");
  }

  showOutput(umur >= 18 ? "Dewasa" : "Anak-anak");

  let angka = 7;
  if (angka > 0) {
    if (angka % 2 == 0) showOutput("Bilangan positif genap");
    else showOutput("Bilangan positif ganjil");
  }
}

// =========================
// Perulangan
// =========================
function demoPerulangan() {
  clearOutput();

  for (let i = 1; i <= 5; i++) showOutput("Perulangan for ke-" + i);

  for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 2; j++) showOutput("i = " + i + ", j = " + j);
  }

  let buah = ["Apel", "Jeruk", "Manggis"];
  for (let i in buah) showOutput("Buah ke-" + i + " : " + buah[i]);
  for (let item of buah) showOutput("Nama buah: " + item);
  buah.forEach((item, idx) => showOutput("forEach: " + idx + " " + item));

  showOutput("Hallo ".repeat(3));

  let k = 1;
  while (k <= 3) {
    showOutput("Perulangan while ke-" + k);
    k++;
  }

  let l = 1;
  do {
    showOutput("Perulangan do/while ke-" + l);
    l++;
  } while (l <= 3);
}

// =========================
// Array
// =========================
function demoArray() {
  clearOutput();

  let angkaArray = [1, 2, 3, 4, 5];
  showOutput("Isi array: " + angkaArray);
  showOutput("Ambil index ke-2: " + angkaArray[2]);

  for (let i = 0; i < angkaArray.length; i++) {
    showOutput("Index " + i + " = " + angkaArray[i]);
  }

  let buah = ["Apel", "Jeruk", "Manggis"];
  buah[3] = "Pisang";
  showOutput("Setelah tambah Pisang: " + buah);

  buah.push("Mangga");
  showOutput("Setelah push Mangga: " + buah);

  delete buah[1];
  showOutput("Setelah delete index 1: " + buah);

  buah.pop();
  showOutput("Setelah pop: " + buah);

  buah.shift();
  showOutput("Setelah shift: " + buah);
}
