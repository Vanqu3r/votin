from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson.objectid import ObjectId


app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://notapassword:notapassword@miproyectito.nkjcl.mongodb.net/db_voto?retryWrites=true&w=majority&appName=MiProyectito"
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


@app.route('/user', methods=['POST'])
def createUsuario():
    try:
        # no existe .insert
        result = db.insert_one({
            'name': request.json['name'],
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
            'name': doc['name'],
            'voto': doc['voto']
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
        'name': request.json['name']
    }})
    return jsonify({'Usuario actualizado'})


if __name__ == "__main__":
    app.run(debug=True)
