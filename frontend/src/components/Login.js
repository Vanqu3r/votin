import { useState, useEffect } from 'react'; // Importar las funciones useState y useEffect
import '../style/Login.css'
const api_back = process.env.REACT_APP_BACK;

const Login = () => {
    const [preferencias, setPreferencias] = useState([]); // Estado para almacenar las preferencias del usuario
    const [formData, setFormData] = useState({ // Estado para almacenar los datos del formulario
        user: 'Votante',
        nombre: '',
        apellido: '',
        edad: 18,
        correo: '',
        codigo_postal: '',
        colonia: '',
        ciudad: '',
        estado: '',
        candidatura: '',
        cedula_politica: '',
    });

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target; // Desestructurar el evento para obtener el nombre y valor del campo

        if (name === 'user' && value === 'Candidato') {
            setFormData({
                ...formData,
                candidatura: '',
                cedula_politica: '',
            });
            setPreferencias([]);
        }

        setFormData(({
            ...formData, // Copiamos todos los valores anteriores
            [name]: value // Actualizamos solo el campo que cambió
        }));
    };

    // Función para verificar el tipo de usuario
    const tipoUsuario = (usuario) => {
        if (usuario === 'Votante') {
            return true;
        } else if (usuario === 'Candidato') {
            return false;
        } else {
            return true;
        }
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Asegurar que la URL no tenga doble barra y termine con barra
            const cleanApiBack = api_back.replace(/([^:]\/)\/+/g, '$1'); // Eliminar dobles barras
            const endpoint = `${cleanApiBack}${cleanApiBack.endsWith('/') ? '' : '/'}${formData.user === 'Votante' ? 'votante/' : 'politico/'
                }`;

            console.log("Endpoint completo:", endpoint); // Verificar en consola

            const requestData = {
                nombre: formData.nombre,
                apellido: formData.apellido,
                edad: formData.edad,
                correo: formData.correo,
                codigo_postal: formData.codigo_postal,
                colonia: formData.colonia,
                ciudad: formData.ciudad,
                estado: formData.estado,
                ...(formData.user === 'Votante' ? {
                    propuestas_votadas: []
                } : {
                    candidatura: formData.candidatura,
                    cedula_politica: formData.cedula_politica,
                    validacion: false
                })
            };

            // Agregar preferencias solo si existen y es votante
            if (formData.user === 'Votante' && preferencias.length > 0) {
                requestData.preferencias = preferencias;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const result = await response.json();
            alert("Registro exitoso!");

            // Resetear formulario
            setFormData(initialFormState);
            setPreferencias([]);

        } catch (error) {
            console.error("Error completo:", error);
            alert("Error en el registro: " + error.message);
        }
    };

    // Estado inicial fuera del componente
    const initialFormState = {
        user: 'Votante',
        nombre: '',
        apellido: '',
        edad: 18,
        correo: '',
        codigo_postal: '',
        colonia: '',
        ciudad: '',
        estado: '',
        candidatura: '',
        cedula_politica: ''
    };

    return (
        <form className="registration-container" onSubmit={handleSubmit}>

            <div className='registration-header'>
                <button className="button-login back-button" onClick={() => window.history.back()}>Cancelar</button>
                <label className="registration-title">Auto<label className="registration-title-vote">Vote</label></label>
                <button className="button-login submit-button" type='submit'>Continuar</button>
            </div>

            <div className="registration-style">

                <div className="section-header">
                    <label className='extra'>Datos adicionales de registro</label>
                    <select
                        className='registration-select'
                        onChange={handleChange}
                        name='user'
                        value={formData.user}
                    >
                        <option value="Votante">Votante</option>
                        <option value="Candidato">Candidato</option>
                    </select>
                </div>

                <div className='registration-card'>

                    <div className="form-section">
                        <label className="form-subheader">Personales</label>
                        <div className="form-fields">
                            <div className="form-group">
                                <label className="form-label">Nombre</label>
                                <input
                                    name='nombre'
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
                                    name='apellido'
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
                                    name='edad'
                                    onChange={handleChange}
                                    type="number"
                                    min='18'
                                    value={formData.edad}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Correo</label>
                                <input
                                    name='correo'
                                    value={formData.correo}
                                    onChange={handleChange}
                                    type="email"
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='registration-card'>
                    <div className="form-section">
                        <label className="form-subheader">Ubicación</label>
                        <div className="form-fields">
                            <div className="form-group">
                                <label className="form-label">Código postal</label>
                                <input
                                    name='codigo_postal'
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
                                    name='colonia'
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
                                    name='ciudad'
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
                                    name='estado'
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
                    <div className='registration-card'>
                        <div className="form-section">
                            <div className="form-fields">
                                <div className="form-group">
                                    <label className="form-label">Candidatura</label>
                                    <select
                                        name='candidatura'
                                        value={formData.candidatura}
                                        onChange={handleChange}
                                        type="text"
                                        className="form-input"
                                        required
                                    >
                                        <option value="">Seleccione una opción</option>
                                        <option value="presidente">Presidente</option>
                                        <option value="gobernador">Gobernador</option>
                                        <option value="presidente municipal">Presidente Municipal</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Cédula política</label>
                                    <input
                                        name='cedula_politica'
                                        value={formData.cedula_politica}
                                        onChange={handleChange}
                                        type="text"
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