import React from "react";
import { Form, Select, Input, Button } from "antd";
import { useTopicAreas } from "../hooks";
import "./CreateDashForm.css";

interface Props {
  onSubmit: Function;
  onCancel: Function;
}

function CreateDashboardForm(props: Props) {
  const { loading, topicareas } = useTopicAreas();
  return (
    <Form
      layout="vertical"
      size="large"
      name="CreateDashboard"
      onFinish={(values) => props.onSubmit(values)}
    >
      <Form.Item
        label="Dashboard Name"
        name="name"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Topic Area" name="topicAreaId">
        <Select loading={loading}>
          {topicareas.map((topic) => {
            return (
              <Select.Option value={topic.id} key={topic.id}>
                {topic.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item label="Description" name="description">
        <Input.TextArea rows={5} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" className="SubmitButton" htmlType="submit">
          Save
        </Button>
        <Button onClick={() => props.onCancel()}>Cancel</Button>
      </Form.Item>
    </Form>
  );
}

export default CreateDashboardForm;
