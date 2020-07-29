import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import Markdown from '../Markdown';

test("renders the title of the markdown component", async () => {
    const { findByText } = render(<Markdown title="Test" subtitle="Subtitle test"/>, { wrapper: MemoryRouter });
    const title = await findByText("Test");
    expect(title).toBeInTheDocument();
  });
  
test("renders the subtitle of the markdown component", async () => {
    const { findByText } = render(<Markdown title="Test" subtitle="Subtitle test."/>, { wrapper: MemoryRouter });
    const subtitle = await findByText("Subtitle test. This text area supports limited Markdown.");
    expect(subtitle).toBeInTheDocument();
});

test("renders the placeholder of the markdown component", async () => {
    const { findByPlaceholderText } = render(<Markdown title="Test" subtitle="Subtitle test."/>, { wrapper: MemoryRouter });
    const subtitle = await findByPlaceholderText("Enter overview text here");
    expect(subtitle).toBeInTheDocument();
});
