from flask import Blueprint, request, jsonify
from bson import ObjectId
from app import mongo
from app.schemas import UsuarioSchema  # importamos el schema

usuarios_bp = Blueprint('usuarios', __name__)
db = mongo.db.v_usuario

usuario_schema = UsuarioSchema()

# Crear usuario con validación
@usuarios_bp.route('/', methods=['POST'])
def create_usuario():
    try:
        # Validación de datos
        data = request.json
        errores = usuario_schema.validate(data)
        if errores:
            return jsonify({'errores': errores}), 400
        
        # Insertar en MongoDB
        result = db.insert_one(data)
        return jsonify({'message': 'Usuario creado', 'id': str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Actualizar usuario con validación
@usuarios_bp.route('/<id>', methods=['PUT'])
def update_usuario(id):
    try:
        data = request.json
        errores = usuario_schema.validate(data)
        if errores:
            return jsonify({'errores': errores}), 400
        
        result = db.update_one({'_id': ObjectId(id)}, {'$set': data})
        if result.matched_count == 0:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        updated_user = db.find_one({'_id': ObjectId(id)})
        updated_user['_id'] = str(updated_user['_id'])
        return jsonify(updated_user)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
