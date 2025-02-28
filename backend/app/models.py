from app import db, bcrypt  # ✅ Import existing db and bcrypt

# Association Table for Many-to-Many (Clerks & Inventory)
clerk_inventory = db.Table(
    'clerk_inventory',
    db.Column('clerk_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('inventory_id', db.Integer, db.ForeignKey('inventory.id'), primary_key=True)
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(50), nullable=False)  # Merchant, Admin, Clerk
    is_active = db.Column(db.Boolean, default=True)

    inventories = db.relationship('Inventory', backref='owner', lazy=True)
    managed_inventories = db.relationship('Inventory', secondary=clerk_inventory, back_populates='clerks')

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

class Inventory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(255), nullable=False)
    quantity_received = db.Column(db.Integer, nullable=False)
    quantity_in_stock = db.Column(db.Integer, nullable=False)
    quantity_spoilt = db.Column(db.Integer, nullable=False)
    buying_price = db.Column(db.Float, nullable=False)
    selling_price = db.Column(db.Float, nullable=False)
    payment_status = db.Column(db.String(50), nullable=False)  # Paid, Unpaid
    supplier = db.Column(db.String(255), nullable=False)
    store_admin_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    clerks = db.relationship('User', secondary=clerk_inventory, back_populates='managed_inventories')

class SupplyRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(255), nullable=False)
    quantity_requested = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), default="Pending")  # Pending, Approved, Declined
    clerk_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    admin_id = db.Column(db.Integer, db.ForeignKey('user.id'))  # Set when approved/declined

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    inventory_id = db.Column(db.Integer, db.ForeignKey('inventory.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False)  # Paid, Unpaid
    processed_by = db.Column(db.Integer, db.ForeignKey('user.id'))  # Admin who updates status

class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    report_type = db.Column(db.String(50), nullable=False)  # Weekly, Monthly, Annual
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    merchant_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

print("Models registered:", db.metadata.tables.keys())
