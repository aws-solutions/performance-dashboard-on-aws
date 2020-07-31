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

  // Workaround I found to select an option from the dropdown 
  const dropdown = document.querySelector('[data-testid=topicAreaId] > .ant-select-selector') as Element;
  fireEvent.mouseDown(dropdown);

  // Get all options in the topicArea dropdown
  const options = wrapper.queryAllByTestId("topicAreaOption");
  // Select the first option
  const topicArea = options[0];
  fireEvent.click(topicArea);
  
  const submitButton = wrapper.getByText("Create");
  fireEvent.submit(submitButton);

  await wait(() => {
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "AWS Dashboard",
        topicAreaId: "123456789",
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