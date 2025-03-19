import { useState, useEffect } from "react";

const api_back = process.env.REACT_APP_BACK;

const useUser = () => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${api_back}/user`);
        const data = await response.json();
        setDataSource(data);
      } catch (error) {
        console.error("Error obteniendo usuario:", error);
      }
    };

    fetchUser();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${api_back}/user/${id}`, { method: "DELETE" });
      if (response.ok) {
        setDataSource((prev) => prev.filter((item) => item._id !== id));
      } else {
        console.error("Error al eliminar usuario");
      }
    } catch (error) {
      console.error("Error en la eliminación:", error);
    }
  };

  return { dataSource, handleDelete, setDataSource };
};

export default useUser;