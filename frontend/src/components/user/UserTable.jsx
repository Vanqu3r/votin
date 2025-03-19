import React from "react";
import { Table, Space, Button } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const UserTable = ({ dataSource, handleDelete, showModal, searchText }) => {
  const filteredData = (Array.isArray(dataSource) ? dataSource : []).filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchText)
    )
  );
  
  console.log('hola usuario ');
  
  const columns = [
    { title: "Nombre", dataIndex: "name" },
    { title: "Apellido", dataIndex: "apellido" },
    { title: "Edad", dataIndex: "edad" },
    { title: "Correo Electronico", dataIndex: "email" },
    { title: "telefono", dataIndex: "telefono" },
    { title: "Dirección", dataIndex: "direccion" },
    { title: "Ciudad", dataIndex: "ciudad" },
    { title: "Estado", dataIndex: "estado" },
    { title: "Código Postal", dataIndex: "codigoPostal" },
    { 
      title: "Voto", 
      dataIndex: "voto", 
      render: (voto) => (voto ? "Sí" : "No") 
    },
    {
      title: "Acciones",
      render: (_, record) => (
        <Space size="middle">
          {/* <Button icon={<EditOutlined />} onClick={() => showModal(record)} /> */}
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} danger />
        </Space>
      ),
    },
  ];

  return <Table dataSource={filteredData} columns={columns} pagination={{ pageSize: 9 }} />;
};

export default UserTable;