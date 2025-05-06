import React, { useState, useEffect, use } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../style/Preferencias.css"; // Asegúrate de tener este archivo CSS para los estilos
import apiClient from "../api/client"; // Asegúrate de que esta ruta sea correcta
import InternalNavbar from "../components/InternalNavbar";

const Preferencias = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [respuestas, setRespuestas] = useState({});

  // VALIDAR QUE EL USUARIO ESTÉ LOGUEADO
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (!user) return; // No hacer nada si user no está disponible

    const fetchData = async () => {
      try {
        // Obtener preguntas
        const preguntasResponse = await apiClient.get("votante/preguntas");
        setCategorias(preguntasResponse.data.categorias);

        // Inicializar respuestas vacías
        const respuestasIniciales = {};
        preguntasResponse.data.categorias.forEach((categoria) => {
          categoria.preguntas.forEach((_, indexPregunta) => {
            respuestasIniciales[`${categoria.numero}-${indexPregunta}`] = null;
          });
        });

        // Obtener respuestas del usuario
        try {
          const respuestasResponse = await apiClient.get(`votante/${user.uid}`);
          const respuestasAPI = respuestasResponse.data.preferencias?.reduce(
            (acc, { categoria_id, pregunta_id, valoracion }) => {
              acc[`${categoria_id}-${pregunta_id - 1}`] = valoracion;
              return acc;
            },
            { ...respuestasIniciales } // Respuestas iniciales como base
          );
          setRespuestas(respuestasAPI || respuestasIniciales);
        } catch (err) {
          console.error("Error al obtener respuestas:", err);
          setRespuestas(respuestasIniciales);
        }
      } catch (err) {
        console.error("Error al obtener preguntas:", err);
      }
    };

    fetchData();
  }, [user]); // Añadir user como dependencia

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

      const usuario_id = user.uid;

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

      alert("Preferencias guardadas correctamente");

      navigate("/dashboard");
    } catch (err) {
      console.error("Error detallado:", err.response);
    }
  };

  return (
    <>
      <InternalNavbar />
      <div className="encuesta-container">
        <h1 className="encuesta-title">Encuesta de Opinión</h1>
        <p className="encuesta-description">
          Por favor, califique cada afirmación del 1 (Totalmente en desacuerdo)
          al 5 (Totalmente de acuerdo)
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
    </>
  );
};

export default Preferencias;
