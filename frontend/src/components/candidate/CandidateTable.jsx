import React from "react";
import { Table, Space, Button } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const CandidateTable = ({ dataSource, handleDelete, showModal, searchText }) => {
  const filteredData = dataSource
    .filter((item) => item.validado !== false) // Filtrar elementos donde validado es false
    .filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(searchText)
      )
    );

  const columns = [
    { title: "Nombre", dataIndex: "name" },
    { title: "Apellido", dataIndex: "apellido" },
    { title: "Numero de identificacion", dataIndex: "numeroId" },
    { title: "Partido", dataIndex: "partido" },
    { title: "Telefono Personal", dataIndex: "telefono" },
    {
      title: "Acciones",
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} danger />
        </Space>
      ),
    },
  ];

  return <Table dataSource={filteredData} columns={columns} pagination={{ pageSize: 9 }} />;
};

export default CandidateTable;