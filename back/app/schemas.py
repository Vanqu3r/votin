from marshmallow import Schema, fields, validate

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