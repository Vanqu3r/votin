import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";

const CandidateForm = ({ candidate, onSave }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (candidate) {
      form.setFieldsValue(candidate);
    } else {
      form.resetFields();
    }
  }, [candidate, form]);

  const handleSubmit = async () => {
    try {
     
      const values = await form.validateFields();
 
      onSave({ ...candidate, ...values });
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
      <Form.Item name="numeroId" label="Numero de identificacion">
        <Input />
      </Form.Item>
      <Form.Item name="partido" label="Partido">
        <Input />
     
      </Form.Item>
      <Form.Item name="telefono" label="Telefono Perosonal">
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

export default CandidateForm;