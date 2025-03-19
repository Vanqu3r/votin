import React, { useState } from "react";

const api_back = process.env.REACT_APP_BACK;

export const NewCandidate = () => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        

        try {
         
            const r = await fetch(`${api_back}/api/candidates/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    apellido,
                    numeroId,
                    partido,
                    telefono,
                    validado: false 

                })
            });


            // Si la respuesta no es 2xx, lanzamos un error
            if (!r.ok) {
                const errorData = await r.json();
                throw new Error(errorData.error || 'Error desconocido');
            }
            

            const data = await r.json();
            console.log(data)
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
        setNumeroId('');
        setPartido('');
        setTelefono('');
        
    }
    //Los estamos de los input

    const [name, setName] = useState('');
    const [apellido, setApellido] = useState('');
    const [numeroId, setNumeroId] = useState('');
    const [partido, setPartido] = useState('');
    const [telefono, setTelefono] = useState('');

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
                        type="text"
                        onChange={(e) => setNumeroId(e.target.value)}
                        value={numeroId}
                        className="form-control mb-3"
                        placeholder="Número de Identificación"
                        required
                        
                    />
                   <input
                        type="text"
                        onChange={(e) => setPartido(e.target.value)}
                        value={partido}
                        className="form-control mb-3"
                        placeholder="Partido"
                        required
                    />
                     <input
                        type="text"
                        onChange={(e) => setTelefono(e.target.value)}
                        value={telefono}
                        className="form-control mb-3"
                        placeholder="Telefono Personal"
                        required
                    />
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
                ) : null}
            </div>
        </div>

    )
}
