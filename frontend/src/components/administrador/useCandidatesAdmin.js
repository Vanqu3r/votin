import { useState, useEffect } from "react";

const api_back = process.env.REACT_APP_BACK;

const useCandidates = () => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch(`${api_back}/api/candidates`);
        const data = await response.json();
        setDataSource(data);
      } catch (error) {
        console.error("Error obteniendo candidatos:", error);
      }
    };

    fetchCandidates();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${api_back}/api/candidates/${id}`, { method: "DELETE" });
      if (response.ok) {
        setDataSource((prev) => prev.filter((item) => item._id !== id));
      } else {
        console.error("Error al eliminar candidato");
      }
    } catch (error) {
      console.error("Error en la eliminación:", error);
    }
  };

  return { dataSource, handleDelete, setDataSource };
};

export default useCandidates;