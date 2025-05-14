import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import InternalNavbar from "../components/InternalNavbar";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF', '#FF6384', '#36A2EB'];
//const COLORS = ['#2E5A88', '#4B77BE', '#6B8FD4', '#8FA7D9', '#B5C4E3', '#D6E0F0', '#1E3F66'];
//const COLORS = ['#0D47A1', '#1565C0', '#1976D2', '#1E88E5', '#2196F3', '#64B5F6', '#90CAF9'];
//const COLORS = ['#4527A0', '#5E35B1', '#7E57C2', '#9575CD', '#B39DDB', '#283593', '#3949AB'];

const Estadisticas = () => {
    const { user } = useAuth();
    const [edadData, setEdadData] = useState([]);
    const [ubicacionData, setUbicacionData] = useState([]);
    const [categoriaData, setCategoriaData] = useState([]);
    const [categoriasPreguntas, setCategoriasPreguntas] = useState([]);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const [votantesRes, candidatosRes, preguntas] = await Promise.all([
                    apiClient.get("/votante"),
                    apiClient.get("/politico"),
                    apiClient.get("/votante/preguntas")
                ]);

                setCategoriasPreguntas(preguntas.data.categorias);

                const votantes = votantesRes.data.map(v => ({ ...v, tipo: "votante" }));
                const candidatos = candidatosRes.data.map(c => ({ ...c, tipo: "candidato" }));
                const todos = [...votantes, ...candidatos];

                // --- Agrupar por edad ---
                const edades = {};
                todos.forEach(u => {
                    const key = u.edad;
                    if (!edades[key]) {
                        edades[key] = { edad: key, votantes: 0, candidatos: 0 };
                    }
                    if (u.tipo === "votante") {
                        edades[key].votantes += 1;
                    } else {
                        edades[key].candidatos += 1;
                    }
                });
                setEdadData(Object.values(edades));

                // --- Agrupar por ciudad (gráfica de pastel para totales combinados) ---
                const ciudades = {};
                todos.forEach(u => {
                    const key = u.ciudad || "Sin ciudad";
                    if (!ciudades[key]) {
                        ciudades[key] = { name: key, total: 0 };
                    }
                    ciudades[key].total += 1;
                });
                setUbicacionData(Object.values(ciudades));

                // --- Agrupar votos por categoría ---
                const categorias = {};
                votantes.forEach(v => {
                    if (Array.isArray(v.preferencias)) {
                        v.preferencias.forEach(p => {
                            const catId = p.categoria_id;
                            if (!categorias[catId]) {
                                const nombreCategoria = preguntas.data.categorias.find(c => c.numero === catId)?.nombre || `Categoría ${catId}`;
                                categorias[catId] = { categoria: nombreCategoria, total: 0 };
                            }
                            categorias[catId].total += p.valoracion;
                        });
                    }
                });
                setCategoriaData(Object.values(categorias));

            } catch (error) {
                console.error("Error al obtener datos: ", error.message);
            }
        };

        fetchDatos();
    }, []);

    return (
        <>
            <InternalNavbar />
            {user?.tipo === "administrador" && (
                <div className="container-fluid p-4" style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", gap: "10px" }}>

                        {/* Gráfica de edades */}
                        <div className="card shadow-sm mb-4 col-sm-6">
                            <div className="card-header bg-primary text-white">
                                <h3 className="mb-0">
                                    <i className="bi bi-graph-up me-2"></i>
                                    Edad de usuarios
                                </h3>
                            </div>
                            <div className="card-body">
                                <div style={{ width: "100%", height: 400 }}>
                                    <ResponsiveContainer>
                                        <BarChart data={edadData}>
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

                        {/* Gráfica por ciudad */}
                        <div className="card shadow-sm mb-4 col-sm-6">
                            <div className="card-header bg-primary text-white">
                                <h3 className="mb-0">
                                    <i className="bi bi-pie-chart-fill me-2"></i>
                                    Ubicación de usuarios
                                </h3>
                            </div>
                            <div className="card-body d-flex justify-content-center">
                                <div style={{ width: 500, height: 400 }}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={ubicacionData}
                                                dataKey="total"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={150}
                                                fill="#8884d8"
                                                innerRadius={80}
                                                label
                                            >
                                                {ubicacionData.map((entry, index) => (
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

                    {/* Gráfica de edades */}
                    <div className="card shadow-sm mb-4 col-sm-6" style={{ width: "100%" }}>
                        <div className="card-header bg-primary text-white">
                            <h3 className="mb-0">
                                <i class="bi bi-people-fill me-2"></i>
                                Votos por categoría (valoraciones)
                            </h3>
                        </div>
                        <div className="card-body">
                            <div style={{ width: "100%", height: 400 }}>
                                <ResponsiveContainer>
                                    <BarChart data={categoriaData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="categoria" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="total" name="Valoraciones Totales" >
                                            {categoriaData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Estadisticas;
