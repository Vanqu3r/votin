import React, { useState } from "react";
import { Button, Modal, Input, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import UserTable from './UserTable';
import UserForm from './UserForm';
import useUser from './useUser';

const api_back = process.env.REACT_APP_BACK; // Reemplaza con tu API real

const ViewUser = () => {
  const { dataSource, handleDelete, setDataSource } = useUser();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchText, setSearchText] = useState("");

  const showModal = (User = null) => {
    setEditingUser(User);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setEditingUser(null);
    setIsModalVisible(false);
  };

  const handleSave = async (newUser) => {
    try {
      if (editingUser) {
        // Actualizar el Usuario en la BD
        console.log(newUser);
        
        const r = await fetch(`${api_back}/user/${editingUser._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });
         
        if (!r.ok) {
          throw new Error("Error al actualizar los datos");
        }
        //retornar los datos de un Usuario en especifico
        const data = await r.json();
        message.success("Usuario actualizado correctamente");
        console.log(data);
        
        setDataSource((prev) =>
          //Cambia el valor del item de datasource, por el valor de data,
          //si es el registro que se editó
          //data contiene la respuesta de la api, que son los valores 
          //del registro actualizado 
            prev.map((item) => (item._id === editingUser._id ? data : item))
          );
        
      } else {
        // Guardar nuevo Usuario en la BD
        console.log(JSON.stringify(newUser));
        
        const r = await fetch(`${api_back}/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });
        
        if (!r.ok) {
          console.log(r);
          
          throw new Error("Error al enviar datos");
        }
  
        const data = await r.json();
        message.success("Usuario agregado correctamente");
  
        setDataSource((prev) => [...prev, data]);
      }
  
      handleCancel(); // Cierra el modal y resetea el formulario
    } catch (error) {
      console.error("Error en la solicitud:", error);
      message.error("Hubo un problema al guardar o actualizar el Usuario");
    }
  };
  

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, marginTop:12 }}>
        <Input
          placeholder="Buscar Usuario..."
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
          Agregar Usuario
        </Button> */}
      </div>

      <UserTable 
        dataSource={dataSource} 
        handleDelete={handleDelete} 
        showModal={showModal} 
        searchText={searchText} 
      />

      <Modal
        title={editingUser ? "Editar Usuario" : "Agregar Usuario"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}
      >
        <UserForm User={editingUser} onSave={handleSave} />
      </Modal>
    </div>
  );
};

export default ViewUser;