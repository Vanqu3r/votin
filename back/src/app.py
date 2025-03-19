from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
import pymongo  # <-- Asegúrate de importar pymongo
from pymongo.errors import ServerSelectionTimeoutError  


app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://Monlliz:Monlliz@miproyectito.nkjcl.mongodb.net/db_voto?retryWrites=true&w=majority&appName=MiProyectito"
mongo = PyMongo(app)
CORS(app)
# hacer referencia a la coleccion v_usuario
db = mongo.db['v_usuario']
# hacer referencia a la coleccion v_candidatos
dbC = mongo.db['v_candidatos']
# solo estan esas dos colecciones


@app.route('/')
def main():
    return 'back'

#Metodos USER
@app.route('/user', methods=['POST'])
def createUsuario():
    try:
        # no existe .insert
        result = db.insert_one({
            'name': request.json['name'],
            'apellido': request.json['apellido'],
            'edad': request.json['edad'],
            'email': request.json['email'],
            'telefono': request.json['telefono'],
            'direccion': request.json['direccion'],
            'ciudad': request.json['ciudad'],
            'estado': request.json['estado'],
            'codigoPostal': request.json['codigoPostal'],
            'voto': request.json['voto']
        })
        idUsuario = (str(result.inserted_id))
        return jsonify({'message': 'Usuario creado con éxito', 'id': str(idUsuario)}), 201
    except Exception as e:
        return f'Error al crear usuario: {str(e)}', 500


@app.route('/user', methods=['GET'])
def getUsuario():
    user = []
    for doc in db.find():
        user.append({
            '_id': str(ObjectId(doc['_id'])),
            'name': doc.get('name', ''), 
            'apellido': doc.get('apellido', ''),
            'edad': doc.get('edad', ''),
            'email': doc.get('email', ''),
            'telefono': doc.get('telefono', ''),
            'direccion': doc.get('direccion', ''),
            'ciudad': doc.get('ciudad', ''),
            'estado': doc.get('estado', ''),
            'codigoPostal': doc.get('codigoPostal', ''),
            'voto': doc.get('voto', '')
        })
    return jsonify(user)


@app.route('/user/<id>', methods=['GET'])
def getUsuarios(id):
    user = db.find_one({'_id': ObjectId(id)})
    return jsonify({
        '_id': str(ObjectId(user['_id'])),
        'name': user['name'],
        'voto': user['voto']
    })


@app.route('/user/<id>', methods=['DELETE'])
def deleteUsuario(id):
    db.delete_one({'_id': ObjectId(id)})
    return jsonify({'Usuario eliminado'})


@app.route('/user/<id>', methods=['PUT'])
def updateUsuario(id):
    db.update_one({'_id': ObjectId(id)}, {'$set': {
        'name': request.json['name'],
            'apellido': request.json['apellido'],
            'edad': request.json['edad'],
            'email': request.json['email'],
            'telefono': request.json['telefono'],
            'direccion': request.json['direccion'],
            'ciudad': request.json['ciudad'],
            'estado': request.json['estado'],
            'codigoPostal': request.json['codigoPostal'],
            'voto': request.json['voto']
    }})
    #regresa los datos del registro actualizado
    updated_user = db.find_one({'_id': ObjectId(id)})
    updated_user['_id'] = str(updated_user['_id'])
    return jsonify(updated_user)

#Metodos candidatos-------------------------------------------------------------------------------------
@app.route('/candidate', methods=['POST'])
def createCandidate():
    try:
        # no existe .insert
        result = dbC.insert_one({
            'name': request.json['name'],
            'apellido': request.json['apellido'],
            'edad': request.json['edad'],
            'direccion': request.json['direccion'],
            'ciudad': request.json['ciudad'],
            'estado': request.json['estado'],
            'codigoPostal': request.json['codigoPostal']
        })
        idCandidate = (str(result.inserted_id))
        return jsonify({'message': 'Candidate creado con éxito', 'id': str(idCandidate)}), 201
    except pymongo.errors.ServerSelectionTimeoutError:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
    except Exception as e:
        return f'Error al crear Candidato: {str(e)}', 500

@app.route('/candidate', methods=['GET'])
def getCandidate():
    candidate = []
    for doc in dbC.find():
        candidate.append({
            '_id': str(ObjectId(doc['_id'])),
            'name': doc.get('name', ''), 
            'apellido': doc.get('apellido', ''),
            'edad': doc.get('edad', ''),
            'direccion': doc.get('direccion', ''),
            'ciudad': doc.get('ciudad', ''),
            'estado': doc.get('estado', ''),
            'codigoPostal': doc.get('codigoPostal', '')
        })
    return jsonify(candidate)



@app.route('/candidate/<id>', methods=['GET'])
def getCandidates(id):
    candidate = dbC.find_one({'_id': ObjectId(id)})
    return jsonify({
        '_id': str(ObjectId(candidate['_id'])),
        'name': request.json['name'],
            'apellido': request.json['apellido'],
            'edad': request.json['edad'],
            'direccion': request.json['direccion'],
            'ciudad': request.json['ciudad'],
            'estado': request.json['estado'],
            'codigoPostal': request.json['codigoPostal']
    })


@app.route('/candidate/<id>', methods=['DELETE'])
def deleteCandidate(id):
    try:
        result = dbC.delete_one({'_id': ObjectId(id)})

        if result.deleted_count == 0:
            return jsonify({"error": "Candidato no encontrado"}), 404

        return jsonify({"message": "Candidato eliminado"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/candidate/<id>', methods=['PUT'])
def updateCandidate(id):
    dbC.update_one({'_id': ObjectId(id)}, {'$set': {
        'name': request.json['name'],
        'apellido': request.json['apellido'],
            'edad': request.json['edad'],
            'direccion': request.json['direccion'],
            'ciudad': request.json['ciudad'],
            'estado': request.json['estado'],
            'codigoPostal': request.json['codigoPostal']
    }})
    #regresa los datos del registro actualizado
    updated_candidate = dbC.find_one({'_id': ObjectId(id)})
    updated_candidate['_id'] = str(updated_candidate['_id'])
    return jsonify(updated_candidate)

if __name__ == "__main__":
    app.run(debug=True)
