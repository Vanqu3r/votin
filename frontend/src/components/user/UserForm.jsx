import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";

const UserForm = ({ user, onSave }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
  }, [user, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSave({ ...user, ...values });
    } catch (error) {
      console.error("Error en el formulario:", error);
    }
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item name="name" label="Nombre" rules={[{ required: true, message: "Ingrese el nombre" }]}>
        <Input />
      </Form.Item>
      <Form.Item name="apellido" label="Apellido" rules={[{ required: true, message: "Ingrese el apellido" }]}>
        <Input />
      </Form.Item>
      <Form.Item name="edad" label="Edad">
        <Input type="number" />
      </Form.Item>
      <Form.Item name="email" label="Correo Electronico">
        <Input type="email" />
      </Form.Item>
      <Form.Item name="telefono" label="Telefono">
        <Input type="text" />
      </Form.Item>
      <Form.Item name="direccion" label="Dirección">
        <Input />
      </Form.Item>
      <Form.Item name="ciudad" label="Ciudad">
        <Input />
      </Form.Item>
      <Form.Item name="estado" label="Estado">
        <Input />
      </Form.Item>
      <Form.Item name="codigoPostal" label="Código Postal">
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={handleSubmit}>
          Guardar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserForm;