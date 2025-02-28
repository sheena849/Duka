from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import SupplyRequest, User

# Define blueprint
supply_bp = Blueprint('supply', __name__)

# Clerk Creates a Supply Request
@supply_bp.route('', methods=['POST'])
@jwt_required()
def request_supply():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # Only Clerks can create supply requests
    if not user or user.role.lower() != 'clerk':
        return jsonify({'message': 'Unauthorized. Only clerks can request supply'}), 403

    data = request.get_json()
    new_request = SupplyRequest(
        product_name=data['product_name'],
        quantity_requested=data['quantity_requested'],
        clerk_id=user_id
    )

    db.session.add(new_request)
    db.session.commit()
    return jsonify({'message': 'Supply request submitted successfully'}), 201

# Get all supply requests (Admin can view all, Clerks can view their own)
# Get all supply requests (Admin can view all, Clerks can view their own)
@supply_bp.route('', methods=['GET'])
@jwt_required()
def get_supply_requests():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role.lower() == 'admin':
        requests = SupplyRequest.query.all()
    elif user.role.lower() == 'clerk':
        requests = SupplyRequest.query.filter_by(clerk_id=user_id).all()
    else:
        return jsonify({'message': 'Unauthorized'}), 403

    request_list = [{
        'id': req.id,
        'product_name': req.product_name,
        'quantity_requested': req.quantity_requested,
        'status': req.status,
        'clerk_id': req.clerk_id,
        'admin_id': req.admin_id
    } for req in requests]

    return jsonify({"supply_requests": request_list}), 200

@supply_bp.route('/<int:request_id>', methods=['GET'])
@jwt_required()
def get_single_request(request_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    print(f"User  ID: {user_id}, Request ID: {request_id}")  # Debugging output

    request = SupplyRequest.query.get_or_404(request_id)

    if user.role.lower() == 'admin' or (user.role.lower() == 'clerk' and request.clerk_id == user_id):
        return jsonify({
            'id': request.id,
            'product_name': request.product_name,
            'quantity_requested': request.quantity_requested,
            'status': request.status,
            'clerk_id': request.clerk_id,
            'admin_id': request.admin_id
        }), 200

# Update a supply request (Admin can approve/decline)
@supply_bp.route('/<int:request_id>', methods=['PUT'])
@jwt_required()
def update_supply_request(request_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # Only Admin can update supply requests
    if not user or user.role.lower() != 'admin':
        return jsonify({'message': 'Unauthorized. Only admins can update supply requests'}), 403

    # Retrieve the supply request by ID
    supply_request = SupplyRequest.query.get_or_404(request_id)

    # Get the JSON data from the request (this is the correct way)
    data = request.get_json()  # This should be called on the request object

    # Debugging output
    print(f"Incoming data: {data}")

    # Update the status and admin_id when approved/declined
    if 'status' in data:
        supply_request.status = data['status']
        supply_request.admin_id = user_id  # Set the admin who processed the request

    db.session.commit()
    return jsonify({'message': 'Supply request updated successfully'}), 200
# Delete a supply request (Admin can delete)
@supply_bp.route('/<int:request_id>', methods=['DELETE'])
@jwt_required()
def delete_supply_request(request_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # Only Admin can delete supply requests
    if not user or user.role.lower() != 'admin':
        return jsonify({'message': 'Unauthorized. Only admins can delete supply requests'}), 403

    request = SupplyRequest.query.get_or_404(request_id)
    db.session.delete(request)
    db.session.commit()
    return jsonify({'message': 'Supply request deleted successfully'}), 204