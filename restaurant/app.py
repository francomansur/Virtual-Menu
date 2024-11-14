from flask_migrate import Migrate
from flask import Flask, jsonify, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin, LoginManager, login_user, logout_user, login_required
import os
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='static')

# CORS configurations to allow all origins and support credentials
CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:3000"}}, supports_credentials=True)

# Database configurations
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///restaurant.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Session configurations
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Configure Flask-Login
login_manager = LoginManager(app)
login_manager.login_view = 'login'


@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({'error': 'Unauthorized access'}), 401


@app.after_request
def apply_cors(response):
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Origin"] = "http://127.0.0.1:3000"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, DELETE, OPTIONS"
    return response

# Model for restaurant administrator


class RestaurantAdmin(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    password_hash = db.Column(db.String(200), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# Callback to load the logged-in user


@login_manager.user_loader
def load_user(user_id):
    return RestaurantAdmin.query.get(int(user_id))

# Menu items table


class MenuItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    image_url = db.Column(db.String(200), nullable=False)

# Orders table


class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_name = db.Column(db.String(100), nullable=False)
    table_number = db.Column(db.Integer, nullable=False)
    observation = db.Column(db.Text)
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp(), nullable=False)
    items = db.relationship('OrderItem', backref='order', cascade="all, delete-orphan")

# Order items table


class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False)
    menu_item_id = db.Column(db.Integer, db.ForeignKey(
        'menu_item.id', ondelete='CASCADE'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    menu_item = db.relationship('MenuItem')

# Login route


@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response

    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = RestaurantAdmin.query.filter_by(username=username).first()

    if user and user.check_password(password):
        login_user(user)
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401

# Logout route


@app.route('/api/logout')
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully."}), 200

# Fetch all orders (requires login)


# Fetch all orders (requires login)
@app.route('/api/orders', methods=['GET'])
@login_required
def orders():
    all_orders = Order.query.filter_by(status='pending').all()

    orders_list = []
    for order in all_orders:
        order_items = [
            {
                "menu_item_name": MenuItem.query.get(item.menu_item_id).name,
                "quantity": item.quantity,
                "price": MenuItem.query.get(item.menu_item_id).price,  # Adicionando o preço
                "total_price": MenuItem.query.get(item.menu_item_id).price * item.quantity  # Calculando o total
            }
            for item in order.items
        ]
        orders_list.append({
            "id": order.id,
            "customer_name": order.customer_name,
            "table_number": order.table_number,
            "observation": order.observation,
            "status": order.status,
            "items": order_items
        })

    return jsonify({"orders": orders_list})
    # Return orders as JSON


# Fetch menu items


@app.route('/api/menu', methods=['GET'])
def get_menu():
    menu_item = MenuItem.query.all()
    menu = [
        {
            'id': item.id,
            'name': item.name,
            'description': item.description,
            'price': item.price,
            'category': item.category,
            'image_url': f"/static/images/{item.image_url}"
        }
        for item in menu_item
    ]
    return jsonify(menu)

# Receive order (POST for cart)


@app.route('/api/cart', methods=['POST', 'OPTIONS'])
def cart():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response

    data = request.json
    print(data)
    return jsonify({"message": "Order received successfully!"}), 200


# Configure the upload directory
UPLOAD_FOLDER = 'static/images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Check if file is allowed


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Create menu item (with image upload)


@app.route('/api/menu', methods=['POST', 'OPTIONS'])
def create_menu_item():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add("Access-Control-Allow-Origin", "http://127.0.0.1:3000")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response

    name = request.form.get('name')
    description = request.form.get('description')
    price = request.form.get('price')
    category = request.form.get('category')
    image = request.files.get('image')  # Receive the image file

    if not name or not description or not price or not category or not image:
        return jsonify({'error': 'Missing required fields'}), 400

    if image and allowed_file(image.filename):
        filename = secure_filename(image.filename)
        image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        new_item = MenuItem(
            name=name,
            description=description,
            price=float(price),
            category=category,
            image_url=filename  # Save only the filename
        )
        db.session.add(new_item)
        db.session.commit()

        return jsonify({'message': 'Menu item created successfully', 'new_item': {
            'id': new_item.id,
            'name': new_item.name,
            'description': new_item.description,
            'price': new_item.price,
            'category': new_item.category,
            'image_url': new_item.image_url
        }}), 201
    else:
        return jsonify({'error': 'Invalid file type or missing image'}), 400

# Delete a menu item


@app.route('/api/menu/<int:item_id>', methods=['DELETE'])
@login_required
def delete_menu_item(item_id):
    # Fetch the item from the database
    item = MenuItem.query.get(item_id)

    if not item:
        return jsonify({'error': 'Menu item not found'}), 404

    # Remove the item from the database
    db.session.delete(item)
    db.session.commit()

    return jsonify({'message': 'Menu item deleted successfully'}), 200

# Fetch distinct menu categories


@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = db.session.query(MenuItem.category).distinct().all()
    categories_list = [category[0] for category in categories]  # Extract the value from each tuple
    return jsonify(categories_list)

# Create orders (POST only)


@app.route('/api/orders', methods=['POST', 'OPTIONS'])
def create_order():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response

    data = request.json
    customer_name = data.get('customer_name')
    table_number = data.get('table_number')
    observation = data.get('observation')
    items = data.get('items')

    if not customer_name or not table_number or not items:
        return jsonify({'error': 'Missing required fields'}), 400

    new_order = Order(customer_name=customer_name, table_number=table_number,
                      status="pending", observation=observation)
    db.session.add(new_order)
    db.session.commit()

    for item in items:
        order_items = OrderItem(order_id=new_order.id,
                                menu_item_id=item['id'], quantity=item['quantity'])
        db.session.add(order_items)

    db.session.commit()

    return jsonify({'message': 'Order created successfully', 'order_id': new_order.id}), 201

# Mark order as completed


@app.route('/api/orders/<int:order_id>/complete', methods=['POST'])
@login_required
def complete_order(order_id):
    # Fetch the order by ID
    order = Order.query.get(order_id)

    if not order:
        return jsonify({'error': 'Order not found'}), 404

    # Update the order status to 'completed'
    order.status = 'completed'
    db.session.commit()

    return jsonify({'message': 'Order completed successfully'})

# Fetch completed orders


# Fetch completed orders
@app.route('/api/history', methods=['GET'])
@login_required
def get_completed_orders():
    # Filter orders that have 'completed' status
    completed_orders = Order.query.filter_by(status='completed').all()

    orders_list = []
    for order in completed_orders:
        order_items = [
            {
                "menu_item_name": MenuItem.query.get(item.menu_item_id).name,  # Menu item name
                "quantity": item.quantity,
                "price": MenuItem.query.get(item.menu_item_id).price,  # Add the price of the item
                "total_price": MenuItem.query.get(item.menu_item_id).price * item.quantity  # Total price for each item
            }
            for item in order.items
        ]
        total_order_price = sum(item['total_price'] for item in order_items)  # Calculate total price for the order
        orders_list.append({
            "id": order.id,
            "customer_name": order.customer_name,
            "table_number": order.table_number,
            "observation": order.observation,
            "status": order.status,
            "items": order_items,  # Include the order items
            "total_order_price": total_order_price  # Add total price of the order
        })

    # Return completed orders as JSON
    return jsonify({"orders": orders_list})

# Fetch order history


@app.route('/api/orders/history', methods=['GET'])
@login_required
def order_history():
    completed_orders = Order.query.filter_by(status='completed').all()

    history_list = [
        {
            "id": order.id,
            "customer_name": order.customer_name,
            "table_number": order.table_number,
            "status": order.status,
        }
        for order in completed_orders
    ]

    return jsonify({"history": history_list})


# Run the app with debug mode off
if __name__ == '__main__':
    app.run(debug=False, port=5001)
