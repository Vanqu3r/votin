from flask import Blueprint, request, jsonify
from bson import ObjectId
from app import mongo
from app.schemas import PoliticoSchema  # importamos el schema

politicos_bp = Blueprint('politicos', __name__)
db = mongo.db.v_politicos

politico_schema = PoliticoSchema()

# Crear político con validación
@politicos_bp.route('/', methods=['POST'])
def create_politico():
    try:
        data = request.json

        # Valida y deserializa los datos
        politico_data = politico_schema.load(data)
        result = db.insert_one(politico_data)
        
        politico_creado = db.find_one({'_id': result.inserted_id}) # Buscar el politico creado
        politico_creado['_id'] = str(politico_creado['_id']) # Convertir _id a string para poder enviarlo en JSON

        return jsonify(politico_creado), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Obtener todos los políticos
@politicos_bp.route('/', methods=['GET'])
def get_politicos():
    politicos = []
    for doc in db.find():
        doc['_id'] = str(doc['_id'])
        politicos.append(doc)
    return jsonify(politicos)

# Obtener un político por ID
@politicos_bp.route('/<id>', methods=['GET'])
def get_politico(id):
    politico = db.find_one({'_id': ObjectId(id)})
    if not politico:
        return jsonify({'error': 'Político no encontrado'})

    politico['_id'] = str(politico['_id'])
    return jsonify(politico)

# Obtener un político por CORREO
@politicos_bp.route('/correo/<correo>', methods=['GET'])
def get_politico_by_correo(correo):
    politico = db.find_one({'correo': correo})
    if not politico:
        return jsonify({'error': 'Político no encontrado'})

    politico['_id'] = str(politico['_id'])
    return jsonify(politico)

# Actualizar político con validación
@politicos_bp.route('/<id>', methods=['PUT'])
def update_politico(id):
    try:
        data = request.json
        errores = politico_schema.validate(data, partial=True)  # Validación parcial para actualización
        if errores:
            return jsonify({'errores': errores})

        result = db.update_one({'_id': ObjectId(id)}, {'$set': data})
        if result.matched_count == 0:
            return jsonify({'error': 'Político no encontrado'})

        updated_politico = db.find_one({'_id': ObjectId(id)})
        updated_politico['_id'] = str(updated_politico['_id'])
        return jsonify(updated_politico)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Eliminar político
@politicos_bp.route('/<id>', methods=['DELETE'])
def delete_politico(id):
    db.delete_one({'_id': ObjectId(id)})
    return jsonify({'message': 'Político eliminado'})
