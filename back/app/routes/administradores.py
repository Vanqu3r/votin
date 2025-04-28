from flask import Blueprint, jsonify
from bson import ObjectId
from app import mongo

administradores_bp = Blueprint('administradores', __name__)
db = mongo.db.v_administradores

# Obtener todos los votantes
@administradores_bp.route('/', methods=['GET'])
def get_votantes():
    administradores = []
    for doc in db.find():
        doc['_id'] = str(doc['_id'])
        administradores.append(doc)
    return jsonify(administradores)

# Obtener un votante por ID
@administradores_bp.route('/<id>', methods=['GET'])
def get_votante(id):
    administrador = db.find_one({'_id': ObjectId(id)})
    if not administrador:
        return jsonify({'error': 'Votante no encontrado'})

    administrador['_id'] = str(administrador['_id'])
    return jsonify(administrador)

# Obtener un votante por CORREO
@administradores_bp.route('/correo/<correo>', methods=['GET'])
def get_votante_by_correo(correo):
    administradores_bp = db.find_one({'correo': correo})
    if not administradores_bp:
        return jsonify({'error': 'Votante no encontrado'})

    administradores_bp['_id'] = str(administradores_bp['_id'])
    return jsonify(administradores_bp)

