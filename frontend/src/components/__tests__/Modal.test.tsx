import React from "react";
import { render } from "@testing-library/react";
import Modal from "../Modal";

test("renders a delete type Modal", async () => {
  const { baseElement } = render(
    <Modal
      title={"test title"}
      message={"test message"}
      isOpen={true}
      closeModal={() => {}}
      buttonType="Delete"
      buttonAction={() => {}}
      ariaHideApp={false}
    />
  );
  expect(baseElement).toMatchSnapshot();
});

test("renders a publish type Modal", async () => {
  const { baseElement } = render(
    <Modal
      title={"test title"}
      message={"test message"}
      isOpen={true}
      closeModal={() => {}}
      buttonType="Publish"
      buttonAction={() => {}}
      ariaHideApp={false}
    />
  );
  expect(baseElement).toMatchSnapshot();
});
