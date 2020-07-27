import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import CreateDashForm from "../CreateDashForm";

jest.mock('../../hooks');

const onSubmit = jest.fn();
const onCancel = jest.fn();

test('submits form with the entered values', async () => {
  const wrapper = render(<CreateDashForm onSubmit={onSubmit} onCancel={onCancel} />);
  
  let input = wrapper.getByLabelText('Dashboard Name');
  fireEvent.change(input, { target: { value: 'AWS Dashboard' } });
  
  input = wrapper.getByLabelText('Description');
  fireEvent.change(input, { target: { value: 'Serverless is more' } });

  // Impossible to test an Ant Design dropdown because is not
  // a proper <Select> HTML element. TODO: Figure out how to test it.
  // input = wrapper.getByLabelText('Topic Area');
  // fireEvent.change(input, { target: { value: '123456789' } });
  
  const submitButton = wrapper.getByText("Save");
  fireEvent.submit(submitButton);

  await wait(() => {
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "AWS Dashboard",
        description: "Serverless is more",
        topicAreaId: undefined,
      })
    );
  });
});

test('invokes cancel function when use clicks cancel', async () => {
  const wrapper = render(<CreateDashForm onSubmit={onSubmit} onCancel={onCancel} />);
  const cancelButton = wrapper.getByText("Cancel");
  fireEvent.click(cancelButton);
  await wait(() => expect(onCancel).toHaveBeenCalled());
});