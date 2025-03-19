import React, { useState } from "react";

const api_back = process.env.REACT_APP_BACK;

export const NewUser = () => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(voto, name, "hola");

        try {
            const r = await fetch(`${api_back}/api/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    apellido,
                    edad,
                    email,
                    telefono,
                    direccion,
                    ciudad,
                    estado,
                    codigoPostal,
                    voto

                })
            });


            // Si la respuesta no es 2xx, lanzamos un error
            if (!r.ok) {
                throw new Error('Error al enviar datos');
            }

            const data = await r.json();
            setRespuestaOK(true);
            resetForm();
            console.log("Respuesta de la API:", data);
        } catch (error) {
            console.error('Error en la solicitud:', error);
            setRespuestaOK(false);
        }
    }

    //limpiar inputs
    const resetForm = () => {
        setName('');
        setApellido('');
        setEdad('');
        setEmail('');
        setTelefono('');
        setDireccion('');
        setCiudad('');
        setEstado('');
        setCodigoPostal('');
        setVoto(false);
    }
    //Los estamos de los input

    const [name, setName] = useState('');
    const [apellido, setApellido] = useState('');
    const [edad, setEdad] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [estado, setEstado] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');
    const [voto, setVoto] = useState(false);
    const [respuestaOK, setRespuestaOK] = useState(false);

    return (
        <div className="row">
            <div className="col-md-4">
                <form onSubmit={handleSubmit} className="card card-body">
                    <input
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        className="form-control mb-3"
                        placeholder="Nombre"
                        autoFocus
                        required
                    />
                    <input
                        type="text"
                        onChange={(e) => setApellido(e.target.value)}
                        value={apellido}
                        className="form-control mb-3"
                        placeholder="Apellido"
                        required
                    />
                    <input
                        type="number"
                        onChange={(e) => setEdad(e.target.value)}
                        value={edad}
                        className="form-control mb-3"
                        placeholder="Edad"
                        required
                    />
                    <input
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className="form-control mb-3"
                        placeholder="Correo electronico"
                        required
                    />
                    <input
                        type="text"
                        onChange={(e) => setTelefono(e.target.value)}
                        value={telefono}
                        className="form-control mb-3"
                        placeholder="Telefono"
                        required
                    />
                    <input
                        type="text"
                        onChange={(e) => setDireccion(e.target.value)}
                        value={direccion}
                        className="form-control mb-3"
                        placeholder="Dirección"
                        required
                    />
                    <input
                        type="text"
                        onChange={(e) => setCiudad(e.target.value)}
                        value={ciudad}
                        className="form-control mb-3"
                        placeholder="Ciudad"
                        required
                    />
                    <input
                        type="text"
                        onChange={(e) => setEstado(e.target.value)}
                        value={estado}
                        className="form-control mb-3"
                        placeholder="Estado"
                        required
                    />
                    <input
                        type="text"
                        onChange={(e) => setCodigoPostal(e.target.value)}
                        value={codigoPostal}
                        className="form-control mb-3"
                        placeholder="Código Postal"
                        required
                    />
                    <div className="form-check mb-3">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="hasVoted"
                            onChange={(e) => setVoto(e.target.checked)}
                            checked={voto}
                        />
                        <label className="form-check-label" htmlFor="hasVoted">
                            Ya votó
                        </label>
                    </div>
                    <button className="btn btn-custom btn-block" type="submit">
                        Enviar
                    </button>
                </form>
                {respuestaOK ? (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="d-none">
                            <symbol id="check-circle-fill" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 
                                9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                            </symbol>
                        </svg>
                        <div className="alert alert-success d-flex align-items-center" role="alert">
                            <svg className="bi flex-shrink-0 me-2" role="img" aria-label="Success:" width="1.2rem" height="1.2rem">
                                <use href="#check-circle-fill" />
                            </svg>
                            <div>
                                Candidato registrado correctamente
                            </div>
                        </div>
                    </>
                ) :null}
            </div>
        </div>

    )
}
