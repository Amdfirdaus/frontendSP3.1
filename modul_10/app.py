from flask import Flask, jsonify, request, render_template, send_from_directory
from flask import session, redirect, url_for
from flask_mysqldb import MySQL
from flask_cors import CORS
import MySQLdb.cursors
import os
import uuid

app = Flask(__name__)
CORS(app, supports_credentials=True)


# =====================
# CONFIG DATABASE
# =====================
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = os.getenv('DB_PASSWORD', 'firdaus')
app.config['MYSQL_DB'] = 'db_toko_bangunan'

app.secret_key = 'toko_bangunan_secret'
mysql = MySQL(app)

app.config.update(
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=False
)


# =====================
# CONFIG UPLOAD GAMBAR
# =====================
UPLOAD_FOLDER = os.path.join('static', 'admin', 'images')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# =====================
# HELPER
# =====================
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def get_image_url(filename):
    if not filename:
        return None

    admin_path = os.path.join(app.root_path, 'static', 'admin', 'images', filename)
    user_path = os.path.join(app.root_path, 'static', 'user', 'images', filename)

    if os.path.exists(admin_path):
        return f"/static/admin/images/{filename}"
    if os.path.exists(user_path):
        return f"/static/user/images/{filename}"
    return None


@app.route('/static/admin/images/<path:filename>')
def serve_images(filename):
    return send_from_directory(
        os.path.join(app.root_path, 'static', 'admin', 'images'),
        filename
    )

# =====================================================
# PUBLIC API
# =====================================================
@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    if not username or not password:
        return "Login gagal", 400

    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT id, role FROM users
        WHERE username=%s AND password=%s
    """, (username, password))
    user = cur.fetchone()
    cur.close()

    if not user:
        return "Username atau password salah", 401

    session['user_id'] = user[0]
    session['role'] = user[1]

    if user[1] == 'admin':
        return redirect('/admin')
    else:
        return redirect('/')


@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

@app.route('/api/categories')
def get_categories():
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, nama_kategori FROM categories")
    rows = cur.fetchall()
    cur.close()

    return jsonify([
        {"id": r[0], "nama_kategori": r[1]} for r in rows
    ])


@app.route('/api/products')
def get_products():
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT p.id, p.nama_produk, p.harga, p.gambar,
               p.deskripsi, c.nama_kategori
        FROM products p
        JOIN categories c ON p.kategori_id = c.id
        ORDER BY p.id ASC
    """)
    rows = cur.fetchall()
    cur.close()

    return jsonify([
        {
            "id": r[0],
            "nama_produk": r[1],
            "harga": r[2],
            "gambar": get_image_url(r[3]),
            "deskripsi": r[4],
            "kategori": r[5]
        } for r in rows
    ])



@app.route('/api/products/category/<int:kategori_id>')
def get_products_by_category(kategori_id):
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT p.id, p.nama_produk, p.harga, p.gambar, c.nama_kategori
        FROM products p
        JOIN categories c ON p.kategori_id = c.id
        WHERE p.kategori_id = %s
        ORDER BY p.id ASC
    """, (kategori_id,))
    rows = cur.fetchall()
    cur.close()

    return jsonify([
        {
            "id": r[0],
            "nama_produk": r[1],
            "harga": r[2],
            "gambar": get_image_url(r[3]),
            "kategori": r[4]
        } for r in rows
    ])


@app.route('/api/products/<int:id>')
def get_product(id):
    cur = mysql.connection.cursor()
    cur.execute("""
    SELECT id, nama_produk, deskripsi, harga, gambar, kategori_id
    FROM products WHERE id=%s
""", (id,))
    row = cur.fetchone()
    cur.close()

    if not row:
        return jsonify({"error": "Produk tidak ditemukan"}), 404

    return jsonify({
    "id": row[0],
    "nama_produk": row[1],
    "deskripsi": row[2],   # 🔥 TAMBAH
    "harga": row[3],
    "gambar": get_image_url(row[4]),
    "kategori_id": row[5]
})

# =====================================================
# ADMIN API (UPDATED CRUD)
# =====================================================

@app.route('/api/admin/products', methods=['GET'])
def admin_get_products():
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT p.id, p.nama_produk,p.deskripsi, p.harga, p.gambar,
               p.kategori_id, c.nama_kategori
        FROM products p
        JOIN categories c ON p.kategori_id = c.id
        ORDER BY p.id DESC
    """)
    rows = cur.fetchall()
    cur.close()

    return jsonify([
    {
        "id": r[0],
        "nama_produk": r[1],
        "deskripsi": r[2],
        "harga": r[3],
        "gambar": get_image_url(r[4]),
        "kategori_id": r[5],
        "kategori": r[6]
    } for r in rows
])



@app.route('/api/admin/products', methods=['POST'])
def admin_add_product():
    if session.get('role') != 'admin':
        return jsonify({"error": "Unauthorized"}), 401

    nama_produk = request.form.get('nama_produk')
    deskripsi = request.form.get('deskripsi')
    harga = request.form.get('harga')
    kategori_id = request.form.get('kategori_id')
    file = request.files.get('gambar')

    if not nama_produk or not deskripsi or not harga or not kategori_id:
        return jsonify({"error": "Data tidak lengkap"}), 400


    if not file or file.filename == '':
        return jsonify({"error": "Gambar wajib diisi"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Format gambar tidak diizinkan"}), 400

    filename = f"{uuid.uuid4().hex}.{file.filename.rsplit('.',1)[1].lower()}"
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    cur = mysql.connection.cursor()
    cur.execute("""
    INSERT INTO products (nama_produk, deskripsi, harga, kategori_id, gambar)
    VALUES (%s, %s, %s, %s, %s)
""", (nama_produk, deskripsi, int(harga), int(kategori_id), filename))

    mysql.connection.commit()
    cur.close()

    return jsonify({"message": "Produk berhasil ditambahkan"}), 201



@app.route('/api/admin/products/<int:id>', methods=['POST'])
def admin_update_product(id):
    nama_produk = request.form.get('nama_produk')
    harga = request.form.get('harga')
    kategori_id = request.form.get('kategori_id')
    deskripsi = request.form.get('deskripsi')
    file = request.files.get('gambar')

    if not all([nama_produk, harga, kategori_id, deskripsi]):
        return jsonify({"error": "Data tidak lengkap"}), 400

    cur = mysql.connection.cursor()
    cur.execute("SELECT gambar FROM products WHERE id=%s", (id,))
    old = cur.fetchone()

    if file and file.filename != '':
        if not allowed_file(file.filename):
            cur.close()
            return jsonify({"error": "Format gambar tidak diizinkan"}), 400

        if old and old[0]:
            old_path = os.path.join(app.config['UPLOAD_FOLDER'], old[0])
            if os.path.exists(old_path):
                os.remove(old_path)

        filename = f"{uuid.uuid4().hex}.{file.filename.rsplit('.',1)[1].lower()}"
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        cur.execute("""
            UPDATE products
            SET nama_produk=%s,
                harga=%s,
                kategori_id=%s,
                deskripsi=%s,
                gambar=%s
            WHERE id=%s
        """, (
            nama_produk,
            int(harga),
            int(kategori_id),
            deskripsi,
            filename,
            id
        ))
    else:
        cur.execute("""
            UPDATE products
            SET nama_produk=%s,
                harga=%s,
                kategori_id=%s,
                deskripsi=%s
            WHERE id=%s
        """, (
            nama_produk,
            int(harga),
            int(kategori_id),
            deskripsi,
            id
        ))

    mysql.connection.commit()
    cur.close()

    return jsonify({"message": "Produk berhasil diperbarui"})


@app.route('/api/admin/products/<int:id>', methods=['DELETE'])
def admin_delete_product(id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT gambar FROM products WHERE id=%s", (id,))
    row = cur.fetchone()

    if row and row[0]:
        path = os.path.join(app.config['UPLOAD_FOLDER'], row[0])
        if os.path.exists(path):
            os.remove(path)

    cur.execute("DELETE FROM products WHERE id=%s", (id,))
    mysql.connection.commit()
    cur.close()

    return jsonify({"message": "Produk berhasil dihapus"})

@app.route('/api/admin/categories', methods=['POST'])
def add_category():
    if session.get('role') != 'admin':
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    nama = data.get('nama_kategori')

    if not nama:
        return jsonify({"error": "Nama kategori wajib diisi"}), 400

    cur = mysql.connection.cursor()
    cur.execute(
        "INSERT INTO categories (nama_kategori) VALUES (%s)",
        (nama,)
    )
    mysql.connection.commit()
    cur.close()

    return jsonify({"message": "Kategori berhasil ditambahkan"}), 201

# =====================================================
# BUY / CHECKOUT ROUTES
# =====================================================

@app.route('/checkout_page/<int:id>')
def buy_page(id):
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cur.execute("""
        SELECT p.*, c.nama_kategori
        FROM products p
        JOIN categories c ON p.kategori_id = c.id
        WHERE p.id = %s
    """, (id,))
    product = cur.fetchone()
    cur.close()

    if not product:
        return "Produk tidak ditemukan", 404

    product['gambar'] = get_image_url(product['gambar'])

    return render_template('user/checkout_page.html', product=product)

@app.route('/checkout', methods=['POST'])
def checkout():
    product_id = request.form.get('product_id')
    qty = int(request.form.get('qty', 1))

    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cur.execute("SELECT harga FROM products WHERE id=%s", (product_id,))
    product = cur.fetchone()

    if not product:
        return "Produk tidak ditemukan", 404

    harga = product['harga']
    total = harga * qty

    cur.execute("""
        INSERT INTO orders (product_id, qty, harga, total, status)
        VALUES (%s, %s, %s, %s, 'cart')
    """, (product_id, qty, harga, total))

    mysql.connection.commit()
    cur.close()

    return redirect('/cart')



@app.route('/checkout-success')
def checkout_success():
    return render_template('user/suksesco.html')

# =====================================================
# BUY / CHECKOUT ROUTES
# =====================================================

@app.route('/cart')
def cart():
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cur.execute("""
        SELECT 
            o.id AS order_id,
            p.nama_produk,
            p.gambar,
            o.qty,
            o.harga,
            o.total
        FROM orders o
        JOIN products p ON o.product_id = p.id
        WHERE o.status = 'cart'
        ORDER BY o.id DESC
    """)
    orders = cur.fetchall()
    cur.close()

    # DEBUG WAJIB (sementara)
    print("ORDERS:", orders)

    for o in orders:
        o['gambar'] = get_image_url(o['gambar'])

    return render_template('user/cart.html', orders=orders)


@app.route('/cart/delete/<int:order_id>', methods=['POST'])
def delete_cart(order_id):
    cur = mysql.connection.cursor()
    cur.execute("""
        DELETE FROM orders
        WHERE id = %s AND status = 'cart'
    """, (order_id,))

    mysql.connection.commit()
    cur.close()

    return redirect('/cart')
@app.route('/cart/update/<int:order_id>', methods=['POST'])
def update_cart(order_id):
    qty = int(request.form.get('qty'))

    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

    # ambil harga
    cur.execute("SELECT harga FROM orders WHERE id=%s", (order_id,))
    order = cur.fetchone()

    if not order:
        return {"success": False}, 404

    harga = order['harga']
    total = harga * qty

    cur.execute("""
        UPDATE orders
        SET qty=%s, total=%s
        WHERE id=%s
    """, (qty, total, order_id))

    mysql.connection.commit()
    cur.close()

    return {
        "success": True,
        "total": total
    }




# =====================================================
# TEMPLATE ROUTES
# =====================================================

@app.route('/')
def index():
    return render_template('user/index.html')


@app.route('/admin')
def admin():
    if session.get('role') != 'admin':
        return redirect('/')
    return render_template('admin/admin.html')


@app.route('/add')
def add():
    if session.get('role') != 'admin':
        return redirect('/')
    return render_template('admin/add.html')


@app.route('/edit/<int:id>')
def edit(id):
    if session.get('role') != 'admin':
        return redirect('/')
    return render_template('admin/edit.html', product_id=id)

@app.route('/detail_produk/<int:id>')
def detail_produk(id):
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cur.execute("""
        SELECT p.*, c.nama_kategori
        FROM products p
        JOIN categories c ON p.kategori_id = c.id
        WHERE p.id = %s
    """, (id,))
    product = cur.fetchone()
    cur.close()

    if not product:
        return "Produk tidak ditemukan", 404

    product['gambar'] = get_image_url(product['gambar'])

    return render_template('user/detail_produk.html', product=product)




# =====================================================
# RUN
# =====================================================

if __name__ == '__main__':
    app.run(debug=True)
