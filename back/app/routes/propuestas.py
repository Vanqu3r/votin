from flask import Blueprint, request, jsonify
from bson import ObjectId
from app import mongo
from app.schemas import PropuestaSchema

propuestas_bp = Blueprint('propuestas', __name__)
dbP = mongo.db.v_propuestas

propuesta_schema = PropuestaSchema()

# Crear propuesta
@propuestas_bp.route('/', methods=['POST'])
def create_propuesta():
    try:
        data = request.json
        errores = propuesta_schema.validate(data)
        if errores:
            return jsonify({'errores': errores}), 400

        # Validar que el candidato exista (opcional, recomendado)
        candidato_id = data['candidato_id']
        candidato = mongo.db.v_candidatos.find_one({'_id': ObjectId(candidato_id)})
        if not candidato:
            return jsonify({'error': 'Candidato no encontrado'}), 404

        result = dbP.insert_one(data)
        return jsonify({'message': 'Propuesta creada', 'id': str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Obtener todas las propuestas
@propuestas_bp.route('/', methods=['GET'])
def get_propuestas():
    propuestas = []
    for doc in dbP.find():
        doc['_id'] = str(doc['_id'])
        propuestas.append(doc)
    return jsonify(propuestas)

# Obtener una propuesta por ID
@propuestas_bp.route('/<id>', methods=['GET'])
def get_propuesta(id):
    propuesta = dbP.find_one({'_id': ObjectId(id)})
    if not propuesta:
        return jsonify({'error': 'Propuesta no encontrada'}), 404

    propuesta['_id'] = str(propuesta['_id'])
    return jsonify(propuesta)

# Actualizar una propuesta
@propuestas_bp.route('/<id>', methods=['PUT'])
def update_propuesta(id):
    try:
        data = request.json
        errores = propuesta_schema.validate(data)
        if errores:
            return jsonify({'errores': errores}), 400

        result = dbP.update_one({'_id': ObjectId(id)}, {'$set': data})
        if result.matched_count == 0:
            return jsonify({'error': 'Propuesta no encontrada'}), 404

        updated_propuesta = dbP.find_one({'_id': ObjectId(id)})
        updated_propuesta['_id'] = str(updated_propuesta['_id'])
        return jsonify(updated_propuesta)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Eliminar una propuesta
@propuestas_bp.route('/<id>', methods=['DELETE'])
def delete_propuesta(id):
    try:
        result = dbP.delete_one({'_id': ObjectId(id)})
        if result.deleted_count == 0:
            return jsonify({'error': 'Propuesta no encontrada'}), 404
        return jsonify({'message': 'Propuesta eliminada'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
