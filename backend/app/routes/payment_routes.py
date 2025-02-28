from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Payment, User

# Define blueprint
payment_bp = Blueprint('payment', __name__)

# Admin or Merchant Processes a Payment
@payment_bp.route('', methods=['POST'])
@jwt_required()
def process_payment():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # Get the role from the JWT claims
    role = get_jwt()['role']  # This retrieves the role from the JWT claims

    # Debugging output to check user role
    print(f"User  ID: {user_id}, User Role: {role if user else 'User  not found'}")

    # Only Admins and Merchants can process payments
    if not user or role not in ['admin', 'merchant']:
        return jsonify({'message': 'Unauthorized. Only admins and merchants can process payments'}), 403

    data = request.get_json()
    new_payment = Payment(
        inventory_id=data['inventory_id'],
        status=data['status'],
        processed_by=user_id
    )
    db.session.add(new_payment)
    db.session.commit()

    return jsonify({'message': 'Payment processed successfully'}), 201

# Get all payments (Admin can view all, Merchants can view their own)
@payment_bp.route('', methods=['GET'])
@jwt_required()
def get_payments():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # Admin can view all payments
    if user.role.lower() == 'admin':
        payments = Payment.query.all()
    # Merchants can only view their own payments
    elif user.role.lower() == 'merchant':
        payments = Payment.query.filter_by(processed_by=user_id).all()
    else:
        return jsonify({'message': 'Unauthorized'}), 403

    payment_list = [{
        'id': payment.id,
        'inventory_id': payment.inventory_id,
        'status': payment.status,
        'processed_by': payment.processed_by
    } for payment in payments]

    return jsonify({"payments": payment_list}), 200

# Get a single payment
@payment_bp.route('/<int:payment_id>', methods=['GET'])
@jwt_required()
def get_single_payment(payment_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    payment = Payment.query.get_or_404(payment_id)

    # Admin can view any payment, Merchants can only view their own payments
    if user.role.lower() == 'admin' or (user.role.lower() == 'merchant' and payment.processed_by == user_id):
        return jsonify({
            'id': payment.id,
            'inventory_id': payment.inventory_id,
            'status': payment.status,
            'processed_by': payment.processed_by
        }), 200

    return jsonify({'message': 'Unauthorized'}), 403

# Update a payment (Admin can update payment status)
@payment_bp.route('/<int:payment_id>', methods=['PUT'])
@jwt_required()
def update_payment(payment_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # Only Admin can update payment status
    if not user or user.role.lower() != 'admin':
        return jsonify({'message': 'Unauthorized. Only admins can update payment status'}), 403

    payment = Payment.query.get_or_404(payment_id)
    data = request.get_json()

    # Update the payment status
    payment.status = data.get('status', payment.status)
    db.session.commit()

    return jsonify({'message': 'Payment updated successfully'}), 200

@payment_bp.route('/<int:payment_id>', methods=['DELETE'])
@jwt_required()
def delete_payment(payment_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    payment = Payment.query.get_or_404(payment_id)

    # Allow merchants to delete their own payments if the status is "pending"
    if user.role.lower() == 'merchant' and payment.processed_by == user_id:
        if payment.status.lower() == "pending":
            db.session.delete(payment)
            db.session.commit()
            return jsonify({'message': 'Payment canceled successfully'}), 200
        return jsonify({'message': 'Payment cannot be canceled after approval'}), 403

    # Admin can delete any payment
    if user.role.lower() == 'admin':
        db.session.delete(payment)
        db.session.commit()
        return jsonify({'message': 'Payment deleted successfully'}), 204

    return jsonify({'message': 'Unauthorized'}), 403
