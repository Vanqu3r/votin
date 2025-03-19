import React, { useState } from "react";

const api_back = process.env.REACT_APP_BACK;

export const User = () => {
    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            const r = await fetch(`${api_back}api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    voto
                })
            });

            // Si la respuesta no es 2xx, lanzamos un error
            if (!r.ok) {
                throw new Error('Error al enviar datos');
            }

            const data = await r.json();
            console.log("Respuesta de la API:", data);
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    }

    //Los estamos de los input
    const [name, setName] = useState('')
    const [voto, Setvoto] = useState(false);

    return (
        <div className="row">
            <div className="col-md-4">
                <form onSubmit={handleSubmit} className="card card-body">
                    <input type="text"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        className="form-control"
                        placeholder="nombre"
                        autoFocus
                    />
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="hasVoted"
                            onChange={(e) => Setvoto(e.target.checked)}
                            checked={voto}
                        />
                        <label className="form-check-label" htmlFor="hasVoted">
                            Ya votó
                        </label>
                    </div>
                    <button className="btn btn-primary btn-block" >
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    )
}
