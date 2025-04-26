from marshmallow import Schema, fields, validate
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
    correo = fields.Email(required=True) 
    codigo_postal = fields.String(required=True)
    colonia = fields.String(required=True)
    ciudad = fields.String(required=True)
    estado = fields.String(required=True)
    preferencias = fields.List(fields.Raw())
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

# PROPUESTA: Schema para Propuesta
class PropuestaSchema(Schema):
    id = fields.String(dump_only=True)
    id_politico = fields.String(required=True)
    titulo = fields.String(required=True, validate=validate.Length(min=5))
    descripcion = fields.String(required=True, validate=validate.Length(min=10))
    categoria = fields.String(required=True, validate=validate.OneOf(CATEGORIAS_VALIDAS))
    votos = fields.List(fields.Nested(VotoSchema))
