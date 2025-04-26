import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../style/Preferencias.css"; // Asegúrate de tener este archivo CSS para los estilos
import apiClient from "../api/client"; // Asegúrate de que esta ruta sea correcta

const Preferencias = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [respuestas, setRespuestas] = useState({});

  // Verificar autenticación
  useEffect(() => {
    if (!currentUser) {
      // Redirigir a login si no está autenticado
      navigate("/");
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const response = await apiClient.get("votante/preguntas");
        setCategorias(response.data.categorias);

        // Inicializar respuestas vacías
        const respuestasIniciales = {};
        response.data.categorias.forEach((categoria) => {
          categoria.preguntas.forEach((_, indexPregunta) => {
            respuestasIniciales[`${categoria.numero}-${indexPregunta}`] = null;
          });
        });
        setRespuestas(respuestasIniciales);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPreguntas();
  }, []);

  const handleRatingChange = (categoriaNum, preguntaIndex, valor) => {
    setRespuestas((prev) => ({
      ...prev,
      [`${categoriaNum}-${preguntaIndex}`]: valor,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Verificar que todas las preguntas tengan respuesta
    const todasRespondidas = Object.values(respuestas).every(
      (val) => val !== null
    );
    if (!todasRespondidas) {
      return;
    }

    try {
      // 2. Transformar los datos al formato que espera tu API
      const datosParaAPI = {
        preferencias: Object.entries(respuestas).map(([key, valor]) => {
          const [categoriaNum, preguntaIndex] = key.split("-");
          return {
            categoria_id: parseInt(categoriaNum),
            pregunta_id: parseInt(preguntaIndex) + 1, // Asumiendo que los IDs empiezan en 1
            valoracion: valor,
          };
        }),
      };

      const usuario_id = "67ea3f2db4d5cd6ae933a6ac";

      console.log("Datos a enviar:", datosParaAPI);

      // 3. Enviar los datos a la API
      const response = await apiClient.put(
        `votante/${usuario_id}`,
        datosParaAPI,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Respuesta del servidor:", response.data);
    } catch (err) {
      console.error("Error detallado:", err.response);
    }
  };

  return (
    <div className="encuesta-container">
      <h1 className="encuesta-title">Encuesta de Opinión</h1>
      <p className="encuesta-description">
        Por favor, califique cada afirmación del 1 (Totalmente en desacuerdo) al
        5 (Totalmente de acuerdo)
      </p>

      <form onSubmit={handleSubmit}>
        {categorias.map((categoria) => (
          <div key={categoria.numero} className="categoria-card">
            <h2 className="categoria-title">
              {categoria.numero}. {categoria.nombre}
            </h2>

            <div className="preguntas-container">
              {categoria.preguntas.map((pregunta, indexPregunta) => (
                <div key={indexPregunta} className="pregunta-item">
                  <p className="pregunta-text">{pregunta}</p>

                  <div className="rating-options">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <label key={num} className="rating-label">
                        <input
                          type="radio"
                          name={`pregunta-${categoria.numero}-${indexPregunta}`}
                          checked={
                            respuestas[
                              `${categoria.numero}-${indexPregunta}`
                            ] === num
                          }
                          onChange={() =>
                            handleRatingChange(
                              categoria.numero,
                              indexPregunta,
                              num
                            )
                          }
                          className="rating-input"
                        />
                        <span className="rating-number">{num}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button type="submit" className="submit-button">
          Enviar Respuestas
        </button>
      </form>
    </div>
  );
};

export default Preferencias;
