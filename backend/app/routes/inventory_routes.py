from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Inventory, User
from sqlalchemy.exc import IntegrityError

# Define blueprint
inventory_bp = Blueprint('inventory', __name__)

# Add new inventory
@inventory_bp.route('', methods=['POST'])  # No need for '/inventory' in the route since it's registered with a prefix
@jwt_required()
def add_inventory():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # Only Admins and Merchants can add new inventory items
    if not user or user.role.lower() not in ['merchant', 'admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()
    
    try:
        new_inventory = Inventory(
            product_name=data['product_name'],
            quantity_received=data['quantity_received'],
            quantity_in_stock=data['quantity_in_stock'],
            quantity_spoilt=data['quantity_spoilt'],
            buying_price=data['buying_price'],
            selling_price=data['selling_price'],
            payment_status=data['payment_status'],
            supplier=data['supplier'],
            store_admin_id=user_id
        )
        db.session.add(new_inventory)
        db.session.commit()
        return jsonify({'message': 'Inventory item added successfully'}), 201
    
    except IntegrityError:
        db.session.rollback()
        return jsonify({'message': 'Error adding inventory'}), 400
@inventory_bp.route('/assign', methods=['POST'])
@jwt_required()
def assign_inventory_to_clerk():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # Only Admins and Merchants can assign inventory
    if not user or user.role.lower() not in ['merchant', 'admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()
    clerk_id = data.get('clerk_id')
    inventory_id = data.get('inventory_id')

    clerk = User.query.get(clerk_id)
    inventory = Inventory.query.get(inventory_id)

    if not clerk or clerk.role.lower() != 'clerk':
        return jsonify({'message': 'Invalid clerk ID'}), 400
    if not inventory:
        return jsonify({'message': 'Invalid inventory ID'}), 400

    # Assign inventory to the clerk
    clerk.managed_inventories.append(inventory)
    db.session.commit()

    return jsonify({'message': f'Inventory {inventory_id} assigned to Clerk {clerk_id}'}), 200


# Get all inventory items
@inventory_bp.route('', methods=['GET'])
@jwt_required()
def get_inventory():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # Admins and Merchants can view all inventory items
    if user.role.lower() in ['merchant', 'admin']:
        inventory = Inventory.query.all()
    # Clerks can only view inventory items assigned to them
    elif user.role.lower() == 'clerk':
        inventory = user.managed_inventories
    else:
        return jsonify({'message': 'Unauthorized'}), 403

    inventory_list = [{
        'id': item.id,
        'product_name': item.product_name,
        'quantity_received': item.quantity_received,
        'quantity_in_stock': item.quantity_in_stock,
        'quantity_spoilt': item.quantity_spoilt,
        'buying_price': item.buying_price,
        'selling_price': item.selling_price,
        'payment_status': item.payment_status,
        'supplier': item.supplier,
        'store_admin_id': item.store_admin_id
    } for item in inventory]

    return jsonify({"inventory": inventory_list}), 200
@inventory_bp.route('/assigned', methods=['GET'])
@jwt_required()
def get_clerk_inventory():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role.lower() != 'clerk':
        return jsonify({"message": "Unauthorized"}), 403

    # Get all inventory items assigned to the clerk
    inventory_list = [{
        'id': inv.id,
        'product_name': inv.product_name,
        'quantity_received': inv.quantity_received,
        'quantity_in_stock': inv.quantity_in_stock,
        'buying_price': inv.buying_price,
        'selling_price': inv.selling_price,
        'supplier': inv.supplier
    } for inv in user.managed_inventories]  

    return jsonify({"inventory": inventory_list}), 200


# Update inventory item
@inventory_bp.route('/<int:inventory_id>', methods=['PUT'])
@jwt_required()
def update_inventory(inventory_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # Only Admins and Merchants can update inventory items
    if not user or user.role.lower() not in ['merchant', 'admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    inventory = Inventory.query.get_or_404(inventory_id)
    data = request.get_json()

    inventory.product_name = data.get('product_name', inventory.product_name)
    inventory.quantity_received = data.get('quantity_received', inventory.quantity_received)
    inventory.quantity_in_stock = data.get('quantity_in_stock', inventory.quantity_in_stock)
    inventory.quantity_spoilt = data.get('quantity_spoilt', inventory.quantity_spoilt)
    inventory.buying_price = data.get('buying_price', inventory.buying_price)
    inventory.selling_price = data.get('selling_price', inventory.selling_price)
    inventory.payment_status = data.get('payment_status', inventory.payment_status)
    inventory.supplier = data.get('supplier', inventory.supplier)

    db.session.commit()
    return jsonify({'message': 'Inventory item updated successfully'}), 200

# Delete inventory item
@inventory_bp.route('/<int:inventory_id>', methods=['DELETE'])
@jwt_required()
def delete_inventory(inventory_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # Only Admins and Merchants can delete inventory items
    if not user or user.role.lower() not in ['merchant', 'admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    inventory = Inventory.query.get_or_404(inventory_id)
    db.session.delete(inventory)
    db.session.commit()
    return jsonify({'message': 'Inventory item deleted successfully'}), 204