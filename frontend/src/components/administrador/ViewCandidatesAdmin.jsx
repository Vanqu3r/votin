import React, { useState } from "react";
import { Button, Modal, Input, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import CandidateTable from "./CandidateTableAdmin";
import CandidateForm from "./CandidateFormAdmin";
import useCandidates from "./useCandidatesAdmin";

const api_back = process.env.REACT_APP_BACK; // Reemplaza con tu API real

const ViewCandidates = () => {
  const { dataSource, handleDelete, setDataSource } = useCandidates();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [searchText, setSearchText] = useState("");

  const showModal = (candidate = null) => {
    setEditingCandidate(candidate);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setEditingCandidate(null);
    setIsModalVisible(false);
  };

  const handleSave = async (newCandidate) => {
    
    try {
      if (editingCandidate) {
        const { _id, ...candidateWithoutId } = newCandidate;
        console.log(candidateWithoutId)
        // Actualizar el candidato en la BD
        const r = await fetch(`${api_back}/api/candidates/${editingCandidate._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(candidateWithoutId),
        });
  
 
        if (!r.ok) {
          throw new Error("Error al actualizar los datos");
        }
        //retornar los datos de un candidato en especifico
        const data = await r.json();
        message.success("Candidato actualizado correctamente");
        console.log(data);
        
        setDataSource((prev) =>
          //Cambia el valor del item de datasource, por el valor de data,
          //si es el registro que se editó
          //data contiene la respuesta de la api, que son los valores 
          //del registro actualizado 
            prev.map((item) => (item._id === editingCandidate._id ? data : item))
          );
        
      } else {
        // Guardar nuevo candidato en la BD
        console.log(JSON.stringify(newCandidate));
        
        const r = await fetch(`${api_back}/api/candidates`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCandidate),
        });
        
        if (!r.ok) {
          console.log(r);
          
          throw new Error("Error al enviar datos");
        }
  
        const data = await r.json();
        message.success("Candidato agregado correctamente");
  
        setDataSource((prev) => [...prev, data]);
      }
  
      handleCancel(); // Cierra el modal y resetea el formulario
    } catch (error) {
      console.error("Error en la solicitud:", error);
      message.error("Hubo un problema al guardar o actualizar el candidato");
    }
  };
  

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, marginTop:12 }}>
        <Input
          placeholder="Buscar candidato..."
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchText(e.target.value.toLowerCase())}
          style={{
            width: 300,
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #1890ff",
          }}
        />

       {/*  <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal(null)}>
          Agregar Candidato
        </Button> */}
      </div>

      <CandidateTable 
        dataSource={dataSource} 
        handleDelete={handleDelete} 
        showModal={showModal} 
        searchText={searchText} 
      />

      <Modal
        title={editingCandidate ? "Editar Candidato" : "Agregar Candidato"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}
      >
        <CandidateForm candidate={editingCandidate} onSave={handleSave} />
      </Modal>
    </div>
  );
};

export default ViewCandidates;