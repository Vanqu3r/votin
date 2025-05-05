from flask import Blueprint, request, jsonify
from bson import ObjectId
from app import mongo
from app.schemas import VotanteSchema  # importamos el schema

votantes_bp = Blueprint('votantes', __name__)
db = mongo.db.v_votantes

votante_schema = VotanteSchema()

# Crear votante con validación
@votantes_bp.route('/', methods=['POST'])
def create_votante():
    try:
        data = request.json
        errores = votante_schema.validate(data)
        if errores:
            return jsonify({'errores': errores})
        
        result = db.insert_one(data)
        
        votante_creado = db.find_one({'_id': result.inserted_id}) # Buscar el votante creado
        votante_creado['_id'] = str(votante_creado['_id']) # Convertir _id a string para poder enviarlo en JSON
        
        return jsonify(votante_creado), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Obtener todos los votantes
@votantes_bp.route('/', methods=['GET'])
def get_votantes():
    votantes = []
    for doc in db.find():
        doc['_id'] = str(doc['_id'])
        votantes.append(doc)
    return jsonify(votantes)

# Obtener un votante por ID
@votantes_bp.route('/<id>', methods=['GET'])
def get_votante(id):
    votante = db.find_one({'_id': ObjectId(id)})
    if not votante:
        return jsonify({'error': 'Votante no encontrado'})

    votante['_id'] = str(votante['_id'])
    return jsonify(votante)

# Obtener un votante por CORREO
@votantes_bp.route('/correo/<correo>', methods=['GET'])
def get_votante_by_correo(correo):
    votante = db.find_one({'correo': correo})
    if not votante:
        return jsonify({'error': 'Votante no encontrado'})

    votante['_id'] = str(votante['_id'])
    return jsonify(votante)

# Actualizar votante con validación
@votantes_bp.route('/<id>', methods=['PUT'])
def update_votante(id):
    try:
        data = request.json
        errores = votante_schema.validate(data, partial=True)
        if errores:
            return jsonify({'errores': errores})
        
        result = db.update_one({'_id': ObjectId(id)}, {'$set': data})
        if result.matched_count == 0:
            return jsonify({'error': 'Votante no encontrado'})
        
        updated_votante = db.find_one({'_id': ObjectId(id)})
        updated_votante['_id'] = str(updated_votante['_id'])
        return jsonify(updated_votante)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Eliminar votante
@votantes_bp.route('/<id>', methods=['DELETE'])
def delete_votante(id):
    db.delete_one({'_id': ObjectId(id)})
    return jsonify({'message': 'Votante eliminado'})

# Obetener preguntas de preferenicas
@votantes_bp.route('/preguntas', methods=['GET'])
def get_preguntas():
    preguntas = {
        "categorias": [
            {
                "numero": 1,
                "nombre": "Economía y Empleo",
                "preguntas": [
                    "¿Apoya políticas para crear más empleo aunque aumente el gasto público?",
                    "¿Está a favor de incentivos para formalizar el trabajo informal?",
                    "¿Cree que es clave capacitar a los trabajadores para nuevos empleos?"
                ]
            },
            {
                "numero": 2,
                "nombre": "Educación",
                "preguntas": [
                    "¿Cree que la educación debe enfocarse más en tecnología y oficios?",
                    "¿Apoya un sistema que combine educación pública y privada de forma justa?",
                    "¿Está de acuerdo en mejorar la educación en zonas rurales?"
                ]
            },
            {
                "numero": 3,
                "nombre": "Salud",
                "preguntas": [
                    "¿Apoya un sistema de salud gratuito y para todos?",
                    "¿Está a favor de fortalecer la prevención en salud más que la atención hospitalaria?",
                    "¿Cree que el sector privado debe colaborar más con el público en salud?"
                ]
            },
            {
                "numero": 4,
                "nombre": "Seguridad y Justicia",
                "preguntas": [
                    "¿Apoya usar más tecnología para combatir el crimen?",
                    "¿Cree que deberían endurecerse las penas para delitos graves?",
                    "¿Está a favor de mejorar la reinserción de presos?"
                ]
            },
            {
                "numero": 5,
                "nombre": "Medio Ambiente",
                "preguntas": [
                    "¿Apoya que el país avance hacia energías limpias?",
                    "¿Está a favor de sancionar más fuerte a las empresas que contaminan?",
                    "¿Cree que las comunidades deben decidir sobre su medio ambiente?"
                ]
            },
            {
                "numero": 6,
                "nombre": "Infraestructura y Transporte",
                "preguntas": [
                    "¿Apoya modernizar el transporte público para reducir el tráfico?",
                    "¿Está a favor de invertir más en carreteras y servicios básicos?",
                    "¿Cree que la conectividad digital es tan importante como la física?"
                ]
            },
            {
                "numero": 7,
                "nombre": "Política Social y Derechos Humanos",
                "preguntas": [
                    "¿Apoya dar ayudas directas a los más pobres?",
                    "¿Está de acuerdo en fortalecer la protección a grupos vulnerables?",
                    "¿Cree que se deben crear organismos independientes para vigilar los derechos humanos?"
                ]
            },
            {
                "numero": 8,
                "nombre": "Gobernabilidad y Reforma Política",
                "preguntas": [
                    "¿Apoya limitar la reelección de autoridades?",
                    "¿Cree que la ciudadanía debe participar más en las decisiones políticas?",
                    "¿Está a favor de reformar la justicia para hacerla más independiente?"
                ]
            },
            {
                "numero": 9,
                "nombre": "Cultura, Ciencia y Tecnología",
                "preguntas": [
                    "¿Apoya más fondos para la cultura y el arte?",
                    "¿Está de acuerdo en aumentar la inversión en ciencia y tecnología?",
                    "¿Cree que la alfabetización digital debería ser prioridad?"
                ]
            },
            {
                "numero": 10,
                "nombre": "Relaciones Exteriores",
                "preguntas": [
                    "¿Apoya fortalecer alianzas regionales para el desarrollo económico?",
                    "¿Cree que deben endurecerse las políticas migratorias?",
                    "¿Está a favor de que el país firme acuerdos contra el cambio climático?"
                ]
            }
        ]
    }

    return jsonify(preguntas)