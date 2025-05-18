from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime, timezone
from app import mongo
from app.schemas import PropuestaSchema
from google import genai

propuestas_bp = Blueprint('propuestas', __name__)
db = mongo.db.v_propuestas
db_politicos = mongo.db.v_politicos
db_votantes = mongo.db.v_votantes

propuesta_schema = PropuestaSchema()

# Obtener todas las propuestas
@propuestas_bp.route('/', methods=['GET'])
def get_propuestas():
    try:
        propuestas = []
        for propuesta in db.find():
            # Convertir ObjectId a string
            propuesta['_id'] = str(propuesta['_id'])
            
            # Manejar el caso donde id_politico puede ser ObjectId o dict ($oid)
            id_politico = propuesta.get('id_politico')
            if isinstance(id_politico, dict):
                id_politico = id_politico.get('$oid', id_politico)
            
            # Obtener datos completos del político
            politico = db_politicos.find_one({'_id': ObjectId(id_politico)})
            if politico:
                politico['_id'] = str(politico['_id'])
                propuesta['politico'] = politico
            
            propuestas.append(propuesta)
        
        return jsonify(propuestas)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@propuestas_bp.route('/ultimas', methods=['GET'])
def get_propuestas_ultimas():
    try:
        propuestas = []
        for propuesta in db.find().sort('_id', -1).limit(5):
            propuesta['_id'] = str(propuesta['_id'])
            
            id_politico = propuesta.get('id_politico')
            if isinstance(id_politico, dict):
                id_politico = id_politico.get('$oid', id_politico)
            
            politico = db_politicos.find_one({'_id': ObjectId(id_politico)})
            if politico:
                politico['_id'] = str(politico['_id'])
                propuesta['politico'] = politico
            
            propuestas.append(propuesta)
        
        return jsonify(propuestas)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Obtener una propuesta por ID
@propuestas_bp.route('/<id>', methods=['GET'])
def get_propuesta(id):
    propuesta = db.find_one({'_id': ObjectId(id)})
    if not propuesta:
        return jsonify({'error': 'Propuesta no encontrada'})

    propuesta['_id'] = str(propuesta['_id'])
    propuesta['id_politico'] = str(propuesta['id_politico']) if 'id_politico' in propuesta else None
    return jsonify(propuesta)

# Obtener propuestas por político
@propuestas_bp.route('/politico/<id_politico>', methods=['GET'])
def get_propuestas_por_politico(id_politico):
    try:
        # Verificar si el político existe
        existe = mongo.db.v_politicos.find_one({'_id': ObjectId(id_politico)})
        if not existe:
            return jsonify({'error': 'Político no encontrado'})

        # Buscar propuestas con ese id_politico
        propuestas = db.find({'id_politico': id_politico})
        resultado = []

        for propuesta in propuestas:
            propuesta['_id'] = str(propuesta['_id'])

            resultado.append(propuesta)

        return jsonify(resultado)

    except Exception as e:
        return jsonify({"error": str(e)}), 500



# Actualizar una propuesta
@propuestas_bp.route('/<id>', methods=['PUT'])
def update_propuesta(id):
    try:
        data = request.json
        errores = propuesta_schema.validate(data, partial=True)
        if errores:
            return jsonify({'errores': errores})

        result = db.update_one({'_id': ObjectId(id)}, {'$set': data})
        if result.matched_count == 0:
            return jsonify({'error': 'Propuesta no encontrada'})

        updated_propuesta = db.find_one({'_id': ObjectId(id)})
        updated_propuesta['_id'] = str(updated_propuesta['_id'])
        updated_propuesta['id_politico'] = str(updated_propuesta['id_politico']) if 'id_politico' in updated_propuesta else None
        return jsonify(updated_propuesta)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Eliminar una propuesta
@propuestas_bp.route('/<id>', methods=['DELETE'])
def delete_propuesta(id):
    try:
        result = db.delete_one({'_id': ObjectId(id)})
        if result.deleted_count == 0:
            return jsonify({'error': 'Propuesta no encontrada'})
        return jsonify({'message': 'Propuesta eliminada'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

from google import genai

@propuestas_bp.route('/', methods=['POST'])
def create_propuesta():
    try:
        data = request.json
        errores = propuesta_schema.validate(data)
        
        if errores:
            return jsonify({'errores': errores})

        # Validar que el político exista
        id_politico = data.get('id_politico')
        if not id_politico or not db_politicos.find_one({'_id': ObjectId(id_politico)}):
            return jsonify({'error': 'Político no encontrado'})

        # Obtener datos
        categoria = data.get('categoria')
        titulo = data.get('titulo')
        descripcion = data.get('descripcion')
        preguntas = obtener_preguntas(categoria)
        
        # Crear el prompt para la API de Gemini
        prompt = f"""
        Evalúa la siguiente propuesta política y responde solo con los números (separados por comas) de las calificaciones del 1 al 5, según corresponda a cada pregunta. No agregues texto adicional, solo los números en el orden de las preguntas.

        Categoría de la propuesta:
        {categoria}
        
        Título:
        {titulo}

        Propuesta:
        {descripcion}

        Preguntas:
        {preguntas}

        Devuelve la respuesta en el formato:
        número,número,número (por ejemplo: 5,4,3)
        """

        # Llamar a la API de Gemini ❗❗DESCOMENTAR PARA HACER EL LLAMADO A LA API DE GEMINI ❗❗
        client = genai.Client(api_key="AIzaSyAns4IRZ6vdnfK8dqWQv_jKoy1_ZT8jUIo")
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt,
        )

        # Obtener la respuesta de la API de Gemini (solo los números)
        # ❗❗DESCOMENTAR PARA OBTENERLO DE LA RESPUESTA ❗❗
        calificaciones = response.text.strip()
        # calificaciones = '1,2,5'
        

        # Insertar la propuesta en la base de datos
        propuesta_data = {
            'id_politico': ObjectId(id_politico),
            'titulo': titulo,
            'descripcion': descripcion,
            'categoria': categoria,
            'valoracion': list(map(int, calificaciones.split(','))),  # Convertir a lista de enteros
            'fecha_creacion': datetime.now(timezone.utc),
        }
           
        result = db.insert_one(propuesta_data)
        prpuesta_creada = db.find_one({'_id': result.inserted_id}) # Buscar la propuesta creada
        
        # Obtener votantes
        votantes = db_votantes.find()
        
        for votante in votantes:
            generar_voto_si_coincide(prpuesta_creada, votante)

        # Devolver la propuesta y las valoraciones
        return jsonify({
            'message': 'Propuesta creada',
            'id': str(result.inserted_id),
            'valoracion': calificaciones
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Mapea categorías a IDs (ajusta según tu sistema)
CATEGORIA_MAP = {
    "Economía y Empleo": 1,
    "Educación": 2,
    "Salud": 3,
    "Seguridad y Justicia": 4,
    "Medio Ambiente": 5,
    "Infraestructura y Transporte": 6,
    "Política Social y Derechos Humanos": 7,
    "Gobernabilidad y Reforma Política": 8,
    "Cultura, Ciencia y Tecnología": 9,
    "Relaciones Exteriores": 10
}

def generar_voto_si_coincide(propuesta, votante):
    categoria_nombre = propuesta['categoria']
    categoria_id = CATEGORIA_MAP.get(categoria_nombre)

    if not categoria_id:
        return False  # Categoría no válida

    # Obtener las preferencias de esa categoría del votante
    preferencias_categoria = [p for p in votante['preferencias'] if p['categoria_id'] == categoria_id]

    if len(preferencias_categoria) != 3:
        return False  # Algo está mal, deberían ser 3 preguntas por categoría

    valoracion_propuesta = propuesta['valoracion']  # lista: [v1, v2, v3]

    # Comparamos cada pregunta (índice 0, 1, 2)
    coincidencias = 0
    for i in range(3):
        valor_votante = preferencias_categoria[i]['valoracion']
        valor_propuesta = valoracion_propuesta[i]
        if valor_votante == valor_propuesta:
            coincidencias += 1

    # Decide tu criterio aquí:
    if coincidencias >= 3:
        print(f"Generando voto para votante {votante['_id']} en propuesta {propuesta['id_politico']}")
        voto = {
            'id_votante': votante['_id']
        }
        
         # Insertamos el voto en la propuesta
        db.update_one(
            {'_id': propuesta['_id']},
            {'$push': {'votos': voto}}
        )

        # Insertamos la propuesta en 'propuestas_votadas' del votante
        db_votantes.update_one(
            {'_id': votante['_id']},
            {'$push': {'propuestas_votadas': propuesta['_id']}}
        )
    
        return True  # Voto generado

    else:
        print(f"No hay suficientes coincidencias para votar (solo {coincidencias}/3)")
        return False


def obtener_preguntas(nombre_categoria):
    for categoria in preguntas['categorias']:
        if categoria['nombre'].lower() == nombre_categoria.lower():
            lista_preguntas = categoria['preguntas']
            texto = "\n".join([f"{i+1}. {pregunta}" for i, pregunta in enumerate(lista_preguntas)])
            return texto
    return "No se encontraron preguntas para esta categoría."


# Cambiar estas para cambiarlas en todo el sistema
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
