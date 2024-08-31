import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TimesheetTable from '../components/TimesheetTable';
import '@testing-library/jest-dom/extend-expect';

test('renders TimesheetTable and adds a new row', () => {
  render(<TimesheetTable />);

  // Check if "Add Row" button is in the document
  const addButton = screen.getByText(/Add Row/i);
  expect(addButton).toBeInTheDocument();

  // Simulate adding a row
  fireEvent.click(addButton);

  // Check if a new row is added
  const rows = screen.getAllByRole('row');
  expect(rows).toHaveLength(2); // 1 header row + 1 new row
});
