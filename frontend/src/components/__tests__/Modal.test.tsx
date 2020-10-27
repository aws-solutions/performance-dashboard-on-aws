import React from "react";
import { render } from "@testing-library/react";
import Modal from "../Modal";

test("renders a delete type Modal", async () => {
  const wrapper = render(
    <Modal
      title={"test title"}
      message={"test message"}
      isOpen={true}
      closeModal={() => {}}
      buttonType="Delete"
      buttonAction={() => {}}
      ariaHideApp={false}
    />,
    { container: document.body }
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a publish type Modal", async () => {
  const wrapper = render(
    <Modal
      title={"test title"}
      message={"test message"}
      isOpen={true}
      closeModal={() => {}}
      buttonType="Publish"
      buttonAction={() => {}}
      ariaHideApp={false}
    />,
    { container: document.body }
  );
  expect(wrapper.container).toMatchSnapshot();
});
