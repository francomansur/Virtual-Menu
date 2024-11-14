from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# Inicializando o Flask e SQLAlchemy
app = Flask(__name__)

# Configurações do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///restaurant.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializando o SQLAlchemy
db = SQLAlchemy(app)

# Tabela de Categorias
class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)

# Tabela de Itens de Menu
class MenuItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(200), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)  # Relacionamento com a categoria
    category = db.relationship('Category', backref=db.backref('menu_items', lazy=True))

# Função para criar as tabelas no banco de dados
def create_tables():
    db.create_all()

# Função para adicionar algumas categorias ao banco de dados
def seed_categories():
    if not Category.query.first():  # Adiciona categorias apenas se não houver nenhuma
        categories = [
            Category(name="Main Course"),
            Category(name="Dessert"),
            Category(name="Beverage"),
            Category(name="Salad")
        ]
        db.session.bulk_save_objects(categories)
        db.session.commit()
        print("Categories added successfully.")
    else:
        print("Categories already exist. No action taken.")

# Executando a criação das tabelas e adicionando as categorias
if __name__ == "__main__":
    with app.app_context():
        create_tables()
        seed_categories()
