import { useState, useEffect } from "react"; // Importar las funciones useState
import "../style/Login.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Importar useNavigate para redireccionar
import axios from "axios";
import apiClient from "../api/client";
// FIREBASE
import {
  handleLogout,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "../api/firebase.config";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// FUNCION PARA SEPARAR NOMBRE Y APELLIDO
function obtenerNombreApellido(displayName) {
  const partes = displayName.trim().split(" ");
  if (partes.length < 2) {
    return {
      nombres: displayName,
      apellidos: "",
    };
  }
  const nombres = partes.slice(0, partes.length - 2).join(" ");
  const apellidos = partes.slice(-2).join(" ");
  return {
    nombres,
    apellidos,
  };
}

const Login = () => {
  // --- FIREBASE FILES
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      console.log("Por favor selecciona un archivo");
      return;
    }

    try {
      // 1. Crear referencia con nombre único
      const fileName = `files/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, fileName);

      // 2. Subir el archivo
      const snapshot = await uploadBytes(storageRef, file);

      // 3. Obtener URL (usando la referencia del snapshot)
      const url = await getDownloadURL(snapshot.ref);
      formData.cedula_politica = url;
    } catch (err) {
      console.error("Error completo:", err);
    }
  };
  // --- FIREBASE FILES

  const [userg, setUserg] = useState(null);
  const navigate = useNavigate(); // Inicializar el hook useNavigate
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    user: "Votante",
    nombre: "",
    apellido: "",
    edad: 18,
    correo: "",
    codigo_postal: "",
    colonia: "",
    ciudad: "",
    estado: "",
    candidatura: "",
    cedula_politica: "",
  });

  // Estado inicial fuera del componente
  const initialFormState = {
    user: "Votante",
    nombre: "",
    apellido: "",
    edad: 18,
    correo: "",
    codigo_postal: "",
    colonia: "",
    ciudad: "",
    estado: "",
    candidatura: "",
    cedula_politica: "",
  };

  // --- VALIDAR QUE EL USUARIO ESTÉ LOGUEADO
  const { user, login, isLoading } = useAuth();
  useEffect(() => {
    // Solo redirige cuando la carga ha terminado Y no hay usuario
    if (!isLoading && user) {
      navigate("/dashboard"); // Redirigir a la página de inicio si el usuario no está autenticado
    }
  }, [isLoading]);
  // --- VALIDAR QUE EL USUARIO ESTÉ LOGUEADO

  // --- OBTENER USUARIO LOGUEADO DE FIREBASE
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUserg(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  // --- OBTENER USUARIO LOGUEADO DE FIREBASE

  // --- SETEAR NOMBRE Y APELLIDO DEL USUARIO LOGUEADO
  useEffect(() => {
    if (userg !== null) {
      const resultado = obtenerNombreApellido(userg.displayName);
      setFormData((prevFormData) => ({
        ...prevFormData,
        nombre: resultado.nombres,
        apellido: resultado.apellidos,
        correo: userg.email,
      }));
    }
  }, [userg]);
  // --- SETEAR NOMBRE Y APELLIDO DEL USUARIO LOGUEADO

  // --- MANEJAR LOS CAMBIOS EN EL FORMULARIO
  const handleChange = (e) => {
    const { name, value } = e.target; // Desestructurar el evento para obtener el nombre y valor del campo

    if (name === "user" && value === "Candidato") {
      setFormData({
        ...formData,
        candidatura: "",
        cedula_politica: "",
      });
    }

    setFormData({
      ...formData, // Copiamos todos los valores anteriores
      [name]: value, // Actualizamos solo el campo que cambió
    });
  };
  // --- MANEJAR LOS CAMBIOS EN EL FORMULARIO

  // -- FUNCION PARA VERIFICAR EL TIPO DE USUARIO (Mostrar opciones para candidato)
  const tipoUsuario = (usuario) => {
    if (usuario === "Votante") {
      return true;
    } else if (usuario === "Candidato") {
      return false;
    } else {
      return true;
    }
  };
  // -- FUNCION PARA VERIFICAR EL TIPO DE USUARIO (Mostrar opciones para candidato)

  // -- ENVIO DE DATOS | REGISTRO
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        edad: formData.edad,
        correo: formData.correo,
        codigo_postal: formData.codigo_postal,
        colonia: formData.colonia,
        ciudad: formData.ciudad,
        estado: formData.estado,
        photoURL: userg.photoURL,
        ...(formData.user === "Votante"
          ? {
              preferencias: [],
              propuestas_votadas: [],
            }
          : {
              candidatura: formData.candidatura,
              cedula_politica: formData.cedula_politica,
              validacion: "pendiente",
            }),
      };

      let response;

      if (formData.user === "Candidato") {
        try {
          await handleUpload(); // Llamar a la función de carga de archivos
          requestData.cedula_politica = formData.cedula_politica; // Asignar la URL del archivo al objeto de datos
          response = await apiClient.post("politico", requestData);

          // formData.cedula_politica = response.data.cedula_politica;
          navigate("/dashboard");
        } catch (error) {
          console.error("Error al crear politico: ", error);
          return;
        }
      } else if (formData.user === "Votante") {
        try {
          response = await apiClient.post("votante", requestData);
          navigate("/preferencias");
        } catch (error) {
          console.error("Error al crear votante: ", error);
          return;
        }
      }

      if (response.status === 201) {
        const userk = {
          uid: response.data._id,
          nombre: response.data.nombre,
          apellido: response.data.apellido,
          edad: response.data.edad,
          correo: response.data.correo,
          codigo_postal: response.data.codigo_postal,
          colonia: response.data.colonia,
          ciudad: response.data.ciudad,
          estado: response.data.estado,
          photoURL: response.data.photoURL,
          tipo: formData.user.toLowerCase(),
        };

        login(userk);
      }

      // setFormData(initialFormState); // Resetear formulario
    } catch (error) {
      console.error("Error completo:", error);
      alert("Error en el registro: " + error.message);
    }
  };
  // -- ENVIO DE DATOS | REGISTRO

  // --- FUNCION PARA CERRAR SESION
  const handleLogoutClick = async () => {
    await handleLogout(); // Llamamos a la función de cierre de sesión de Firebase
    navigate("/"); // Redirigir a la página principal después de cerrar sesión
  };
  // --- FUNCION PARA CERRAR SESION

  // --- PARA CODIGO POSTAL
  const [postalCode, setPostalCode] = useState("");
  const [addressData, setAddressData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePostalCodeChange = async (e) => {
    const cp = e.target.value.replace(/\D/g, "");
    setPostalCode(cp);
    setError(null);

    if (cp.length === 5) {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.copomex.com/query/info_cp/${cp}?token=591a2db3-0048-4dce-91cf-12b7e5bfa4bd`
        );

        // Verificación segura de la respuesta
        const data = response.data;

        if (!data) {
          throw new Error("No se recibieron datos");
        }

        // Maneja diferentes estructuras de respuesta
        const addresses = data.error
          ? []
          : data.response
          ? data.response
          : Array.isArray(data)
          ? data
          : [];

        if (addresses.length === 0) {
          setError("No se encontraron resultados para este código postal");
        }

        setAddressData(addresses);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error al buscar el código postal. Intenta nuevamente.");
        setAddressData([]);
      } finally {
        setLoading(false);
      }
    } else {
      setAddressData([]);
    }
  };

  const handleAddressSelect = (address) => {
    setFormData({
      ...formData,
      codigo_postal: postalCode,
      colonia: address.response.asentamiento,
      ciudad: address.response.municipio,
      estado: address.response.estado,
    });
  };
  // --- PARA CODIGO POSTAL

  return (
    <form className="registration-container" onSubmit={handleSubmit}>
      <div className="registration-header">
        <button
          className="button-login back-button"
          onClick={handleLogoutClick}
        >
          Cancelar
        </button>
        <label className="registration-title">
          Auto<label className="registration-title-vote">Vote</label>
        </label>
        <button className="button-login submit-button-login" type="submit">
          Continuar
        </button>
      </div>

      <div className="registration-style">
        <div className="section-header">
          <label className="extra">Datos adicionales de registro</label>
          <select
            className="registration-select"
            onChange={handleChange}
            name="user"
            value={formData.user}
          >
            <option value="Votante">Votante</option>
            <option value="Candidato">Candidato</option>
          </select>
        </div>

        <div className="registration-card">
          <div className="form-section">
            <label className="form-subheader">Personales</label>
            <div className="form-fields">
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  type="text"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Apellido</label>
                <input
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  type="text"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Edad</label>
                <input
                  name="edad"
                  onChange={handleChange}
                  type="number"
                  min="18"
                  value={formData.edad}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Correo</label>
                <input
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  type="email"
                  className="form-input"
                  required
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sección de búsqueda de ubicación */}
        <div className="registration-card">
          <div className="form-section">
            <label className="form-subheader">Ubicación</label>

            <div className="location-search-container">
              <div className="mb-3">
                <label htmlFor="postalCode" className="form-label">
                  Buscar por Código Postal
                </label>
                <div className="search-input-group">
                  <input
                    type="text"
                    className="form-input"
                    id="postalCode"
                    maxLength="5"
                    value={postalCode}
                    onChange={handlePostalCodeChange}
                    placeholder="Ej. 11520"
                  />
                  {loading && (
                    <div className="search-loading">
                      <span className="spinner"></span> Buscando...
                    </div>
                  )}
                  {error && <div className="search-error">{error}</div>}
                </div>
              </div>

              {addressData.length > 0 && (
                <div className="location-results">
                  <div className="mb-3">
                    <label className="form-label">Colonias disponibles</label>
                    <select
                      className="form-select"
                      onChange={(e) =>
                        handleAddressSelect(addressData[e.target.value])
                      }
                    >
                      <option value="">Selecciona una colonia</option>
                      {addressData.map((item, index) => (
                        <option key={index} value={index}>
                          {item.response.asentamiento ||
                            "Colonia no especificada"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="form-fields">
              <div className="form-group">
                <label className="form-label">Código postal</label>
                <input
                  name="codigo_postal"
                  value={formData.codigo_postal}
                  onChange={handleChange}
                  type="text"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Colonia</label>
                <input
                  name="colonia"
                  value={formData.colonia}
                  onChange={handleChange}
                  type="text"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Ciudad</label>
                <input
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  type="text"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Estado</label>
                <input
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  type="text"
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {!tipoUsuario(formData.user) && (
          <div className="registration-card">
            <div className="form-section">
              <div className="form-fields">
                <label className="form-subheader">Candidato</label>
                <div className="form-group">
                  <label className="form-label">Candidatura</label>
                  <select
                    name="candidatura"
                    value={formData.candidatura}
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="presidente">Presidente</option>
                    <option value="gobernador">Gobernador</option>
                    <option value="presidente municipal">
                      Presidente Municipal
                    </option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Cédula política</label>
                  <input
                    name="cedula_politica"
                    // value={formData.cedula_politica}
                    onChange={handleFileChange}
                    type="file"
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default Login;
