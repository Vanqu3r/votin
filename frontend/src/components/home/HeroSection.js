import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="container py-5 my-4">
      <div className="row align-items-center g-5">
        {/* Columna izquierda - Texto */}
        <div className="col-md-6 order-md-1 order-2">
          <h1 className="display-6 fw-bold mb-3 text-primary">
            La inteligencia artificial que convierte tus ideales en decisiones
            electorales
          </h1>
          <p className="lead text-muted mb-4">
            Es un sistema basado en inteligencia artificial que facilite y
            optimice la toma de decisiones electorales de los ciudadanos,
            permitiéndoles identificar las opciones políticas que mejor se
            alinean con sus valores e intereses.
          </p>
          <div className="d-flex flex-wrap gap-3 mb-4">
            <Link
              className="btn btn-primary px-4 py-2 shadow-sm"
              to="/dashboard"
            >
              Comenzar ahora
            </Link>
          </div>
        </div>

        {/* Columna derecha - Imagen */}
        <div className="col-md-6 order-md-2 order-1">
          <div className="position-relative">
            <img
              src="/images/robot-votando.jpg"
              alt="Robot Votando"
              className="img-fluid rounded-4 shadow-lg w-100"
            />
            <div className="position-absolute bottom-0 end-0 bg-white p-3 rounded-3 shadow-sm m-4">
              <div className="d-flex align-items-center gap-2">
                <div className="bg-primary rounded-circle p-2">
                  <span className="bi bi-check-lg text-white"></span>
                </div>
                <div>
                  <p className="mb-0 fw-bold">Power by IA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
