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

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/api-votaciones.git
cd api-votaciones
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
npm install recharts
```

Si no tienes `requirements.txt`, instala directamente:

```bash
pip install Flask flask-cors flask-pymongo pymongo marshmallow
pip freeze > requirements.txt
```

---

### 4️⃣ Configurar la conexión a MongoDB

Edita el archivo `app/config.py`:

```python
class Config:
    SECRET_KEY = 'supersecretkey'

    # MongoDB local
    MONGO_URI = 'mongodb://localhost:27017/db_voto'

    # MongoDB Atlas (descomentar y completar)
    # MONGO_URI = 'mongodb+srv://<user>:<password>@<cluster>.mongodb.net/db_voto'
```

---

### 5️⃣ Ejecutar el servidor

```bash
python run.py
```

El servidor se ejecutará en:  
```
http://127.0.0.1:5000/
```

---

## 📚 Endpoints Disponibles

### 🔐 Usuarios (Votantes) `/api/users`

| Método | Ruta            | Descripción               |
|--------|-----------------|---------------------------|
| POST   | /api/users/     | Crear usuario (votante)   |
| GET    | /api/users/     | Listar todos los usuarios |
| GET    | /api/users/<id> | Obtener usuario por ID    |
| PUT    | /api/users/<id> | Actualizar usuario        |
| DELETE | /api/users/<id> | Eliminar usuario          |

---

### 👔 Candidatos `/api/candidates`

| Método | Ruta                 | Descripción                 |
|--------|----------------------|-----------------------------|
| POST   | /api/candidates/     | Crear candidato             |
| GET    | /api/candidates/     | Listar todos los candidatos |
| GET    | /api/candidates/<id> | Obtener candidato por ID    |
| PUT    | /api/candidates/<id> | Actualizar candidato        |
| DELETE | /api/candidates/<id> | Eliminar candidato          |

---

### 📋 Propuestas `/api/propuestas`

| Método | Ruta                  | Descripción                |
|--------|-----------------------|----------------------------|
| POST   | /api/propuestas/      | Crear propuesta            |
| GET    | /api/propuestas/      | Listar todas las propuestas|
| GET    | /api/propuestas/<id>  | Obtener propuesta por ID   |
| PUT    | /api/propuestas/<id>  | Actualizar propuesta       |
| DELETE | /api/propuestas/<id>  | Eliminar propuesta         |

---

### 📊 Preferencias `/api/preferencias`

| Método | Ruta                           | Descripción                                           |
|--------|--------------------------------|-------------------------------------------------------|
| POST   | /api/preferencias/             | Crear o actualizar las preferencias de un usuario     |
| GET    | /api/preferencias/<usuario_id> | Obtener las preferencias de un usuario por su ID      |
| DELETE | /api/preferencias/<usuario_id> | Eliminar las preferencias de un usuario               |
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
  ]
}
```

---

## 🛠️ Herramientas y Librerías Usadas

- **Flask** → Framework para la API REST
- **Flask-CORS** → Para habilitar peticiones desde frontend externos
- **Flask-PyMongo** → Conexión con MongoDB
- **PyMongo** → Cliente MongoDB para Python
- **Marshmallow** → Validación y serialización de datos
