from flask import Flask, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from .config import Config






mongo = PyMongo()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inicializar extensiones
    mongo.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
    
    # Registrar blueprints
    from .routes.usuarios import usuarios_bp
    from .routes.candidatos import candidatos_bp
    from .routes.propuestas import propuestas_bp
    from .routes.preferencias import preferencias_bp
    CORS(usuarios_bp)
    CORS(candidatos_bp)
    CORS(propuestas_bp)
    CORS(preferencias_bp)
    
    app.register_blueprint(usuarios_bp, url_prefix='/api/users')
    app.register_blueprint(candidatos_bp, url_prefix='/api/candidates')
    app.register_blueprint(propuestas_bp, url_prefix='/api/propuestas')
    app.register_blueprint(preferencias_bp, url_prefix='/api/preferencias')

    # Ruta por defecto
    @app.route('/')
    def index():
        return {'message': 'API Votaciones corriendo'}
    
    # LISTAR TODAS LAS RUTAS DISPONIBLES
    @app.route('/routes', methods=['GET'])
    def listar_rutas():
        rutas = []
        for rule in app.url_map.iter_rules():
            rutas.append({
                'endpoint': rule.endpoint,
                'ruta': str(rule),
                'metodos': list(rule.methods)
            })
        return jsonify(rutas)

    # Manejo de error 404
    @app.errorhandler(404)
    def pagina_no_encontrada(e):
        return {'error': 'Ruta no encontrada'}, 404

    return app
