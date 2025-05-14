import React, { useState, useEffect, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import InternalNavbar from "../components/InternalNavbar";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

// Configuration
//const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF', '#FF6384', '#36A2EB']; // Paleta de colores COLORIDOS
const COLORS = ['#2E5A88', '#4B77BE', '#6B8FD4', '#8FA7D9', '#B5C4E3', '#D6E0F0', '#1E3F66']; // Paleta de colores Azules y grises
//const COLORS = ['#0B3D91', '#1A56B5', '#296FD9', '#4A89E8', '#6BA3F0', '#8CBDEF', '#ADD7F6']; // Paleta de colores Azules
//const COLORS = ['#3A1D6E', '#4B2D7F', '#5C3D90', '#6D4DA1', '#7E5DB2', '#8F6DC3', '#A07DD4']; // Paleta de colores Morados y grises
//const COLORS = ['#4527A0', '#5E35B1', '#7E57C2', '#9575CD', '#B39DDB', '#283593', '#3949AB']; // Paleta de colores Morados
//const COLORS = ['#2C3E50', '#3D4F61', '#4E6072', '#5F7183', '#708294', '#8193A5', '#92A4B6']; // Paleta de colores Grises y azules
//const COLORS = ['#005F73', '#0A7086', '#158199', '#2092AC', '#2BA3BF', '#36B4D2', '#41C5E5']; // Paleta de colores Azules y turquesas
const CHART_HEIGHT = 400;

const Estadisticas = () => {
    const { user, isLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rawData, setRawData] = useState({
        votantes: [],
        candidatos: [],
        categorias: [],
        miCandidato: null
    });

    // Fetch all data
    useEffect(() => {
        const fetchDatos = async () => {
            try {
                setLoading(true);

                // Primero verifica que el usuario esté disponible
                if (!user) return;

                const requests = [
                    apiClient.get("/votante"),
                    apiClient.get("/politico"),
                    apiClient.get("/votante/preguntas")
                ];

                // Si es candidato, obtenemos sus datos específicos
                if (user?.tipo === "candidato") {
                    requests.push(apiClient.get(`/politico/${user.uid}`));
                }

                const [votantesRes, candidatosRes, preguntas, miCandidatoRes] = await Promise.all(requests);

                setRawData({
                    votantes: votantesRes.data,
                    candidatos: candidatosRes.data,
                    categorias: preguntas.data.categorias,
                    miCandidato: miCandidatoRes?.data || null
                });
            } catch (err) {
                console.error("Error al obtener datos: ", err);
                setError("Error al cargar los datos. Por favor intente más tarde.");
            } finally {
                setLoading(false);
            }
        };

        // Solo ejecutar si el usuario está disponible
        if (user && !isLoading) {
            fetchDatos();
        }
    }, [user, isLoading]); // Añadimos isLoading como dependencia

    // Process data for admin view
    const adminData = useMemo(() => {
        const votantes = rawData.votantes.map(v => ({ ...v, tipo: "votante" }));
        const candidatos = rawData.candidatos.map(c => ({ ...c, tipo: "candidato" }));
        const todos = [...votantes, ...candidatos];

        // Age data
        const edades = {};
        todos.forEach(u => {
            const key = u.edad;
            if (!edades[key]) {
                edades[key] = { edad: key, votantes: 0, candidatos: 0 };
            }
            edades[key][u.tipo === "votante" ? "votantes" : "candidatos"] += 1;
        });

        // Location data
        const ciudades = {};
        todos.forEach(u => {
            const key = u.ciudad || "Sin ciudad";
            ciudades[key] = (ciudades[key] || 0) + 1;
        });
        const ubicacionData = Object.entries(ciudades).map(([name, total]) => ({ name, total }));

        // Category data
        const categorias = {};
        rawData.votantes.forEach(v => {
            if (Array.isArray(v.preferencias)) {
                v.preferencias.forEach(p => {
                    const catId = p.categoria_id;
                    const nombreCategoria = rawData.categorias.find(c => c.numero === catId)?.nombre || `Categoría ${catId}`;
                    categorias[catId] = {
                        categoria: nombreCategoria,
                        total: (categorias[catId]?.total || 0) + p.valoracion
                    };
                });
            }
        });

        return {
            edadData: Object.values(edades).sort((a, b) => a.edad - b.edad),
            ubicacionData: ubicacionData.sort((a, b) => b.total - a.total),
            categoriaData: Object.values(categorias)
        };
    }, [rawData]);

    // Process data for candidate view
    const candidateData = useMemo(() => {
        if (!rawData.miCandidato) return null;

        // 1. Número de votos en propuestas por categoría
        const votosPorCategoria = {};
        const miCandidatoId = rawData.miCandidato.id;

        rawData.votantes.forEach(votante => {
            if (Array.isArray(votante.preferencias)) {
                votante.preferencias.forEach(pref => {
                    if (pref.politico_id === miCandidatoId) {
                        const catId = pref.categoria_id;
                        const nombreCategoria = rawData.categorias.find(c => c.numero === catId)?.nombre || `Categoría ${catId}`;
                        votosPorCategoria[catId] = {
                            categoria: nombreCategoria,
                            votos: (votosPorCategoria[catId]?.votos || 0) + pref.valoracion
                        };
                    }
                });
            }
        });

        // 2. Porcentaje de votantes del total de plataforma
        const totalVotantes = rawData.votantes.length;
        const misVotantesIds = new Set();

        rawData.votantes.forEach(v => {
            if (Array.isArray(v.preferencias)) {
                const haVotado = v.preferencias.some(p => p.politico_id === miCandidatoId);
                if (haVotado) misVotantesIds.add(v.id);
            }
        });

        const porcentajeVotantes = totalVotantes > 0
            ? (misVotantesIds.size / totalVotantes * 100).toFixed(2)
            : 0;

        // 3. Edad de los votantes que han votado sus propuestas
        const edadesVotantes = {};
        rawData.votantes.forEach(v => {
            if (misVotantesIds.has(v.id)) {
                const edad = v.edad;
                edadesVotantes[edad] = (edadesVotantes[edad] || 0) + 1;
            }
        });

        // 4. Ubicación de los votantes
        const ubicacionVotantes = {};
        rawData.votantes.forEach(v => {
            if (misVotantesIds.has(v.id)) {
                const ciudad = v.ciudad || "Sin ciudad";
                ubicacionVotantes[ciudad] = (ubicacionVotantes[ciudad] || 0) + 1;
            }
        });

        return {
            votosPorCategoria: Object.values(votosPorCategoria),
            porcentajeVotantes,
            edadesVotantes: Object.entries(edadesVotantes).map(([name, value]) => ({ name, value })),
            ubicacionVotantes: Object.entries(ubicacionVotantes).map(([name, value]) => ({ name, value })),
            totalVotantes,
            misVotantes: misVotantesIds.size
        };
    }, [rawData]);

    if (!user) {
        return (
            <>
                <InternalNavbar />
                <div className="container mt-5">
                    <div className="alert alert-danger">
                        Debes iniciar sesión para acceder a esta página.
                    </div>
                </div>
            </>
        );
    }

    if (loading) {
        return (
            <>
                <InternalNavbar />
                <div className="container mt-5 text-center">
                    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <h4 className="mt-3">Cargando tus estadísticas...</h4>
                    <p>Esto puede tomar unos momentos</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <InternalNavbar />
                <div className="container mt-5">
                    <div className="alert alert-danger">
                        <h4>Error al cargar las estadísticas</h4>
                        <p>{error}</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => window.location.reload()}
                        >
                            <i className="bi bi-arrow-clockwise me-2"></i>
                            Intentar nuevamente
                        </button>
                    </div>
                </div>
            </>
        );
    }

    // Render for admin
    if (user.tipo === "administrador") {
        return (
            <>
                <InternalNavbar />
                <div className="container-fluid p-4">
                    <div className="row g-4 mb-4">
                        {/* Age Chart */}
                        <div className="col-lg-6">
                            <div className="card shadow-sm h-100">
                                <div className="card-header bg-primary text-white">
                                    <h3 className="mb-0">
                                        <i className="bi bi-bar-chart-fill me-2"></i>
                                        Edad de usuarios
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <div style={{ height: CHART_HEIGHT }}>
                                        <ResponsiveContainer>
                                            <BarChart data={adminData.edadData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="edad" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="votantes" fill={COLORS[4]} name="Votantes" />
                                                <Bar dataKey="candidatos" fill={COLORS[0]} name="Candidatos" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location Chart */}
                        <div className="col-lg-6">
                            <div className="card shadow-sm h-100">
                                <div className="card-header bg-primary text-white">
                                    <h3 className="mb-0">
                                        <i className="bi bi-pie-chart-fill me-2"></i>
                                        Ubicación de usuarios
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <div style={{ height: CHART_HEIGHT }}>
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie
                                                    data={adminData.ubicacionData}
                                                    dataKey="total"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={150}
                                                    innerRadius={80}
                                                    label
                                                >
                                                    {adminData.ubicacionData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category Chart */}
                    <div className="row">
                        <div className="col-12">
                            <div className="card shadow-sm">
                                <div className="card-header bg-primary text-white">
                                    <h3 className="mb-0">
                                        <i className="bi bi-bar-chart-fill me-2"></i>
                                        Votos por categoría (valoraciones)
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <div style={{ height: CHART_HEIGHT }}>
                                        <ResponsiveContainer>
                                            <BarChart data={adminData.categoriaData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="categoria" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="total" name="Valoraciones Totales">
                                                    {adminData.categoriaData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Render for candidate
    if (user.tipo === "candidato" && candidateData) {
        return (
            <>
                <InternalNavbar />
                <div className="container-fluid p-4">
                    
                    {/* Resumen de votos */}
                    <div className="row mb-4">
                        <div >
                            <div className="card shadow-sm h-100">
                                <div className="card-header bg-success text-white">
                                    <h3 className="mb-0">
                                        <i className="bi bi-people-fill me-2"></i>
                                        Resumen de votantes
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <h4>Total de votantes en la plataforma: {candidateData.totalVotantes}</h4>
                                    <h4>Mis votantes: {candidateData.misVotantes}</h4>
                                    <div className="progress mt-3" style={{ height: "30px" }}>
                                        <div
                                            className="progress-bar bg-info"
                                            role="progressbar"
                                            style={{ width: `${candidateData.porcentajeVotantes}%` }}
                                            aria-valuenow={candidateData.porcentajeVotantes}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            {candidateData.porcentajeVotantes}%
                                        </div>
                                    </div>
                                    <p className="mt-2">Porcentaje de votantes que te han apoyado</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4 mb-4">
                        {/* Votos por categoría */}
                        <div className="col-lg-6">
                            <div className="card shadow-sm h-100">
                                <div className="card-header bg-primary text-white">
                                    <h3 className="mb-0">
                                        <i className="bi bi-bar-chart-fill me-2"></i>
                                        Votos por categoría
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <div style={{ height: CHART_HEIGHT }}>
                                        <ResponsiveContainer>
                                            <BarChart data={candidateData.votosPorCategoria}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="categoria" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="votos" name="Votos recibidos">
                                                    {candidateData.votosPorCategoria.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Edad de votantes */}
                        <div className="col-lg-6">
                            <div className="card shadow-sm h-100">
                                <div className="card-header bg-primary text-white">
                                    <h3 className="mb-0">
                                        <i className="bi bi-pie-chart-fill me-2"></i>
                                        Edad de mis votantes
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <div style={{ height: CHART_HEIGHT }}>
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie
                                                    data={candidateData.edadesVotantes}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={150}
                                                    innerRadius={80}
                                                    label
                                                >
                                                    {candidateData.edadesVotantes.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ubicación de votantes */}
                    <div className="row">
                        <div className="col-12">
                            <div className="card shadow-sm">
                                <div className="card-header bg-primary text-white">
                                    <h3 className="mb-0">
                                        <i className="bi bi-pie-chart-fill me-2"></i>
                                        Ubicación de mis votantes
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <div style={{ height: CHART_HEIGHT }}>
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie
                                                    data={candidateData.ubicacionVotantes}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={150}
                                                    innerRadius={80}
                                                    label
                                                >
                                                    {candidateData.ubicacionVotantes.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Default view for other user types
    return (
        <>
            <InternalNavbar />
            <div className="container mt-5">
                <div className="alert alert-warning">
                    No tienes permisos para ver estadísticas.
                </div>
            </div>
        </>
    );
};

export default Estadisticas;