$(function () {
  const STORAGE_KEY = "jquery_users_v1";

  function load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }
  function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
  function render() {
    const users = load();
    const $body = $("#user-table tbody").empty();
    if (users.length === 0) {
      $body.append(
        '<tr><td colspan="3" style="color:#666">Belum ada data.</td></tr>'
      );
      return;
    }
    users.forEach(function (u, idx) {
      const $tr = $("<tr></tr>");
      $tr.append($("<td></td>").text(u.name));
      $tr.append($("<td></td>").text(u.email));
      const $actions = $("<td></td>");
      const $edit = $('<button class="btn edit-btn">Edit</button>');
      const $del = $('<button class="btn del-btn">Hapus</button>');
      $edit.on("click", function () {
        $("#user-id").val(idx);
        $("#name").val(u.name);
        $("#email").val(u.email);
        $("#save-btn").text("Perbarui");
      });
      $del.on("click", function () {
        if (!confirm("Hapus pengguna ini?")) return;
        users.splice(idx, 1);
        save(users);
        render();
      });
      $actions.append($edit, $del);
      $tr.append($actions);
      $body.append($tr);
    });
  }

  $("#user-form").on("submit", function (e) {
    e.preventDefault();
    const id = $("#user-id").val();
    const name = $("#name").val().trim();
    const email = $("#email").val().trim();
    if (!name || !email) return alert("Nama dan email required.");
    const users = load();
    if (id === "") {
      // create
      users.push({ name: name, email: email });
    } else {
      // update
      users[+id] = { name: name, email: email };
    }
    save(users);
    $("#user-id").val("");
    $("#name").val("");
    $("#email").val("");
    $("#save-btn").text("Simpan");
    render();
  });

  render();
});
