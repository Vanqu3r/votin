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
            return jsonify({'errores': errores}), 400
        
        result = db.insert_one(data)
        return jsonify({'message': 'Votante creado', 'id': str(result.inserted_id)}), 201
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
        return jsonify({'error': 'Votante no encontrado'}), 404

    votante['_id'] = str(votante['_id'])
    return jsonify(votante)

# Actualizar votante con validación
@votantes_bp.route('/<id>', methods=['PUT'])
def update_votante(id):
    try:
        data = request.json
        errores = votante_schema.validate(data, partial=True)
        if errores:
            return jsonify({'errores': errores}), 400
        
        result = db.update_one({'_id': ObjectId(id)}, {'$set': data})
        if result.matched_count == 0:
            return jsonify({'error': 'Votante no encontrado'}), 404
        
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
                    "¿Está de acuerdo con la implementación de políticas que incentiven la creación de nuevos empleos en el país?",
                    "¿Cree que es necesario reducir impuestos para apoyar a las pequeñas y medianas empresas?",
                    "¿Apoya el aumento del salario mínimo para mejorar la calidad de vida de los trabajadores?"
                ]
            },
            {
                "numero": 2,
                "nombre": "Educación",
                "preguntas": [
                    "¿Considera que se debe incrementar la inversión en educación pública en todos los niveles?",
                    "¿Está de acuerdo con la creación de programas de becas para estudiantes de bajos recursos?",
                    "¿Apoya la modernización del currículo educativo para adaptarlo a las demandas actuales del mercado laboral?"
                ]
            },
            {
                "numero": 3,
                "nombre": "Salud",
                "preguntas": [
                    "¿Cree que el gobierno debe garantizar el acceso universal a servicios de salud de calidad?",
                    "¿Está de acuerdo con aumentar la inversión en infraestructura hospitalaria y equipamiento médico?",
                    "¿Apoya la implementación de programas de prevención y promoción de la salud en las comunidades?"
                ]
            },
            {
                "numero": 4,
                "nombre": "Seguridad y Justicia",
                "preguntas": [
                    "¿Está a favor del fortalecimiento de las fuerzas de seguridad para combatir el crimen de manera efectiva?",
                    "¿Cree que se requiere una reforma del sistema judicial para agilizar y mejorar la justicia?",
                    "¿Apoya la implementación de medidas que aseguren la protección de los derechos humanos en el ámbito de la seguridad?"
                ]
            },
            {
                "numero": 5,
                "nombre": "Medio Ambiente",
                "preguntas": [
                    "¿Está de acuerdo con la promoción de energías renovables para reducir la dependencia de combustibles fósiles?",
                    "¿Cree que se deben establecer políticas más estrictas para la protección del medio ambiente y los recursos naturales?",
                    "¿Apoya la implementación de programas de reciclaje y gestión sostenible de residuos en su comunidad?"
                ]
            },
            {
                "numero": 6,
                "nombre": "Infraestructura y Transporte",
                "preguntas": [
                    "¿Considera necesaria una mayor inversión en la mejora de la infraestructura vial y de transporte público?",
                    "¿Está de acuerdo con proyectos que amplíen el acceso a servicios básicos, como agua potable y saneamiento?",
                    "¿Apoya la modernización de las telecomunicaciones y la conectividad a nivel nacional?"
                ]
            },
            {
                "numero": 7,
                "nombre": "Política Social y Derechos Humanos",
                "preguntas": [
                    "¿Está a favor de implementar políticas que promuevan la igualdad de género y la inclusión social?",
                    "¿Cree que el gobierno debe reforzar los programas de apoyo a personas en situación de vulnerabilidad?",
                    "¿Apoya el fortalecimiento de las leyes y medidas para proteger y garantizar los derechos humanos?"
                ]
            },
            {
                "numero": 8,
                "nombre": "Gobernabilidad y Reforma Política",
                "preguntas": [
                    "¿Está de acuerdo con la realización de reformas políticas que impulsen la transparencia y la rendición de cuentas?",
                    "¿Cree que es fundamental fomentar una mayor participación ciudadana en la toma de decisiones gubernamentales?",
                    "¿Apoya la descentralización del poder para mejorar la gobernabilidad en las distintas regiones del país?"
                ]
            },
            {
                "numero": 9,
                "nombre": "Cultura, Ciencia y Tecnología",
                "preguntas": [
                    "¿Considera importante que el gobierno invierta en el fomento de la cultura y el apoyo a las artes?",
                    "¿Está a favor de aumentar la inversión en investigación científica y desarrollo tecnológico?",
                    "¿Cree que se deben crear programas que integren la innovación tecnológica en la educación y la industria?"
                ]
            },
            {
                "numero": 10,
                "nombre": "Relaciones Exteriores",
                "preguntas": [
                    "¿Está de acuerdo con que el gobierno fortalezca las relaciones diplomáticas y comerciales con otros países?",
                    "¿Cree que es fundamental promover acuerdos internacionales que beneficien al país en términos económicos y de seguridad?",
                    "¿Apoya la implementación de políticas migratorias que favorezcan la integración y seguridad tanto de los migrantes como de la nación?"
                ]
            }
        ]
    }

    return jsonify(preguntas)