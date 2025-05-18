from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
from app import mongo

votes_bp = Blueprint('votes', __name__)
db_votes = mongo.db.v_votes
db_votantes = mongo.db.v_votantes
db_propuestas = mongo.db.v_propuestas

# Helper para convertir ObjectId a string
def parse_json(data):
    if isinstance(data, list):
        return [parse_json(d) for d in data]
    if '_id' in data:
        data['_id'] = str(data['_id'])
    return data

# CREATE - Registrar un nuevo voto
@votes_bp.route('/', methods=['POST'])  # ✅ Responde a POST /api/votes/
def crear_voto():
    try:
        data = request.get_json()

        id_propuesta = data.get('id_propuesta')
        id_votante = data.get('id_votante')

        if not (id_propuesta and id_votante):
            return jsonify({"error": "Faltan campos requeridos"}), 400

        if not (ObjectId.is_valid(id_propuesta) and ObjectId.is_valid(id_votante)):
            return jsonify({"error": "IDs inválidos"}), 400

        oid_propuesta = ObjectId(id_propuesta)
        oid_votante = ObjectId(id_votante)

        # Verificar existencia
        if not db_votantes.find_one({"_id": oid_votante}):
            return jsonify({"error": "Votante no encontrado"}), 404

        propuesta = db_propuestas.find_one({"_id": oid_propuesta})
        if not propuesta:
            return jsonify({"error": "Propuesta no encontrada"}), 404

        # Verificar voto duplicado
        if db_votes.find_one({"id_propuesta": id_propuesta, "id_votante": id_votante}):
            return jsonify({"error": "Este votante ya votó por esta propuesta"}), 400

        if any(v['id_votante'] == id_votante for v in propuesta.get('votos', [])):
            return jsonify({"error": "Este votante ya está registrado en la propuesta"}), 400

        # Crear voto
        fecha_actual = datetime.utcnow()
        nuevo_voto = {
            "id_propuesta": id_propuesta,
            "id_votante": id_votante,
            "fecha_voto": fecha_actual
        }

        db_votes.insert_one(nuevo_voto)

        db_propuestas.update_one(
            {"_id": oid_propuesta},
            {"$push": {"votos": {"id_votante": id_votante, "fecha_voto": fecha_actual}}}
        )

        db_votantes.update_one(
            {"_id": oid_votante},
            {"$addToSet": {"propuestas_votadas": {"id_propuesta": id_propuesta}}}
        )

        return jsonify({"message": "Voto registrado correctamente", "voto": parse_json(nuevo_voto)}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# DELETE - Eliminar un voto
@votes_bp.route('/', methods=['DELETE'])  # ✅ Responde a DELETE /api/votes/
def eliminar_voto():
    try:
        data = request.get_json()

        id_propuesta = data.get('id_propuesta')
        id_votante = data.get('id_votante')

        if not (id_propuesta and id_votante):
            return jsonify({"error": "Faltan campos requeridos"}), 400

        if not (ObjectId.is_valid(id_propuesta) and ObjectId.is_valid(id_votante)):
            return jsonify({"error": "IDs inválidos"}), 400

        oid_propuesta = ObjectId(id_propuesta)
        oid_votante = ObjectId(id_votante)

        result = db_votes.delete_one({
            "id_propuesta": id_propuesta,
            "id_votante": id_votante
        })

        db_propuestas.update_one(
            {"_id": oid_propuesta},
            {"$pull": {"votos": {"id_votante": id_votante}}}
        )

        db_votantes.update_one(
            {"_id": oid_votante},
            {"$pull": {"propuestas_votadas": {"id_propuesta": id_propuesta}}}
        )

        if result.deleted_count == 0:
            return jsonify({"error": "No se encontró el voto especificado"}), 404

        return jsonify({"message": "Voto eliminado correctamente"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# READ - Obtener votos por votante
@votes_bp.route('/votante/<id_votante>', methods=['GET'])  # ✅ /api/votes/votante/<id>
def obtener_votos_por_votante(id_votante):
    try:
        if not ObjectId.is_valid(id_votante):
            return jsonify({"error": "ID de votante inválido"}), 400

        votos = list(db_votes.find({"id_votante": id_votante}))
        return jsonify(parse_json(votos)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# READ - Obtener votos por propuesta
@votes_bp.route('/propuesta/<id_propuesta>', methods=['GET'])  # ✅ /api/votes/propuesta/<id>
def obtener_votos_por_propuesta(id_propuesta):
    try:
        if not ObjectId.is_valid(id_propuesta):
            return jsonify({"error": "ID de propuesta inválido"}), 400

        votos = list(db_votes.find({"id_propuesta": id_propuesta}))
        return jsonify(parse_json(votos)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
