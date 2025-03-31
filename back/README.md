
# 🗳️ Autovote

## ⚙️ Instalación y Configuración

### 🛠️ Herramientas y Librerías Usadas

- **Flask** → Framework para la API REST
- **Flask-CORS** → Para habilitar peticiones desde frontend externos
- **Flask-PyMongo** → Conexión con MongoDB
- **PyMongo** → Cliente MongoDB para Python
- **Marshmallow** → Validación y serialización de datos

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
  ]
}
```

---

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


