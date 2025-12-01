// Pastikan jQuery sudah dimuat
$(function () {
  const STORAGE_KEY = "jquery_todos_v1";

  function loadTodos() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  function saveTodos(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  function render() {
    const todos = loadTodos();
    const $list = $("#todo-list").empty();
    if (todos.length === 0) {
      $list.append('<li style="color:#666">Belum ada tugas.</li>');
      return;
    }
    todos.forEach(function (item, idx) {
      const $li = $("<li></li>");
      const $text = $('<span class="todo-text"></span>').text(item.text);
      if (item.done) $text.addClass("completed");
      const $controls = $("<div></div>");
      const $toggle = $(
        '<button class="btn toggle-btn" title="Tandai selesai">✔</button>'
      );
      const $edit = $('<button class="btn edit-btn" title="Edit">✎</button>');
      const $del = $('<button class="btn del-btn" title="Hapus">✖</button>');

      $toggle.on("click", function () {
        todos[idx].done = !todos[idx].done;
        saveTodos(todos);
        render();
      });

      $edit.on("click", function () {
        const newText = prompt("Edit tugas:", todos[idx].text);
        if (newText !== null) {
          todos[idx].text = newText.trim();
          saveTodos(todos);
          render();
        }
      });

      $del.on("click", function () {
        if (confirm("Hapus tugas ini?")) {
          todos.splice(idx, 1);
          saveTodos(todos);
          render();
        }
      });

      $controls.append($toggle, $edit, $del);
      $li.append($text, $controls);
      $list.append($li);
    });
  }

  // submit add
  $("#todo-form").on("submit", function (e) {
    e.preventDefault();
    const val = $("#todo-input").val().trim();
    if (!val) return alert("Masukkan teks tugas.");
    const todos = loadTodos();
    todos.push({ text: val, done: false });
    saveTodos(todos);
    $("#todo-input").val("");
    render();
  });

  $("#clear-btn").on("click", function () {
    if (!confirm("Hapus semua tugas?")) return;
    localStorage.removeItem(STORAGE_KEY);
    render();
  });

  // initial render
  render();
});
