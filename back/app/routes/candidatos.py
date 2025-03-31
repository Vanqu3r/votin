from flask import Blueprint, request, jsonify
from bson import ObjectId
from app import mongo
from app.schemas import CandidatoSchema  # importamos el schema

candidatos_bp = Blueprint('candidatos', __name__)
dbC = mongo.db.v_candidatos

candidato_schema = CandidatoSchema()

# Crear candidato con validación
@candidatos_bp.route('/', methods=['POST'])
def create_candidato():
    try:
        data = request.json
        errores = candidato_schema.validate(data)
        if errores:
            return jsonify({'errores': errores}), 400

        result = dbC.insert_one(data)
        return jsonify({'message': 'Candidato creado', 'id': str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Obtener todos los candidatos
@candidatos_bp.route('/', methods=['GET'])
def get_propuestas():
    candidatos = []
    for doc in dbC.find():
        doc['_id'] = str(doc['_id'])
        candidatos.append(doc)
    return jsonify(candidatos)

# Obtener un candidato por ID
@candidatos_bp.route('/<id>', methods=['GET'])
def get_propuesta(id):
    candidato = dbC.find_one({'_id': ObjectId(id)})
    if not candidato:
        return jsonify({'error': 'Candidato no encontrado'}), 404

    candidato['_id'] = str(candidato['_id'])
    return jsonify(candidato)


# Actualizar candidato con validación
@candidatos_bp.route('/<id>', methods=['PUT'])
def update_candidato(id):
    try:
        data = request.json
        errores = candidato_schema.validate(data)
        if errores:
            return jsonify({'errores': errores}), 400

        result = dbC.update_one({'_id': ObjectId(id)}, {'$set': data})
        if result.matched_count == 0:
            return jsonify({'error': 'Candidato no encontrado'}), 404

        updated_candidato = dbC.find_one({'_id': ObjectId(id)})
        updated_candidato['_id'] = str(updated_candidato['_id'])
        return jsonify(updated_candidato)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@candidatos_bp.route('/<id>', methods=['DELETE'])
def deleteUsuario(id):
    dbC.delete_one({'_id': ObjectId(id)})
    return jsonify({'Candidato eliminado'})