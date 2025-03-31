from marshmallow import Schema, fields, validate
<<<<<<< HEAD
from datetime import datetime

# VOTANTE: Schema para propuestas votadas
class PropuestaVotadaSchema(Schema):
    id_propuesta = fields.String(required=True)

# VOTANTE: Schema para preferencias
class PreferenciasSchema(Schema):
    # Claves: "1" a "10"
    # Valores: listas de exactamente 3 números entre 1 y 5
    preferencias = fields.Dict(
        keys=fields.String(validate=validate.OneOf([str(i) for i in range(1, 11)])),
        values=fields.List(
            fields.Integer(validate=validate.Range(min=1, max=5)),
            validate=validate.Length(equal=3)
        ),
        required=True
    )

# VOTANTE: Schema para Votante
class VotanteSchema(Schema):
    id = fields.String(dump_only=True)
    nombre = fields.String(required=True, validate=validate.Length(min=1))
    apellido = fields.String(required=True, validate=validate.Length(min=1))
    edad = fields.Integer(required=True, validate=validate.Range(min=18))
    codigo_postal = fields.String(required=True)
    colonia = fields.String(required=True)
    ciudad = fields.String(required=True)
    estado = fields.String(required=True)
    preferencias = fields.Nested(PreferenciasSchema)
    analisis = fields.String()
    propuestas_votadas = fields.List(fields.Nested(PropuestaVotadaSchema))

# POLITICO: Schema para Político
class PoliticoSchema(Schema):
    id = fields.String(dump_only=True)
    nombre = fields.String(required=True, validate=validate.Length(min=1))
    apellido = fields.String(required=True, validate=validate.Length(min=1))
    edad = fields.Integer(required=True, validate=validate.Range(min=18))
    correo = fields.Email(required=True)
    codigo_postal = fields.String(required=True)
    colonia = fields.String(required=True)
    ciudad = fields.String(required=True)
    estado = fields.String(required=True)
    candidatura = fields.String(required=True, validate=validate.OneOf([
        "presidente", "gobernador", "presidente municipal"
    ]))
    cedula_politica = fields.String(required=True)
    validacion = fields.Boolean(missing=False)

# PROPUESTA: Schema para Votos (usado en propuestas)
class VotoSchema(Schema):
    id_votante = fields.String(required=True)

# PROPUESTA: Lista de categorías válidas para propuestas
=======

# Schema para Usuario
class UsuarioSchema(Schema):
    name = fields.String(required=True, validate=validate.Length(min=1))
    apellido = fields.String(required=True, validate=validate.Length(min=1))
    edad = fields.Integer(required=True, validate=validate.Range(min=18))  # Ejemplo: mínimo 18 años
    email = fields.Email(required=True)
    telefono = fields.String(required=True)
    direccion = fields.String(required=True)
    ciudad = fields.String(required=True)
    estado = fields.String(required=True)
    codigoPostal = fields.String(required=True)
    voto = fields.String(required=True, validate=validate.OneOf(["si", "no"]))  # Ejemplo: solo "si" o "no"

# Schema para Candidato
class CandidatoSchema(Schema):
    name = fields.String(required=True, validate=validate.Length(min=1))
    apellido = fields.String(required=True, validate=validate.Length(min=1))
    edad = fields.Integer(required=True, validate=validate.Range(min=18))
    direccion = fields.String(required=True)
    ciudad = fields.String(required=True)
    estado = fields.String(required=True)
    codigoPostal = fields.String(required=True)

# Lista de categorías válidas
>>>>>>> 7bdf913356a6ba1e5bd137236b8393256ff40ebc
CATEGORIAS_VALIDAS = [
    "Economía y Empleo",
    "Educación",
    "Salud",
    "Seguridad y Justicia",
    "Medio Ambiente",
    "Infraestructura y Transporte",
    "Política Social y Derechos Humanos",
    "Gobernabilidad y Reforma Política",
    "Cultura, Ciencia y Tecnología",
    "Relaciones Exteriores"
]

<<<<<<< HEAD
# PROPUESTA: Schema para Propuesta
class PropuestaSchema(Schema):
    id = fields.String(dump_only=True)
    id_politico = fields.String(required=True)
    titulo = fields.String(required=True, validate=validate.Length(min=5))
    descripcion = fields.String(required=True, validate=validate.Length(min=10))
    categoria = fields.String(required=True, validate=validate.OneOf(CATEGORIAS_VALIDAS))
    votos = fields.List(fields.Nested(VotoSchema))
=======
# Schema para Propuestas
class PropuestaSchema(Schema):
    candidato_id = fields.String(required=True)
    titulo = fields.String(required=True, validate=validate.Length(min=5))
    descripcion = fields.String(required=True, validate=validate.Length(min=10))
    fecha = fields.String(required=True)  # Mejor manejarlo como Date si deseas validar el formato
    estatus = fields.String(required=True, validate=validate.OneOf(["activo", "inactivo"]))
    categoria = fields.String(required=True, validate=validate.OneOf(CATEGORIAS_VALIDAS))
    
# Schema para Preferencias    
class PreferenciaSchema(Schema):
    usuario_id = fields.String(required=True)
    
    respuestas = fields.Dict(
        keys=fields.String(validate=validate.OneOf([str(i) for i in range(1, 11)])),
        values=fields.List(
            fields.Integer(validate=validate.Range(min=1, max=5)),
            validate=validate.Length(equal=3)  # Deben ser 3 respuestas por categoría
        ),
        required=True
    )
>>>>>>> 7bdf913356a6ba1e5bd137236b8393256ff40ebc
