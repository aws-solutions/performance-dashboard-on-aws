import React from "react";
import { render } from "@testing-library/react";
import ChooseStaticDataset from "../ChooseStaticDataset";
import { MemoryRouter, Router } from "react-router-dom";

test("renders a static dataset table", async () => {
  const wrapper = render(<ChooseStaticDataset />);
  //expect(wrapper.container).toMatchSnapshot();
});

// test("renders a dropdown with options", async () => {
//   const wrapper = render(
//     <Dropdown
//       id="aws-service"
//       name="aws-service"
//       label="Select an AWS service"
//       options={[
//         {
//           label: "Amazon S3",
//           value: "s3",
//         },
//         {
//           label: "AWS Lambda",
//           value: "lambda",
//         },
//       ]}
//     />
//   );
//   expect(wrapper.container).toMatchSnapshot();
// });

// test("calls register function", async () => {
//   const register = jest.fn();
//   render(
//     <Dropdown
//       id="aws-service"
//       name="aws-service"
//       register={register}
//       label="Select an AWS service"
//       options={[]}
//     />
//   );
//   expect(register).toBeCalled();
// });

// test("renders a select with error", async () => {
//   const wrapper = render(
//     <Dropdown
//       id="aws-service"
//       name="aws-service"
//       error="Something bad happened"
//       label="Select an AWS service"
//       options={[]}
//     />
//   );
//   expect(wrapper.container).toMatchSnapshot();
// });

// test("renders a select with hint", async () => {
//   const wrapper = render(
//     <Dropdown
//       id="aws-service"
//       name="aws-service"
//       hint="Think twice before selecting"
//       label="Select an AWS service"
//       options={[]}
//     />
//   );
//   expect(wrapper.container).toMatchSnapshot();
// });

// test("renders a select with a default value", async () => {
//   const wrapper = render(
//     <Dropdown
//       id="aws-service"
//       name="aws-service"
//       defaultValue="lambda"
//       label="Select an AWS service"
//       options={[
//         {
//           label: "Amazon S3",
//           value: "s3",
//         },
//         {
//           label: "AWS Lambda",
//           value: "lambda",
//         },
//       ]}
//     />
//   );
//   expect(wrapper.container).toMatchSnapshot();
// });
