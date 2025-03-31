from flask import Blueprint, request, jsonify
from bson import ObjectId
from app import mongo
from app.schemas import PropuestaSchema

propuestas_bp = Blueprint('propuestas', __name__)
<<<<<<< HEAD
db = mongo.db.v_propuestas
db_politicos = mongo.db.v_politicos
=======
dbP = mongo.db.v_propuestas
>>>>>>> 7bdf913356a6ba1e5bd137236b8393256ff40ebc

propuesta_schema = PropuestaSchema()

# Crear propuesta
@propuestas_bp.route('/', methods=['POST'])
def create_propuesta():
    try:
        data = request.json
        errores = propuesta_schema.validate(data)
        if errores:
            return jsonify({'errores': errores}), 400

<<<<<<< HEAD
        # Validar que el político exista
        id_politico = data.get('id_politico')
        if not id_politico or not db_politicos.find_one({'_id': ObjectId(id_politico)}):
            return jsonify({'error': 'Político no encontrado'}), 404

        result = db.insert_one(data)
=======
        # Validar que el candidato exista (opcional, recomendado)
        candidato_id = data['candidato_id']
        candidato = mongo.db.v_candidatos.find_one({'_id': ObjectId(candidato_id)})
        if not candidato:
            return jsonify({'error': 'Candidato no encontrado'}), 404

        result = dbP.insert_one(data)
>>>>>>> 7bdf913356a6ba1e5bd137236b8393256ff40ebc
        return jsonify({'message': 'Propuesta creada', 'id': str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Obtener todas las propuestas
@propuestas_bp.route('/', methods=['GET'])
def get_propuestas():
    propuestas = []
<<<<<<< HEAD
    for doc in db.find():
        doc['_id'] = str(doc['_id'])
        doc['id_politico'] = str(doc['id_politico']) if 'id_politico' in doc else None
=======
    for doc in dbP.find():
        doc['_id'] = str(doc['_id'])
>>>>>>> 7bdf913356a6ba1e5bd137236b8393256ff40ebc
        propuestas.append(doc)
    return jsonify(propuestas)

# Obtener una propuesta por ID
@propuestas_bp.route('/<id>', methods=['GET'])
def get_propuesta(id):
<<<<<<< HEAD
    propuesta = db.find_one({'_id': ObjectId(id)})
=======
    propuesta = dbP.find_one({'_id': ObjectId(id)})
>>>>>>> 7bdf913356a6ba1e5bd137236b8393256ff40ebc
    if not propuesta:
        return jsonify({'error': 'Propuesta no encontrada'}), 404

    propuesta['_id'] = str(propuesta['_id'])
<<<<<<< HEAD
    propuesta['id_politico'] = str(propuesta['id_politico']) if 'id_politico' in propuesta else None
    return jsonify(propuesta)

# Obtener propuestas por político
@propuestas_bp.route('/politico/<id_politico>', methods=['GET'])
def get_propuestas_por_politico(id_politico):
    try:
        # Verificar si el político existe
        existe = mongo.db.v_politicos.find_one({'_id': ObjectId(id_politico)})
        if not existe:
            return jsonify({'error': 'Político no encontrado'}), 404

        # Buscar propuestas con ese id_politico
        propuestas = db.find({'id_politico': id_politico})
        resultado = []

        for propuesta in propuestas:
            propuesta['_id'] = str(propuesta['_id'])

            resultado.append(propuesta)

        return jsonify(resultado)

    except Exception as e:
        return jsonify({"error": str(e)}), 500



=======
    return jsonify(propuesta)

>>>>>>> 7bdf913356a6ba1e5bd137236b8393256ff40ebc
# Actualizar una propuesta
@propuestas_bp.route('/<id>', methods=['PUT'])
def update_propuesta(id):
    try:
        data = request.json
<<<<<<< HEAD
        errores = propuesta_schema.validate(data, partial=True)
        if errores:
            return jsonify({'errores': errores}), 400

        result = db.update_one({'_id': ObjectId(id)}, {'$set': data})
        if result.matched_count == 0:
            return jsonify({'error': 'Propuesta no encontrada'}), 404

        updated_propuesta = db.find_one({'_id': ObjectId(id)})
        updated_propuesta['_id'] = str(updated_propuesta['_id'])
        updated_propuesta['id_politico'] = str(updated_propuesta['id_politico']) if 'id_politico' in updated_propuesta else None
=======
        errores = propuesta_schema.validate(data)
        if errores:
            return jsonify({'errores': errores}), 400

        result = dbP.update_one({'_id': ObjectId(id)}, {'$set': data})
        if result.matched_count == 0:
            return jsonify({'error': 'Propuesta no encontrada'}), 404

        updated_propuesta = dbP.find_one({'_id': ObjectId(id)})
        updated_propuesta['_id'] = str(updated_propuesta['_id'])
>>>>>>> 7bdf913356a6ba1e5bd137236b8393256ff40ebc
        return jsonify(updated_propuesta)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Eliminar una propuesta
@propuestas_bp.route('/<id>', methods=['DELETE'])
def delete_propuesta(id):
    try:
<<<<<<< HEAD
        result = db.delete_one({'_id': ObjectId(id)})
=======
        result = dbP.delete_one({'_id': ObjectId(id)})
>>>>>>> 7bdf913356a6ba1e5bd137236b8393256ff40ebc
        if result.deleted_count == 0:
            return jsonify({'error': 'Propuesta no encontrada'}), 404
        return jsonify({'message': 'Propuesta eliminada'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
<<<<<<< HEAD

=======
>>>>>>> 7bdf913356a6ba1e5bd137236b8393256ff40ebc
