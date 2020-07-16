import React from 'react';
import { render } from '@testing-library/react';
import PageHeader from '../PageHeader';

test('render a header with subtitle', () => {
  const { container } = render(
    <PageHeader>
        <PageHeader.Title>Some title</PageHeader.Title>
        <PageHeader.Subtitle>This is a subtitle</PageHeader.Subtitle>
    </PageHeader>
  );

  expect(container).toMatchSnapshot();
});
