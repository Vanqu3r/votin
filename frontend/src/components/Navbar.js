import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () =>
(
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
            <Link className="navbar-brand" to="/">
                Votin
            </Link>
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link active" aria-current="page" to="/">
                            Principal
                        </Link>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Usuario
                        </a>
                        <ul className="dropdown-menu">
                            <li><Link className="dropdown-item" to="/newuser">
                                Registrar un Usuario
                                </Link>
                            </li>
                            <li><Link className="dropdown-item" to="/viewuser">
                                Ver usuario
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Candidato
                        </a>
                        <ul className="dropdown-menu">
                            <li><Link className="dropdown-item" to="/newcandidate">
                                Registrar un candidato
                                </Link>
                            </li>
                            <li><Link className="dropdown-item" to="/viewcandidate">
                                Ver candidatos
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/about">
                            About
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link disabled" aria-disabled="true">
                            Disabled
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to='/login'>
                            Iniciar sesión
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

)