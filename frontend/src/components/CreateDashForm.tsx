import React from "react";
import { Form, Select, Input, Button } from "antd";
import { useTopicAreas } from "../hooks";

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
      <Form.Item label="Topic Area" name="topicAreaId" rules={[{ required: true }]}>
        <Select loading={loading} data-testid="topicAreaId">
          {topicareas.map((topic) => {
            return (
              <Select.Option value={topic.id} key={topic.id} data-testid="topicAreaOption">
                {topic.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create
        </Button>
        <Button onClick={() => props.onCancel()}>Cancel</Button>
      </Form.Item>
    </Form>
  );
}

export default CreateDashboardForm;
