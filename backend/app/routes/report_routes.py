from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Report, User

# Define blueprint
report_bp = Blueprint('report', __name__)

# Merchant Generates a Report
@report_bp.route('', methods=['POST'])
@jwt_required()
def generate_report():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # Only Merchants can generate reports
    if not user or user.role != 'merchant':
        return jsonify({'message': 'Unauthorized. Only merchants can generate reports'}), 403

    data = request.get_json()
    new_report = Report(
        report_type=data['report_type'],
        merchant_id=user_id
    )
    db.session.add(new_report)
    db.session.commit()

    return jsonify({'message': 'Report generated successfully'}), 201

# Get all reports (Admin can view all, Merchants can view their own)
@report_bp.route('', methods=['GET'])
@jwt_required()
def get_reports():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # Admin can view all reports
    if user.role.lower() == 'admin':
        reports = Report.query.all()
    # Merchants can only view their own reports
    elif user.role.lower() == 'merchant':
        reports = Report.query.filter_by(merchant_id=user_id).all()
    else:
        return jsonify({'message': 'Unauthorized'}), 403

    report_list = [{
        'id': report.id,
        'report_type': report.report_type,
        'created_at': report.created_at,
        'merchant_id': report.merchant_id
    } for report in reports]

    return jsonify({"reports": report_list}), 200

# Get a single report
@report_bp.route('/<int:report_id>', methods=['GET'])
@jwt_required()
def get_single_report(report_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    report = Report.query.get_or_404(report_id)

    # Admin can view any report, Merchants can only view their own reports
    if user.role.lower() == 'admin' or (user.role.lower() == 'merchant' and report.merchant_id == user_id):
        return jsonify({
            'id': report.id,
            'report_type': report.report_type,
            'created_at': report.created_at,
            'merchant_id': report.merchant_id
        }), 200

    return jsonify({'message': 'Unauthorized'}), 403

# Update a report (Admin can update report type)
@report_bp.route('/<int:report_id>', methods=['PUT'])
@jwt_required()
def update_report(report_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # Only Admin can update report types
    if not user or user.role.lower() != 'admin':
        return jsonify({'message': 'Unauthorized. Only admins can update reports'}), 403

    report = Report.query.get_or_404(report_id)
    data = request.get_json()

    # Update the report type
    report.report_type = data.get('report_type', report.report_type)
    db.session.commit()

    return jsonify({'message': 'Report updated successfully'}), 200

# Delete a report (Admin can delete)
@report_bp.route('/<int:report_id>', methods=['DELETE'])
@jwt_required()
def delete_report(report_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # Only Admin can delete reports
    if not user or user.role.lower() != 'admin':
        return jsonify({'message': 'Unauthorized. Only admins can delete reports'}), 403

    report = Report.query.get_or_404(report_id)
    db.session.delete(report)
    db.session.commit()
    return jsonify({'message': 'Report deleted successfully'}), 204