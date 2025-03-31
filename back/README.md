<<<<<<< HEAD



# 🗳️ Autovote

## ⚙️ Instalación y Configuración

### 🛠️ Herramientas y Librerías Usadas

- **Flask** → Framework para la API REST
- **Flask-CORS** → Para habilitar peticiones desde frontend externos
- **Flask-PyMongo** → Conexión con MongoDB
- **PyMongo** → Cliente MongoDB para Python
- **Marshmallow** → Validación y serialización de datos
=======
¡Claro! Aquí te va el **README.md** con formato bonito y listo para usar en tu proyecto. Puedes copiarlo tal cual y pegarlo en tu archivo `README.md`.

---

# 📚 API de Votaciones con Flask, MongoDB y Marshmallow

API RESTful desarrollada en **Flask**, conectada a **MongoDB**, que permite gestionar **usuarios (votantes)**, **candidatos**, **propuestas** y almacenar las **preferencias** de los votantes respecto a diferentes temas de interés político y social.

---

## 🚀 Características

✅ Registro y gestión de votantes  
✅ Registro y gestión de políticos (candidatos)  
✅ Creación y gestión de propuestas de campaña  
✅ Almacenamiento y consulta de las preferencias de votantes  
✅ Validación de datos con **Marshmallow**  
✅ Estructura modular basada en **Blueprints**  
✅ Compatible con MongoDB local y en la nube (Atlas)  
✅ CORS habilitado  
✅ Ruta para obtener dinámicamente las **categorías y preguntas** del formulario de preferencias  

---

## ⚙️ Requisitos Previos

- **Python 3.8+**
- **MongoDB**
  - MongoDB local (`localhost:27017`)
  - o MongoDB Atlas (en la nube)
- **Entorno Virtual (opcional pero recomendado)**

---

## 🛠️ Instalación y Configuración
>>>>>>> 7bdf913356a6ba1e5bd137236b8393256ff40ebc

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/Vanqu3r/votin
cd back
```

---

### 2️⃣ Crear entorno virtual (opcional pero recomendado)

```bash
python -m venv venv

# Linux/macOS
source venv/bin/activate

# Windows
venv\Scripts\activate
```

---

### 3️⃣ Instalar dependencias

```bash
pip install -r requirements.txt
```

Si no tienes `requirements.txt`, instala directamente:

```bash
pip install Flask flask-cors flask-pymongo pymongo marshmallow
pip freeze > requirements.txt
```
---

### 4️⃣ Ejecutar el servidor

```bash
python run.py
```

El servidor se ejecutará en:  
```
http://127.0.0.1:5000/
```

---

<<<<<<< HEAD
## 📋 Colecciones

### 🧱 **Colección: `v_votantes`**

Cada documento representa un **votante**.

```json
{
  _id: ObjectId,
  nombre: String,
  apellido: String,
  edad: Number,
  codigo_postal: String,
  colonia: String,
  ciudad: String,
  estado: String,
  preferencias: {
    "1": [Number, Number, Number],
    "2": [...],
    ...
    "10": [...]
  },
  analisis: String,  // Resultado generado por IA (por ejemplo, ChatGPT)
  propuestas_votadas: [
    { id_propuesta: ObjectId },
    { id_propuesta: ObjectId }
=======
## 📚 Endpoints Disponibles

### 🔐 Usuarios (Votantes) `/api/users`

| Método | Ruta            | Descripción               |
|--------|-----------------|---------------------------|
| POST   | /api/users/     | Crear usuario (votante)   |
| GET    | /api/users/     | Listar todos los usuarios |
| GET    | /api/users/(id) | Obtener usuario por ID    |
| PUT    | /api/users/(id) | Actualizar usuario        |
| DELETE | /api/users/(id) | Eliminar usuario          |

---

### 👔 Candidatos `/api/candidates`

| Método | Ruta                 | Descripción                 |
|--------|----------------------|-----------------------------|
| POST   | /api/candidates/     | Crear candidato             |
| GET    | /api/candidates/     | Listar todos los candidatos |
| GET    | /api/candidates/(id) | Obtener candidato por ID    |
| PUT    | /api/candidates/(id) | Actualizar candidato        |
| DELETE | /api/candidates/(id) | Eliminar candidato          |

---

### 📋 Propuestas `/api/propuestas`

| Método | Ruta                  | Descripción                |
|--------|-----------------------|----------------------------|
| POST   | /api/propuestas/      | Crear propuesta            |
| GET    | /api/propuestas/      | Listar todas las propuestas|
| GET    | /api/propuestas/(id)  | Obtener propuesta por ID   |
| PUT    | /api/propuestas/(id)  | Actualizar propuesta       |
| DELETE | /api/propuestas/(id)  | Eliminar propuesta         |

---

### 📊 Preferencias `/api/preferencias`

| Método | Ruta                           | Descripción                                           |
|--------|--------------------------------|-------------------------------------------------------|
| POST   | /api/preferencias/             | Crear o actualizar las preferencias de un usuario     |
| GET    | /api/preferencias/(usuario_id) | Obtener las preferencias de un usuario por su ID      |
| DELETE | /api/preferencias/(usuario_id) | Eliminar las preferencias de un usuario               |
| GET    | /api/preferencias/preguntas    | Obtener el formulario de categorías y preguntas       |

---

## 📝 Estructura de JSON para Guardar Preferencias  
**(POST `/api/preferencias/`)**

```json
{
  "usuario_id": "66106f1b39814a0372eac9b1",
  "respuestas": {
    "1": [4, 3, 5],
    "2": [5, 4, 4],
    "3": [5, 5, 5],
    "4": [3, 4, 5],
    "5": [4, 4, 4],
    "6": [5, 3, 5],
    "7": [5, 5, 5],
    "8": [4, 3, 4],
    "9": [5, 5, 4],
    "10": [5, 4, 5]
  }
}
```

- `usuario_id`: ID del votante (en formato de `ObjectId`).
- `respuestas`: Objeto donde las claves son las categorías (1-10), y los valores son arreglos con 3 respuestas (del 1 al 5).

---

## 📄 JSON de Categorías y Preguntas  
**(GET `/api/preferencias/preguntas`)**

```json
{
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
    }
    // ... Resto de las categorías hasta la 10
>>>>>>> 7bdf913356a6ba1e5bd137236b8393256ff40ebc
  ]
}
```

---

<<<<<<< HEAD
### 🧱 **Colección: `v_politicos`**

Cada documento representa un **político o candidato**.

```json
{
  _id: ObjectId,
  nombre: String,
  apellido: String,
  edad: Number,
  codigo_postal: String,
  colonia: String,
  ciudad: String,
  estado: String,
  candidatura: String,  // "presidente", "gobernador", "presidente municipal"
  cedula_politica: ObjectId,  // ID del archivo PDF en GridFS
  validacion: Boolean
}
```

---

### 🧱 **Colección: `v_propuestas`**

Cada documento representa una **propuesta política**.

```json
{
  _id: ObjectId,
  id_politico: ObjectId,  // Referencia al político que la creó
  titulo: String,
  descripcion: String,
  categoria: String,  // Una de las categorías válidas
  votos: [
    { id_votante: ObjectId },
    { id_votante: ObjectId }
  ]
}
```

---

### 📂 **GridFS** (para PDFs)

- Los archivos como la `cedula_politica` se almacenan en **GridFS**, en las colecciones internas:
  - `fs.files` → metadatos de archivo
  - `fs.chunks` → fragmentos binarios

---

### 🔗 Relaciones entre colecciones:

- `v_votantes.propuestas_votadas[].id_propuesta` → apunta a `v_propuestas._id`
- `v_politicos.propuestas_creadas[].id_propuesta` → apunta a `v_propuestas._id`
- `v_propuestas.id_politico` → apunta a `v_politicos._id`
- `v_propuestas.votos[].id_votante` → apunta a `v_votantes._id`
- `v_politicos.cedula_politica` → apunta al archivo PDF en **GridFS**

---

## 📊 Endpoints

### 📄 **Rutas para `/api/votante`**

| Método | Endpoint                          | Descripción                                |
|--------|-----------------------------------|--------------------------------------------|
| POST   | `/api/votante/`                  | Crear un nuevo votante con validación      |
| GET    | `/api/votante/`                  | Obtener todos los votantes                 |
| GET    | `/api/votante/<id>`              | Obtener un votante por su ID               |
| PUT    | `/api/votante/<id>`              | Actualizar votante por ID con validación   |
| DELETE | `/api/votante/<id>`              | Eliminar un votante por ID                 |
| GET    | `/api/votante/preguntas`         | Obtener preguntas sobre preferencias       |

---

### 📄 **Rutas para `/api/politico`**

| Método | Endpoint                          | Descripción                                |
|--------|-----------------------------------|--------------------------------------------|
| POST   | `/api/politico/`                 | Crear un nuevo político con validación     |
| GET    | `/api/politico/`                 | Obtener todos los políticos                |
| GET    | `/api/politico/<id>`             | Obtener un político por su ID              |
| PUT    | `/api/politico/<id>`             | Actualizar político por ID                 |
| DELETE | `/api/politico/<id>`             | Eliminar un político por ID                |

---

### 📄 **Rutas para `/api/propuestas`**

| Método | Endpoint                          | Descripción                                      |
|--------|-----------------------------------|--------------------------------------------------|
| POST   | `/api/propuestas/`                | Crear una propuesta (validando político)        |
| GET    | `/api/propuestas/`                | Obtener todas las propuestas                    |
| GET    | `/api/propuestas/<id>`            | Obtener una propuesta por su ID                 |
| GET    | `/api/propuestas/politico/<id>`   | Obtener las propuestas creadas por ID político  |
| PUT    | `/api/propuestas/<id>`            | Actualizar una propuesta por ID                 |
| DELETE | `/api/propuestas/<id>`            | Eliminar una propuesta por ID                   |

---


=======
## 🛠️ Herramientas y Librerías Usadas

- **Flask** → Framework para la API REST
- **Flask-CORS** → Para habilitar peticiones desde frontend externos
- **Flask-PyMongo** → Conexión con MongoDB
- **PyMongo** → Cliente MongoDB para Python
- **Marshmallow** → Validación y serialización de datos
>>>>>>> 7bdf913356a6ba1e5bd137236b8393256ff40ebc
