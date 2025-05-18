from flask import Blueprint, jsonify
from app import mongo

estadisticas_bp = Blueprint('estadisticas', __name__)
db_propuestas = mongo.db.v_propuestas
db_politicos = mongo.db.v_politicos
db_votantes = mongo.db.v_votantes

# Para dashboard
@estadisticas_bp.route('/dashboard', methods=['GET'])
def resumen_conteos():
    try:
        total_votantes = db_votantes.count_documents({})
        total_politicos = db_politicos.count_documents({})
        total_propuestas = db_propuestas.count_documents({})

        return jsonify({
            'votantes': total_votantes,
            'politicos': total_politicos,
            'propuestas': total_propuestas
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
