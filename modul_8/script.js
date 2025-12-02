$(function () {
  $("#slider").slider({
    range: true,
    min: 0,
    max: 200000,
    values: [20000, 150000],

    slide: function (event, ui) {
      $("#labelHarga").text(
        "Harga: Rp " +
          ui.values[0].toLocaleString() +
          " - Rp " +
          ui.values[1].toLocaleString()
      );

      filterProduk(ui.values[0], ui.values[1]);
    },
  });

  function filterProduk(min, max) {
    $(".produk").each(function () {
      let harga = parseInt($(this).data("harga"));

      if (harga >= min && harga <= max) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }

  // Jalankan pertama kali
  filterProduk(20000, 150000);
});
