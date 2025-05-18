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
                    requests.push(apiClient.get(`/propuesta/politico/${user.uid}`));
                }

                // Y actualizar el setRawData correctamente:
                const [votantesRes, candidatosRes, preguntas, miCandidatoRes, misPropuestasRes] = await Promise.all(requests);

                setRawData({
                    votantes: votantesRes.data,
                    candidatos: candidatosRes.data,
                    categorias: preguntas.data.categorias,
                    miCandidato: miCandidatoRes?.data || null,
                    misPropuestas: misPropuestasRes?.data || []
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
        if (!rawData.miCandidato || !rawData.votantes || !rawData.categorias) {
            return null;
        }

        // Inicializar estructuras de datos
        const votosPorCategoria = {};
        const misVotantesIds = new Set();
        const edadesVotantes = {};
        const ubicacionVotantes = {};
        const propuestasConVotos = new Set();

        // Inicializar categorías con todas las categorías disponibles
        rawData.categorias.forEach(cat => {
            votosPorCategoria[cat.nombre] = {
                categoria: cat.nombre,
                votos: 0
            };
        });

        // Procesar votos de cada propuesta del candidato
        rawData.misPropuestas?.forEach(propuesta => {
            if (propuesta.id_politico === rawData.miCandidato._id) {
                // Registrar la propuesta si tiene votos
                if (propuesta.votos?.length > 0) {
                    propuestasConVotos.add(propuesta._id);
                }

                // Contar votos por categoría
                propuesta.votos?.forEach(voto => {
                    // Sumar a la categoría correspondiente
                    if (votosPorCategoria[propuesta.categoria]) {
                        votosPorCategoria[propuesta.categoria].votos += 1;
                    }

                    // Registrar votantes únicos
                    misVotantesIds.add(voto.id_votante.$oid);
                });
            }
        });

        // Procesar datos demográficos de los votantes
        rawData.votantes.forEach(votante => {
            if (misVotantesIds.has(votante._id)) {
                // Procesar edad
                const edad = votante.edad;
                edadesVotantes[edad] = (edadesVotantes[edad] || 0) + 1;

                // Procesar ubicación
                const ubicacion = `${votante.ciudad || 'Sin ciudad'}, ${votante.estado || 'Sin estado'}`;
                ubicacionVotantes[ubicacion] = (ubicacionVotantes[ubicacion] || 0) + 1;
            }
        });

        // Formatear datos para gráficos
        const votosPorCategoriaData = Object.values(votosPorCategoria)
            .filter(item => item.votos > 0)
            .sort((a, b) => b.votos - a.votos);

        const edadesVotantesData = Object.entries(edadesVotantes)
            .map(([edad, count]) => ({
                name: `${edad} años`,
                value: count,
                edad: parseInt(edad)
            }))
            .sort((a, b) => a.edad - b.edad);

        const ubicacionVotantesData = Object.entries(ubicacionVotantes)
            .map(([ubicacion, count]) => ({
                name: ubicacion,
                value: count
            }))
            .sort((a, b) => b.value - a.value);

        const totalVotantes = rawData.votantes.length;
        const votantesUnicos = misVotantesIds.size;
        const porcentajeVotantes = totalVotantes > 0
            ? Math.min(100, (votantesUnicos / totalVotantes) * 100).toFixed(2) // Asegurar no más del 100%
            : 0;

        return {
            votosPorCategoria: votosPorCategoriaData,
            porcentajeVotantes,
            edadesVotantes: edadesVotantesData,
            ubicacionVotantes: ubicacionVotantesData,
            totalVotantes,
            misVotantes: votantesUnicos,
            misPropuestas: rawData.misPropuestas?.length || 0,
            propuestasConVotos: propuestasConVotos.size,
            tieneDatos: votantesUnicos > 0
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
                    <div className="spinner-border text-primary" style={{ width: '2rem', height: '2rem' }} role="status">
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
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {adminData.ubicacionData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value, name, props) => [
                                                        value + " usuario(s)",
                                                        name
                                                    ]} 
                                                />
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
                                    <div style={{ height: 500 }}>
                                        <ResponsiveContainer>
                                            <BarChart data={adminData.categoriaData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                        dataKey="categoria"
                                                        angle={-45}
                                                        textAnchor="end"
                                                        height={170}
                                                        tick={{ fontSize: 12 }}
                                                    />
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
                        <div>
                            <div className="card shadow-sm h-100">
                                <div className="card-header bg-success text-white">
                                    <h3 className="mb-0">
                                        <i className="bi bi-people-fill me-2"></i>
                                        Resumen de votantes
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <h5>Total en plataforma:</h5>
                                                <h3 className="text-primary">{candidateData.totalVotantes}</h3>
                                            </div>
                                            <div className="mb-3">
                                                <h5>Mis votantes:</h5>
                                                <h3 className="text-success">{candidateData.misVotantes}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <h5>Mis propuestas:</h5>
                                                <h3 className="text-info">{candidateData.misPropuestas}</h3>
                                            </div>
                                            <div className="progress mt-3" style={{ height: "30px" }}>
                                                <div
                                                    className="progress-bar bg-info"
                                                    role="progressbar"
                                                    style={{ width: `${candidateData.porcentajeVotantes}%` }}
                                                >
                                                    {candidateData.porcentajeVotantes}%
                                                </div>
                                            </div>
                                            <p className="mt-2 text-muted">Porcentaje de apoyo</p>
                                        </div>
                                    </div>
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
                                    {candidateData?.votosPorCategoria?.length > 0 && (
                                        <small className="text-white-50">
                                            Total votos: {candidateData.votosPorCategoria.reduce((sum, item) => sum + item.votos, 0)}
                                        </small>
                                    )}
                                </div>
                                <div className="card-body">
                                    {candidateData?.votosPorCategoria?.length > 0 ? (
                                        <div style={{ height: CHART_HEIGHT }}>
                                            <ResponsiveContainer>
                                                <BarChart
                                                    data={candidateData.votosPorCategoria}
                                                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis
                                                        dataKey="categoria"
                                                        angle={-45}
                                                        textAnchor="end"
                                                        height={70}
                                                        tick={{ fontSize: 12 }}
                                                    />
                                                    <YAxis
                                                        label={{
                                                            value: 'Número de votos',
                                                            angle: -90,
                                                            position: 'insideLeft',
                                                            fontSize: 12
                                                        }}
                                                    />
                                                    <Tooltip
                                                        formatter={(value, name, props) => [
                                                            value,
                                                            props.payload.categoria
                                                        ]}
                                                        labelFormatter={() => 'Total votos'}
                                                    />
                                                    <Legend />
                                                    <Bar
                                                        dataKey="votos"
                                                        name="Votos por categoría"
                                                        fill={COLORS[0]}
                                                        animationDuration={1500}
                                                    >
                                                        {candidateData.votosPorCategoria.map((entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={COLORS[index % COLORS.length]}
                                                            />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            {rawData.misPropuestas?.length > 0 ? (
                                                <p>No hay votos registrados para tus propuestas</p>
                                            ) : (
                                                <p>No tienes propuestas registradas</p>
                                            )}
                                        </div>
                                    )}
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
                                    {candidateData.tieneDatos ? (
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
                                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                    >
                                                        {candidateData.edadesVotantes.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        formatter={(value, name, props) => [
                                                            value + " votante(s)",
                                                            props.payload.name
                                                        ]}
                                                    />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p>No hay datos de edades disponibles</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Ubicación de votantes */}
                        <div className="col-12">
                            <div className="card shadow-sm">
                                <div className="card-header bg-primary text-white">
                                    <h3 className="mb-0">
                                        <i className="bi bi-pie-chart-fill me-2"></i>
                                        Ubicación de mis votantes
                                    </h3>
                                </div>
                                <div className="card-body">
                                    {candidateData.tieneDatos ? (
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
                                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                    >
                                                        {candidateData.ubicacionVotantes.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        formatter={(value, name, props) => [
                                                            value,
                                                            props.payload.name
                                                        ]}
                                                    />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p>No hay datos de ubicación disponibles</p>
                                        </div>
                                    )}
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