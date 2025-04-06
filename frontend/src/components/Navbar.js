import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from './AuthContext';
import LogoutButton from './LogoutButton';

const Navbar = () => {
    const { user, isLoading } = useAuth();

    // Función para verificar si el usuario esta logueado
    const isLoggedIn = () => {
        return false;
    };

    if (isLoading) return <div>Cargando...</div>;
    return (
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
                        {/* Mostrar Iniciar sesión SOLO si no hay usuario logueado */}
                        {!user && (
                            <li className="nav-item">
                                <Link className="nav-link" to='/login'>
                                    Iniciar sesión
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="navbar-user">
                    {user ? (
                        <>
                            <span>Bienvenido, {user.name}</span>
                            <LogoutButton />
                        </>
                    ) : (
                        <span>No has iniciado sesión</span>
                    )}
                </div>
            </div>
        </nav>

    );
};

export default Navbar;