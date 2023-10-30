import { Button, Form, Input, Modal } from 'antd';
import React, { useEffect } from 'react';

const ModalComp = (props) => {
  const { isModalOpen, handleOk, handleCancel, handleUpdateLabel, form, selectedRectDetails } = props;

  useEffect(() => {
    if (isModalOpen && selectedRectDetails && selectedRectDetails.label) {
      form.setFieldsValue({
        label: selectedRectDetails.label,
      });
    }
  }, [isModalOpen, selectedRectDetails]);

  return (
    selectedRectDetails && (
      <Modal
        title="Update Label"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          key={selectedRectDetails.label} 
          onFinish={handleUpdateLabel}
          form={form}
        >
          <label>Label</label>
          <Form.Item
            name="label"
            rules={[{ required: true, message: "Please enter Label" }]}
          >
            <Input dir="auto" />
          </Form.Item>
          <div style={{ display: "flex", alignItems: "end" }}>
            <Button type="primary" htmlType="submit" size="large">
              Update
            </Button>
            <Button
              size="large"
              style={{ marginLeft: "8px" }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
    )
  );
};

export default ModalComp;
